# Pray Tool — Web

Web version of the Pray Tool app: prayer times (vaktija), ayah of the day and
upcoming Islamic events. Next.js (App Router), no database. The mobile app is
not changed.

- **Prayer times**: Aladhan `/calendar` (same as the app), cached a day per location/method.
- **Ayah of the day**: same `dailyAyahKey` as the app; quran.com (Besim Korkut / Saheeh International).
- **Events**: copied from the app's `assets/content/{bs,en}/events.json` (Umm al-Qura dates).
- **Settings** live in cookies: `pt_loc` (city id or `geo:lat,lng`), `pt_lang`, `pt_method`.

```bash
pnpm install
pnpm sync-content   # re-copy cities + events from ../pray-tool-mobile-app
pnpm dev
pnpm test
pnpm build && pnpm start
```

Deployed on Railway (`railway up`).
