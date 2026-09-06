"use client";

import { TOP_SPOTS, TOP_SPOTS_RULES, TOP_SPOTS_SUBTITLE, TOP_SPOTS_TITLE } from "@/lib/formation/top-spots";

function fitColor(fit: string) {
  if (fit === "Fort") return "var(--d-gold)";
  if (fit === "Faible") return "color-mix(in srgb, var(--d-night) 45%, transparent)";
  return "var(--d-night)";
}

export function FormationTopSpots() {
  return (
    <div className="space-y-4">
      <div>
        <p className="formation-label">Bonus — à valider</p>
        <h2 className="formation-title mt-2 text-2xl" style={{ color: "var(--d-cream)" }}>
          {TOP_SPOTS_TITLE}
        </h2>
        <p className="formation-body mt-2 text-sm">{TOP_SPOTS_SUBTITLE}</p>
      </div>

      <div className="formation-card p-5">
        <p className="formation-label">Règles avant la liste</p>
        <ul className="formation-body mt-3 space-y-2 text-sm">
          {TOP_SPOTS_RULES.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="formation-accent shrink-0">—</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {TOP_SPOTS.map((s) => (
        <article key={s.rank} className="formation-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="formation-label">#{String(s.rank).padStart(2, "0")}</p>
              <h3 className="formation-title mt-1 text-lg" style={{ color: "var(--d-night)" }}>
                {s.name}
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="formation-label text-[10px]" style={{ color: fitColor(s.cafe) }}>
                Café {s.cafe}
              </span>
              <span className="formation-label text-[10px]" style={{ color: fitColor(s.snack) }}>
                Snack {s.snack}
              </span>
            </div>
          </div>
          <p className="formation-body mt-3 text-sm">{s.why}</p>
          <p className="formation-body mt-2 text-xs opacity-80">{s.example}</p>
          <p className="formation-body mt-3 text-xs">
            <span className="formation-accent">Qui : </span>
            {s.who}
          </p>
          <p className="formation-body mt-1 text-xs">
            <span className="formation-accent">Piège : </span>
            {s.trap}
          </p>
        </article>
      ))}
    </div>
  );
}
