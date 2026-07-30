import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const p = resolve(".env.local");
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

async function main() {
  loadEnvLocal();
  const { runCarouselExamplePipeline } = await import(
    "../lib/studio/pipeline"
  );
  const { getShotstackRenderStatus } = await import("../lib/studio/render");
  const { updateStudioVideo } = await import("../lib/studio/db");

  console.log("Lancement pipeline exemple (DB + Shotstack)…");
  const result = await runCarouselExamplePipeline({ publish: false });
  console.log(result);

  for (let i = 1; i <= 36; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const status = await getShotstackRenderStatus(result.renderId);
    console.log(`[${i}] ${status.status}`);
    if (status.status === "done" && status.url) {
      await updateStudioVideo(result.videoId, {
        video_url: status.url,
        thumbnail_url: status.poster || status.thumbnail || null,
        status: "publishing",
        error: "auto_publish désactivé pour ce test — ouvre Voir",
      });
      console.log("VIDEO_URL:", status.url);
      console.log("videoId:", result.videoId);
      return;
    }
    if (status.status === "failed") {
      await updateStudioVideo(result.videoId, {
        status: "failed",
        error: status.error || "Shotstack failed",
      });
      throw new Error(status.error || "failed");
    }
  }
  throw new Error("timeout");
}

main().catch((e) => {
  console.error("ERROR:", e instanceof Error ? e.message : e);
  process.exit(1);
});
