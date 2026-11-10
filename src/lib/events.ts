import bs from '@/content/events.bs.json';
import en from '@/content/events.en.json';
import { addDays, daysBetween, type Ymd } from './dates';
import { fromHijri, toHijri } from './hijri';
import type { Lang } from './i18n';

/** An event of the Islamic year on a fixed Hijri date (bundled in the app). */
export type IslamicEvent = {
  id: string;
  month: number;
  day: number;
  days: number;
  /** eid, night, fast, day or season. */
  kind: string;
  title: string;
  summary: string;
  description: string;
  practices?: string[];
  note?: string;
};

export type EventDate = {
  event: IslamicEvent;
  start: Ymd;
  end: Ymd;
  hijriYear: number;
  /** Days from today to the start; 0 or less once it has begun. */
  daysUntil: number;
};

const byLang: Record<Lang, IslamicEvent[]> = { bs: bs as IslamicEvent[], en: en as IslamicEvent[] };

/** Events still to come (or under way) from [today], soonest first, this Hijri year and next. */
export function upcomingEvents(lang: Lang, today: Ymd): EventDate[] {
  const year = toHijri(today).year;
  const all: EventDate[] = [];
  for (const y of [year - 1, year, year + 1]) {
    for (const event of byLang[lang]) {
      const start = fromHijri(y, event.month, event.day);
      const end = addDays(start, (event.days ?? 1) - 1);
      if (end >= today) all.push({ event, start, end, hijriYear: y, daysUntil: daysBetween(today, start) });
    }
  }
  return all.sort((a, b) => a.start.localeCompare(b.start));
}
