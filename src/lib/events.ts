import ar from '@/content/events.ar.json';
import bs from '@/content/events.bs.json';
import en from '@/content/events.en.json';
import fa from '@/content/events.fa.json';
import id from '@/content/events.id.json';
import tr from '@/content/events.tr.json';
import ur from '@/content/events.ur.json';
import { addDays, daysBetween, type Ymd } from './dates';
import { getDoc } from './content';
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

const byLang = { bs, en, ar, tr, id, fa, ur } as Record<Lang, IslamicEvent[]>;

/** The events from Firebase, else the copy bundled with the web. */
export async function loadEvents(lang: Lang): Promise<IslamicEvent[]> {
  const doc = await getDoc<{ events: IslamicEvent[] }>(`content/events/langs/${lang}`);
  return doc?.events?.length ? doc.events : byLang[lang];
}

/** Events still to come (or under way) from [today], soonest first, this Hijri year and next. */
export function upcomingEvents(lang: Lang, today: Ymd, events = byLang[lang]): EventDate[] {
  const year = toHijri(today).year;
  const all: EventDate[] = [];
  for (const y of [year - 1, year, year + 1]) {
    for (const event of events) {
      const start = fromHijri(y, event.month, event.day);
      const end = addDays(start, (event.days ?? 1) - 1);
      if (end >= today) all.push({ event, start, end, hijriYear: y, daysUntil: daysBetween(today, start) });
    }
  }
  return all.sort((a, b) => a.start.localeCompare(b.start));
}
