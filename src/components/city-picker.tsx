'use client';

import { useMemo, useState, useTransition } from 'react';
import { chooseCity, chooseCoordinates } from '@/app/actions';
import { foldForSearch } from '@/lib/cities';

type Option = { id: string; label: string; alt: string; flag: string; country: string };
type Labels = { search: string; useMine: string; locating: string; denied: string };

/** Search over the bundled cities, plus the browser's own location. */
export function CityPicker({ cities, currentId, labels }: { cities: Option[]; currentId?: string; labels: Labels }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'locating' | 'denied'>('idle');
  const [pending, start] = useTransition();

  const shown = useMemo(() => {
    const q = foldForSearch(query.trim());
    return q ? cities.filter((c) => foldForSearch(c.label).includes(q) || foldForSearch(c.alt).includes(q)) : cities;
  }, [cities, query]);

  const locate = () => {
    if (!navigator.geolocation) return setStatus('denied');
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => start(() => chooseCoordinates(pos.coords.latitude, pos.coords.longitude)),
      () => setStatus('denied'),
      { timeout: 10_000, maximumAge: 600_000 },
    );
  };

  return (
    <div className={pending ? 'pointer-events-none opacity-60' : ''}>
      <button
        onClick={locate}
        className="mb-2 w-full rounded-2xl bg-noor px-4 py-3 font-semibold text-ink hover:brightness-110"
      >
        📍 {status === 'locating' ? labels.locating : labels.useMine}
      </button>
      {status === 'denied' && <p className="mb-2 text-sm text-red-300">{labels.denied}</p>}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={labels.search}
        className="mt-2 w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none focus:border-noor"
      />
      <ul className="mt-3 grid max-h-[60vh] grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => start(() => chooseCity(c.id))}
              className={`w-full rounded-xl px-3 py-2.5 text-start hover:bg-white/10 ${
                c.id === currentId ? 'bg-noor/15 text-noor' : ''
              }`}
            >
              {c.flag} {c.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
