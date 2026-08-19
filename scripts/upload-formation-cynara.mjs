/**
 * Upload cynara-recolte.mp4 vers Vercel Blob (store privé).
 * Usage: node scripts/upload-formation-cynara.mjs
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

const filename = "cynara-recolte.mp4";
const local = resolve(root, "private/formation/videos", filename);
if (!existsSync(local)) {
  console.error("Fichier manquant:", local);
  process.exit(1);
}

const buf = readFileSync(local);
const bytes = buf.length;
console.log(`Upload ${(bytes / 1024 / 1024).toFixed(1)} Mo…`);

const blob = await put(`formation/videos/${filename}`, buf, {
  access: "private",
  contentType: "video/mp4",
  token,
  allowOverwrite: true,
  multipart: true,
});

const metaPath = resolve(root, "lib/formation/video-blob-urls.json");
let meta = {};
if (existsSync(metaPath)) {
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch {
    meta = {};
  }
}

meta["cynara-recolte"] = {
  filename,
  pathname: blob.pathname,
  url: blob.url,
  uploadedAt: new Date().toISOString(),
  bytes,
};

mkdirSync(dirname(metaPath), { recursive: true });
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log("✅ pathname:", blob.pathname);
console.log("✅ Meta:", metaPath);
