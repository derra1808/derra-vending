import type { CoreNumber } from "./types";
import { LETTER_VALUES, VOWELS, MASTER_NUMBERS } from "./constants";

export const KARMIC_DEBT_NUMBERS = new Set([13, 14, 16, 19]);

export interface NumberValue {
  raw: number;
  reduced: CoreNumber;
  display: string;
  hasKarmicDebt: boolean;
  karmicNumber?: number;
}

export interface NameEnergy {
  name: string;
  vowels: NumberValue;
  consonants: NumberValue;
  total: NumberValue;
  vowelsPlusConsonants: NumberValue;
}

export interface PersonalityTree {
  root1: NumberValue;
  root2: NumberValue;
  trunk: NumberValue;
  bark: NumberValue;
  branches: NumberValue;
  leaves: NumberValue;
  fruits: NumberValue;
  lifeDynamic: NumberValue;
  familyMemoryPositions: string[];
}

export interface InclusionTable {
  counts: Record<number, number>;
  missing: number[];
  labels: Record<number, string>;
}

export interface Challenges {
  birthday: NumberValue;
  birthGift: NumberValue;
  fetus: NumberValue;
  date: [NumberValue, NumberValue, NumberValue, NumberValue];
}

export interface YearTemporal {
  year: number;
  age: number;
  personalYear: CoreNumber;
  universalYear: CoreNumber;
  yearObjective: CoreNumber;
  personalMonths: CoreNumber[];
  personalQuarters: [CoreNumber, CoreNumber, CoreNumber, CoreNumber];
  personalDaysInMonth: CoreNumber[];
  hasInfluence12: boolean;
}

export interface LifePlanRow {
  ageFrom: number;
  ageTo: number;
  vibration1: CoreNumber;
  vibration2: CoreNumber;
  key: CoreNumber;
  formativePeriod: CoreNumber;
}

export interface LifePlanYearRow {
  year: number;
  age: number;
  formativePeriod: CoreNumber;
  vibration1: CoreNumber;
  vibration2: CoreNumber;
  key: CoreNumber;
  personalYear: CoreNumber;
  universalYear: CoreNumber;
  yearObjective: CoreNumber;
  hasInfluence12: boolean;
}

export interface NumerologieStrategiqueProfile {
  tree: PersonalityTree;
  inclusion: InclusionTable;
  challenges: Challenges;
  nameEnergies: NameEnergy[];
  currentTemporal: YearTemporal;
  previousTemporal: YearTemporal;
  nextTemporal: YearTemporal;
  lifePlanPeriods: LifePlanRow[];
  lifePlanYears: LifePlanYearRow[];
}

function normalizeLetter(char: string): string {
  return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function reduceFull(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}

export function reduceNumber(n: number, keepMaster = true): CoreNumber {
  if (keepMaster && MASTER_NUMBERS.has(n)) return n as CoreNumber;
  while (n > 9) {
    if (keepMaster && MASTER_NUMBERS.has(n)) return n as CoreNumber;
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n as CoreNumber;
}

function sumLetters(text: string, filter?: (c: string) => boolean): number {
  let total = 0;
  for (const char of text) {
    const normalized = normalizeLetter(char);
    if (!/[a-z]/.test(normalized)) continue;
    if (filter && !filter(normalized)) continue;
    total += LETTER_VALUES[normalized] ?? 0;
  }
  return total;
}

function detectKarmic(raw: number): number | undefined {
  if (KARMIC_DEBT_NUMBERS.has(raw)) return raw;
  return undefined;
}

export function toNumberValue(raw: number, keepMaster = true): NumberValue {
  const karmic = detectKarmic(raw);
  const reduced = reduceNumber(raw, keepMaster);
  const display = MASTER_NUMBERS.has(raw)
    ? `${raw}/${reduceFull(raw)}`
    : karmic
      ? `${raw}/${reduced}`
      : String(reduced);
  return {
    raw,
    reduced,
    display,
    hasKarmicDebt: Boolean(karmic),
    karmicNumber: karmic,
  };
}

export function getExpression(firstName: string, lastName: string): CoreNumber {
  return reduceNumber(sumLetters(`${firstName} ${lastName}`));
}

export function getLifePath(dateStr: string): CoreNumber {
  const [year, month, day] = dateStr.split("-").map(Number);
  const ySum = reduceNumber(
    String(year)
      .split("")
      .reduce((s, n) => s + Number(n), 0),
    false
  );
  return reduceNumber(reduceNumber(day, false) + reduceNumber(month, false) + ySum);
}

export function getTrunk(dateStr: string): CoreNumber {
  const [, month, day] = dateStr.split("-").map(Number);
  return reduceNumber(day + month);
}

export function getLifeDynamic(
  expression: CoreNumber,
  lifePath: CoreNumber,
  trunk: CoreNumber
): NumberValue {
  const raw = expression + lifePath + trunk;
  return toNumberValue(raw);
}

export function getPersonalityNumber(firstName: string, lastName: string): CoreNumber {
  return reduceNumber(sumLetters(`${firstName} ${lastName}`, (c) => !VOWELS.has(c)));
}

export function getSoulUrge(firstName: string, lastName: string): CoreNumber {
  return reduceNumber(sumLetters(`${firstName} ${lastName}`, (c) => VOWELS.has(c)));
}

export function getBirthdayNumber(dateStr: string): CoreNumber {
  const day = Number(dateStr.split("-")[2]);
  return reduceNumber(day);
}

export function getBirthdayChallenge(dateStr: string): CoreNumber {
  const day = Number(dateStr.split("-")[2]);
  const tens = Math.floor(day / 10);
  const units = day % 10;
  return reduceNumber(Math.abs(tens - units));
}

export function getBirthGift(dateStr: string): CoreNumber {
  const day = Number(dateStr.split("-")[2]);
  return reduceNumber(11 - reduceFull(day));
}

export function getFetusNumber(lastName: string): CoreNumber {
  return reduceNumber(sumLetters(lastName, (c) => VOWELS.has(c)));
}

function getNameEnergy(name: string): NameEnergy {
  const vowelsRaw = sumLetters(name, (c) => VOWELS.has(c));
  const consonantsRaw = sumLetters(name, (c) => !VOWELS.has(c));
  const totalRaw = sumLetters(name);
  return {
    name,
    vowels: toNumberValue(vowelsRaw),
    consonants: toNumberValue(consonantsRaw),
    total: toNumberValue(totalRaw),
    vowelsPlusConsonants: toNumberValue(vowelsRaw + consonantsRaw),
  };
}

export function getInclusionTable(firstName: string, lastName: string): InclusionTable {
  const counts: Record<number, number> = Object.fromEntries(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [n, 0])
  ) as Record<number, number>;

  for (const char of `${firstName} ${lastName}`) {
    const n = normalizeLetter(char);
    if (LETTER_VALUES[n]) counts[LETTER_VALUES[n]]++;
  }

  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === 0);

  return {
    counts,
    missing,
    labels: {
      1: "Action (Capacité à décider)",
      2: "Rapport à l'autre",
      3: "Communication",
      4: "Travail / organisation",
      5: "Liberté",
      6: "Amour-propre",
      7: "Confiance en soi / spiritualité",
      8: "Légitimité / réalisation",
      9: "Groupe / relation aux autres",
    },
  };
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

function getDateChallenges(dateStr: string): [NumberValue, NumberValue, NumberValue, NumberValue] {
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
    toNumberValue(Math.abs(m - d), false),
    toNumberValue(Math.abs(d - y), false),
    toNumberValue(Math.abs(m - d - y), false),
    toNumberValue(Math.abs(m - y) || 9, false),
  ];
}

export function getPersonalYear(dateStr: string, targetYear: number): CoreNumber {
  const [, month, day] = dateStr.split("-").map(Number);
  const ySum = reduceNumber(
    String(targetYear)
      .split("")
      .reduce((s, n) => s + Number(n), 0),
    false
  );
  return reduceNumber(reduceNumber(day, false) + reduceNumber(month, false) + ySum);
}

export function getUniversalYear(year: number): CoreNumber {
  return reduceNumber(
    String(year)
      .split("")
      .reduce((s, n) => s + Number(n), 0)
  );
}

export function getYearObjective(personalYear: CoreNumber, universalYear: CoreNumber): CoreNumber {
  return reduceNumber(personalYear + universalYear, false);
}

export function getPersonalMonth(personalYear: CoreNumber, month: number): CoreNumber {
  return reduceNumber(personalYear + month);
}

export function getPersonalDay(personalMonth: CoreNumber, day: number): CoreNumber {
  return reduceNumber(personalMonth + day, false);
}

export function getPersonalQuarters(
  personalYear: CoreNumber,
  birthMonth: number
): [CoreNumber, CoreNumber, CoreNumber, CoreNumber] {
  const q1 = personalYear;
  const q2 = reduceNumber(personalYear + birthMonth);
  const q3 =
    personalYear === 9
      ? reduceNumber(personalYear + birthMonth)
      : reduceNumber(personalYear + birthMonth - 1);
  const q4 = personalYear === 9 ? reduceNumber(personalYear + 1, false) : personalYear;
  return [q1, q2, q3, q4];
}

export function getFormativePeriod(age: number): CoreNumber {
  return reduceNumber(Math.floor(age / 9) + 1, false);
}

export function hasInfluence12(age: number): boolean {
  return age % 12 === 11;
}

function getSeasonVibrations(
  age: number,
  lifePath: CoreNumber,
  birthday: CoreNumber,
  trunk: CoreNumber,
  pinnacles: [CoreNumber, CoreNumber, CoreNumber, CoreNumber]
): { v1: CoreNumber; v2: CoreNumber } {
  const p1End = 36 - lifePath;
  const p2End = p1End + 9;
  const p3End = p2End + 9;
  const p4End = p3End + 9;

  if (age <= p1End) return { v1: pinnacles[0], v2: trunk };
  if (age <= p2End) return { v1: birthday, v2: pinnacles[1] };
  if (age <= p4End) return { v1: birthday, v2: pinnacles[2] };
  return { v1: pinnacles[0], v2: pinnacles[3] };
}

function buildYearTemporal(
  dateStr: string,
  birthYear: number,
  targetYear: number
): YearTemporal {
  const [, birthMonth] = dateStr.split("-").map(Number);
  const age = targetYear - birthYear;
  const personalYear = getPersonalYear(dateStr, targetYear);
  const universalYear = getUniversalYear(targetYear);
  const yearObjective = getYearObjective(personalYear, universalYear);
  const personalMonths = Array.from({ length: 12 }, (_, i) =>
    getPersonalMonth(personalYear, i + 1)
  );
  const personalQuarters = getPersonalQuarters(personalYear, birthMonth);

  const now = new Date();
  const refMonth = now.getFullYear() === targetYear ? now.getMonth() + 1 : 7;
  const daysInMonth = new Date(targetYear, refMonth, 0).getDate();
  const personalMonth = getPersonalMonth(personalYear, refMonth);
  const personalDaysInMonth = Array.from({ length: daysInMonth }, (_, i) =>
    getPersonalDay(personalMonth, i + 1)
  );

  return {
    year: targetYear,
    age,
    personalYear,
    universalYear,
    yearObjective,
    personalMonths,
    personalQuarters,
    personalDaysInMonth,
    hasInfluence12: hasInfluence12(age),
  };
}

function buildLifePlanPeriods(
  dateStr: string,
  lifePath: CoreNumber,
  birthday: CoreNumber,
  trunk: CoreNumber,
  pinnacles: [CoreNumber, CoreNumber, CoreNumber, CoreNumber]
): LifePlanRow[] {
  const p1End = 36 - lifePath;
  const p2End = p1End + 9;
  const p3End = p2End + 9;
  const p4End = p3End + 9;

  const ranges: [number, number][] = [
    [0, p1End],
    [p1End + 1, p2End],
    [p2End + 1, p3End],
    [p3End + 1, p4End],
    [p4End + 1, 99],
  ];

  return ranges.map(([ageFrom, ageTo]) => {
    const midAge = Math.floor((ageFrom + ageTo) / 2);
    const { v1, v2 } = getSeasonVibrations(midAge, lifePath, birthday, trunk, pinnacles);
    return {
      ageFrom,
      ageTo,
      vibration1: v1,
      vibration2: v2,
      key: reduceNumber(v1 + v2, false),
      formativePeriod: getFormativePeriod(midAge),
    };
  });
}

function buildLifePlanYears(
  dateStr: string,
  birthYear: number,
  lifePath: CoreNumber,
  birthday: CoreNumber,
  trunk: CoreNumber,
  pinnacles: [CoreNumber, CoreNumber, CoreNumber, CoreNumber],
  fromYear: number,
  toYear: number
): LifePlanYearRow[] {
  const rows: LifePlanYearRow[] = [];
  for (let year = fromYear; year <= toYear; year++) {
    const age = year - birthYear;
    const { v1, v2 } = getSeasonVibrations(age, lifePath, birthday, trunk, pinnacles);
    const personalYear = getPersonalYear(dateStr, year);
    const universalYear = getUniversalYear(year);
    rows.push({
      year,
      age,
      formativePeriod: getFormativePeriod(age),
      vibration1: v1,
      vibration2: v2,
      key: reduceNumber(v1 + v2, false),
      personalYear,
      universalYear,
      yearObjective: getYearObjective(personalYear, universalYear),
      hasInfluence12: hasInfluence12(age),
    });
  }
  return rows;
}

function detectFamilyMemoryPositions(tree: Omit<PersonalityTree, "familyMemoryPositions">): string[] {
  const positions: string[] = [];
  const checks: [string, NumberValue][] = [
    ["1ère racine", tree.root1],
    ["2ème racine", tree.root2],
    ["Feuilles", tree.leaves],
    ["Tronc", tree.trunk],
    ["Écorce", tree.bark],
  ];
  for (const [label, val] of checks) {
    if (val.hasKarmicDebt || val.karmicNumber) positions.push(label);
  }
  return positions;
}

export function buildNumerologieStrategiqueProfile(
  firstName: string,
  lastName: string,
  dateStr: string,
  referenceDate = new Date()
): NumerologieStrategiqueProfile {
  const [birthYear] = dateStr.split("-").map(Number);
  const currentYear = referenceDate.getFullYear();

  const expression = getExpression(firstName, lastName);
  const lifePath = getLifePath(dateStr);
  const trunk = getTrunk(dateStr);
  const birthday = getBirthdayNumber(dateStr);
  const pinnacles = getPinnacles(dateStr);

  const treeBase = {
    root1: toNumberValue(sumLetters(`${firstName} ${lastName}`)),
    root2: toNumberValue(
      (() => {
        const [year, month, day] = dateStr.split("-").map(Number);
        const ySum = String(year)
          .split("")
          .reduce((s, n) => s + Number(n), 0);
        return reduceNumber(day, false) + reduceNumber(month, false) + reduceFull(ySum);
      })()
    ),
    trunk: toNumberValue(
      Number(dateStr.split("-")[2]) + Number(dateStr.split("-")[1])
    ),
    bark: toNumberValue(sumLetters(`${firstName} ${lastName}`, (c) => !VOWELS.has(c))),
    branches: toNumberValue(11 - reduceFull(Number(dateStr.split("-")[2]))),
    leaves: toNumberValue(sumLetters(`${firstName} ${lastName}`, (c) => VOWELS.has(c))),
    fruits: toNumberValue(sumLetters(`${firstName} ${lastName}`, (c) => !VOWELS.has(c))),
    lifeDynamic: getLifeDynamic(expression, lifePath, trunk),
  };

  const tree: PersonalityTree = {
    ...treeBase,
    familyMemoryPositions: detectFamilyMemoryPositions(treeBase),
  };

  return {
    tree,
    inclusion: getInclusionTable(firstName, lastName),
    challenges: {
      birthday: toNumberValue(getBirthdayChallenge(dateStr), false),
      birthGift: toNumberValue(getBirthGift(dateStr), false),
      fetus: toNumberValue(getFetusNumber(lastName), false),
      date: getDateChallenges(dateStr),
    },
    nameEnergies: [getNameEnergy(firstName), getNameEnergy(lastName)],
    currentTemporal: buildYearTemporal(dateStr, birthYear, currentYear),
    previousTemporal: buildYearTemporal(dateStr, birthYear, currentYear - 1),
    nextTemporal: buildYearTemporal(dateStr, birthYear, currentYear + 1),
    lifePlanPeriods: buildLifePlanPeriods(dateStr, lifePath, birthday, trunk, pinnacles),
    lifePlanYears: buildLifePlanYears(
      dateStr,
      birthYear,
      lifePath,
      birthday,
      trunk,
      pinnacles,
      birthYear,
      birthYear + 99
    ),
  };
}

// Re-export for backward compatibility
export {
  getExpression as getExpressionNS,
  getLifePath as getLifePathNS,
  getSoulUrge as getSoulUrgeNS,
  getPersonalityNumber as getPersonalityNumberNS,
};
