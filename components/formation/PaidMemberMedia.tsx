"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formationAudioSrc, formationVideoSrc } from "@/lib/formation/offer";
import { FORMATION_AUDIO_TRACKS } from "@/lib/formation/audio-tracks";

const VIDEO = "cynara-recolte.mp4";
const AUDIO = FORMATION_AUDIO_TRACKS[0]?.filename || "00-intro.mp3";

export function PaidMemberMedia() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      let paid = user.user_metadata?.has_paid === true;
      if (!paid) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_paid")
          .eq("id", user.id)
          .maybeSingle();
        paid = Boolean(profile?.has_paid);
      }
      if (paid) setShow(true);
    })();
  }, []);

  if (!show) return null;

  const videoUrl = formationVideoSrc(VIDEO);
  const audioUrl = formationAudioSrc(AUDIO);

  return (
    <section className="section-night px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <p className="formation-label">Ta formation</p>
        <h2 className="formation-title mt-3 text-3xl md:text-4xl">Vidéo et audio</h2>
        <div
          className="mt-6 overflow-hidden"
          style={{ border: "1px solid color-mix(in srgb, var(--d-gold) 45%, transparent)" }}
        >
          <video
            className="aspect-video w-full bg-black"
            controls
            playsInline
            preload="auto"
            src="/api/formation/video/cynara-recolte"
          />
        </div>
        <p className="formation-body mt-3 text-sm">
          <a href={videoUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--d-gold)" }}>
            Ouvrir la vidéo
          </a>
        </p>
        <div className="formation-card mt-6 p-4">
          <p className="formation-label">Audio — introduction</p>
          <audio className="mt-3 w-full" controls preload="metadata" src="/api/formation/audio/intro" />
        </div>
      </div>
    </section>
  );
}
