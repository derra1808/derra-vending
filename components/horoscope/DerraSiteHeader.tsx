"use client";

import { Sparkles } from "lucide-react";
import { hz } from "./theme";

export function DerraSiteHeader() {
  return (
    <header className="mb-8 text-center md:mb-10">
      <p className={`mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] ${hz.accentSoft}`}>
        <Sparkles className="h-3.5 w-3.5" />
        Derra
      </p>
    </header>
  );
}
