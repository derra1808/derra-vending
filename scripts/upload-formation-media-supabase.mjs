import { existsSync, readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
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

const existing = await sb.storage.getBucket(bucket);
if (existing.error) {
  const created = await sb.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: 52428800,
  });
  if (created.error) {
    console.error("create_bucket", created.error.message);
    process.exit(1);
  }
  console.log("bucket_created");
} else {
  console.log("bucket_ok");
}

const jobs = [
  { dir: resolve(root, "private/formation/audio"), kind: "audio", type: "audio/mpeg" },
  { dir: resolve(root, "private/formation/videos"), kind: "video", type: "video/mp4" },
];

const uploaded = [];
for (const job of jobs) {
  if (!existsSync(job.dir)) continue;
  const files = readdirSync(job.dir).filter((f) =>
    job.kind === "audio" ? f.endsWith(".mp3") : f.endsWith(".mp4")
  );
  for (const name of files) {
    const buf = readFileSync(resolve(job.dir, name));
    const path = `${job.kind}/${name}`;
    const { error } = await sb.storage.from(bucket).upload(path, buf, {
      contentType: job.type,
      upsert: true,
    });
    if (error) {
      console.error("upload_fail", path, error.message);
    } else {
      uploaded.push({ path, mb: +(buf.length / 1024 / 1024).toFixed(1) });
      console.log("uploaded", path, (buf.length / 1024 / 1024).toFixed(1), "MB");
    }
  }
}

console.log(JSON.stringify({ uploaded: uploaded.length, files: uploaded }));
