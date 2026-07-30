"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  StudioSettings,
  StudioSetupStatus,
  StudioTheme,
  StudioVideo,
} from "@/lib/studio/types";

interface Props {
  themes: StudioTheme[];
  videos: StudioVideo[];
  settings: StudioSettings | null;
  setup: StudioSetupStatus;
  dbError: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  generating: "Script / voix…",
  rendering: "Montage…",
  publishing: "Publication…",
  published: "Publié",
  failed: "Erreur",
};

export function StudioDashboard({
  themes,
  videos,
  settings,
  setup,
  dbError,
}: Props) {
  const router = useRouter();
  const [themeId, setThemeId] = useState(
    settings?.active_theme_id || themes[0]?.id || ""
  );
  const [customTheme, setCustomTheme] = useState(
    settings?.custom_theme_text || ""
  );
  const [autoPublish, setAutoPublish] = useState(
    settings?.auto_publish !== false
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(dbError);

  async function saveThemeAndRun() {
    setBusy("save");
    setError(null);
    setMessage(null);
    try {
      const patchRes = await fetch("/api/studio/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_theme_id: customTheme.trim() ? null : themeId,
          custom_theme_text: customTheme.trim() || null,
          auto_publish: autoPublish,
        }),
      });
      const patchData = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchData.error || "Settings échoué");

      setBusy("generate");
      const genRes = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: customTheme.trim() ? undefined : themeId,
          customThemeText: customTheme.trim() || undefined,
          force: true,
        }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Génération échouée");

      setMessage(
        `Vidéo lancée (${genData.videoId}). Publication auto dès que le montage est prêt.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function saveSettingsOnly() {
    setBusy("settings");
    setError(null);
    try {
      const res = await fetch("/api/studio/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_theme_id: customTheme.trim() ? null : themeId,
          custom_theme_text: customTheme.trim() || null,
          auto_publish: autoPublish,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setMessage(
        "Réglages sauvés. Auto = ~5 histoires café/vending par jour."
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function publishNow(videoId: string) {
    setBusy(videoId);
    setError(null);
    try {
      const res = await fetch("/api/studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publication échouée");
      setMessage("Publié sur les réseaux connectés.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function runTikTokExample() {
    setBusy("example");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/studio/test-example", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Exemple échoué");
      setMessage(
        data.message ||
          `Exemple TikTok lancé (${data.videoId}). Attends 1–3 min puis « Rafraîchir statut ».`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  async function refreshStatuses() {
    setBusy("poll");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/studio/poll", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Poll échoué");
      setMessage(data.message || "Statuts mis à jour.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  const checks: { key: keyof StudioSetupStatus; label: string }[] = [
    { key: "claude", label: "Claude (Anthropic)" },
    { key: "elevenlabs", label: "ElevenLabs" },
    { key: "shotstack", label: "Shotstack" },
    { key: "pexels", label: "Pexels" },
    { key: "blob", label: "Vercel Blob" },
    { key: "metricool", label: "Metricool" },
    { key: "supabase", label: "Supabase" },
    { key: "cronSecret", label: "CRON_SECRET" },
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="font-display text-xl text-gold">Configuration API</h2>
        <p className="text-sm text-cream/60">
          PC éteint : l’auto tourne sur Vercel (5 histoires café/vending / jour via
          cron). En local tu peux aussi lancer à la main ici.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {checks.map(({ key, label }) => (
            <li
              key={key}
              className="flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm"
            >
              <span
                className={setup[key] ? "text-emerald-400" : "text-red-400"}
              >
                {setup[key] ? "●" : "○"}
              </span>
              {label}
            </li>
          ))}
        </ul>
        {!setup.readyToGenerate && (
          <p className="text-sm text-amber-200/90">
            Voir <code className="text-gold">STUDIO-SETUP.md</code> pour créer
            les comptes dans l’ordre.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-gold">Ton thème</h2>
        <label className="block text-sm text-cream/70">
          Thème prédéfini (vending)
          <select
            className="mt-2 w-full rounded border border-white/15 bg-ink-soft px-3 py-2 text-cream"
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            disabled={Boolean(customTheme.trim())}
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-cream/70">
          Ou thème libre (remplace la liste)
          <textarea
            className="mt-2 w-full rounded border border-white/15 bg-ink-soft px-3 py-2 text-cream"
            rows={3}
            placeholder="Ex: Avantages d’un distributeur café pour les PME à Genève"
            value={customTheme}
            onChange={(e) => setCustomTheme(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-cream/80">
          <input
            type="checkbox"
            checked={autoPublish}
            onChange={(e) => setAutoPublish(e.target.checked)}
          />
          Publication automatique (recommandé — ON)
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveThemeAndRun}
            disabled={Boolean(busy) || !setup.readyToGenerate}
            className="rounded bg-gold px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-40"
          >
            {busy === "generate" || busy === "save"
              ? "Lancement…"
              : "Générer & publier maintenant"}
          </button>
          <button
            type="button"
            onClick={runTikTokExample}
            disabled={
              Boolean(busy) || !setup.shotstack || !setup.supabase
            }
            className="rounded border border-gold/50 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold disabled:opacity-40"
          >
            {busy === "example"
              ? "Exemple en cours…"
              : "Générer exemple TikTok"}
          </button>
          <button
            type="button"
            onClick={saveSettingsOnly}
            disabled={Boolean(busy)}
            className="rounded border border-white/20 px-5 py-2.5 text-sm text-cream disabled:opacity-40"
          >
            {busy === "settings" ? "Enregistrement…" : "Sauver les réglages"}
          </button>
        </div>
        {message && <p className="text-sm text-emerald-300">{message}</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl text-gold">Vidéos</h2>
          <button
            type="button"
            onClick={refreshStatuses}
            disabled={Boolean(busy)}
            className="rounded border border-white/20 px-3 py-1.5 text-xs text-cream disabled:opacity-40"
          >
            {busy === "poll" ? "Vérification…" : "Rafraîchir statut (Shotstack)"}
          </button>
        </div>
        <p className="text-xs text-cream/45">
          En local, Shotstack ne peut pas rappeler ton PC — utilise ce bouton
          après 1–2 min de montage.
        </p>
        {videos.length === 0 ? (
          <p className="text-sm text-cream/50">Aucune vidéo pour l’instant.</p>
        ) : (
          <ul className="space-y-3">
            {videos.map((v) => (
              <li
                key={v.id}
                className="rounded border border-white/10 bg-ink-soft/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-cream">{v.title}</p>
                    <p className="mt-1 text-xs text-cream/50">
                      {v.theme_label} · {STATUS_LABEL[v.status] || v.status}
                      {v.created_at
                        ? ` · ${new Date(v.created_at).toLocaleString("fr-CH")}`
                        : ""}
                    </p>
                    {v.error && (
                      <p className="mt-2 text-xs text-red-300">{v.error}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {v.video_url && (
                      <a
                        href={v.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border border-white/15 px-3 py-1.5 text-xs text-cream/80"
                      >
                        Voir
                      </a>
                    )}
                    {v.video_url && v.status !== "published" && (
                      <button
                        type="button"
                        onClick={() => publishNow(v.id)}
                        disabled={busy === v.id}
                        className="rounded border border-gold/40 px-3 py-1.5 text-xs text-gold disabled:opacity-40"
                      >
                        {busy === v.id ? "…" : "Publier"}
                      </button>
                    )}
                    {v.video_url && v.error?.toLowerCase().includes("metricool") && (
                      <span className="text-[10px] text-amber-200/80">
                        Vidéo OK — vérifie Metricool (userId/blogId + réseaux
                        connectés)
                      </span>
                    )}
                    {v.video_url &&
                      v.error?.toLowerCase().includes("ayrshare") && (
                      <span className="text-[10px] text-amber-200/80">
                        Ancien Ayrshare — republie via Metricool
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
