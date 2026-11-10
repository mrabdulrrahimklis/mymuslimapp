import { type Ymd, utcToYmd } from './dates';

export type HijriDate = { year: number; month: number; day: number };

// Umm al-Qura, the same calendar the app uses for events.
const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
  timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric',
});

export function toHijri(ymd: Ymd): HijriDate {
  const parts = fmt.formatToParts(new Date(`${ymd}T12:00:00Z`));
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)!.value, 10);
  return { year: get('year'), month: get('month'), day: get('day') };
}

const ISLAMIC_EPOCH_MS = Date.UTC(622, 6, 19); // 1 Muharram 1 AH (approx.)

/** The Gregorian day of a Hijri date: estimated, then matched exactly. */
export function fromHijri(year: number, month: number, day: number): Ymd {
  const days = Math.floor((year - 1) * 354.36667 + (month - 1) * 29.5306 + day - 1);
  const guess = new Date(ISLAMIC_EPOCH_MS + days * 86_400_000);
  let fallback: Ymd | null = null;
  for (let off = -4; off <= 4; off++) {
    const d = new Date(guess);
    d.setUTCDate(d.getUTCDate() + off);
    const ymd = utcToYmd(d);
    const h = toHijri(ymd);
    if (h.year === year && h.month === month) {
      if (h.day === day) return ymd;
      if (h.day === day - 1) fallback = utcToYmd(new Date(d.getTime() + 86_400_000));
    }
  }
  if (fallback) return fallback; // day 30 of a 29-day month
  throw new Error(`no Gregorian date for ${year}-${month}-${day} AH`);
}
