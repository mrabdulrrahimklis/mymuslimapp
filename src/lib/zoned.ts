/** Offset of [timeZone] from UTC at instant [at], e.g. "+01:00". */
export function offsetAt(timeZone: string, at: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const local = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  const minutes = Math.round((local - at.getTime()) / 60_000);
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

/** "2026-11-10" + "05:29" in Europe/Sarajevo → "2026-11-10T05:29:00+01:00". */
export function zonedIso(ymd: string, hm: string, timeZone: string): string {
  // The offset an hour either side of a DST change can differ; take it at that wall time.
  const guess = new Date(`${ymd}T${hm}:00Z`);
  const offset = offsetAt(timeZone, new Date(guess.getTime() - parseOffset(offsetAt(timeZone, guess))));
  return `${ymd}T${hm}:00${offset}`;
}

const parseOffset = (o: string) => (o[0] === '-' ? -1 : 1) * (Number(o.slice(1, 3)) * 60 + Number(o.slice(4))) * 60_000;
