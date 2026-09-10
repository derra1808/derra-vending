import { readFileSync } from "fs";
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

const files = [
  "audio/00-intro.mp3",
  "audio/01-business-model.mp3",
  "video/cynara-recolte.mp4",
  "video/part-1-heygen.mp4",
  "video/part-2-heygen.mp4",
];

for (const path of files) {
  const { data, error } = await sb.storage.from("formation-media").createSignedUrl(path, 120);
  if (error || !data?.signedUrl) {
    console.log("sign_fail", path, error?.message);
    continue;
  }
  const res = await fetch(data.signedUrl, { method: "HEAD" });
  console.log(path, res.status, res.headers.get("content-type"), res.headers.get("content-length"));
}
