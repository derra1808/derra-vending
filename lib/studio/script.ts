import Anthropic from "@anthropic-ai/sdk";
import { COMPANY } from "@/lib/data";
import { getCtaUrl } from "./config";
import type { GeneratedScript, StudioTheme } from "./types";

function extractJson(text: string): Partial<GeneratedScript> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1]?.trim() || text.trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Réponse Claude sans JSON");
  }
  return JSON.parse(raw.slice(start, end + 1)) as Partial<GeneratedScript>;
}

export async function generateVideoScript(
  theme: StudioTheme
): Promise<GeneratedScript> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY manquant — crée un compte sur console.anthropic.com"
    );
  }

  const anthropic = new Anthropic({ apiKey: key });
  const ctaUrl = getCtaUrl();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

  const message = await anthropic.messages.create({
    model,
    max_tokens: 1200,
    temperature: 0.85,
    system: `Tu es un conteur social media pour ${COMPANY.name} (${COMPANY.region}).
Tu écris des scripts Shorts/Reels faceless en français (Suisse) sur l’histoire du vending, le café et les machines — comme de vraies histoires à écouter jusqu’au bout.
Durée parlée : 35–50 secondes (~90–130 mots).
Réponds UNIQUEMENT en JSON valide (pas de markdown) avec les clés: title, hook, script, caption, hashtags.
- title: accroche curiosité (<70 caractères)
- hook: première phrase choc (max 12 mots)
- script: narration orale, phrases courtes, suspense puis chute. PAS de hashtags. CTA soft ${COMPANY.name} à la fin.
- caption: 2–3 phrases
- hashtags: 5 à 8 sans #
Marque: ${COMPANY.name}. CTA: ${ctaUrl}.`,
    messages: [
      {
        role: "user",
        content: `Thème: ${theme.label}
Angle: ${theme.angle}
Mots-clés: ${theme.keywords.join(", ")}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Réponse Claude vide");
  }

  const parsed = extractJson(block.text);
  if (!parsed.title || !parsed.script) {
    throw new Error("Script JSON incomplet");
  }

  return {
    title: String(parsed.title).slice(0, 100),
    hook: String(parsed.hook || parsed.title),
    script: String(parsed.script),
    caption: String(parsed.caption || parsed.script.slice(0, 200)),
    hashtags: Array.isArray(parsed.hashtags)
      ? parsed.hashtags.map((h) => String(h).replace(/^#/, "")).slice(0, 10)
      : theme.keywords,
  };
}

export interface GeneratedCarousel {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  narration: string;
  slides: Array<{
    top: string;
    bottom: string;
    spoken: string;
    photoQuery: string;
    durationSec: number;
  }>;
}

function extractJsonObject(text: string): Record<string, unknown> {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1]?.trim() || text.trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Réponse Claude sans JSON");
  }
  return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
}

/** Carousel TikTok unique : slides + voix = texte à l'écran */
export async function generateCarouselFromTheme(
  theme: StudioTheme
): Promise<GeneratedCarousel> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY manquant — crée un compte sur console.anthropic.com"
    );
  }

  const anthropic = new Anthropic({ apiKey: key });
  const ctaUrl = getCtaUrl();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

  const message = await anthropic.messages.create({
    model,
    max_tokens: 2000,
    temperature: 0.95,
    system: `Tu es un conteur captivant pour ${COMPANY.name} (${COMPANY.region}).
Tu crées des carrousels TikTok / Shorts en français (Suisse) UNIQUEMENT sur :
histoire du vending, vraies anecdotes café, machines à café, univers du distributeur.
Objectif : une HISTOIRE qui donne envie d’écouter jusqu’à la DERNIÈRE seconde (hook fort, tension, chute).
Pas de catalogue commercial plat. Pas de sujet hors café/vending.
Réponds UNIQUEMENT en JSON valide (pas de markdown):
{"title":"...","hook":"...","caption":"...","hashtags":["..."],"slides":[{"top":"...","bottom":"...","spoken":"...","photoQuery":"english pexels query","durationSec":3.8}]}
Règles:
- Exactement 5 slides = 5 temps d’une histoire (mise en scène → intrigue → détail choc → révélation → chute/CTA doux)
- spoken = narration orale alignée avec le texte à l’écran, phrases qui s’enchaînent (8–20 mots)
- durationSec 3.5–5 ; le rythme doit porter jusqu’à la fin
- Dernière slide : chute mémorable + mention légère ${COMPANY.name} / café & distributeurs Genève (pas de hard sell agressif)
- photoQuery en anglais, atmosphère (vintage, café, machine, rue, grains…)
CTA soft: ${ctaUrl}.`,
    messages: [
      {
        role: "user",
        content: `Raconte une histoire NOUVELLE et captivante (varie à chaque fois) sur:
Thème: ${theme.label}
Angle: ${theme.angle}
Mots-clés: ${theme.keywords.join(", ")}
Contrainte: le spectateur doit avoir envie d’aller jusqu’au bout. Seed: ${Date.now()}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Réponse Claude vide (carousel)");
  }

  const parsed = extractJsonObject(block.text);
  const rawSlides = Array.isArray(parsed.slides) ? parsed.slides : [];
  if (rawSlides.length < 3) {
    throw new Error("Claude n’a pas renvoyé assez de slides");
  }

  const slides = rawSlides.slice(0, 5).map((s) => {
    const row = s as Record<string, unknown>;
    const top = String(row.top || "").trim();
    const bottom = String(row.bottom || "").trim();
    const spoken =
      String(row.spoken || "").trim() || `${top}. ${bottom}`.trim();
    return {
      top: top || spoken.slice(0, 60),
      bottom: bottom || " ",
      spoken,
      photoQuery: String(
        row.photoQuery || theme.visualQuery || "vending machine"
      ).trim(),
      durationSec: Math.max(3, Math.min(5.5, Number(row.durationSec) || 3.8)),
    };
  });

  return {
    title: String(parsed.title || theme.label).slice(0, 100),
    hook: String(parsed.hook || slides[0]?.top || theme.label),
    caption: String(parsed.caption || slides.map((x) => x.spoken).join(" ")),
    hashtags: Array.isArray(parsed.hashtags)
      ? parsed.hashtags.map((h) => String(h).replace(/^#/, "")).slice(0, 10)
      : theme.keywords,
    narration: slides.map((s) => s.spoken).join(". "),
    slides,
  };
}
