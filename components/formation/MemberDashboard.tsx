"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  BookOpen,
  Video,
  FolderDown,
  Clock,
  Play,
} from "lucide-react";
import { EBOOK_PARTS, FORMATION } from "@/lib/formation/content";
import { MEMBER_DOWNLOADS, MEMBER_VIDEOS, PART_AVATAR_VIDEO, formationVideoSrc } from "@/lib/formation/offer";
import { FormationAudioPlayer } from "@/components/formation/FormationAudioPlayer";
import { FormationQa50 } from "@/components/formation/FormationQa50";
import { FormationSnackPlus } from "@/components/formation/FormationSnackPlus";
import { FormationTopSpots } from "@/components/formation/FormationTopSpots";

type Tab = "formation" | "bonus" | "videos";

function PartMedia({
  partId,
  image,
  title,
}: {
  partId: number;
  image?: string;
  title: string;
}) {
  const avatar = PART_AVATAR_VIDEO[partId];
  const [showImage, setShowImage] = useState(!avatar);

  if (avatar && !showImage) {
    return (
      <div className="relative bg-black">
        <video
          className="aspect-video w-full max-h-[85vh] object-contain"
          controls
          playsInline
          preload="metadata"
          poster={image}
          src={formationVideoSrc(avatar.filename)}
          onError={() => setShowImage(true)}
        >
          Ton navigateur ne lit pas la vidéo.
        </video>
        <p
          className="formation-label absolute left-3 top-3 px-2 py-1 text-[9px]"
          style={{ background: "color-mix(in srgb, var(--d-night) 75%, transparent)", color: "var(--d-gold)" }}
        >
          Avatar HeyGen
        </p>
      </div>
    );
  }

  if (!image) return null;

  return (
    <div className="formation-anime-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={`Illustration — ${title}`} className="formation-anime-img" />
    </div>
  );
}

export function MemberDashboard({ displayName }: { displayName: string }) {
  const readyVideos = MEMBER_VIDEOS.filter((v) => v.ready);
  const pendingVideos = MEMBER_VIDEOS.filter((v) => !v.ready);
  const [tab, setTab] = useState<Tab>("formation");
  const [activeVideo, setActiveVideo] = useState<string>(readyVideos[0]?.id ?? "cynara-recolte");
  const [videoError, setVideoError] = useState<string | null>(null);
  const currentVideo = readyVideos.find((v) => v.id === activeVideo) ?? readyVideos[0];

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "formation", label: "Formation", icon: BookOpen },
    { id: "bonus", label: "Bonus", icon: FolderDown },
    { id: "videos", label: "Vidéos", icon: Video },
  ];

  return (
    <div className="section-night w-full px-0 py-6 md:py-8">
      <div className="mx-auto w-full max-w-none px-3 sm:px-4 md:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="formation-label">Espace membre</p>
            <h1 className="formation-title mt-4 text-3xl md:text-4xl lg:text-5xl">Bienvenue, {displayName}</h1>
            <p className="formation-body mt-2 text-sm md:text-base">
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
          <div className="mt-8 space-y-5 md:mt-10 md:space-y-6">
            {currentVideo && (
              <div
                className="overflow-hidden"
                style={{ border: "1px solid color-mix(in srgb, var(--d-gold) 45%, transparent)" }}
              >
                <div
                  className="px-4 py-3"
                  style={{
                    background: "color-mix(in srgb, var(--d-gold) 14%, var(--d-night))",
                    borderBottom: "1px solid color-mix(in srgb, var(--d-gold) 35%, transparent)",
                  }}
                >
                  <p className="formation-label">Vidéo exclusive</p>
                  <p className="formation-title mt-2 text-xl" style={{ color: "var(--d-cream)" }}>
                    {currentVideo.title}
                  </p>
                </div>
                <video
                  className="aspect-video w-full bg-black"
                  controls
                  playsInline
                  preload="auto"
                  src={formationVideoSrc(currentVideo.filename)}
                />
                <p className="formation-body px-4 py-3 text-sm">
                  <a
                    href={formationVideoSrc(currentVideo.filename)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                    style={{ color: "var(--d-gold)" }}
                  >
                    Ouvrir la vidéo
                  </a>
                </p>
              </div>
            )}
            <FormationAudioPlayer />
            {EBOOK_PARTS.map((part) => (
              <article
                key={part.id}
                id={`partie-${part.id}`}
                className="formation-card w-full overflow-hidden p-0"
              >
                <PartMedia
                  partId={part.id}
                  image={"image" in part ? part.image : undefined}
                  title={part.title}
                />
                <div className="p-5 sm:p-8 md:p-10 lg:px-14 lg:py-12">
                  <span className="formation-label">Partie {part.id}</span>
                  <div className="mt-4 max-w-none">
                    {part.content.split("\n").map((line, i) => {
                      if (line.startsWith("## "))
                        return (
                          <h2 key={i} className="formation-title mt-6 text-3xl md:text-4xl">
                            {line.replace("## ", "")}
                          </h2>
                        );
                      if (line.startsWith("### "))
                        return (
                          <h3 key={i} className="formation-accent mt-6 text-xl md:text-2xl font-semibold">
                            {line.replace("### ", "")}
                          </h3>
                        );
                      if (line.startsWith("- "))
                        return (
                          <li key={i} className="formation-body ml-5 text-base md:text-lg">
                            {line.replace("- ", "")}
                          </li>
                        );
                      if (line.startsWith("*") && line.endsWith("*"))
                        return (
                          <p key={i} className="formation-body mt-3 text-base md:text-lg italic">
                            {line.replace(/\*/g, "")}
                          </p>
                        );
                      if (line.trim())
                        return (
                          <p key={i} className="formation-body mt-3 text-base md:text-lg leading-relaxed">
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
            <div className="pt-8">
              <FormationTopSpots />
            </div>
            <div className="pt-8">
              <FormationSnackPlus />
            </div>
            <div className="pt-8">
              <FormationQa50 />
            </div>
          </div>
        )}

        {tab === "videos" && (
          <div className="mt-10 space-y-6">
            <div
              className="overflow-hidden"
              style={{ border: "1px solid color-mix(in srgb, var(--d-gold) 40%, transparent)" }}
            >
              {currentVideo && (
                <>
                  <video
                    key={currentVideo.id}
                    className="aspect-video w-full bg-black"
                    controls
                    playsInline
                    preload="auto"
                    src={formationVideoSrc(currentVideo.filename)}
                    onError={() =>
                      setVideoError("La vidéo ne se charge pas. Réessaie dans un instant.")
                    }
                    onLoadedData={() => setVideoError(null)}
                  />
                  {videoError && (
                    <p className="formation-body p-4 text-center text-sm" style={{ color: "var(--d-gold)" }}>
                      {videoError}
                    </p>
                  )}
                  <p className="formation-body px-4 py-3 text-sm">
                    <a
                      href={formationVideoSrc(currentVideo.filename)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: "var(--d-gold)" }}
                    >
                      Si le lecteur reste noir, ouvre la vidéo ici
                    </a>
                  </p>
                </>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {readyVideos.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVideoError(null);
                    setActiveVideo(v.id);
                  }}
                  className="formation-card p-5 text-left transition hover:opacity-95"
                  style={
                    activeVideo === v.id
                      ? { borderColor: "var(--d-gold)" }
                      : undefined
                  }
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
              {pendingVideos.map((v) => (
                <div key={v.id} className="formation-card p-5 opacity-70" aria-disabled="true">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--d-gold)" }} />
                    <div>
                      <p className="formation-label text-[10px]">En attente</p>
                      <p className="formation-title mt-2 text-lg" style={{ color: "var(--d-night)" }}>
                        {v.title}
                      </p>
                      <p className="formation-body mt-2 text-xs">{v.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="formation-tip mt-12 text-center">
          <p className="formation-label">Appel</p>
          <h2 className="formation-title text-xl">Besoin d&apos;aller plus loin ?</h2>
          <p className="formation-body mt-2 text-sm">
            Appel Q&R ({FORMATION.coachingCallPrice} CHF) : tes questions + accès à mes fournisseurs (machines & consommables).
          </p>
          <Link href="/formation/pricing" className="formation-btn-primary mt-6 inline-flex">
            Voir les options
          </Link>
        </div>
      </div>
    </div>
  );
}
