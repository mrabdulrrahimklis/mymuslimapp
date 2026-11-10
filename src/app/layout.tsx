import type { Metadata, Viewport } from 'next';
import { Amiri, Manrope, Vazirmatn } from 'next/font/google';
import { readSettings } from '@/lib/settings';
import { APP_NAME, dict, isRtl } from '@/lib/i18n';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

const manrope = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-manrope' });
const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri' });

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await readSettings();
  const t = dict[lang];
  return { title: `${t.title} · ${APP_NAME}`, description: t.tagline, applicationName: APP_NAME };
}

export const viewport: Viewport = { themeColor: '#06110d' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await readSettings();
  return (
    <html lang={lang} dir={isRtl(lang) ? 'rtl' : 'ltr'} className={`${manrope.variable} ${vazir.variable} ${amiri.variable}`}>
      <body className="font-sans antialiased">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
          <main>{children}</main>
          <SiteFooter lang={lang} />
        </div>
      </body>
    </html>
  );
}
