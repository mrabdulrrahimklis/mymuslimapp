// Copies the cities and Islamic events from the Flutter app, so the web shows
// the same data. Read-only towards the mobile app. Run: pnpm sync-content
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = join(root, '..', 'pray-tool-mobile-app');
const out = join(root, 'src', 'content');
mkdirSync(out, { recursive: true });

// City('id', 'Name', 'CC', lat, lng, nameBs: 'Beč')
const dart = readFileSync(join(mobile, 'lib/core/location/city_data.dart'), 'utf8');
const re = /City\(\s*'([^']+)',\s*'([^']+)',\s*'([A-Z]{2})',\s*(-?[\d.]+),\s*(-?[\d.]+)(?:,\s*nameBs:\s*'([^']+)')?/g;
const cities = [...dart.matchAll(re)].map(([, id, name, country, lat, lng, nameBs]) => ({
  id, name, country, lat: Number(lat), lng: Number(lng), ...(nameBs ? { nameBs } : {}),
}));
writeFileSync(join(out, 'cities.json'), JSON.stringify(cities, null, 1) + '\n');

for (const lang of ['bs', 'en']) {
  const events = readFileSync(join(mobile, `assets/content/${lang}/events.json`), 'utf8');
  writeFileSync(join(out, `events.${lang}.json`), events);
}
console.log(`synced ${cities.length} cities and events (bs, en)`);
