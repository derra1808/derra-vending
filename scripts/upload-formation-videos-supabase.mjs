import { existsSync, readFileSync, statSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  const k = line.slice(0, i).trim().replace(/^\uFEFF/, "");
  const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  if (!process.env[k]) process.env[k] = v;
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
const bucket = "formation-media";
const MAX = 48 * 1024 * 1024;
const videos = [
  "cynara-recolte.mp4",
  "part-1-heygen.mp4",
  "part-2-heygen.mp4",
];

const raised = await sb.storage.updateBucket(bucket, {
  public: false,
  fileSizeLimit: 314572800,
});
console.log("raise_limit", raised.error?.message || "ok");

function ffmpegAvailable() {
  const r = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  return r.status === 0;
}

function compress(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  const probe = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
    { encoding: "utf8" }
  );
  const duration = Math.max(1, parseFloat(probe.stdout) || 60);
  const videoBits = Math.max(280_000, Math.floor((MAX * 8 * 0.88) / duration) - 80_000);
  const args = [
    "-y",
    "-i",
    src,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-b:v",
    String(videoBits),
    "-maxrate",
    String(Math.floor(videoBits * 1.2)),
    "-bufsize",
    String(videoBits * 2),
    "-vf",
    "scale='min(1280,iw)':-2",
    "-c:a",
    "aac",
    "-b:a",
    "80k",
    "-movflags",
    "+faststart",
    dest,
  ];
  const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed ${src}`);
}

async function upload(localPath, name) {
  const buf = readFileSync(localPath);
  const { error } = await sb.storage.from(bucket).upload(`video/${name}`, buf, {
    contentType: "video/mp4",
    upsert: true,
  });
  if (error) {
    console.error("upload_fail", name, error.message, (buf.length / 1024 / 1024).toFixed(1), "MB");
    return false;
  }
  console.log("uploaded", name, (buf.length / 1024 / 1024).toFixed(1), "MB");
  return true;
}

const hasFfmpeg = ffmpegAvailable();
console.log("ffmpeg", hasFfmpeg ? "yes" : "no");
const tmpDir = resolve(root, "private/formation/videos/.web");

for (const name of videos) {
  const src = resolve(root, "private/formation/videos", name);
  if (!existsSync(src)) {
    console.log("missing", name);
    continue;
  }
  const size = statSync(src).size;
  console.log("local", name, (size / 1024 / 1024).toFixed(1), "MB");
  if (size <= MAX) {
    await upload(src, name);
    continue;
  }
  if (!hasFfmpeg) {
    console.error("cannot_compress", name);
    continue;
  }
  const dest = resolve(tmpDir, name);
  if (existsSync(dest) && statSync(dest).size > 0 && statSync(dest).size <= MAX) {
    console.log("reuse_compressed", name, (statSync(dest).size / 1024 / 1024).toFixed(1), "MB");
    await upload(dest, name);
    continue;
  }
  console.log("compressing", name);
  compress(src, dest);
  const outSize = existsSync(dest) ? statSync(dest).size : 0;
  console.log("compressed", name, (outSize / 1024 / 1024).toFixed(1), "MB");
  await upload(dest, name);
}

const listed = await sb.storage.from(bucket).list("video");
console.log("bucket_video", listed.data?.map((f) => ({ name: f.name, mb: ((f.metadata?.size || 0) / 1024 / 1024).toFixed(1) })));
const listedAudio = await sb.storage.from(bucket).list("audio");
console.log("bucket_audio", listedAudio.data?.map((f) => f.name));
