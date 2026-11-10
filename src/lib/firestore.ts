/**
 * Reads the app's content from Firestore (project `pray-tool`, public under
 * `content/`) over the REST API, so the web needs no SDK or credentials.
 */
const BASE = 'https://firestore.googleapis.com/v1/projects/pray-tool/databases/(default)/documents';

type Value =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values?: Value[] } }
  | { mapValue: { fields?: Record<string, Value> } };

/** Firestore's typed JSON as plain values. */
export function decode(v: Value): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(decode);
  return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, f]) => [k, decode(f)]));
}

/** A document under `content/`, or null when missing or unreachable. Cached for [revalidate] seconds. */
export async function getDoc<T>(path: string, revalidate = 60 * 60 * 24): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const { fields } = (await res.json()) as { fields?: Record<string, Value> };
    return decode({ mapValue: { fields } }) as T;
  } catch {
    return null;
  }
}

/** Ayah texts stored whole or, when too large for one document, in `parts`. */
export async function getAyahs(path: string): Promise<string[] | null> {
  const doc = await getDoc<{ ayahs?: string[]; parts?: number }>(path, 60 * 60 * 24 * 7);
  if (!doc) return null;
  if (doc.ayahs) return doc.ayahs;
  const parts = await Promise.all(
    Array.from({ length: doc.parts ?? 0 }, (_, i) => getDoc<{ ayahs: string[] }>(`${path}/parts/${i + 1}`)),
  );
  return parts.every(Boolean) ? parts.flatMap((p) => p!.ayahs) : null;
}
