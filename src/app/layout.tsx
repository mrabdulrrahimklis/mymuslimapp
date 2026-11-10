import type { Metadata, Viewport } from 'next';
import { Amiri, Manrope } from 'next/font/google';
import { readSettings } from '@/lib/settings';
import { dict } from '@/lib/i18n';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

const manrope = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-manrope' });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri' });

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await readSettings();
  const t = dict[lang];
  return { title: `${t.title} · Pray Tool`, description: t.tagline };
}

export const viewport: Viewport = { themeColor: '#06110d' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await readSettings();
  return (
    <html lang={lang} className={`${manrope.variable} ${amiri.variable}`}>
      <body className="font-sans antialiased">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
          <main>{children}</main>
          <SiteFooter lang={lang} />
        </div>
      </body>
    </html>
  );
}
