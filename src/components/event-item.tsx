import type { EventDate } from '@/lib/events';
import { hijriLabel, locale, type Dict, type Lang } from '@/lib/i18n';
import { ymdToUtc } from '@/lib/dates';

const kindColor: Record<string, string> = {
  eid: 'bg-gold/15 text-gold', night: 'bg-indigo-400/15 text-indigo-300',
  fast: 'bg-sky-400/15 text-sky-300', season: 'bg-noor/15 text-noor', day: 'bg-white/10 text-white/80',
};

export function whenLabel(e: EventDate, t: Dict) {
  if (e.daysUntil <= 0) return e.daysUntil === 0 ? t.today : t.ongoing;
  return e.daysUntil === 1 ? t.tomorrow : t.inDays(e.daysUntil);
}

export function dateRange(e: EventDate, lang: Lang) {
  const f = new Intl.DateTimeFormat(locale(lang), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return e.start === e.end ? f.format(ymdToUtc(e.start)) : f.formatRange(ymdToUtc(e.start), ymdToUtc(e.end));
}

/** One event occurrence; [open] shows description and practices. */
export function EventItem({ e, lang, t, detailed }: { e: EventDate; lang: Lang; t: Dict; detailed?: boolean }) {
  const head = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-semibold">{e.event.title}</p>
        <p className="mt-0.5 text-sm text-mute">
          {dateRange(e, lang)} · {hijriLabel(lang, e.event.day, e.event.month, e.hijriYear)}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${kindColor[e.event.kind] ?? kindColor.day}`}>
        {whenLabel(e, t)}
      </span>
    </div>
  );
  if (!detailed) return <li className="rounded-2xl border border-line bg-panel/70 p-4">{head}</li>;
  return (
    <li>
      <details className="group rounded-2xl border border-line bg-panel/70 p-4 open:border-noor/40">
        <summary>{head}</summary>
        <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/85">
          <p>{e.event.summary}</p>
          <p>{e.event.description}</p>
          {e.event.kind === 'night' && <p className="text-sm text-mute">{t.eveningBefore}.</p>}
          {!!e.event.practices?.length && (
            <>
              <p className="pt-1 text-sm font-semibold uppercase tracking-wider text-noor">{t.practices}</p>
              <ul className="list-disc space-y-1 pl-5">
                {e.event.practices.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </>
          )}
          {e.event.note && <p className="text-sm italic text-mute">{e.event.note}</p>}
        </div>
      </details>
    </li>
  );
}
