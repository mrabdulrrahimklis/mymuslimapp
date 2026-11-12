import { cookies, headers } from 'next/headers';
import { isCalendar, type CalendarId } from './calendar';
import { cityById, cityName, nearestCity } from './cities';
import { isLang, langFromHeader, type Lang } from './i18n';
import { methodById, type Method } from './methods';

export const COOKIE = { loc: 'pt_loc', lang: 'pt_lang', method: 'pt_method', calendar: 'pt_cal' } as const;
export const COOKIE_OPTIONS = {
  // Browsers keep a cookie 400 days at most; it is set again only when the visitor changes it.
  maxAge: 60 * 60 * 24 * 400,
  sameSite: 'lax' as const,
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

export type Place = { label: string; lat: number; lng: number; cityId?: string; nearby: boolean };
export type Settings = { lang: Lang; method: Method; calendar: CalendarId; place: Place };

const DEFAULT_CITY = 'sarajevo';

/** `geo:43.86,18.41` from the browser, or a bundled city id. */
export function parsePlace(raw: string | undefined, lang: Lang): Place {
  const geo = raw?.match(/^geo:(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)$/);
  if (geo) {
    const lat = Number(geo[1]);
    const lng = Number(geo[2]);
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      const near = nearestCity(lat, lng);
      return { label: cityName(near, lang), lat, lng, nearby: true };
    }
  }
  const city = cityById(raw ?? '') ?? cityById(DEFAULT_CITY)!;
  return { label: cityName(city, lang), lat: city.lat, lng: city.lng, cityId: city.id, nearby: false };
}

export async function readSettings(): Promise<Settings> {
  const jar = await cookies();
  const saved = jar.get(COOKIE.lang)?.value;
  const calendar = jar.get(COOKIE.calendar)?.value;
  const lang = isLang(saved) ? saved : langFromHeader((await headers()).get('accept-language'));
  return {
    lang,
    method: methodById(jar.get(COOKIE.method)?.value),
    calendar: isCalendar(calendar) ? calendar : 'gregorian',
    place: parsePlace(jar.get(COOKIE.loc)?.value, lang),
  };
}
