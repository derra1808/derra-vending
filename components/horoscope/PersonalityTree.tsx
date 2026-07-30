"use client";

import type { PersonalityTree, InclusionTable, Challenges, NameEnergy } from "@/lib/horoscope/numerology-strategique";
import { hz } from "./theme";

const TREE_KEYS: { key: keyof PersonalityTree; label: string; description: string }[] = [
  { key: "root1", label: "1ère racine", description: "Expression — vos dons naturels" },
  { key: "root2", label: "2ème racine", description: "Chemin de vie — votre nature profonde" },
  { key: "trunk", label: "Tronc", description: "Objectif de vie — ce qui vous motive" },
  { key: "bark", label: "Écorce", description: "Comment les autres vous perçoivent" },
  { key: "branches", label: "Branches", description: "Votre manière d'agir" },
  { key: "leaves", label: "Feuilles", description: "Vos besoins affectifs" },
  { key: "fruits", label: "Fruits", description: "Vos besoins de réalisation" },
];

interface PersonalityTreeDisplayProps {
  tree: PersonalityTree;
  inclusion: InclusionTable;
  challenges: Challenges;
  nameEnergies: NameEnergy[];
}

function NumberCell({
  label,
  value,
  description,
  highlight,
}: {
  label: string;
  value: { display: string; hasKarmicDebt: boolean };
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 ${highlight ? hz.cardHighlight : hz.cardInner}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className={`text-sm font-medium ${hz.title}`}>{label}</p>
        <p className={`text-2xl ${hz.number}`}>
          {value.display}
          {value.hasKarmicDebt && <span className={`ml-0.5 text-sm ${hz.warnNumber}`}>*</span>}
        </p>
      </div>
      {description && <p className={`mt-1 text-xs ${hz.muted}`}>{description}</p>}
    </div>
  );
}

export function PersonalityTreeDisplay({ tree, inclusion, challenges, nameEnergies }: PersonalityTreeDisplayProps) {
  return (
    <div className="space-y-8">
      <div className={`p-5 text-center ${hz.cardHero}`}>
        <p className={`text-sm font-medium ${hz.accentSoft}`}>Dynamique de vie</p>
        <p className={`mt-1 text-4xl font-bold ${hz.number}`}>{tree.lifeDynamic.display}</p>
        {[11, 22, 33].includes(tree.lifeDynamic.raw) && (
          <p className={`mt-2 text-sm ${hz.muted}`}>Nombre maître — un potentiel rare et précieux</p>
        )}
      </div>

      <div>
        <p className={`mb-4 text-sm font-semibold ${hz.title}`}>Les 7 clés de votre arbre</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TREE_KEYS.map(({ key, label, description }) => (
            <NumberCell
              key={key}
              label={label}
              value={tree[key] as { display: string; hasKarmicDebt: boolean }}
              description={description}
              highlight={key === "root1" || key === "root2" || key === "trunk"}
            />
          ))}
        </div>
      </div>

      {tree.familyMemoryPositions.length > 0 && (
        <p className={`rounded-lg px-4 py-3 text-sm ${hz.warn}`}>
          * Mémoire familiale sur : {tree.familyMemoryPositions.join(", ")}
        </p>
      )}

      <div>
        <p className={`mb-1 text-sm font-semibold ${hz.title}`}>Boîte à outils</p>
        <p className={`mb-4 text-xs ${hz.muted}`}>Fréquence de chaque nombre dans votre nom.</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div
              key={n}
              className={`rounded-lg border p-3 text-center ${
                inclusion.counts[n] === 0 ? hz.warn : hz.cardInner
              }`}
            >
              <p className={`text-xl font-bold ${inclusion.counts[n] === 0 ? hz.warnNumber : hz.number}`}>
                {inclusion.counts[n]}
              </p>
              <p className={`mt-0.5 text-[10px] leading-tight ${hz.muted}`}>
                {inclusion.labels[n].split(" (")[0]}
              </p>
            </div>
          ))}
        </div>
        {inclusion.missing.length > 0 && (
          <p className={`mt-3 text-sm ${hz.muted}`}>
            À cultiver : <span className={`font-medium ${hz.warnNumber}`}>{inclusion.missing.join(", ")}</span>
          </p>
        )}
      </div>

      <div>
        <p className={`mb-4 text-sm font-semibold ${hz.title}`}>Défis et dons de naissance</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Défi du jour", value: challenges.birthday.display },
            { label: "Cadeau de naissance", value: challenges.birthGift.display },
            { label: "Fœtus", value: challenges.fetus.display },
            { label: "Défis de date", value: challenges.date.map((d) => d.display).join(" · ") },
          ].map(({ label, value }) => (
            <div key={label} className={`p-4 text-center ${hz.cardInner}`}>
              <p className={`text-2xl ${hz.number}`}>{value}</p>
              <p className={`mt-1 text-xs ${hz.muted}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={`mb-4 text-sm font-semibold ${hz.title}`}>Énergie de vos noms</p>
        <div className="space-y-3">
          {nameEnergies.map((ne) => (
            <div key={ne.name} className={`p-4 ${hz.cardInner}`}>
              <p className={`mb-3 font-semibold ${hz.title}`}>{ne.name}</p>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {[
                  { label: "Voyelles", val: ne.vowels.display },
                  { label: "Consonnes", val: ne.consonants.display },
                  { label: "Total", val: ne.total.display },
                  { label: "V + C", val: ne.vowelsPlusConsonants.display },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className={`text-xs ${hz.muted}`}>{label}</p>
                    <p className={hz.number}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
