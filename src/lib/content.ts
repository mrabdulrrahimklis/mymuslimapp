/**
 * Reads the app's content from Firebase Hosting (project `pray-tool`, site
 * `muslim-app-content`), where `pray-tool-content` deploys every item as
 * `content/<path>.json`, so the web needs no SDK or credentials.
 */
export const CONTENT_HOST = 'https://muslim-app-content.web.app';

/** URL of the item at [path] (under `content/`). */
export const contentUrl = (path: string) => `${CONTENT_HOST}/${path}.json`;

/** The item at `<path>.json`, or null when missing or unreachable. Cached for [revalidate] seconds. */
export async function getDoc<T>(path: string, revalidate = 60 * 60 * 24): Promise<T | null> {
  try {
    const res = await fetch(contentUrl(path), { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** An item's ayah texts (a surah's text or translation). */
export async function getAyahs(path: string): Promise<string[] | null> {
  const doc = await getDoc<{ ayahs?: string[] }>(path, 60 * 60 * 24 * 7);
  return doc?.ayahs ?? null;
}
