import type { Ymd } from './dates';
import type { Lang } from './i18n';

/** Ayah counts of all 114 surahs (6236 in total). */
const verseCounts = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
  6, 3, 5, 4, 5, 6,
];
const totalAyahs = 6236;

/** Same ayah as the mobile app on a given day (Knuth multiplicative hash). */
export function dailyAyahKey(ymd: Ymd): string {
  const day = BigInt(Math.round((Date.parse(`${ymd}T00:00:00Z`) - Date.UTC(2000, 0, 1)) / 86_400_000));
  let index = Number((day * 2654435761n) % BigInt(totalAyahs));
  for (let surah = 0; surah < verseCounts.length; surah++) {
    if (index < verseCounts[surah]) return `${surah + 1}:${index + 1}`;
    index -= verseCounts[surah];
  }
  throw new Error('unreachable');
}

/** quran.com translations, as in the app: Besim Korkut (bs), Saheeh International (en). */
const translationId: Record<Lang, number> = { bs: 126, en: 20 };

export type Ayah = { key: string; arabic: string; translation: string };

export const stripMarkup = (html: string) =>
  html.replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim();

export async function loadAyah(ymd: Ymd, lang: Lang): Promise<Ayah> {
  const key = dailyAyahKey(ymd);
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${key}?translations=${translationId[lang]}&fields=text_uthmani`,
    { next: { revalidate: 60 * 60 * 24 * 7 } },
  );
  if (!res.ok) throw new Error(`quran.com ${res.status}`);
  const { verse } = (await res.json()) as {
    verse: { text_uthmani: string; translations?: { text: string }[] };
  };
  return { key, arabic: verse.text_uthmani, translation: stripMarkup(verse.translations?.[0]?.text ?? '') };
}
