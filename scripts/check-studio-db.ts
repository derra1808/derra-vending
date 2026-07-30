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
  const { createAdminClient } = await import("../lib/supabase/admin");
  const sb = createAdminClient();
  const a = await sb.from("studio_settings").select("id").limit(1);
  const b = await sb.from("studio_videos").select("id").limit(1);
  console.log("studio_settings:", a.error ? `ERR ${a.error.message}` : "OK");
  console.log("studio_videos:", b.error ? `ERR ${b.error.message}` : "OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
