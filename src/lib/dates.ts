/** A calendar day as `YYYY-MM-DD`; compared as strings. */
export type Ymd = string;

/** Today's date in [timeZone]. */
export const todayIn = (timeZone: string, now = new Date()): Ymd =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);

export const ymdToUtc = (ymd: Ymd) => new Date(`${ymd}T00:00:00Z`);
export const utcToYmd = (d: Date): Ymd => d.toISOString().slice(0, 10);

export const addDays = (ymd: Ymd, n: number): Ymd => {
  const d = ymdToUtc(ymd);
  d.setUTCDate(d.getUTCDate() + n);
  return utcToYmd(d);
};

/** Whole days from [from] to [to]. */
export const daysBetween = (from: Ymd, to: Ymd) =>
  Math.round((ymdToUtc(to).getTime() - ymdToUtc(from).getTime()) / 86_400_000);
