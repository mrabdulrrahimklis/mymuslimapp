export type Lang = 'bs' | 'en';
export const langs: Lang[] = ['bs', 'en'];

const bs = {
  title: 'Vaktija',
  navTimes: 'Vaktija',
  footerPages: 'Stranice',
  footerApp: 'Mobilna aplikacija',
  footerAppNote: 'Kur\'an, kibla, zikr i obavijesti za namaz, sve offline.',
  footerHelp: 'Podrška',
  support: 'Pomoć',
  privacy: 'Politika privatnosti',
  contact: 'Kontakt',
  prayerTimes: 'Namaska vremena',
  tagline: 'Vaktija, ajet dana i islamski događaji',
  prayers: ['Zora', 'Izlazak sunca', 'Podne', 'Ikindija', 'Akšam', 'Jacija'],
  nextPrayer: 'Sljedeće',
  in: 'za',
  changeLocation: 'Promijeni lokaciju',
  location: 'Lokacija',
  searchCity: 'Traži grad…',
  useMyLocation: 'Koristi moju lokaciju',
  locating: 'Tražim lokaciju…',
  locationDenied: 'Lokacija nije dostupna. Izaberi grad s liste.',
  nearCity: 'blizu',
  method: 'Metoda izračuna',
  methodAuto: 'Automatski (po lokaciji)',
  save: 'Sačuvaj',
  back: 'Nazad',
  ayahOfDay: 'Ajet dana',
  upcomingEvents: 'Naredni događaji',
  allEvents: 'Svi događaji',
  events: 'Islamski događaji',
  today: 'Danas',
  tomorrow: 'Sutra',
  inDays: (n: number) => `za ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'dan' : 'dana'}`,
  ongoing: 'U toku',
  eveningBefore: 'Noć počinje uveče prije',
  practices: 'Preporuke',
  savedInCookie: 'Lokacija i postavke se čuvaju u kolačiću na ovom uređaju.',
  unavailable: 'Vaktija trenutno nije dostupna. Pokušaj ponovo za koji trenutak.',
  sourceNote: 'Vremena: Aladhan · Kur\'an: quran.com (prijevod Besim Korkut)',
};

const en: typeof bs = {
  title: 'Prayer Times',
  navTimes: 'Prayer times',
  footerPages: 'Pages',
  footerApp: 'Mobile app',
  footerAppNote: 'Qur\'an, Qibla, zikr and prayer alerts, all offline.',
  footerHelp: 'Help',
  support: 'Support',
  privacy: 'Privacy policy',
  contact: 'Contact',
  prayerTimes: 'Prayer times',
  tagline: 'Prayer times, ayah of the day and Islamic events',
  prayers: ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
  nextPrayer: 'Next',
  in: 'in',
  changeLocation: 'Change location',
  location: 'Location',
  searchCity: 'Search city…',
  useMyLocation: 'Use my location',
  locating: 'Finding your location…',
  locationDenied: 'Location unavailable. Pick a city from the list.',
  nearCity: 'near',
  method: 'Calculation method',
  methodAuto: 'Automatic (by location)',
  save: 'Save',
  back: 'Back',
  ayahOfDay: 'Ayah of the day',
  upcomingEvents: 'Upcoming events',
  allEvents: 'All events',
  events: 'Islamic events',
  today: 'Today',
  tomorrow: 'Tomorrow',
  inDays: (n: number) => `in ${n} days`,
  ongoing: 'Ongoing',
  eveningBefore: 'The night begins the evening before',
  practices: 'Recommended',
  savedInCookie: 'Your location and settings are saved in a cookie on this device.',
  unavailable: 'Prayer times are unavailable right now. Try again in a moment.',
  sourceNote: 'Times: Aladhan · Qur\'an: quran.com (Saheeh International)',
};

export const dict = { bs, en };
export type Dict = typeof bs;

/** Bosnian names of the Hijri months (1 = Muharrem). */
export const hijriMonthsBs = [
  'muharrem', 'safer', 'rebiu-l-evvel', 'rebiu-l-ahir', 'džumade-l-ula', 'džumade-l-uhra',
  'redžeb', 'ša\'ban', 'ramazan', 'ševval', 'zu-l-ka\'de', 'zu-l-hidždže',
];
export const hijriMonthsEn = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah',
];

export const hijriLabel = (lang: Lang, day: number, month: number, year: number) =>
  `${day}. ${(lang === 'bs' ? hijriMonthsBs : hijriMonthsEn)[month - 1]} ${year}. h.`;

export const locale = (lang: Lang) => (lang === 'bs' ? 'bs-BA' : 'en-GB');
