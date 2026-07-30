import type { AstrologyProfile, HoroscopeReport, NumerologyProfile, TimelineSection } from "./types";
import { ZODIAC_LABELS, NUMBER_SYMBOLS, ELEMENT_LABELS } from "./constants";
import { NUMBER_PROFILES, ZODIAC_PROFILES, PERSONAL_YEAR_FORECASTS } from "./content";

type NumKey = keyof typeof NUMBER_PROFILES;

function numProfile(n: number): (typeof NUMBER_PROFILES)[NumKey] {
  return NUMBER_PROFILES[n as NumKey] ?? NUMBER_PROFILES[9];
}

function pinnacleEndAge(lifePath: number): number {
  const base = lifePath > 9 ? reduceForPinnacle(lifePath) : lifePath;
  return 36 - base;
}

function reduceForPinnacle(n: number): number {
  while (n > 9) n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return n;
}

function activePinnacle(numerology: NumerologyProfile, age: number): { index: number; value: number } {
  const ends = numerology.pinnacles.map((_, i) => {
    if (i === 0) return pinnacleEndAge(numerology.lifePath);
    if (i === 1) return pinnacleEndAge(numerology.lifePath) + 9;
    if (i === 2) return pinnacleEndAge(numerology.lifePath) + 18;
    return 999;
  });
  const index = ends.findIndex((end) => age <= end);
  return { index: index === -1 ? 3 : index, value: numerology.pinnacles[index === -1 ? 3 : index] };
}

function formatMissing(lessons: number[]): string {
  if (lessons.length === 0) return "aucune lettre manquante — profil numérique complet dans le nom";
  return `lettres absentes du nom : ${lessons.join(", ")} (leçons karmiques à intégrer)`;
}

function nameBreakdown(numerology: NumerologyProfile): string {
  const [first, last] = numerology.strategique.nameEnergies;
  if (!first) return "";
  const lastPart = last
    ? ` · nom « ${last.name} » : voyelles ${last.vowels.display}, consonnes ${last.consonants.display}, total ${last.total.display}`
    : "";
  return `Prénom « ${first.name} » : voyelles ${first.vowels.display} (désir intime), consonnes ${first.consonants.display} (image), total ${first.total.display}${lastPart}`;
}

function inclusionSummary(numerology: NumerologyProfile): string {
  const { counts, missing } = numerology.strategique.inclusion;
  const dominant = Object.entries(counts)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([n, c]) => `${n} (×${c})`)
    .join(", ");
  const miss = missing.length ? ` · absents : ${missing.join(", ")}` : "";
  return `Inclusion dans le nom : dominantes ${dominant || "—"}${miss}`;
}

function treeSignature(numerology: NumerologyProfile): string {
  const t = numerology.strategique.tree;
  return `Arbre NS — racines ${t.root1.display}/${t.root2.display}, tronc ${t.trunk.display}, écorce ${t.bark.display}, branches ${t.branches.display}, feuilles ${t.leaves.display}, fruits ${t.fruits.display}, dynamique ${t.lifeDynamic.display}`;
}

function crossInsight(a: number, b: number, label: string): string {
  if (a === b) return `${label} : ${a} en résonance pure — force concentrée.`;
  return `${label} : tension créative entre ${a} (${numProfile(a).title}) et ${b} (${numProfile(b).title}).`;
}

export function buildPersonalizedPast(
  firstName: string,
  age: number,
  astrology: AstrologyProfile,
  numerology: NumerologyProfile
): TimelineSection {
  const sun = ZODIAC_PROFILES[astrology.sunSign];
  const lp = numProfile(numerology.lifePath);
  const expr = numProfile(numerology.expression);
  const soul = numProfile(numerology.soulUrge);
  const pers = numProfile(numerology.personality);
  const birth = numProfile(numerology.birthday);
  const pinnacle = activePinnacle(numerology, age);
  const pinProf = numProfile(pinnacle.value);

  return {
    title: "Votre Passé — Empreinte numérique unique",
    period: `Les ${age} premières années · pic ${pinnacle.index + 1} (${pinnacle.value})`,
    summary: `${firstName}, votre empreinte ne ressemble à aucune autre : chemin de vie ${numerology.lifePath} (${lp.title}), expression ${numerology.expression}, intime ${numerology.soulUrge}, personnalité sociale ${numerology.personality}, jour de naissance ${numerology.birthday}. ${nameBreakdown(numerology)}. ${treeSignature(numerology)}. ${crossInsight(numerology.expression, numerology.lifePath, "Expression vs chemin")} ${crossInsight(numerology.soulUrge, numerology.personality, "Intime vs écorce")} Soleil en ${ZODIAC_LABELS[astrology.sunSign]} (${astrology.decan}e décan), Lune ${ZODIAC_LABELS[astrology.moonSign]}, ascendant ${ZODIAC_LABELS[astrology.risingSign]} à ${astrology.birthHourPlanet} — trio céleste propre à votre heure de naissance. ${formatMissing(numerology.karmicLessons)}.`,
    love: `Côté cœur, le ${numerology.soulUrge} (${soul.title}) révèle un besoin profond de ${soul.lifeMission.toLowerCase()}, tandis que votre écorce ${numerology.personality} (${pers.title}) montre ${pers.essence.split(".")[0].toLowerCase()}. En ${ZODIAC_LABELS[astrology.moonSign]}, l'émotion passée s'est vécue par ${ZODIAC_PROFILES[astrology.moonSign].love.split(".")[0].toLowerCase()}. Défi relationnel du pic ${pinnacle.value} : ${pinProf.challenges[0].toLowerCase()}.`,
    career: `Professionnellement, l'expression ${numerology.expression} (${expr.title}) oriente vers ${expr.lifeMission.toLowerCase()}. Le ${ZODIAC_LABELS[astrology.sunSign]} ajoute ${sun.career.split(",")[0].toLowerCase()}. Votre tronc ${numerology.trunk} fixe l'objectif : ${numProfile(numerology.trunk).lifeMission.toLowerCase()}. Période formatrice dominée par le ${pinnacle.value} : ${pinProf.personalYearMeaning.toLowerCase()}.`,
    health: `Jour ${numerology.birthday} (${birth.title}) : sensibilité à ${birth.challenges[0].toLowerCase()}. Élément ${ELEMENT_LABELS[astrology.element]} — équilibre via ${ZODIAC_PROFILES[astrology.sunSign].strengths[0].toLowerCase()} sans excès de ${ZODIAC_PROFILES[astrology.sunSign].shadows[0].toLowerCase()}. Défis date : ${numerology.challenges.slice(0, 2).join(", ")}.`,
    advice: `Intégrez vos leçons karmiques (${numerology.karmicLessons.join(", ") || "aucune — profil complet"}). Le passé prépare la maturité ${numerology.maturity} : ${numProfile(numerology.maturity).lifeMission.toLowerCase()}.`,
  };
}

export function buildPersonalizedPresent(
  firstName: string,
  astrology: AstrologyProfile,
  numerology: NumerologyProfile,
  currentYear: number
): TimelineSection {
  const temporal = numerology.strategique.currentTemporal;
  const py = numProfile(numerology.personalYear);
  const forecast = PERSONAL_YEAR_FORECASTS[numerology.personalYear];
  const objective = numProfile(temporal.yearObjective);
  const universal = numProfile(temporal.universalYear);
  const quarters = temporal.personalQuarters.join("-");

  return {
    title: "Votre Présent — Croisement exact des cycles",
    period: `${currentYear} · année perso ${numerology.personalYear} · objectif ${temporal.yearObjective} · universelle ${temporal.universalYear}`,
    summary: `${firstName}, en ${currentYear} votre année personnelle ${numerology.personalYear} (${py.title}) croise l'année universelle ${temporal.universalYear} (${universal.title}) avec un objectif annuel ${temporal.yearObjective} (${objective.title}). ${forecast.theme}. ${inclusionSummary(numerology)}. Trimestres personnels ${quarters} — rythme propre à votre date ${numerology.personalYear !== numerology.expression ? `(différent de votre expression ${numerology.expression})` : ""}. Dynamique de vie active : ${numerology.lifeDynamicDisplay}. Ascendant ${ZODIAC_LABELS[astrology.risingSign]} en façade, Lune ${ZODIAC_LABELS[astrology.moonSign]} en profondeur.`,
    love: `Amour ${currentYear} : année ${numerology.personalYear} — ${forecast.love} Besoin intime ${numerology.soulUrge} : ${numProfile(numerology.soulUrge).strengths.slice(0, 2).join(", ").toLowerCase()}. Masque social ${numerology.personality} en couple : ${numProfile(numerology.personality).challenges[0].toLowerCase()}.`,
    career: `Carrière : ${forecast.career} Expression ${numerology.expression} + objectif ${temporal.yearObjective} = priorité à ${objective.lifeMission.toLowerCase()}. Mois forts : ${temporal.personalMonths.filter((m, i, arr) => arr.indexOf(m) === i).slice(0, 3).join(", ")}.`,
    health: `${forecast.health} Nombre du jour actuel dans le cycle : écoutez les pics du ${numerology.lifeDynamic} (dynamique de vie).`,
    advice: `${forecast.advice} Focus trimestre 1 (${temporal.personalQuarters[0]}) puis 3 (${temporal.personalQuarters[2]}) pour aligner action et intuition ${numerology.soulUrge}.`,
  };
}

export function buildPersonalizedFuture(
  firstName: string,
  title: string,
  period: string,
  astrology: AstrologyProfile,
  numerology: NumerologyProfile,
  personalYear: number,
  horizon: "year" | "five" | "ten"
): TimelineSection {
  const forecast = PERSONAL_YEAR_FORECASTS[personalYear as NumKey];
  const py = numProfile(personalYear);
  const lp = numProfile(numerology.lifePath);
  const trunk = numProfile(numerology.trunk);
  const futurePinnacle =
    horizon === "ten"
      ? numerology.pinnacles[3]
      : horizon === "five"
        ? numerology.pinnacles[2]
        : numerology.pinnacles[1];
  const pinProf = numProfile(futurePinnacle);

  const horizonNote = {
    year: `Transition vers année perso ${personalYear} (${py.title}).`,
    five: `À 5 ans : année ${personalYear}, pic ${futurePinnacle} (${pinProf.title}), maturité ${numerology.maturity}.`,
    ten: `À 10 ans : année ${personalYear}, dernier pic ${futurePinnacle}, mission tronc ${numerology.trunk} (${trunk.title}) pleinement activée.`,
  };

  return {
    title,
    period,
    summary: `${firstName}, ${horizonNote[horizon]} ${forecast.theme} Chemin ${numerology.lifePath} (${lp.title}) + expression ${numerology.expression} : ${lp.essence.split(".")[0]}, exprimé par ${numProfile(numerology.expression).title.toLowerCase()}. ${ZODIAC_LABELS[astrology.sunSign]} ${ZODIAC_PROFILES[astrology.sunSign].futureTheme.split(".")[0]}. Fruits de l'arbre visés : ${numerology.strategique.tree.fruits.display} (${numProfile(numerology.strategique.tree.fruits.reduced).lifeMission.toLowerCase()}).`,
    love: `${forecast.love} Horizon affectif guidé par feuilles ${numerology.soulUrge} et fruits ${numerology.strategique.tree.fruits.reduced}.`,
    career: `${forecast.career} Objectif de vie (tronc ${numerology.trunk}) : ${trunk.lifeMission.toLowerCase()}. Pic ${futurePinnacle} : ${pinProf.personalYearMeaning.toLowerCase()}.`,
    health: `${forecast.health} Élément ${ELEMENT_LABELS[astrology.element]} — préservez l'équilibre des défis ${numerology.challenges.join(", ")}.`,
    advice: `${forecast.advice} Ancrez-vous sur la dynamique ${numerology.lifeDynamicDisplay} et les forces ${lp.strengths.join(", ").toLowerCase()}.`,
  };
}

export function buildPersonalizedSynthesis(
  fullName: string,
  astrology: AstrologyProfile,
  numerology: NumerologyProfile,
  currentYear: number
): string {
  const lp = numProfile(numerology.lifePath);
  const symbol = NUMBER_SYMBOLS[numerology.lifePath];
  const t = numerology.strategique.currentTemporal;

  return [
    `${fullName} — signature numérique : ${numerology.expression}/${numerology.lifePath}/${numerology.trunk}/${numerology.lifeDynamicDisplay}.`,
    `${treeSignature(numerology)}.`,
    `${nameBreakdown(numerology)}.`,
    `Astrologie : ${ZODIAC_LABELS[astrology.sunSign]} (${astrology.decan}e décan, ${ELEMENT_LABELS[astrology.element]}), ascendant ${ZODIAC_LABELS[astrology.risingSign]}, Lune ${ZODIAC_LABELS[astrology.moonSign]}, ${astrology.chineseSign} ${astrology.chineseElement}, planète horaire ${astrology.birthHourPlanet}.`,
    `Triangle fondamental : expression ${numerology.expression}, chemin ${numerology.lifePath}, intime ${numerology.soulUrge}, personnalité ${numerology.personality}, naissance ${numerology.birthday}, maturité ${numerology.maturity}.`,
    `${crossInsight(numerology.expression, numerology.lifePath, "Croisement")} ${crossInsight(numerology.soulUrge, numerology.personality, "Masque")}`,
    `${formatMissing(numerology.karmicLessons)}. ${inclusionSummary(numerology)}.`,
    `Pics de vie : ${numerology.pinnacles.join(" → ")}. Défis : ${numerology.challenges.join(", ")}.`,
    `${currentYear} : année perso ${t.personalYear}, universelle ${t.universalYear}, objectif ${t.yearObjective}.`,
    `${lp.title} ${symbol.symbol} — ${lp.lifeMission}`,
  ].join(" ");
}

export function applyPersonalizedNarrative(report: HoroscopeReport): HoroscopeReport {
  const currentYear = new Date().getFullYear();
  const firstName = report.fullName.split(" ")[0] ?? report.fullName;

  return {
    ...report,
    past: buildPersonalizedPast(firstName, report.age, report.astrology, report.numerology),
    present: buildPersonalizedPresent(firstName, report.astrology, report.numerology, currentYear),
    nextYear: buildPersonalizedFuture(
      firstName,
      "L'Année à Venir — Votre Prochain Chapitre",
      `Année ${currentYear + 1} — année personnelle ${report.numerology.nextPersonalYear}`,
      report.astrology,
      report.numerology,
      report.numerology.nextPersonalYear,
      "year"
    ),
    inFiveYears: buildPersonalizedFuture(
      firstName,
      "Dans 5 Ans — Votre Horizon Proche",
      `Année ${currentYear + 5} — année personnelle ${report.numerology.personalYearFiveYears}`,
      report.astrology,
      report.numerology,
      report.numerology.personalYearFiveYears,
      "five"
    ),
    inTenYears: buildPersonalizedFuture(
      firstName,
      "Dans 10 Ans — Votre Destinée à Long Terme",
      `Année ${currentYear + 10} — année personnelle ${report.numerology.personalYearTenYears}`,
      report.astrology,
      report.numerology,
      report.numerology.personalYearTenYears,
      "ten"
    ),
    synthesis: buildPersonalizedSynthesis(report.fullName, report.astrology, report.numerology, currentYear),
  };
}
