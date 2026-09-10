"use client";

import { useEffect, useState } from "react";

export function useFormationMediaSrc(kind: "audio" | "video", id: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setUrl(null);
    setError(null);

    fetch(`/api/formation/${kind}/${id}?src=1`, { credentials: "include" })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
        if (!res.ok || !data?.url) {
          throw new Error(data?.error || "unavailable");
        }
        if (!cancelled) setUrl(data.url);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            kind === "audio"
              ? "Audio pas encore disponible."
              : "La vidéo ne se charge pas. Réessaie dans un instant."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [kind, id]);

  return { url, error };
}
