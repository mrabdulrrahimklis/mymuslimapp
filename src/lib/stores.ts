/** Where the mobile app is installed from. */
export const APP_STORE_URL = 'https://apps.apple.com/app/id6830848746';
export const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.amygdal.pray_tool';

/** The store for the device in [userAgent], or null for a computer. */
export function storeFor(userAgent: string | null): string | null {
  const ua = userAgent ?? '';
  if (/android/i.test(ua)) return PLAY_URL;
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua))) return APP_STORE_URL;
  return null;
}
