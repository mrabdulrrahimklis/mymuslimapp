import { EventItem } from '@/components/event-item';
import { TopBar } from '@/components/top-bar';
import { todayIn } from '@/lib/dates';
import { upcomingEvents } from '@/lib/events';
import { dict } from '@/lib/i18n';
import { readSettings } from '@/lib/settings';

export default async function EventsPage() {
  const { lang } = await readSettings();
  const t = dict[lang];
  const today = todayIn('Europe/Sarajevo');
  // One year ahead: each event once.
  const seen = new Set<string>();
  const events = upcomingEvents(lang, today).filter((e) => !seen.has(e.event.id) && seen.add(e.event.id));
  return (
    <>
      <TopBar lang={lang} path="/events" />
      <h1 className="mb-5 text-3xl font-bold tracking-tight">{t.events}</h1>
      <ul className="grid items-start gap-3 lg:grid-cols-2">
        {events.map((e) => <EventItem key={`${e.event.id}-${e.hijriYear}`} e={e} lang={lang} t={t} detailed />)}
      </ul>
    </>
  );
}
