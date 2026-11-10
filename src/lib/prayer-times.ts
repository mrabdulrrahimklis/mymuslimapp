import { addDays, todayIn, type Ymd } from './dates';
import type { Method } from './methods';

export type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export const PRAYERS: PrayerKey[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export type PrayerDay = {
  date: Ymd;
  /** ISO instants with the location's offset, e.g. 2026-11-10T05:29:00+01:00. */
  times: Record<PrayerKey, string>;
  hijri: { day: number; month: number; year: number };
};

export type Vaktija = { timeZone: string; today: PrayerDay; tomorrow: PrayerDay | null };

type ApiDay = {
  timings: Record<string, string>;
  date: { gregorian: { date: string }; hijri: { day: string; month: { number: number }; year: string } };
  meta: { timezone: string };
};

/** Whole month from Aladhan; cached by URL for a day. */
async function fetchMonth(year: number, month: number, lat: number, lng: number, method: Method) {
  const q = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    iso8601: 'true',
    ...(method.aladhanId != null ? { method: String(method.aladhanId) } : {}),
  });
  const res = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?${q}`, {
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error(`Aladhan ${res.status}`);
  return ((await res.json()) as { data: ApiDay[] }).data;
}

function toDay(d: ApiDay): PrayerDay {
  const [dd, mm, yyyy] = d.date.gregorian.date.split('-');
  return {
    date: `${yyyy}-${mm}-${dd}`,
    times: Object.fromEntries(PRAYERS.map((p) => [p, d.timings[p]])) as PrayerDay['times'],
    hijri: { day: +d.date.hijri.day, month: d.date.hijri.month.number, year: +d.date.hijri.year },
  };
}

export async function loadVaktija(lat: number, lng: number, method: Method, now = new Date()): Promise<Vaktija> {
  const months = new Map<string, PrayerDay[]>();
  let timeZone: string | undefined;
  const month = async (ymd: Ymd) => {
    const key = ymd.slice(0, 7);
    if (!months.has(key)) {
      const raw = await fetchMonth(+ymd.slice(0, 4), +ymd.slice(5, 7), lat, lng, method);
      months.set(key, raw.map(toDay));
      timeZone ??= raw[0]?.meta.timezone;
    }
    return months.get(key)!;
  };
  await month(now.toISOString().slice(0, 10));
  const today = todayIn(timeZone ?? 'UTC', now);
  const tomorrow = addDays(today, 1);
  const find = async (ymd: Ymd) => (await month(ymd)).find((d) => d.date === ymd) ?? null;
  const todayDay = await find(today);
  if (!todayDay) throw new Error(`no prayer times for ${today}`);
  return { timeZone: timeZone!, today: todayDay, tomorrow: await find(tomorrow).catch(() => null) };
}
