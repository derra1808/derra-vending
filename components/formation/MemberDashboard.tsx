"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  Play,
  BookOpen,
  Video,
  FolderDown,
} from "lucide-react";
import { EBOOK_PARTS, FORMATION } from "@/lib/formation/content";
import { MEMBER_DOWNLOADS, MEMBER_VIDEOS } from "@/lib/formation/offer";

type Tab = "formation" | "bonus" | "videos";

export function MemberDashboard({ displayName }: { displayName: string }) {
  const [tab, setTab] = useState<Tab>("formation");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "formation", label: "Formation", icon: BookOpen },
    { id: "bonus", label: "Bonus", icon: FolderDown },
    { id: "videos", label: "Vidéos", icon: Video },
  ];

  return (
    <div className="section-night px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="formation-label">Espace membre</p>
            <h1 className="formation-title mt-4 text-3xl">Bienvenue, {displayName}</h1>
            <p className="formation-body mt-2 text-sm">
              Pack complet — {FORMATION.title} · {FORMATION.ebookPrice} {FORMATION.currency}
            </p>
          </div>
          <a
            href="/api/formation/download?file=ebook.pdf"
            className="formation-btn-primary inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Ebook PDF
          </a>
        </div>

        <nav
          className="mt-10 flex flex-wrap gap-2 border-b pb-0"
          style={{ borderColor: "color-mix(in srgb, var(--d-gold) 30%, transparent)" }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition"
                style={{
                  color: active ? "var(--d-gold)" : "var(--d-cream)",
                  opacity: active ? 1 : 0.55,
                  borderBottom: active ? "2px solid var(--d-gold)" : "2px solid transparent",
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {tab === "formation" && (
          <div className="mt-10 space-y-6">
            {EBOOK_PARTS.map((part) => (
              <article key={part.id} id={`partie-${part.id}`} className="formation-card overflow-hidden p-0">
                {"image" in part && part.image && (
                  <div className="formation-anime-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={part.image}
                      alt={`Illustration — ${part.title}`}
                      className="formation-anime-img"
                    />
                  </div>
                )}
                <div className="p-8">
                  <span className="formation-label">Partie {part.id}</span>
                  <div className="mt-4 max-w-none">
                    {part.content.split("\n").map((line, i) => {
                      if (line.startsWith("## "))
                        return (
                          <h2 key={i} className="formation-title mt-4 text-2xl">
                            {line.replace("## ", "")}
                          </h2>
                        );
                      if (line.startsWith("### "))
                        return (
                          <h3 key={i} className="formation-accent mt-4 text-lg font-semibold">
                            {line.replace("### ", "")}
                          </h3>
                        );
                      if (line.startsWith("- "))
                        return (
                          <li key={i} className="formation-body ml-4 text-sm">
                            {line.replace("- ", "")}
                          </li>
                        );
                      if (line.startsWith("*") && line.endsWith("*"))
                        return (
                          <p key={i} className="formation-body mt-2 text-sm italic">
                            {line.replace(/\*/g, "")}
                          </p>
                        );
                      if (line.trim())
                        return (
                          <p key={i} className="formation-body mt-2 text-sm">
                            {line}
                          </p>
                        );
                      return null;
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "bonus" && (
          <div className="mt-10 space-y-4">
            <p className="formation-body text-sm">
              Tous tes outils en PDF, prêts à imprimer ou annoter. Liens protégés.
            </p>
            {MEMBER_DOWNLOADS.filter((d) => d.id !== "ebook").map((d) => (
              <a
                key={d.id}
                href={`/api/formation/download?file=${encodeURIComponent(d.file)}`}
                className="formation-card flex items-center justify-between gap-4 p-5 transition hover:opacity-95"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center"
                    style={{
                      background: "var(--d-night)",
                      border: "1px solid var(--d-gold)",
                    }}
                  >
                    <FileText className="h-5 w-5" style={{ color: "var(--d-gold)" }} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="formation-title text-lg" style={{ color: "var(--d-night)" }}>
                        {d.label}
                      </p>
                      <span
                        className="formation-label px-2 py-0.5 text-[10px]"
                        style={{
                          color: "var(--d-gold)",
                          border: "1px solid color-mix(in srgb, var(--d-gold) 50%, transparent)",
                        }}
                      >
                        PDF
                      </span>
                    </div>
                    <p className="formation-body mt-1 text-sm">{d.description}</p>
                  </div>
                </div>
                <Download className="h-4 w-4 shrink-0" style={{ color: "var(--d-gold)" }} />
              </a>
            ))}
          </div>
        )}

        {tab === "videos" && (
          <div className="mt-10 space-y-6">
            <p className="formation-body text-sm">
              Regarde les modules ici. Si une vidéo affiche « pas encore uploadée », elle arrive bientôt —
              dépose le fichier MP4 dans <code>private/formation/videos/</code>.
            </p>

            {activeVideo && (
              <div
                className="overflow-hidden"
                style={{ border: "1px solid color-mix(in srgb, var(--d-gold) 40%, transparent)" }}
              >
                <video
                  key={activeVideo}
                  className="aspect-video w-full bg-black"
                  controls
                  autoPlay
                  src={`/api/formation/video/${activeVideo}`}
                  onError={() =>
                    setVideoError(
                      "Vidéo pas encore disponible. Place le fichier MP4 dans private/formation/videos/"
                    )
                  }
                  onLoadedData={() => setVideoError(null)}
                />
                {videoError && (
                  <p className="formation-body p-4 text-center text-sm" style={{ color: "var(--d-gold)" }}>
                    {videoError}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {MEMBER_VIDEOS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVideoError(null);
                    setActiveVideo(v.id);
                  }}
                  className="formation-card p-5 text-left transition hover:opacity-95"
                >
                  <div className="flex items-start gap-3">
                    <Play className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--d-gold)" }} />
                    <div>
                      <p className="formation-label text-[10px]">{v.duration}</p>
                      <p className="formation-title mt-2 text-lg" style={{ color: "var(--d-night)" }}>
                        {v.title}
                      </p>
                      <p className="formation-body mt-2 text-xs">{v.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="formation-tip mt-12 text-center">
          <p className="formation-label">Coaching</p>
          <h2 className="formation-title text-xl">Besoin d&apos;aller plus loin ?</h2>
          <p className="formation-body mt-2 text-sm">
            Appel Q&R (150 CHF) ou accompagnement complet (490 CHF) avec contacts fournisseurs.
          </p>
          <Link href="/formation/pricing" className="formation-btn-primary mt-6 inline-flex">
            Voir les options
          </Link>
        </div>
      </div>
    </div>
  );
}
