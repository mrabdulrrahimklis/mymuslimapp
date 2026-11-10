import type { Dict } from './types';

const plural = new Intl.PluralRules('ar');

export const ar: Dict = {
  title: 'مواقيت الصلاة',
  tagline: 'مواقيت الصلاة وآية اليوم والمناسبات الإسلامية',
  navTimes: 'مواقيت الصلاة',
  prayers: ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'],
  nextPrayer: 'الصلاة التالية',
  in: 'بعد',
  changeLocation: 'تغيير الموقع',
  location: 'الموقع',
  searchCity: 'ابحث عن مدينة…',
  useMyLocation: 'استخدم موقعي',
  locating: 'جارٍ تحديد موقعك…',
  locationDenied: 'الموقع غير متاح. اختر مدينة من القائمة.',
  near: (city) => `قرب ${city}`,
  method: 'طريقة الحساب',
  methodAuto: 'تلقائي (أقرب جهة معتمدة)',
  save: 'حفظ',
  language: 'اللغة',
  ayahOfDay: 'آية اليوم',
  quran: 'القرآن',
  events: 'المناسبات الإسلامية',
  today: 'اليوم',
  tomorrow: 'غدًا',
  inDays: (n) =>
    n === 2
      ? 'بعد يومين'
      : ({ one: 'بعد يوم واحد', few: `بعد ${n} أيام`, many: `بعد ${n} يومًا` } as Record<string, string>)[
          plural.select(n)
        ] ?? `بعد ${n} يوم`,
  ongoing: 'جارية الآن',
  eveningBefore: 'تبدأ الليلة مساء اليوم السابق',
  practices: 'المستحب',
  savedInCookie: 'يُحفظ موقعك وإعداداتك في ملف تعريف ارتباط على هذا الجهاز.',
  unavailable: 'مواقيت الصلاة غير متاحة حاليًا. حاول مرة أخرى بعد قليل.',
  sourceNote: 'المواقيت: Aladhan · القرآن: quran.com',
  footerPages: 'الصفحات',
  footerApp: 'تطبيق الجوال',
  footerAppNote: 'القرآن والقبلة والأذكار وتنبيهات الصلاة، كلها دون إنترنت.',
  footerHelp: 'المساعدة',
  support: 'الدعم',
  privacy: 'سياسة الخصوصية',
  contact: 'اتصل بنا',
};
