import { isView, periodOf, type CalendarId, type View } from './calendar';
import type { Ymd } from './dates';

type Search = Record<string, string | string[] | undefined>;

/** `view=year&at=2026-11-12` */
export const calendarQuery = (view: View, at: Ymd) => new URLSearchParams({ view, at }).toString();

/** The month or year a calendar URL asks for (this month by default), in [cal]. */
export function readPeriod(cal: CalendarId, search: Search, today: Ymd) {
  const view: View = isView(search.view) ? search.view : 'month';
  const raw = typeof search.at === 'string' ? search.at : '';
  const at = /^\d{4}-\d{2}-\d{2}$/.test(raw) && !Number.isNaN(Date.parse(raw)) && raw >= '1900' && raw < '2100' ? raw : today;
  return { view, at, ...periodOf(cal, view, at) };
}
