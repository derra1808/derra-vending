"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, HardHat, Store, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  REALIZATIONS,
  type Realization,
  type RealizationCategory,
} from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

const FILTERS: { id: RealizationCategory | "all"; label: string; icon?: typeof Store }[] = [
  { id: "all", label: "Tout voir" },
  { id: "entreprise", label: "Entreprises", icon: Building2 },
  { id: "chantier", label: "Chantiers", icon: HardHat },
  { id: "commerce", label: "Commerces & tabacs", icon: Store },
];

export function Realizations() {
  const [filter, setFilter] = useState<RealizationCategory | "all">("all");
  const [lightbox, setLightbox] = useState<Realization | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return REALIZATIONS.slice(0, 18);
    return REALIZATIONS.filter((r) => r.category === filter).slice(0, 12);
  }, [filter]);

  return (
    <section className="bg-ink py-24 md:py-32" id="realisations">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Réalisations"
          title="Nos réalisations à Genève"
          subtitle="Installations réelles chez nos partenaires — entreprises, chantiers, tabacs et commerces. Machines haute capacité et solutions compactes Necta."
        />

        <Reveal>
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    filter === f.id
                      ? "bg-gold text-ink"
                      : "border border-white/10 text-white/60 hover:border-gold/30 hover:text-cream"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <Reveal key={item.src} delay={(i % 6) * 0.05}>
              <button
                type="button"
                onClick={() => setLightbox(item)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5 text-left"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="mb-2 inline-block rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                    {item.category}
                  </span>
                  <p className="text-sm font-medium text-cream">{item.caption}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 rounded-full border border-white/10 p-2 text-cream"
              onClick={() => setLightbox(null)}
              aria-label="Fermer"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={1200}
                height={900}
                className="max-h-[85vh] w-auto object-contain"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-ink/80 p-4 text-center text-sm text-cream backdrop-blur">
                {lightbox.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
