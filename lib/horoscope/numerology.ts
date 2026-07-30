import type { CoreNumber, NumerologyProfile } from "./types";
import {
  buildNumerologieStrategiqueProfile,
  getLifePath,
  getExpression,
  getSoulUrge,
  getPersonalityNumber,
  getBirthdayNumber,
  getPersonalYear,
  reduceNumber,
} from "./numerology-strategique";
import { LETTER_VALUES, VOWELS } from "./constants";

function normalizeLetter(char: string): string {
  return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getKarmicLessons(firstName: string, lastName: string): number[] {
  const present = new Set<number>();
  for (const char of `${firstName} ${lastName}`) {
    const n = normalizeLetter(char);
    if (LETTER_VALUES[n]) present.add(LETTER_VALUES[n]);
  }
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !present.has(n));
}

function getPinnacles(dateStr: string): [CoreNumber, CoreNumber, CoreNumber, CoreNumber] {
  const [year, month, day] = dateStr.split("-").map(Number);
  const m = reduceNumber(month, false);
  const d = reduceNumber(day, false);
  const y = reduceNumber(
    String(year)
      .split("")
      .reduce((s, n) => s + Number(n), 0),
    false
  );
  return [
    reduceNumber(m + d),
    reduceNumber(d + y),
    reduceNumber(m + d + y),
    reduceNumber(m + y),
  ];
}

function getChallenges(dateStr: string): [CoreNumber, CoreNumber, CoreNumber, CoreNumber] {
  const [year, month, day] = dateStr.split("-").map(Number);
  const m = reduceNumber(month, false);
  const d = reduceNumber(day, false);
  const y = reduceNumber(
    String(year)
      .split("")
      .reduce((s, n) => s + Number(n), 0),
    false
  );
  return [
    reduceNumber(Math.abs(m - d)),
    reduceNumber(Math.abs(d - y)),
    reduceNumber(Math.abs(m - d - y)),
    reduceNumber(Math.abs(m - y) || 9),
  ];
}

function getDominantNumber(values: CoreNumber[]): CoreNumber {
  const counts = new Map<number, number>();
  for (const n of values) counts.set(n, (counts.get(n) ?? 0) + 1);
  let max = 0;
  let dominant: CoreNumber = values[0];
  for (const [n, c] of counts) {
    if (c > max) {
      max = c;
      dominant = n as CoreNumber;
    }
  }
  return dominant;
}

export function buildNumerologyProfile(
  firstName: string,
  lastName: string,
  dateStr: string,
  currentYear = new Date().getFullYear()
): NumerologyProfile {
  const strategique = buildNumerologieStrategiqueProfile(firstName, lastName, dateStr);
  const lifePath = getLifePath(dateStr);
  const expression = getExpression(firstName, lastName);
  const soulUrge = getSoulUrge(firstName, lastName);
  const personality = getPersonalityNumber(firstName, lastName);
  const birthday = getBirthdayNumber(dateStr);
  const maturity = reduceNumber(lifePath + expression);
  const pinnacles = getPinnacles(dateStr);
  const challenges = getChallenges(dateStr);
  const karmicLessons = getKarmicLessons(firstName, lastName);

  return {
    lifePath,
    expression,
    soulUrge,
    personality,
    birthday,
    maturity,
    personalYear: getPersonalYear(dateStr, currentYear),
    nextPersonalYear: getPersonalYear(dateStr, currentYear + 1),
    personalYearFiveYears: getPersonalYear(dateStr, currentYear + 5),
    personalYearTenYears: getPersonalYear(dateStr, currentYear + 10),
    pinnacles,
    challenges,
    karmicLessons,
    dominantNumber: getDominantNumber([lifePath, expression, soulUrge, personality, birthday]),
    lifeDynamic: strategique.tree.lifeDynamic.reduced,
    lifeDynamicDisplay: strategique.tree.lifeDynamic.display,
    trunk: strategique.tree.trunk.reduced,
    strategique,
  };
}

export { reduceNumber, getPersonalYear, getExpression, getLifePath };
