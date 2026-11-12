import { CityPicker } from '@/components/city-picker';
import { TopBar } from '@/components/top-bar';
import { cities, cityName, flag } from '@/lib/cities';
import { dict } from '@/lib/i18n';
import { readSettings } from '@/lib/settings';

export default async function LocationPage() {
  const { lang, method, calendar, place } = await readSettings();
  const t = dict[lang];
  const options = cities.map((c) => ({
    id: c.id, label: cityName(c, lang), alt: c.name, flag: flag(c.country), country: c.country,
  }));
  return (
    <>
      <TopBar lang={lang} method={method} calendar={calendar} path="/location" />
      <h1 className="mb-5 text-3xl font-bold tracking-tight">{t.location}</h1>
      <CityPicker
        cities={options}
        currentId={place.cityId}
        labels={{ search: t.searchCity, useMine: t.useMyLocation, locating: t.locating, denied: t.locationDenied }}
      />
    </>
  );
}
