/** Aladhan calculation methods offered on the web (same ids as the app). */
export type Method = { id: string; name: string; aladhanId: number | null };

export const methods: Method[] = [
  { id: 'auto', name: '', aladhanId: null },
  { id: 'uoif', name: 'Musulmans de France (ex-UOIF) - 12°', aladhanId: 12 },
  { id: 'diyanet', name: 'Diyanet İşleri Başkanlığı', aladhanId: 13 },
  { id: 'mwl', name: 'Muslim World League (MWL)', aladhanId: 3 },
  { id: 'isna', name: 'North America (ISNA)', aladhanId: 2 },
  { id: 'egypt', name: 'Egyptian General Authority', aladhanId: 5 },
  { id: 'ummAlQura', name: 'Umm Al-Qura, Makkah', aladhanId: 4 },
  { id: 'karachi', name: 'Islamic University, Karachi', aladhanId: 1 },
  { id: 'moonsighting', name: 'Moonsighting Committee Worldwide', aladhanId: 15 },
  { id: 'russia', name: 'Russia (Spiritual Administration of Muslims)', aladhanId: 14 },
  { id: 'dubai', name: 'Dubai', aladhanId: 16 },
  { id: 'qatar', name: 'Qatar', aladhanId: 10 },
  { id: 'kuwait', name: 'Kuwait', aladhanId: 9 },
  { id: 'jakim', name: 'JAKIM (Malaysia)', aladhanId: 17 },
  { id: 'muis', name: 'MUIS (Singapore)', aladhanId: 11 },
  { id: 'kemenag', name: 'KEMENAG (Indonesia)', aladhanId: 20 },
  { id: 'tehran', name: 'University of Tehran', aladhanId: 7 },
];

/** The app's default: Musulmans de France 12°. */
export const defaultMethod = methods[1];

export const methodById = (id: string | undefined) =>
  methods.find((m) => m.id === id) ?? defaultMethod;
