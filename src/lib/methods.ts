/** Aladhan calculation methods offered on the web (same ids as the app). */
/** [short] names it in the top bar. */
export type Method = { id: string; name: string; short: string; aladhanId: number | null };

export const methods: Method[] = [
  { id: 'auto', name: '', short: '', aladhanId: null },
  { id: 'uoif', name: 'Musulmans de France (ex-UOIF) - 12°', short: 'France 12°', aladhanId: 12 },
  { id: 'diyanet', name: 'Diyanet İşleri Başkanlığı', short: 'Diyanet', aladhanId: 13 },
  { id: 'mwl', name: 'Muslim World League (MWL)', short: 'MWL', aladhanId: 3 },
  { id: 'isna', name: 'North America (ISNA)', short: 'ISNA', aladhanId: 2 },
  { id: 'egypt', name: 'Egyptian General Authority', short: 'Egypt', aladhanId: 5 },
  { id: 'ummAlQura', name: 'Umm Al-Qura, Makkah', short: 'Umm Al-Qura', aladhanId: 4 },
  { id: 'karachi', name: 'Islamic University, Karachi', short: 'Karachi', aladhanId: 1 },
  { id: 'moonsighting', name: 'Moonsighting Committee Worldwide', short: 'Moonsighting', aladhanId: 15 },
  { id: 'russia', name: 'Russia (Spiritual Administration of Muslims)', short: 'Russia', aladhanId: 14 },
  { id: 'dubai', name: 'Dubai', short: 'Dubai', aladhanId: 16 },
  { id: 'qatar', name: 'Qatar', short: 'Qatar', aladhanId: 10 },
  { id: 'kuwait', name: 'Kuwait', short: 'Kuwait', aladhanId: 9 },
  { id: 'jakim', name: 'JAKIM (Malaysia)', short: 'JAKIM', aladhanId: 17 },
  { id: 'muis', name: 'MUIS (Singapore)', short: 'MUIS', aladhanId: 11 },
  { id: 'kemenag', name: 'KEMENAG (Indonesia)', short: 'KEMENAG', aladhanId: 20 },
  { id: 'tehran', name: 'University of Tehran', short: 'Tehran', aladhanId: 7 },
];

/** The app's default: Musulmans de France 12°. */
export const defaultMethod = methods[1];

export const methodById = (id: string | undefined) =>
  methods.find((m) => m.id === id) ?? defaultMethod;
