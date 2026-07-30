"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SIZE = 88;
const STROKE = 5;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

function baseProgress(status?: string | null): number {
  switch (status) {
    case "generating":
      return 22;
    case "rendering":
      return 55;
    case "publishing":
      return 88;
    case "published":
      return 100;
    case "failed":
      return 0;
    default:
      return 0;
  }
}

const STEP_LABEL: Record<string, string> = {
  generating: "Script…",
  rendering: "Montage…",
  publishing: "Publication…",
  published: "Prête",
  failed: "Erreur",
};

export function StudioProgressRing({
  status,
  working,
}: {
  status?: string | null;
  working: boolean;
}) {
  const [tick, setTick] = useState(0);

  // Pendant le montage (le plus long), le rond avance doucement
  useEffect(() => {
    if (status !== "rendering" && status !== "generating") return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    setTick(0);
  }, [status]);

  let pct = baseProgress(status);
  if (status === "generating") {
    pct = Math.min(48, 22 + tick * 1.2);
  } else if (status === "rendering") {
    pct = Math.min(82, 55 + tick * 0.7);
  } else if (!status && working) {
    pct = 12;
  }

  const ready = status === "published" && pct >= 100;
  const failed = status === "failed";
  const offset = C - (pct / 100) * C;
  const ringColor = failed
    ? "#ef4444"
    : ready
      ? "#34d399"
      : working || pct > 0
        ? "#C9A84C"
        : "rgba(255,255,255,0.2)";

  return (
    <div
      className="relative shrink-0"
      style={{ width: SIZE, height: SIZE }}
      title={
        ready
          ? "Vidéo prête"
          : STEP_LABEL[status || ""] || (working ? "En cours…" : "En attente")
      }
      aria-label={`Progression ${Math.round(pct)}%`}
    >
      <svg
        width={SIZE}
        height={SIZE}
        className="-rotate-90"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={ringColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div
        className={`absolute inset-[10px] overflow-hidden rounded-full bg-ink ring-1 ${
          ready ? "ring-emerald-400/60" : "ring-gold/25"
        }`}
      >
        <Image
          src="/brand/logo.png"
          alt="Derra Vending"
          fill
          className={`object-cover ${working && !ready ? "animate-pulse" : ""}`}
          sizes="68px"
          priority
        />
      </div>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-cream/55">
        {ready
          ? "Prête"
          : failed
            ? "Erreur"
            : pct > 0
              ? `${Math.round(pct)}%`
              : "Idle"}
      </span>
    </div>
  );
}
