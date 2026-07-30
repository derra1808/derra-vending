/**
 * Test one-shot : carousel TikTok hardcodé → Shotstack → poll URL.
 * Usage: npx tsx scripts/test-carousel-render.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvLocal();

async function main() {
  const { CAROUSEL_EXAMPLE, getCarouselMusicUrl } = await import(
    "../lib/studio/carousel-example"
  );
  const { resolveCarouselSlideImages } = await import("../lib/studio/visuals");
  const {
    startCarouselPhotoRender,
    getShotstackRenderStatus,
  } = await import("../lib/studio/render");

  if (!process.env.SHOTSTACK_API_KEY) {
    console.error("FAIL: SHOTSTACK_API_KEY manquant");
    process.exit(1);
  }

  console.log("Resolving slide images (gallery → Pexels fallback)…");
  const slides = await resolveCarouselSlideImages(CAROUSEL_EXAMPLE.slides);
  for (const s of slides) {
    console.log(`  - ${s.imageUrl.slice(0, 90)}…`);
  }

  console.log("Music:", getCarouselMusicUrl());
  console.log("Starting Shotstack carousel render…");

  const { renderId } = await startCarouselPhotoRender({
    musicUrl: getCarouselMusicUrl(),
    slides,
  });
  console.log("renderId:", renderId);

  const maxAttempts = 36; // ~3 min
  for (let i = 1; i <= maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const status = await getShotstackRenderStatus(renderId);
    console.log(`[${i}/${maxAttempts}] status=${status.status}`);
    if (status.status === "done" && status.url) {
      console.log("VIDEO_URL:", status.url);
      if (status.poster) console.log("POSTER:", status.poster);
      process.exit(0);
    }
    if (status.status === "failed") {
      console.error("FAIL:", status.error || "Shotstack failed");
      process.exit(1);
    }
  }

  console.error("TIMEOUT: render still pending after polling");
  process.exit(2);
}

main().catch((err) => {
  console.error("ERROR:", err instanceof Error ? err.message : err);
  process.exit(1);
});
