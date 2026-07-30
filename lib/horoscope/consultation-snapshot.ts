import type { HoroscopeReport } from "./types";
import { ZODIAC_LABELS } from "./constants";

export type ConsultationSnapshot = {
  fullName: string;
  age: number;
  sunSign: string;
  risingSign: string;
  lifePath: number;
  expression: number;
  personalYear: number;
  synthesis: string;
  present: {
    title: string;
    period: string;
    summary: string;
    love: string;
    career: string;
    health: string;
    advice: string;
  };
  past: { title: string; summary: string };
  nextYear: { title: string; summary: string };
};

export function buildConsultationSnapshot(report: HoroscopeReport): ConsultationSnapshot {
  return {
    fullName: report.fullName,
    age: report.age,
    sunSign: ZODIAC_LABELS[report.astrology.sunSign],
    risingSign: ZODIAC_LABELS[report.astrology.risingSign],
    lifePath: report.numerology.lifePath,
    expression: report.numerology.expression,
    personalYear: report.numerology.personalYear,
    synthesis: report.synthesis,
    present: {
      title: report.present.title,
      period: report.present.period,
      summary: report.present.summary,
      love: report.present.love,
      career: report.present.career,
      health: report.present.health,
      advice: report.present.advice,
    },
    past: { title: report.past.title, summary: report.past.summary },
    nextYear: { title: report.nextYear.title, summary: report.nextYear.summary },
  };
}
