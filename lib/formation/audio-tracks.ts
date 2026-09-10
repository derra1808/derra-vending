/** Pistes audio formation (ElevenLabs → private/formation/audio/) */
export const FORMATION_AUDIO_INTRO =
  "Avant de commencer, prends bien des notes sur les informations qui pourraient t'intéresser : les chiffres, les étapes, les scripts, tout ce que tu veux retenir ou appliquer ensuite. Tu pourras aussi tout relire dans le PDF. Allez, on démarre la formation.";

export const FORMATION_AUDIO_TRACKS = [
  {
    id: "intro",
    title: "Introduction",
    filename: "00-intro.mp3",
  },
  {
    id: "part-1",
    title: "Partie 1 — Le business model",
    filename: "01-business-model.mp3",
    partId: 1,
  },
  {
    id: "part-2",
    title: "Partie 2 — Trouver les commerçants",
    filename: "02-prospection.mp3",
    partId: 2,
  },
  {
    id: "part-3",
    title: "Partie 3 — Machines & stock",
    filename: "03-machines.mp3",
    partId: 3,
  },
  {
    id: "part-4",
    title: "Partie 4 — Gestion quotidienne",
    filename: "04-gestion.mp3",
    partId: 4,
  },
  {
    id: "part-5",
    title: "Partie 5 — Les chiffres",
    filename: "05-chiffres.mp3",
    partId: 5,
  },
] as const;

export type FormationAudioTrackId = (typeof FORMATION_AUDIO_TRACKS)[number]["id"];
