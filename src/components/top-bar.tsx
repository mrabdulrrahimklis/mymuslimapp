import Image from 'next/image';
import Link from 'next/link';
import { chooseCalendar, chooseLang, chooseMethod } from '@/app/actions';
import { Menu } from '@/components/menu';
import { MobileNav } from '@/components/mobile-nav';
import { APP_NAME, dict, langFlags, langs, languages, type Lang } from '@/lib/i18n';
import { calendars, type CalendarId } from '@/lib/calendar';
import { methods, type Method } from '@/lib/methods';

const NAV = [
  { href: '/', key: 'navTimes' },
  { href: '/calendar', key: 'calendar' },
  { href: '/events', key: 'events' },
  { href: '/location', key: 'location' },
] as const;

/**
 * Logo on the left; on a computer the pages and the calendar, calculation
 * method and language menus beside it, on a phone all of them in a side
 * panel behind the hamburger on the right.
 */
export function TopBar({ lang, method, calendar, path }: { lang: Lang; method: Method; calendar: CalendarId; path: string }) {
  const page = path.split('?')[0];
  const t = dict[lang];

  const links = (inline: boolean) => NAV.map((n) => (
    <Link
      key={n.href}
      href={n.href}
      aria-current={n.href === page ? 'page' : undefined}
      className={`${inline ? 'rounded-2xl px-4 py-3 text-base' : 'rounded-full px-4 py-1.5'} ${
        n.href === page ? 'bg-white/10 text-white' : 'text-mute hover:text-white'
      }`}
    >
      {t[n.key]}
    </Link>
  ));

  const menus = (inline: boolean) => [
    <Menu
      key="calendar"
      inline={inline}
      label={t.calendar}
      summary={<><span aria-hidden>📅</span> {t[calendar]}</>}
      name="calendar"
      items={calendars.map((c) => ({ value: c, label: t[c] }))}
      current={calendar}
      action={chooseCalendar}
      path={path}
    />,
    <Menu
      key="method"
      inline={inline}
      label={t.method}
      summary={<><span aria-hidden>🕋</span> {inline ? method.name || t.methodAuto : method.short || t.methodAutoShort}</>}
      name="method"
      items={methods.map((m) => ({ value: m.id, label: m.name || t.methodAuto }))}
      current={method.id}
      action={chooseMethod}
      path={path}
      wide
    />,
    <Menu
      key="lang"
      inline={inline}
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
    />,
  ];

  return (
    <header className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-4">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <Image src="/logo.png" alt="" width={32} height={32} className="rounded-lg" priority />
        {APP_NAME}
      </Link>
      <nav className="hidden gap-1 text-sm lg:flex">{links(false)}</nav>
      <div className="hidden items-center gap-2 lg:flex">{menus(false)}</div>
      <MobileNav label={t.menu} closeLabel={t.close}>
        <nav className="flex flex-col gap-1">{links(true)}</nav>
        <div className="flex flex-col gap-4 border-t border-line pt-6">{menus(true)}</div>
      </MobileNav>
    </header>
  );
}
