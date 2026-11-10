import Link from 'next/link';
import { chooseLang } from '@/app/actions';
import { dict, langs, languages, type Lang } from '@/lib/i18n';

const NAV = [
  { href: '/', key: 'navTimes' },
  { href: '/events', key: 'events' },
  { href: '/location', key: 'location' },
] as const;

/** Brand, site navigation and the bs/en switch. */
export function TopBar({ lang, path }: { lang: Lang; path: string }) {
  const t = dict[lang];
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="grid size-8 place-items-center rounded-full bg-noor/15 text-noor">☾</span>
        Pray Tool
      </Link>
      <nav className="order-3 flex w-full gap-1 overflow-x-auto text-sm sm:order-none sm:w-auto">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={n.href === path ? 'page' : undefined}
            className={`rounded-full px-4 py-1.5 ${n.href === path ? 'bg-white/10 text-white' : 'text-mute hover:text-white'}`}
          >
            {t[n.key]}
          </Link>
        ))}
      </nav>
      <details className="group relative">
        <summary
          aria-label={t.language}
          className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm hover:border-noor"
        >
          <span aria-hidden>🌐</span> {languages[lang]} <span className="text-mute group-open:rotate-180">▾</span>
        </summary>
        <form
          action={chooseLang}
          className="absolute end-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-panel p-1 shadow-2xl"
        >
          <input type="hidden" name="back" value={path} />
          {langs.map((l) => (
            <button
              key={l}
              name="lang"
              value={l}
              lang={l}
              aria-pressed={l === lang}
              className={`block w-full rounded-xl px-3 py-2 text-start text-sm ${
                l === lang ? 'bg-noor/15 text-noor' : 'hover:bg-white/10'
              }`}
            >
              {languages[l]}
            </button>
          ))}
        </form>
      </details>
    </header>
  );
}
