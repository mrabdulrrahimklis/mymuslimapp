'use client';

import { useEffect, useState } from 'react';

export type Slot = { label: string; iso: string };

const hm = (iso: string) => iso.slice(11, 16); // already in the location's time

function countdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** Today's six times with the current one marked and a live countdown to the next. */
export function PrayerBoard({
  slots, tomorrowFajr, serverNow, nextLabel, inLabel,
}: { slots: Slot[]; tomorrowFajr: Slot | null; serverNow: number; nextLabel: string; inLabel: string }) {
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const at = slots.map((s) => Date.parse(s.iso));
  const nextIndex = at.findIndex((t) => t > now);
  const next = nextIndex >= 0 ? slots[nextIndex] : tomorrowFajr;
  const current = nextIndex === -1 ? slots.length - 1 : nextIndex - 1;

  return (
    <section>
      {next && (
        <div className="mb-5 rounded-3xl border border-noor/30 bg-gradient-to-br from-noor/20 to-noor/5 p-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-noor">{nextLabel}</p>
          <p className="mt-1 text-3xl font-semibold">
            {next.label} <span className="text-mute">·</span> {hm(next.iso)}
          </p>
          <p className="mt-2 font-mono text-4xl tabular-nums tracking-tight sm:text-5xl" suppressHydrationWarning>
            <span className="mr-2 align-middle text-base font-sans text-mute">{inLabel}</span>
            {countdown(Date.parse(next.iso) - now)}
          </p>
        </div>
      )}
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slots.map((s, i) => (
          <li
            key={s.label}
            className={`rounded-2xl border p-4 transition ${
              i === current ? 'border-noor bg-noor/15 shadow-[0_0_30px_-10px] shadow-noor' : 'border-line bg-panel/70'
            }`}
          >
            <p className={`text-sm ${i === current ? 'text-noor' : 'text-mute'}`}>{s.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{hm(s.iso)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
