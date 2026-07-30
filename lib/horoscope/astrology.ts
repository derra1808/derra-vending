import type { ZodiacSign, AstrologyProfile } from "./types";
import {
  ZODIAC_ORDER,
  ZODIAC_DATES,
  ZODIAC_ELEMENTS,
  ZODIAC_MODALITIES,
  ZODIAC_PLANETS,
  CHINESE_SIGNS,
  CHINESE_ELEMENTS,
} from "./constants";

function parseDate(dateStr: string): { day: number; month: number; year: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { day, month, year };
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  const [hour, minute] = timeStr.split(":").map(Number);
  return { hour: hour ?? 12, minute: minute ?? 0 };
}

export function getSunSign(dateStr: string): ZodiacSign {
  const { day, month } = parseDate(dateStr);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "belier";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taureau";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemeaux";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "lion";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "vierge";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "balance";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpion";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittaire";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorne";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "verseau";
  return "poissons";
}

export function getDecan(dateStr: string, sign: ZodiacSign): 1 | 2 | 3 {
  const { day, month } = parseDate(dateStr);
  const { start, end } = ZODIAC_DATES[sign];
  const [sM, sD] = start;
  const [eM, eD] = end;

  let startDay = sD;
  let startMonth = sM;
  let endDay = eD;
  let endMonth = eM;

  if (sign === "capricorne" && month === 1) {
    startDay = 1;
    startMonth = 1;
  }

  const totalDays =
    sign === "capricorne" && month === 12
      ? 31 - startDay + 1 + endDay
      : endMonth === startMonth
        ? endDay - startDay + 1
        : (new Date(2024, endMonth - 1, endDay).getTime() -
            new Date(2024, startMonth - 1, startDay).getTime()) /
            86400000 +
          1;

  let dayInSign: number;
  if (month === startMonth) {
    dayInSign = day - startDay + 1;
  } else if (sign === "capricorne" && month === 1) {
    dayInSign = 31 - startDay + 1 + day;
  } else {
    dayInSign =
      new Date(2024, month - 1, day).getTime() -
      new Date(2024, startMonth - 1, startDay).getTime();
    dayInSign = Math.floor(dayInSign / 86400000) + 1;
  }

  const third = totalDays / 3;
  if (dayInSign <= third) return 1;
  if (dayInSign <= third * 2) return 2;
  return 3;
}

/** Ascendant estimé : chaque signe monte environ 2 h (méthode solaire simplifiée). */
export function getRisingSign(dateStr: string, timeStr: string): ZodiacSign {
  const sunSign = getSunSign(dateStr);
  const { hour, minute } = parseTime(timeStr);
  const decimalHour = hour + minute / 60;
  const sunIndex = ZODIAC_ORDER.indexOf(sunSign);
  const offset = Math.floor(((decimalHour - 6 + 24) % 24) / 2);
  const risingIndex = (sunIndex + offset) % 12;
  return ZODIAC_ORDER[risingIndex];
}

/** Position lunaire approximative (cycle ~27,3 jours). */
export function getMoonSign(dateStr: string): ZodiacSign {
  const { day, month, year } = parseDate(dateStr);
  const ref = new Date(2000, 0, 6);
  const birth = new Date(year, month - 1, day);
  const daysDiff = (birth.getTime() - ref.getTime()) / 86400000;
  const lunarCycle = 27.321661;
  const signIndex = Math.floor(((daysDiff % lunarCycle) + lunarCycle) % lunarCycle / (lunarCycle / 12));
  return ZODIAC_ORDER[signIndex % 12];
}

export function getChineseZodiac(year: number): { sign: string; element: string } {
  const animals = CHINESE_SIGNS;
  const sign = animals[((year - 4) % 12 + 12) % 12];
  const element = CHINESE_ELEMENTS[Math.floor(((year - 4) % 10) / 2)];
  return { sign, element };
}

const HOUR_PLANETS = [
  "Saturne", "Jupiter", "Mars", "Soleil", "Vénus", "Mercure", "Lune",
  "Saturne", "Jupiter", "Mars", "Soleil", "Vénus", "Mercure", "Lune",
  "Saturne", "Jupiter", "Mars", "Soleil", "Vénus", "Mercure", "Lune",
  "Saturne", "Jupiter", "Mars",
];

export function getBirthHourPlanet(timeStr: string): string {
  const { hour } = parseTime(timeStr);
  return HOUR_PLANETS[hour] ?? "Soleil";
}

export function buildAstrologyProfile(dateStr: string, timeStr: string): AstrologyProfile {
  const { year } = parseDate(dateStr);
  const sunSign = getSunSign(dateStr);
  const chinese = getChineseZodiac(year);

  return {
    sunSign,
    risingSign: getRisingSign(dateStr, timeStr),
    moonSign: getMoonSign(dateStr),
    element: ZODIAC_ELEMENTS[sunSign],
    modality: ZODIAC_MODALITIES[sunSign],
    rulingPlanet: ZODIAC_PLANETS[sunSign],
    chineseSign: chinese.sign,
    chineseElement: chinese.element,
    decan: getDecan(dateStr, sunSign),
    birthHourPlanet: getBirthHourPlanet(timeStr),
  };
}

export function formatFrenchDate(dateStr: string): string {
  const { day, month, year } = parseDate(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatFrenchTime(timeStr: string): string {
  const { hour, minute } = parseTime(timeStr);
  return `${String(hour).padStart(2, "0")}h${String(minute).padStart(2, "0")}`;
}

export function calculateAge(dateStr: string, referenceYear = new Date().getFullYear()): number {
  const { year } = parseDate(dateStr);
  return referenceYear - year;
}
