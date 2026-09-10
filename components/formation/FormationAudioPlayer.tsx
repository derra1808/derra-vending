"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { FORMATION_AUDIO_TRACKS } from "@/lib/formation/audio-tracks";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function FormationAudioPlayer({
  urls = {},
}: {
  urls?: Record<string, string>;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAfterLoadRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const track = FORMATION_AUDIO_TRACKS[index];
  const publicBase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const publicSrc = publicBase
    ? `${publicBase}/storage/v1/object/public/formation-media/audio/${encodeURIComponent(track.filename)}`
    : "";
  const src = urls[`audio:${track.id}`] || urls[track.id] || publicSrc || `/api/formation/audio/${track.id}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setReady(false);
    setError(null);
    setCurrent(0);
    setDuration(0);
    audio.load();
  }, [src]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      if (audio.readyState < 2) {
        audio.load();
        await new Promise<void>((resolve, reject) => {
          const onReady = () => {
            cleanup();
            resolve();
          };
          const onFail = () => {
            cleanup();
            reject(new Error("load"));
          };
          const cleanup = () => {
            audio.removeEventListener("canplay", onReady);
            audio.removeEventListener("error", onFail);
          };
          audio.addEventListener("canplay", onReady, { once: true });
          audio.addEventListener("error", onFail, { once: true });
        });
      }
      await audio.play();
      setPlaying(true);
      setError(null);
    } catch {
      setError("Impossible de lancer l’audio. Recharge la page ou réessaie.");
      setPlaying(false);
    }
  }

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(FORMATION_AUDIO_TRACKS.length - 1, next));
    playAfterLoadRef.current = playing || playAfterLoadRef.current;
    audioRef.current?.pause();
    setPlaying(false);
    setIndex(clamped);
  }

  function onSeek(value: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = value;
    setCurrent(value);
  }

  return (
    <div
      className="formation-card p-5 sm:p-6"
      style={{ borderColor: "color-mix(in srgb, var(--d-gold) 45%, transparent)" }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setReady(true);
          if (playAfterLoadRef.current) {
            playAfterLoadRef.current = false;
            e.currentTarget
              .play()
              .then(() => setPlaying(true))
              .catch(() => setPlaying(false));
          }
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => {
          if (index < FORMATION_AUDIO_TRACKS.length - 1) {
            playAfterLoadRef.current = true;
            setIndex(index + 1);
          } else {
            setPlaying(false);
          }
        }}
        onError={() => {
          setError(
            "Audio pas encore disponible. On le génère avec une vraie voix (ElevenLabs)."
          );
          setPlaying(false);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="flex items-start gap-3">
        <Volume2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--d-gold)" }} />
        <div className="min-w-0 flex-1">
          <p className="formation-label">Écouter la formation</p>
          <p className="formation-title mt-2 text-lg" style={{ color: "var(--d-night)" }}>
            {track.title}
          </p>
          <p className="formation-body mt-2 text-sm">
            Voix extraite de ton fichier RECU. Au début : prends des notes. Play / Pause à tout moment.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="formation-btn-ghost-dark inline-flex items-center justify-center disabled:opacity-40"
          aria-label="Piste précédente"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="formation-btn-primary inline-flex items-center gap-2"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          {playing ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index >= FORMATION_AUDIO_TRACKS.length - 1}
          className="formation-btn-ghost-dark inline-flex items-center justify-center disabled:opacity-40"
          aria-label="Piste suivante"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <span className="formation-body ml-auto text-xs tabular-nums">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={current}
        onChange={(e) => onSeek(Number(e.target.value))}
        disabled={!ready || !duration}
        className="mt-4 w-full accent-[var(--d-gold)]"
        aria-label="Progression"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {FORMATION_AUDIO_TRACKS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(i)}
            className="formation-label px-2 py-1 text-[10px] transition"
            style={{
              color: i === index ? "var(--d-night)" : "var(--d-text)",
              border:
                i === index
                  ? "1px solid var(--d-gold)"
                  : "1px solid color-mix(in srgb, var(--d-night) 15%, transparent)",
              background: i === index ? "color-mix(in srgb, var(--d-gold) 25%, transparent)" : "transparent",
            }}
          >
            {i === 0 ? "Intro" : `P${i}`}
          </button>
        ))}
      </div>

      {error && (
        <p className="formation-body mt-4 text-sm" style={{ color: "var(--d-gold)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
