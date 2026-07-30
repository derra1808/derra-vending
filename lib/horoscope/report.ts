import type { BirthData, HoroscopeReport } from "./types";
import {
  buildAstrologyProfile,
  formatFrenchDate,
  formatFrenchTime,
  calculateAge,
} from "./astrology";
import { buildNumerologyProfile } from "./numerology";
import { applyPersonalizedNarrative } from "./personalized-narrative";

export function generateHoroscopeReport(data: BirthData): HoroscopeReport {
  const { firstName, lastName, birthDate, birthTime } = data;
  const fullName = `${firstName.trim()} ${lastName.trim()}`;
  const currentYear = new Date().getFullYear();

  const astrology = buildAstrologyProfile(birthDate, birthTime);
  const numerology = buildNumerologyProfile(firstName, lastName, birthDate, currentYear);
  const age = calculateAge(birthDate, currentYear);

  const base: HoroscopeReport = {
    fullName,
    birthDateFormatted: formatFrenchDate(birthDate),
    birthTimeFormatted: formatFrenchTime(birthTime),
    age,
    astrology,
    numerology,
    past: { title: "", period: "", summary: "", love: "", career: "", health: "", advice: "" },
    present: { title: "", period: "", summary: "", love: "", career: "", health: "", advice: "" },
    nextYear: { title: "", period: "", summary: "", love: "", career: "", health: "", advice: "" },
    inFiveYears: { title: "", period: "", summary: "", love: "", career: "", health: "", advice: "" },
    inTenYears: { title: "", period: "", summary: "", love: "", career: "", health: "", advice: "" },
    synthesis: "",
  };

  return applyPersonalizedNarrative(base);
}

export {
  NUMBER_SYMBOLS,
  ZODIAC_LABELS,
  ELEMENT_LABELS,
} from "./constants";
export { ZODIAC_PROFILES, NUMBER_PROFILES } from "./content";
