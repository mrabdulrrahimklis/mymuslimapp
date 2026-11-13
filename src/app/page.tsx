import Link from 'next/link';
import { Suspense } from 'react';
import { AutoLocate } from '@/components/auto-locate';
import { PrayerBoard } from '@/components/prayer-board';
import { TopBar } from '@/components/top-bar';
import { loadAyah } from '@/lib/ayah';
import { flag, cityById, nearestCity } from '@/lib/cities';
import { todayIn, ymdToUtc } from '@/lib/dates';
import { dict, hijriLabel, locale, type Lang } from '@/lib/i18n';
import { loadVaktija, PRAYERS } from '@/lib/prayer-times';
import { readSettings } from '@/lib/settings';

export default async function Home() {
  const { lang, method, calendar, place, locationSaved } = await readSettings();
  const t = dict[lang];
  const vaktija = await loadVaktija(place.lat, place.lng, method).catch(() => null);
  const today = vaktija?.today.date ?? todayIn('Europe/Sarajevo');
  const city = place.cityId ? cityById(place.cityId)! : nearestCity(place.lat, place.lng);
  const dateText = new Intl.DateTimeFormat(locale(lang), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC', calendar: 'gregory',
  }).format(ymdToUtc(today));

  return (
    <>
      <TopBar lang={lang} method={method} calendar={calendar} path="/" />
      {!locationSaved && <AutoLocate />}

      <section className="mb-6">
        <div>
          <h1 className="flex flex-wrap items-center gap-x-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <span>{flag(city.country)} {place.label}</span>
            <Link
              href="/location"
              aria-label={t.changeLocation}
              title={t.changeLocation}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-noor hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
            </Link>
          </h1>
          {/* The chosen calendar's date first. */}
          <div className={`mt-1 flex ${calendar === 'islamic' ? 'flex-col-reverse' : 'flex-col'}`}>
            <p className="text-mute first-letter:uppercase">{dateText}</p>
            {vaktija && (
              <p className="text-gold">
                {hijriLabel(lang, vaktija.today.hijri.day, vaktija.today.hijri.month, vaktija.today.hijri.year)}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="lg:sticky lg:top-6">
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
        </div>

        <div>
          {/* Streamed in after the prayer times, so they never wait for quran.com. */}
          <Suspense>
            <AyahOfDay today={today} lang={lang} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function AyahOfDay({ today, lang }: { today: string; lang: Lang }) {
  const ayah = await loadAyah(today, lang).catch(() => null);
  if (!ayah) return null;
  const t = dict[lang];
  return (
    <section className="rounded-3xl border border-gold/25 bg-gradient-to-b from-gold/10 to-transparent p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{t.ayahOfDay}</h2>
      <p dir="rtl" lang="ar" className="mt-4 font-arabic text-3xl leading-[2.1]">{ayah.arabic}</p>
      {ayah.translation && <p className="mt-4 text-lg leading-relaxed text-white/90">{ayah.translation}</p>}
      <p className="mt-3 text-sm text-mute">{t.quran} {ayah.key}</p>
    </section>
  );
}
