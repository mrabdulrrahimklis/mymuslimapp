export type Dict = {
  title: string;
  tagline: string;
  navTimes: string;
  prayers: [string, string, string, string, string, string];
  nextPrayer: string;
  in: string;
  changeLocation: string;
  location: string;
  searchCity: string;
  useMyLocation: string;
  locating: string;
  locationDenied: string;
  method: string;
  methodAuto: string;
  /** [methodAuto] short enough for the top bar. */
  methodAutoShort: string;
  save: string;
  language: string;
  ayahOfDay: string;
  quran: string;
  events: string;
  today: string;
  tomorrow: string;
  inDays: (n: number) => string;
  ongoing: string;
  eveningBefore: string;
  practices: string;
  savedInCookie: string;
  unavailable: string;
  sourceNote: string;
  footerPages: string;
  footerApp: string;
  footerAppNote: string;
  footerHelp: string;
  support: string;
  privacy: string;
  contact: string;
  /** The calendar menu and page. */
  calendar: string;
  gregorian: string;
  islamic: string;
  month: string;
  year: string;
  previous: string;
  next: string;
  date: string;
  downloadCsv: string;
  printPdf: string;
  /** Next to the QR code for the app. */
  scanToInstall: string;
  /** The mobile menu's button and its close button. */
  menu: string;
  close: string;
};
