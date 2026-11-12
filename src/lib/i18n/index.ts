import { ar } from './ar';
import { bs } from './bs';
import { en } from './en';
import { fa } from './fa';
import { id } from './id';
import { tr } from './tr';
import { ur } from './ur';
import { ymdToUtc } from '../dates';
import { fromHijri } from '../hijri';

export type { Dict } from './types';

/** The app's name in every language, as in the mobile app (`appName`). */
export const APP_NAME = 'Muslim App';

/** The mobile app's languages, each named in its own language. */
export const languages = {
  bs: 'Bosanski',
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  id: 'Bahasa Indonesia',
  fa: 'فارسی',
  ur: 'اردو',
} as const;

/** A flag for each language, shown next to its name. */
export const langFlags = {
  bs: '🇧🇦', en: '🇬🇧', ar: '🇸🇦', tr: '🇹🇷', id: '🇮🇩', fa: '🇮🇷', ur: '🇵🇰',
} as const satisfies Record<keyof typeof languages, string>;

export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const isLang = (v: unknown): v is Lang => typeof v === 'string' && v in languages;

export const dict: Record<Lang, typeof bs> = { bs, en, ar, tr, id, fa, ur };

export const isRtl = (lang: Lang) => lang === 'ar' || lang === 'fa' || lang === 'ur';

const locales: Record<Lang, string> = {
  bs: 'bs-BA', en: 'en-GB', ar: 'ar', tr: 'tr-TR', id: 'id-ID', fa: 'fa-IR', ur: 'ur-PK',
};
/** Locale for Gregorian dates; pass `calendar: 'gregory'` too (fa-IR defaults to Persian). */
export const locale = (lang: Lang) => locales[lang];

/** First supported language in an Accept-Language header, else Bosnian. */
export function langFromHeader(header: string | null): Lang {
  for (const part of (header ?? '').split(',')) {
    const code = part.split(';')[0].trim().slice(0, 2).toLowerCase();
    if (code === 'hr' || code === 'sr') return 'bs';
    if (isLang(code)) return code;
  }
  return 'bs';
}

const hijriMonthsBs = [
  'muharrem', 'safer', 'rebiu-l-evvel', 'rebiu-l-ahir', 'džumade-l-ula', 'džumade-l-uhra',
  'redžeb', "ša'ban", 'ramazan', 'ševval', "zu-l-ka'de", 'zu-l-hidždže',
];
const hijriMonthsEn = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah',
];

/** "15 Sha'ban 1448" in [lang]; the other languages use ICU's Islamic month names. */
export function hijriLabel(lang: Lang, day: number, month: number, year: number) {
  if (lang === 'bs') return `${day}. ${hijriMonthsBs[month - 1]} ${year}. h.`;
  if (lang === 'en') return `${day} ${hijriMonthsEn[month - 1]} ${year} AH`;
  const name = islamicMonthName(lang, month);
  const n = new Intl.NumberFormat(locales[lang], { useGrouping: false });
  return `${n.format(day)} ${name} ${n.format(year)}`;
}

const monthNameCache = new Map<string, string>();
function islamicMonthName(lang: Lang, month: number) {
  const key = `${lang}:${month}`;
  if (!monthNameCache.has(key)) {
    const f = new Intl.DateTimeFormat(`${locales[lang]}-u-ca-islamic-umalqura`, { month: 'long', timeZone: 'UTC' });
    monthNameCache.set(key, f.format(ymdToUtc(fromHijri(1448, month, 15))));
  }
  return monthNameCache.get(key)!;
}
