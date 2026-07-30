#!/usr/bin/env node
/** Vérifie que Supabase + Stripe sont bien configurés dans .env.local */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
if (!existsSync(envPath)) {
  console.log("❌ Fichier .env.local introuvable");
  process.exit(1);
}

const raw = readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  raw
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      const k = l.slice(0, i).trim();
      let v = l.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      return [k, v];
    })
);

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_EBOOK",
];

let ok = true;
for (const key of required) {
  const val = env[key];
  const status = val && val.length > 5 ? "✅" : "❌";
  if (status === "❌") ok = false;
  console.log(`${status} ${key}`);
}

console.log(ok ? "\n✅ Prêt — redémarre npm run dev puis teste l'achat." : "\n❌ Colle tes clés dans .env.local puis redémarre le serveur.");
