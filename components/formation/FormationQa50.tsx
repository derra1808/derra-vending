"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { QA50_CATEGORIES, QA50_COUNT, QA50_SUBTITLE, QA50_TITLE } from "@/lib/formation/qa-50";

export function FormationQa50() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <p className="formation-label">{QA50_COUNT} questions</p>
        <h2 className="formation-title mt-2 text-2xl" style={{ color: "var(--d-cream)" }}>
          {QA50_TITLE}
        </h2>
        <p className="formation-body mt-2 text-sm">{QA50_SUBTITLE}</p>
      </div>

      {QA50_CATEGORIES.map((cat) => (
        <div key={cat.id} className="space-y-2">
          <p className="formation-label mt-4">{cat.title}</p>
          {cat.items.map((item) => {
            const key = `${cat.id}:${item.q}`;
            const isOpen = open === key;
            return (
              <div key={item.q} className="formation-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : key)}
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
      ))}
    </div>
  );
}
