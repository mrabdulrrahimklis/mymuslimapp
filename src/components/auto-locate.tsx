'use client';

import { useEffect } from 'react';
import { chooseCoordinates } from '@/app/actions';

/**
 * On a first visit (no place saved yet), asks the browser where the visitor
 * is and saves it, so the times are for here rather than the default city.
 * If they say no, the default city stays and nothing is saved.
 */
export function AutoLocate() {
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => chooseCoordinates(pos.coords.latitude, pos.coords.longitude),
      () => {},
      { timeout: 10_000, maximumAge: 600_000 },
    );
  }, []);
  return null;
}
