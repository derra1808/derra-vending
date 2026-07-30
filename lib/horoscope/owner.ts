import type { BirthData } from "./types";

export const OWNER_PROFILE = {
  firstName: "ibrahim",
  lastName: "derra",
  birthDate: "1997-08-18",
  birthTime: "03:00",
} as const;

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeTime(value: string): string {
  const [hours = "0", minutes = "0"] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

export function isOwnerProfile(data: BirthData): boolean {
  return (
    normalizeName(data.firstName) === OWNER_PROFILE.firstName &&
    normalizeName(data.lastName) === OWNER_PROFILE.lastName &&
    data.birthDate === OWNER_PROFILE.birthDate &&
    normalizeTime(data.birthTime) === OWNER_PROFILE.birthTime
  );
}
