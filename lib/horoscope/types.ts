export type ZodiacSign =
  | "belier"
  | "taureau"
  | "gemeaux"
  | "cancer"
  | "lion"
  | "vierge"
  | "balance"
  | "scorpion"
  | "sagittaire"
  | "capricorne"
  | "verseau"
  | "poissons";

export type Element = "feu" | "terre" | "air" | "eau";

export type MasterNumber = 11 | 22 | 33;

export type CoreNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | MasterNumber;

export interface BirthData {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthTime: string;
}

export interface AstrologyProfile {
  sunSign: ZodiacSign;
  risingSign: ZodiacSign;
  moonSign: ZodiacSign;
  element: Element;
  modality: "cardinal" | "fixe" | "mutable";
  rulingPlanet: string;
  chineseSign: string;
  chineseElement: string;
  decan: 1 | 2 | 3;
  birthHourPlanet: string;
}

import type { NumerologieStrategiqueProfile } from "./numerology-strategique";

export interface NumerologyProfile {
  lifePath: CoreNumber;
  expression: CoreNumber;
  soulUrge: CoreNumber;
  personality: CoreNumber;
  birthday: CoreNumber;
  maturity: CoreNumber;
  personalYear: CoreNumber;
  nextPersonalYear: CoreNumber;
  personalYearFiveYears: CoreNumber;
  personalYearTenYears: CoreNumber;
  pinnacles: [CoreNumber, CoreNumber, CoreNumber, CoreNumber];
  challenges: [CoreNumber, CoreNumber, CoreNumber, CoreNumber];
  karmicLessons: number[];
  dominantNumber: CoreNumber;
  lifeDynamic: CoreNumber;
  lifeDynamicDisplay: string;
  trunk: CoreNumber;
  strategique: NumerologieStrategiqueProfile;
}

export interface TimelineSection {
  title: string;
  period: string;
  summary: string;
  love: string;
  career: string;
  health: string;
  advice: string;
}

export interface HoroscopeReport {
  fullName: string;
  birthDateFormatted: string;
  birthTimeFormatted: string;
  age: number;
  astrology: AstrologyProfile;
  numerology: NumerologyProfile;
  past: TimelineSection;
  present: TimelineSection;
  nextYear: TimelineSection;
  inFiveYears: TimelineSection;
  inTenYears: TimelineSection;
  synthesis: string;
}
