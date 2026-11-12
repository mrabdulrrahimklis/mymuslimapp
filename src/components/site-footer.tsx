import Image from 'next/image';
import Link from 'next/link';
import { AppBadges } from '@/components/app-badges';
import { APP_NAME, dict, type Lang } from '@/lib/i18n';

const SUPPORT_URL = 'https://pray-tool.web.app/';
const PRIVACY_URL = 'https://pray-tool.web.app/privacy';
const CONTACT = 'mailto:abudu.klis@gmail.com';

const heading = 'mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-mute';
const link = 'text-white/80 hover:text-noor';

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = dict[lang];
  return (
    <footer className="mt-16 border-t border-line pt-10 text-sm">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-base font-semibold">
            <Image src="/logo.png" alt="" width={28} height={28} className="rounded-lg" />
            {APP_NAME}
          </p>
          <p className="mt-2 text-mute">{t.tagline}</p>
        </div>
        <div>
          <p className={heading}>{t.footerPages}</p>
          <ul className="space-y-2">
            <li><Link href="/" className={link}>{t.navTimes}</Link></li>
            <li><Link href="/calendar" className={link}>{t.calendar}</Link></li>
            <li><Link href="/events" className={link}>{t.events}</Link></li>
            <li><Link href="/location" className={link}>{t.changeLocation}</Link></li>
          </ul>
        </div>
        <div>
          <p className={heading}>{t.footerApp}</p>
          <p className="text-mute">{t.footerAppNote}</p>
        </div>
        <div>
          <p className={heading}>{t.footerHelp}</p>
          <ul className="space-y-2">
            <li><a href={SUPPORT_URL} target="_blank" rel="noopener" className={link}>{t.support}</a></li>
            <li><a href={PRIVACY_URL} target="_blank" rel="noopener" className={link}>{t.privacy}</a></li>
            <li><a href={CONTACT} className={link}>{t.contact}</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-line pt-8">
        <AppBadges scanLabel={t.scanToInstall} />
      </div>
      <div className="mt-8 flex flex-col gap-1 border-t border-line py-6 text-xs text-mute sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Amygdal · {t.savedInCookie}</p>
        <p>{t.sourceNote}</p>
      </div>
    </footer>
  );
}
