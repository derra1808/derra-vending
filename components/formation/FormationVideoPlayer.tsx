"use client";

import { useEffect, useState } from "react";
import { MEMBER_VIDEOS } from "@/lib/formation/offer";
import { createClient } from "@/lib/supabase/client";

export function FormationVideoPlayer({
  id,
  src,
  poster,
  className,
}: {
  id: string;
  src?: string;
  poster?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(src || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (src) {
      setUrl(src);
      setError(null);
      return;
    }

    let cancelled = false;

    async function resolve() {
      try {
        const res = await fetch(`/api/formation/video/${id}?src=1`, { credentials: "include" });
        const data = (await res.json().catch(() => null)) as { url?: string } | null;
        if (res.ok && data?.url) {
          if (!cancelled) setUrl(data.url);
          return;
        }
      } catch {
        /* try storage next */
      }

      const filename = MEMBER_VIDEOS.find((v) => v.id === id)?.filename;
      const supabase = createClient();
      if (!filename || !supabase) {
        if (!cancelled) setError("La vidéo ne se charge pas. Réessaie dans un instant.");
        return;
      }
      const signed = await supabase.storage
        .from("formation-media")
        .createSignedUrl(`video/${filename}`, 60 * 60 * 6);
      if (signed.data?.signedUrl && !cancelled) {
        setUrl(signed.data.signedUrl);
        return;
      }
      if (!cancelled) setError("La vidéo ne se charge pas. Réessaie dans un instant.");
    }

    void resolve();
    return () => {
      cancelled = true;
    };
  }, [id, src]);

  if (!url) {
    return (
      <div className={className || "aspect-video w-full bg-black"}>
        {error && (
          <p className="formation-body p-4 text-center text-sm" style={{ color: "var(--d-gold)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <video
      className={className || "aspect-video w-full bg-black"}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      src={url}
      onError={() => setError("La vidéo ne se charge pas. Réessaie dans un instant.")}
      onLoadedData={() => setError(null)}
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}
