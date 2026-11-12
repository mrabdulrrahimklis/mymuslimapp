import Image from 'next/image';
import Link from 'next/link';
import { chooseCalendar, chooseLang, chooseMethod } from '@/app/actions';
import { Menu } from '@/components/menu';
import { APP_NAME, dict, langFlags, langs, languages, type Lang } from '@/lib/i18n';
import { calendars, type CalendarId } from '@/lib/calendar';
import { methods, type Method } from '@/lib/methods';

const NAV = [
  { href: '/', key: 'navTimes' },
  { href: '/calendar', key: 'calendar' },
  { href: '/events', key: 'events' },
  { href: '/location', key: 'location' },
] as const;

/** Brand, site navigation, and the calendar, calculation method and language menus. */
export function TopBar({ lang, method, calendar, path }: { lang: Lang; method: Method; calendar: CalendarId; path: string }) {
  const page = path.split('?')[0];
  const t = dict[lang];
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <Image src="/logo.png" alt="" width={32} height={32} className="rounded-lg" priority />
        {APP_NAME}
      </Link>
      <nav className="order-3 flex w-full gap-1 overflow-x-auto text-sm sm:order-none sm:w-auto">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={n.href === page ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 ${n.href === page ? 'bg-white/10 text-white' : 'text-mute hover:text-white'}`}
          >
            {t[n.key]}
          </Link>
        ))}
      </nav>
      <div className="flex flex-wrap items-center gap-2">
        <Menu
          label={t.calendar}
          summary={<><span aria-hidden>📅</span> {t[calendar]}</>}
          name="calendar"
          items={calendars.map((c) => ({ value: c, label: t[c] }))}
          current={calendar}
          action={chooseCalendar}
          path={path}
        />
        <Menu
          label={t.method}
          summary={<><span aria-hidden>🕋</span> {method.short || t.methodAutoShort}</>}
          name="method"
          items={methods.map((m) => ({ value: m.id, label: m.name || t.methodAuto }))}
          current={method.id}
          action={chooseMethod}
          path={path}
          wide
        />
        <Menu
          label={t.language}
          summary={<><span aria-hidden>{langFlags[lang]}</span> {languages[lang]}</>}
          name="lang"
          items={langs.map((l) => ({
            value: l,
            lang: l,
            label: <><span aria-hidden className="me-2">{langFlags[l]}</span>{languages[l]}</>,
          }))}
          current={lang}
          action={chooseLang}
          path={path}
        />
      </div>
    </header>
  );
}
