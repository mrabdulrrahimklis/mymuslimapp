import Link from 'next/link';
import { chooseLang } from '@/app/actions';
import type { Lang } from '@/lib/i18n';

/** Brand, an optional back link and the bs/en switch. */
export function TopBar({ lang, back, path }: { lang: Lang; back?: string; path: string }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      {back ? (
        <Link href="/" className="rounded-full border border-line px-4 py-1.5 text-sm text-mute hover:text-white">
          ← {back}
        </Link>
      ) : (
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-full bg-noor/15 text-noor">☾</span>
          Pray Tool
        </Link>
      )}
      <form action={chooseLang} className="flex rounded-full border border-line p-0.5 text-sm">
        <input type="hidden" name="back" value={path} />
        {(['bs', 'en'] as const).map((l) => (
          <button
            key={l}
            name="lang"
            value={l}
            aria-pressed={l === lang}
            className={`rounded-full px-3 py-1 uppercase ${l === lang ? 'bg-noor text-ink font-semibold' : 'text-mute hover:text-white'}`}
          >
            {l}
          </button>
        ))}
      </form>
    </header>
  );
}
