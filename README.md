# Muslim App — Web

Web version of Muslim App (the `pray-tool` Flutter app): prayer times (vaktija), ayah of the day and
upcoming Islamic events. Next.js (App Router), no database. The mobile app is
not changed.

- **Prayer times**: Aladhan `/calendar` (same as the app), cached a day per location/method.
- **Ayah of the day**: same `dailyAyahKey` as the app; quran.com (Besim Korkut / Saheeh International).
- **Events**: copied from the app's `assets/content/<lang>/events.json` (Umm al-Qura dates).
- **Languages**: all 7 of the app (bs, en, ar, tr, id, fa, ur); RTL for ar/fa/ur. First visit follows the browser's Accept-Language.
- **Settings** live in cookies: `pt_loc` (city id or `geo:lat,lng`), `pt_lang`, `pt_method`.

```bash
pnpm install
pnpm sync-content   # re-copy cities + events from ../pray-tool-mobile-app
pnpm dev
pnpm test
pnpm build && pnpm start
```

Deployed on Railway (`railway up`).
