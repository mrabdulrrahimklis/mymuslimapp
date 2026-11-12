import { addDays, ymdToUtc, type Ymd } from './dates';
import { fromHijri, toHijri } from './hijri';
import { hijriLabel, hijriMonthName, hijriYear, locale, type Lang } from './i18n';

/** The calendars a visitor can pick (the app's two main ones). */
export const calendars = ['gregorian', 'islamic'] as const;
export type CalendarId = (typeof calendars)[number];
export const isCalendar = (v: unknown): v is CalendarId => calendars.includes(v as CalendarId);

export type View = 'month' | 'year';
export const isView = (v: unknown): v is View => v === 'month' || v === 'year';

/** [ymd] as year, month and day of [cal]; Hijri follows Umm al-Qura. */
export function partsIn(cal: CalendarId, ymd: Ymd) {
  if (cal === 'islamic') return toHijri(ymd);
  return { year: +ymd.slice(0, 4), month: +ymd.slice(5, 7), day: +ymd.slice(8, 10) };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** The first day of month [month] of [year] in [cal]; month 13 is next year's first. */
function monthStart(cal: CalendarId, year: number, month: number): Ymd {
  if (month > 12) return monthStart(cal, year + 1, month - 12);
  return cal === 'islamic' ? fromHijri(year, month, 1) : `${year}-${pad(month)}-01`;
}

/** First and last day of the month or year of [cal] that holds [ymd]. */
export function periodOf(cal: CalendarId, view: View, ymd: Ymd): { from: Ymd; to: Ymd } {
  const { year, month } = partsIn(cal, ymd);
  const from = monthStart(cal, year, view === 'year' ? 1 : month);
  const next = view === 'year' ? monthStart(cal, year + 1, 1) : monthStart(cal, year, month + 1);
  return { from, to: addDays(next, -1) };
}

/** "Novembar 2026" or "Džumade-l-uhra 1448" — the month (or just the year) starting at [from]. */
export function periodLabel(lang: Lang, cal: CalendarId, view: View, from: Ymd) {
  const { year, month } = partsIn(cal, from);
  if (cal === 'islamic') {
    return view === 'year' ? hijriYear(lang, year) : `${hijriMonthName(lang, month)} ${hijriYear(lang, year)}`;
  }
  return new Intl.DateTimeFormat(locale(lang), {
    ...(view === 'month' ? { month: 'long' } : {}), year: 'numeric', timeZone: 'UTC', calendar: 'gregory',
  }).format(ymdToUtc(from));
}

/** A day as the other calendar shows it, e.g. "2 Džumade-l-uhra 1448" or "12. 11. 2026.". */
export function dayLabel(lang: Lang, cal: CalendarId, ymd: Ymd) {
  if (cal === 'islamic') {
    const h = toHijri(ymd);
    return hijriLabel(lang, h.day, h.month, h.year);
  }
  return new Intl.DateTimeFormat(locale(lang), {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC', calendar: 'gregory',
  }).format(ymdToUtc(ymd));
}

/** "Pon", "Mon", … for [ymd]. */
export const weekday = (lang: Lang, ymd: Ymd) =>
  new Intl.DateTimeFormat(locale(lang), { weekday: 'short', timeZone: 'UTC' }).format(ymdToUtc(ymd));
