import { describe, expect, it } from 'vitest';
import { dailyAyahKey, stripMarkup } from './ayah';
import { parsePlace } from './settings';
import { fromHijri, toHijri } from './hijri';
import { upcomingEvents } from './events';
import { foldForSearch, nearestCity } from './cities';

describe('hijri', () => {
  it('converts both ways', () => {
    expect(fromHijri(1447, 9, 1)).toBe('2026-02-18'); // Ramadan 1447
    expect(fromHijri(1447, 10, 1)).toBe('2026-03-20'); // Eid al-Fitr
    expect(toHijri('2026-02-18')).toEqual({ year: 1447, month: 9, day: 1 });
  });
  it('round-trips every day of a year', () => {
    for (let m = 1; m <= 12; m++) {
      const ymd = fromHijri(1448, m, 15);
      expect(toHijri(ymd)).toEqual({ year: 1448, month: m, day: 15 });
    }
  });
});

describe('dailyAyahKey', () => {
  it('is a valid key and stable per day', () => {
    expect(dailyAyahKey('2000-01-01')).toBe('1:1');
    expect(dailyAyahKey('2026-11-10')).toMatch(/^\d{1,3}:\d{1,3}$/);
    expect(dailyAyahKey('2026-11-10')).toBe(dailyAyahKey('2026-11-10'));
    expect(dailyAyahKey('2026-11-10')).not.toBe(dailyAyahKey('2026-11-11'));
  });
  it('strips footnotes', () => {
    expect(stripMarkup('Allah<sup foot_note="1">1</sup> je <i>Jedan</i>')).toBe('Allah je Jedan');
  });
});

describe('events', () => {
  it('lists upcoming events soonest first, none in the past', () => {
    const list = upcomingEvents('bs', '2026-11-10');
    expect(list.length).toBeGreaterThan(10);
    expect(list.every((e) => e.end >= '2026-11-10')).toBe(true);
    expect(list[0].event.id).toBe('isra_miraj'); // 27 Rajab 1448
  });
  it('keeps an event that is under way', () => {
    const ramadan = upcomingEvents('en', '2026-02-25').find((e) => e.event.id === 'ramadan')!;
    expect(ramadan.daysUntil).toBeLessThan(0);
  });
});

describe('location', () => {
  it('parses cookies and falls back to Sarajevo', () => {
    expect(parsePlace(undefined, 'bs').cityId).toBe('sarajevo');
    expect(parsePlace('junk', 'bs').cityId).toBe('sarajevo');
    expect(parsePlace('vienna', 'bs').label).toBe('Beč');
    const geo = parsePlace('geo:44.54,18.68', 'bs');
    expect(geo).toMatchObject({ lat: 44.54, lng: 18.68, label: 'Tuzla', nearby: true });
    expect(parsePlace('geo:999,1', 'en').cityId).toBe('sarajevo');
  });
  it('finds cities', () => {
    expect(nearestCity(43.85, 18.4).id).toBe('sarajevo');
    expect(foldForSearch('Bihać Đakovo')).toBe('bihac djakovo');
  });
});

describe('languages', async () => {
  const { dict, hijriLabel, langFromHeader, langs } = await import('./i18n');
  it('has every language of the app with events', () => {
    expect(langs).toEqual(['bs', 'en', 'ar', 'tr', 'id', 'fa', 'ur']);
    for (const l of langs) {
      expect(dict[l].prayers).toHaveLength(6);
      expect(upcomingEvents(l, '2026-11-10').length).toBeGreaterThan(10);
    }
  });
  it('picks the language from the browser', () => {
    expect(langFromHeader('tr-TR,tr;q=0.9,en;q=0.8')).toBe('tr');
    expect(langFromHeader('hr-HR,en;q=0.5')).toBe('bs');
    expect(langFromHeader('de-DE,en;q=0.5')).toBe('en');
    expect(langFromHeader(null)).toBe('bs');
  });
  it('names Hijri months in each language', () => {
    expect(hijriLabel('bs', 15, 8, 1448)).toBe("15. ša'ban 1448. h.");
    for (const l of ['ar', 'tr', 'id', 'fa', 'ur'] as const) {
      expect(hijriLabel(l, 1, 9, 1448)).not.toMatch(/M09|undefined/);
    }
  });
  it('uses Arabic plural rules', () => {
    expect(dict.ar.inDays(1)).toBe('بعد يوم واحد');
    expect(dict.ar.inDays(2)).toBe('بعد يومين');
    expect(dict.ar.inDays(5)).toBe('بعد 5 أيام');
    expect(dict.ar.inDays(11)).toBe('بعد 11 يومًا');
    expect(dict.ar.inDays(100)).toBe('بعد 100 يوم');
  });
});
