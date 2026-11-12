'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isCalendar } from '@/lib/calendar';
import { cityById } from '@/lib/cities';
import { isLang } from '@/lib/i18n';
import { methods } from '@/lib/methods';
import { COOKIE, COOKIE_OPTIONS } from '@/lib/settings';

async function save(name: string, value: string) {
  (await cookies()).set(name, value, COOKIE_OPTIONS);
}

export async function chooseCity(id: string) {
  if (!cityById(id)) return;
  await save(COOKIE.loc, id);
  redirect('/');
}

/** Browser coordinates, rounded to ~1 km so the stored value stays coarse. */
export async function chooseCoordinates(lat: number, lng: number) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
  await save(COOKIE.loc, `geo:${lat.toFixed(2)},${lng.toFixed(2)}`);
  redirect('/');
}

/** The page a form came from (its `back` field, query included), if it is one of ours. */
function backPath(back: unknown) {
  const path = String(back ?? '/');
  const [page, query] = path.split('?');
  const ok = ['/', '/location', '/events', '/calendar'].includes(page) && (query === undefined || /^[\w=&-]*$/.test(query));
  return ok ? path : '/';
}
const back = (formData: FormData) => backPath(formData.get('back'));

export async function chooseMethod(formData: FormData) {
  const id = String(formData.get('method') ?? '');
  if (methods.some((m) => m.id === id)) await save(COOKIE.method, id);
  redirect(back(formData));
}

export async function chooseCalendar(formData: FormData) {
  const calendar = formData.get('calendar');
  if (isCalendar(calendar)) await save(COOKIE.calendar, calendar);
  // A month or year of the old calendar means nothing in the new one.
  const path = back(formData);
  redirect(path.startsWith('/calendar') ? `/calendar?view=${new URLSearchParams(path.split('?')[1]).get('view') === 'year' ? 'year' : 'month'}` : path);
}

export async function chooseLang(formData: FormData) {
  const lang = formData.get('lang');
  if (isLang(lang)) await save(COOKIE.lang, lang);
  redirect(back(formData));
}
