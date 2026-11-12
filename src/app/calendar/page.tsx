import Link from 'next/link';
import { PrintButton } from '@/components/print-button';
import { TopBar } from '@/components/top-bar';
import { calendarQuery, readPeriod } from '@/lib/calendar-period';
import { dayLabel, partsIn, periodLabel, weekday } from '@/lib/calendar';
import { cityById, flag, nearestCity } from '@/lib/cities';
import { addDays, todayIn } from '@/lib/dates';
import { dict } from '@/lib/i18n';
import { loadDays, PRAYERS, type CalendarDay } from '@/lib/prayer-times';
import { readSettings } from '@/lib/settings';

type Search = Promise<Record<string, string | string[] | undefined>>;

/** Prayer times for a whole month or year of the chosen calendar, to read, print or download. */
export default async function CalendarPage({ searchParams }: { searchParams: Search }) {
  const { lang, method, calendar, place } = await readSettings();
  const t = dict[lang];
  const today = todayIn('Europe/Sarajevo');
  const { view, at, from, to } = readPeriod(calendar, await searchParams, today);
  const days = await loadDays(place.lat, place.lng, method, from, to).catch(() => null);
  const city = place.cityId ? cityById(place.cityId)! : nearestCity(place.lat, place.lng);
  const other = calendar === 'islamic' ? 'gregorian' : 'islamic';
  const href = (v: typeof view, a: string) => `/calendar?${calendarQuery(v, a)}`;

  // The year view is split into the calendar's months.
  const groups: { from: string; days: CalendarDay[] }[] = [];
  for (const d of days ?? []) {
    if (!groups.length || partsIn(calendar, d.date).day === 1) groups.push({ from: d.date, days: [] });
    groups.at(-1)!.days.push(d);
  }

  return (
    <>
      <div className="print:hidden"><TopBar lang={lang} method={method} calendar={calendar} path={`/calendar?${calendarQuery(view, at)}`} /></div>

      <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{periodLabel(lang, calendar, view, from)}</h1>
          <p className="mt-1 text-mute">
            {flag(city.country)} {place.label} · {method.name || t.methodAuto}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm print:hidden">
          <div className="flex rounded-full border border-line p-0.5">
            {(['month', 'year'] as const).map((v) => (
              <Link
                key={v}
                href={href(v, at)}
                aria-current={v === view ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 ${v === view ? 'bg-noor/15 font-semibold text-noor' : 'text-mute hover:text-white'}`}
              >
                {t[v]}
              </Link>
            ))}
          </div>
          <Link href={href(view, addDays(from, -1))} aria-label={t.previous} className="rounded-full border border-line px-3 py-1.5 hover:border-noor">
            <span className="inline-block rtl:rotate-180">‹</span>
          </Link>
          <Link href={href(view, addDays(to, 1))} aria-label={t.next} className="rounded-full border border-line px-3 py-1.5 hover:border-noor">
            <span className="inline-block rtl:rotate-180">›</span>
          </Link>
          <a href={`/calendar/download?${calendarQuery(view, at)}`} className="rounded-full bg-noor px-4 py-1.5 font-semibold text-ink">
            ⬇ {t.downloadCsv}
          </a>
          <PrintButton label={t.printPdf} />
        </div>
      </section>

      {!days?.length ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4">{t.unavailable}</p>
      ) : (
        groups.map((g) => (
          <section key={g.from} className="mb-8 break-inside-avoid-page">
            {view === 'year' && <h2 className="mb-2 text-xl font-semibold">{periodLabel(lang, calendar, 'month', g.from)}</h2>}
            <div className="overflow-x-auto rounded-2xl border border-line print:overflow-visible print:rounded-none">
              <table className="w-full text-xs tabular-nums sm:text-sm">
                <thead className="bg-panel text-mute">
                  <tr>
                    <th className="px-1.5 py-2 text-start font-semibold sm:px-3">{t.date}</th>
                    <th className="hidden px-3 py-2 text-start font-semibold sm:table-cell">{t[other]}</th>
                    {t.prayers.map((p) => <th key={p} className="px-1 py-2 text-end font-semibold sm:px-3">{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {g.days.map((d) => (
                    <tr
                      key={d.date}
                      aria-current={d.date === today ? 'date' : undefined}
                      className={`border-t border-line ${d.date === today ? 'bg-noor/15 text-noor' : ''}`}
                    >
                      <td className="whitespace-nowrap px-1.5 py-1.5 sm:px-3">
                        <span className="inline-block w-5 font-semibold sm:w-7">{partsIn(calendar, d.date).day}</span>
                        <span className="text-mute">{weekday(lang, d.date)}</span>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-1.5 text-mute sm:table-cell">{dayLabel(lang, other, d.date)}</td>
                      {PRAYERS.map((p) => <td key={p} className="px-1 py-1.5 text-end sm:px-3">{d.times[p]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </>
  );
}
