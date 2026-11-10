import Link from 'next/link';
import { PrayerBoard } from '@/components/prayer-board';
import { EventItem } from '@/components/event-item';
import { TopBar } from '@/components/top-bar';
import { loadAyah } from '@/lib/ayah';
import { flag, cityById, nearestCity } from '@/lib/cities';
import { todayIn, ymdToUtc } from '@/lib/dates';
import { upcomingEvents } from '@/lib/events';
import { dict, hijriLabel, locale } from '@/lib/i18n';
import { loadVaktija, PRAYERS } from '@/lib/prayer-times';
import { readSettings } from '@/lib/settings';

export default async function Home() {
  const { lang, method, place } = await readSettings();
  const t = dict[lang];
  const vaktija = await loadVaktija(place.lat, place.lng, method).catch(() => null);
  const today = vaktija?.today.date ?? todayIn('Europe/Sarajevo');
  const [ayah, events] = [await loadAyah(today, lang).catch(() => null), upcomingEvents(lang, today).slice(0, 4)];
  const city = place.cityId ? cityById(place.cityId)! : nearestCity(place.lat, place.lng);
  const dateText = new Intl.DateTimeFormat(locale(lang), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(ymdToUtc(today));

  return (
    <>
      <TopBar lang={lang} path="/" />

      <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {flag(city.country)} {place.nearby ? `${t.nearCity} ${place.label}` : place.label}
          </h1>
          <p className="mt-1 capitalize text-mute">{dateText}</p>
          {vaktija && (
            <p className="text-gold">
              {hijriLabel(lang, vaktija.today.hijri.day, vaktija.today.hijri.month, vaktija.today.hijri.year)}
            </p>
          )}
        </div>
        <Link href="/location" className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
          📍 {t.changeLocation}
        </Link>
      </section>

      {vaktija ? (
        <PrayerBoard
          slots={PRAYERS.map((p, i) => ({ label: t.prayers[i], iso: vaktija.today.times[p] }))}
          tomorrowFajr={vaktija.tomorrow && { label: t.prayers[0], iso: vaktija.tomorrow.times.Fajr }}
          serverNow={Date.now()}
          nextLabel={t.nextPrayer}
          inLabel={t.in}
        />
      ) : (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4">{t.unavailable}</p>
      )}

      {ayah && (
        <section className="mt-8 rounded-3xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{t.ayahOfDay}</h2>
          <p dir="rtl" lang="ar" className="mt-4 font-arabic text-3xl leading-[2.1]">{ayah.arabic}</p>
          {ayah.translation && <p className="mt-4 text-lg leading-relaxed text-white/90">{ayah.translation}</p>}
          <p className="mt-3 text-sm text-mute">Kur&apos;an {ayah.key}</p>
        </section>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t.upcomingEvents}</h2>
          <Link href="/events" className="text-sm text-noor hover:underline">{t.allEvents} →</Link>
        </div>
        <ul className="space-y-3">
          {events.map((e) => <EventItem key={`${e.event.id}-${e.hijriYear}`} e={e} lang={lang} t={t} />)}
        </ul>
      </section>

      <footer className="mt-12 space-y-1 text-center text-xs text-mute">
        <p>{t.savedInCookie}</p>
        <p>{t.sourceNote}</p>
      </footer>
    </>
  );
}
