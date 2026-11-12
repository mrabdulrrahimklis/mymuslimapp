import { chooseMethod } from '@/app/actions';
import { CityPicker } from '@/components/city-picker';
import { TopBar } from '@/components/top-bar';
import { cities, cityName, flag } from '@/lib/cities';
import { dict } from '@/lib/i18n';
import { methods } from '@/lib/methods';
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
      <div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
      <CityPicker
        cities={options}
        currentId={place.cityId}
        labels={{ search: t.searchCity, useMine: t.useMyLocation, locating: t.locating, denied: t.locationDenied }}
      />
      <form action={chooseMethod} className="rounded-2xl border border-line bg-panel/70 p-4">
        <label htmlFor="method" className="text-sm font-semibold text-mute">{t.method}</label>
        <div className="mt-2 flex flex-col gap-3">
          <select
            id="method"
            name="method"
            defaultValue={method.id}
            className="flex-1 rounded-xl border border-line bg-ink px-3 py-2.5"
          >
            {methods.map((m) => <option key={m.id} value={m.id}>{m.name || t.methodAuto}</option>)}
          </select>
          <button className="rounded-xl bg-noor px-5 py-2.5 font-semibold text-ink">{t.save}</button>
        </div>
      </form>
      </div>
    </>
  );
}
