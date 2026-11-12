import { readPeriod } from '@/lib/calendar-period';
import { dayLabel, periodLabel, weekday } from '@/lib/calendar';
import { cityById, nearestCity } from '@/lib/cities';
import { todayIn } from '@/lib/dates';
import { dict } from '@/lib/i18n';
import { loadDays, PRAYERS } from '@/lib/prayer-times';
import { readSettings } from '@/lib/settings';

const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

/** The month or year on the calendar page as CSV (opens in Excel, Numbers, Sheets). */
export async function GET(request: Request) {
  const { lang, method, calendar, place } = await readSettings();
  const t = dict[lang];
  const search = Object.fromEntries(new URL(request.url).searchParams);
  const { view, from, to } = readPeriod(calendar, search, todayIn('Europe/Sarajevo'));
  const days = await loadDays(place.lat, place.lng, method, from, to).catch(() => null);
  if (!days?.length) return new Response(t.unavailable, { status: 503 });

  const rows = [
    [t.date, t.gregorian, t.islamic, '', ...t.prayers],
    ...days.map((d) => [d.date, dayLabel(lang, 'gregorian', d.date), dayLabel(lang, 'islamic', d.date), weekday(lang, d.date), ...PRAYERS.map((p) => d.times[p])]),
  ];
  const csv = rows.map((r) => r.map(cell).join(',')).join('\r\n');

  const city = place.cityId ? cityById(place.cityId)! : nearestCity(place.lat, place.lng);
  const name = `${city.id}-${periodLabel('en', calendar, view, from)}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return new Response(`\uFEFF${csv}\r\n`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="vaktija-${name}.csv"`,
      'cache-control': 'private, no-store',
    },
  });
}
