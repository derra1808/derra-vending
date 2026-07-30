"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/formation/offer";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-cream px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="formation-label text-center">FAQ</p>
        <h2 className="formation-title mt-3 text-center text-3xl md:text-4xl">
          Questions fréquentes
        </h2>
        <p className="formation-body mx-auto mt-4 max-w-md text-center text-sm">
          Les questions que tout le monde se pose avant de se lancer.
        </p>

        <div className="mt-10 space-y-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="formation-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="formation-title text-base md:text-lg" style={{ color: "var(--d-night)" }}>
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
                  <p className="formation-body border-t px-5 pb-5 pt-0 text-sm leading-relaxed"
                    style={{ borderColor: "color-mix(in srgb, var(--d-night) 10%, transparent)" }}
                  >
                    <span className="mt-3 block">{item.a}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
