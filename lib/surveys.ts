export type SandwichId = "thon" | "jambon" | "saumon";

export type MachineSurvey = {
  id: string;
  name: string;
  location: string;
  question: string;
  options: {
    id: SandwichId;
    label: string;
    image: string;
  }[];
};

export const MACHINES: Record<string, MachineSurvey> = {
  "cynara-rollier": {
    id: "cynara-rollier",
    name: "Cynara",
    location: "Chantier Rollier",
    question: "Quel sandwich préférez-vous ?",
    options: [
      {
        id: "thon",
        label: "Thon tomates marinées",
        image: "/sondage/images/sandwich-thon.png",
      },
      {
        id: "jambon",
        label: "Jambon cheddar",
        image: "/sondage/images/sandwich-jambon.png",
      },
      {
        id: "saumon",
        label: "Duo de saumon",
        image: "/sondage/images/sandwich-saumon.png",
      },
    ],
  },
};

export function getMachine(id: string): MachineSurvey | undefined {
  return MACHINES[id];
}

export function getValidChoices(machineId: string): SandwichId[] {
  return getMachine(machineId)?.options.map((o) => o.id) ?? [];
}
