import { nearestCity } from './cities';
import { addDays, todayIn, type Ymd } from './dates';
import { getDoc } from './firestore';
import type { Method } from './methods';
import { zonedIso } from './zoned';

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

// ── From Firebase: every bundled city × method × year, as the app stores it ──

type StoredDay = { date: Ymd; times: Record<string, string>; hijri: string };
type StoredYear = { timezone: string; cacheKey: string; days: StoredDay[] };

/** Aladhan's transliterated Hijri month names, in order. */
const ALADHAN_MONTHS = [
  'Muḥarram', 'Ṣafar', 'Rabīʿ al-awwal', 'Rabīʿ al-thānī', 'Jumādá al-ūlá', 'Jumādá al-ākhirah',
  'Rajab', 'Shaʿbān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿdah', 'Dhū al-Ḥijjah',
];

/** "30 Jumādá al-ūlá 1448" → { day: 30, month: 5, year: 1448 } */
export function parseHijri(text: string): PrayerDay['hijri'] {
  const words = text.split(' ');
  return {
    day: Number(words[0]),
    month: ALADHAN_MONTHS.indexOf(words.slice(1, -1).join(' ')) + 1,
    year: Number(words.at(-1)),
  };
}

/** Same tolerance as the app: ~0.1° ≈ 11 km from a bundled city. */
const MAX_DRIFT = 0.1;

async function fromFirebase(lat: number, lng: number, method: Method, now: Date): Promise<Vaktija | null> {
  const city = nearestCity(lat, lng);
  if (Math.abs(city.lat - lat) >= MAX_DRIFT || Math.abs(city.lng - lng) >= MAX_DRIFT) return null;
  const years = new Map<number, Promise<StoredYear | null>>();
  const year = (y: number) => {
    if (!years.has(y)) years.set(y, getDoc<StoredYear>(`content/prayerTimes/cities/${city.id}/methods/${method.id}/years/${y}`));
    return years.get(y)!;
  };
  const first = await year(now.getUTCFullYear());
  if (!first) return null;
  const today = todayIn(first.timezone, now);
  const find = async (ymd: Ymd) => (await year(Number(ymd.slice(0, 4))))?.days.find((d) => d.date === ymd) ?? null;
  const toDay = (d: StoredDay): PrayerDay => ({
    date: d.date,
    times: Object.fromEntries(
      PRAYERS.map((p) => [p, zonedIso(d.date, d.times[p.toLowerCase()], first.timezone)]),
    ) as PrayerDay['times'],
    hijri: parseHijri(d.hijri),
  });
  const todayDay = await find(today);
  if (!todayDay) return null;
  const tomorrow = await find(addDays(today, 1));
  return { timeZone: first.timezone, today: toDay(todayDay), tomorrow: tomorrow && toDay(tomorrow) };
}

/** Prayer times for today and tomorrow: Firebase for the app's cities, else Aladhan. */
export async function loadVaktija(lat: number, lng: number, method: Method, now = new Date()): Promise<Vaktija> {
  return (await fromFirebase(lat, lng, method, now)) ?? fromAladhan(lat, lng, method, now);
}

async function fromAladhan(lat: number, lng: number, method: Method, now: Date): Promise<Vaktija> {
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
