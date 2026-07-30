"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/data";
import { LionMark } from "./Logo";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-ink pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2"
          >
            <LionMark className="h-5 w-5 text-gold" />
            <span className="text-xs font-medium uppercase tracking-widest text-gold">
              Genève · Meyrin · Canton de Genève
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-cream md:text-5xl lg:text-6xl"
          >
            Votre partenaire vending{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              premium
            </span>{" "}
            à Genève
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/60"
          >
            Installation gratuite de distributeurs automatiques de café, boissons
            et snacks. Maintenance, remplissage et assistance inclus — nous gérons
            tout à 100 %.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink transition hover:bg-gold-light"
            >
              Demander une visite gratuite
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href={COMPANY.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-cream backdrop-blur transition hover:border-gold/40 hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-gold" />
              Être rappelé
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8 text-sm text-white/50"
          >
            <span>UID {COMPANY.uid}</span>
            <span className="hidden h-1 w-1 rounded-full bg-gold/50 sm:block" />
            <span>40+ machines actives</span>
            <span className="hidden h-1 w-1 rounded-full bg-gold/50 sm:block" />
            <span>Installation 100 % gratuite</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-card">
            <Image
              src="/gallery/realisation-06.png"
              alt="Installation Derra Vending — distributeurs professionnels Genève"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/10 bg-ink/80 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                Service clé en main
              </p>
              <p className="mt-1 font-display text-lg text-cream">
                De la Necta compacte aux distributeurs haute capacité
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-gold/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
