"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  SNACK_PLUS_DIFF,
  SNACK_PLUS_ITEMS,
  SNACK_PLUS_SAME,
  SNACK_PLUS_SUBTITLE,
  SNACK_PLUS_TITLE,
} from "@/lib/formation/snack-plus";

export function FormationSnackPlus() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <p className="formation-label">Plus</p>
        <h2 className="formation-title mt-2 text-2xl" style={{ color: "var(--d-cream)" }}>
          {SNACK_PLUS_TITLE}
        </h2>
        <p className="formation-body mt-2 text-sm">{SNACK_PLUS_SUBTITLE}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="formation-card p-5">
          <p className="formation-label">Pareil que le café</p>
          <ul className="formation-body mt-3 space-y-2 text-sm">
            {SNACK_PLUS_SAME.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="formation-accent shrink-0">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="formation-card p-5">
          <p className="formation-label">Ce qui change</p>
          <ul className="formation-body mt-3 space-y-2 text-sm">
            {SNACK_PLUS_DIFF.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="formation-accent shrink-0">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {SNACK_PLUS_ITEMS.map((item) => {
        const isOpen = open === item.q;
        return (
          <div key={item.q} className="formation-card overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : item.q)}
              aria-expanded={isOpen}
            >
              <span className="formation-title text-base" style={{ color: "var(--d-night)" }}>
                {item.q}
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 transition-transform"
                style={{
                  color: "var(--d-gold)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>
            {isOpen && (
              <p
                className="formation-body border-t px-5 pb-5 text-sm leading-relaxed"
                style={{ borderColor: "color-mix(in srgb, var(--d-night) 10%, transparent)" }}
              >
                <span className="mt-3 block">{item.a}</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
