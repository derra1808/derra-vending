/**
 * Upload des MP3 formation vers Vercel Blob (store privé).
 * Usage: node scripts/upload-formation-audio.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { put } from "@vercel/blob";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(resolve(root, ".env.local"), "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  const k = line.slice(0, i).trim().replace(/^\uFEFF/, "");
  let v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  if (!process.env[k]) process.env[k] = v;
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN manquant");
  process.exit(1);
}

const tracks = [
  { id: "intro", filename: "00-intro.mp3" },
  { id: "part-1", filename: "01-business-model.mp3" },
  { id: "part-2", filename: "02-prospection.mp3" },
  { id: "part-3", filename: "03-machines.mp3" },
  { id: "part-4", filename: "04-gestion.mp3" },
  { id: "part-5", filename: "05-chiffres.mp3" },
];

const metaPath = resolve(root, "lib/formation/audio-blob-urls.json");
let meta = {};
if (existsSync(metaPath)) {
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch {
    meta = {};
  }
}

for (const track of tracks) {
  const local = resolve(root, "private/formation/audio", track.filename);
  if (!existsSync(local)) {
    console.error("Fichier manquant:", local);
    process.exit(1);
  }
  const buf = readFileSync(local);
  console.log(`Upload ${track.filename} (${(buf.length / 1024).toFixed(0)} Ko)…`);
  const blob = await put(`formation/audio/${track.filename}`, buf, {
    access: "private",
    contentType: "audio/mpeg",
    token,
    allowOverwrite: true,
  });
  meta[track.id] = {
    filename: track.filename,
    pathname: blob.pathname,
    url: blob.url,
    uploadedAt: new Date().toISOString(),
    bytes: buf.length,
  };
  console.log("  ✅", blob.pathname);
}

mkdirSync(dirname(metaPath), { recursive: true });
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log("✅ Meta:", metaPath);
