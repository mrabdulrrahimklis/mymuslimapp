import data from '@/content/cities.json';

export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  nameBs?: string;
};

export const cities = data as City[];

export const cityById = (id: string) => cities.find((c) => c.id === id);

export const cityName = (c: City, lang: string) =>
  lang === 'bs' ? (c.nameBs ?? c.name) : c.name;

/** The country's flag, from its code (🇧🇦 for BA). */
export const flag = (country: string) =>
  String.fromCodePoint(...[...country].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));

/** Great-circle distance in km. */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(bLat - aLat) / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(rad(bLng - aLng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export const nearestCity = (lat: number, lng: number) =>
  cities.reduce((best, c) =>
    distanceKm(lat, lng, c.lat, c.lng) < distanceKm(lat, lng, best.lat, best.lng) ? c : best,
  );

/** Lower case without diacritics, so "bihac" finds Bihać. */
export const foldForSearch = (s: string) =>
  s.toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[̀-ͯ]/g, '');
