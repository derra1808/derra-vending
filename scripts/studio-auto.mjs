/**
 * Auto local Derra Studio — PC allumé = ça tourne tout seul.
 *
 * Usage :
 *   npm run studio:auto
 *
 * - démarre Next sur le port 3005 si besoin
 * - toutes les ~20 s : vérifie si Shotstack a fini → publie (créneau Metricool)
 * - toutes les ~3 min : tente 1 nouvelle vidéo SI créneau Genève ouvert
 * - 10 / jour : matin 2 · midi 2 · aprem 3 · soir 3
 * - publication Metricool si auto_publish ON
 *
 * Arrêt : Ctrl+C
 */

import { spawn } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  const map = {};
  if (!existsSync(path)) return map;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (k) map[k] = v;
  }
  return map;
}

const env = loadEnvLocal();
const PORT = process.env.STUDIO_AUTO_PORT || "3005";
const BASE = process.env.STUDIO_AUTO_URL || `http://127.0.0.1:${PORT}`;
const SECRET = process.env.CRON_SECRET || env.CRON_SECRET;
/** Intervalle entre 2 nouvelles vidéos (génération Claude + TTS + Shotstack). */
const INTERVAL_MS = Number(
  process.env.STUDIO_AUTO_INTERVAL_MS || 3 * 60 * 1000
); // 3 min
/** Poll Shotstack souvent — en local pas de webhook, sinon ça reste “montage”. */
const POLL_MS = Number(process.env.STUDIO_AUTO_POLL_MS || 20 * 1000); // 20 s
const START_SERVER = process.env.STUDIO_AUTO_START_SERVER !== "0";

if (!SECRET) {
  console.error("❌ CRON_SECRET manquant dans .env.local");
  process.exit(1);
}

function log(...args) {
  const t = new Date().toLocaleTimeString("fr-CH", { hour12: false });
  console.log(`[${t}]`, ...args);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function serverReady() {
  try {
    const res = await fetch(`${BASE}/studio`, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });
    return res.status > 0;
  } catch {
    return false;
  }
}

function startNextDev() {
  log(`Démarrage Next.js sur le port ${PORT}…`);
  const child = spawn("npx", ["next", "dev", "-p", PORT], {
    cwd: root,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });
  child.stdout?.on("data", (buf) => {
    const s = String(buf);
    if (s.includes("Ready") || s.includes("Local:")) process.stdout.write(s);
  });
  child.stderr?.on("data", (buf) => {
    const s = String(buf);
    if (!s.includes("npm warn")) process.stderr.write(s);
  });
  child.on("exit", (code) => {
    log(`Next.js arrêté (code ${code})`);
    process.exit(code || 1);
  });
  return child;
}

async function waitForServer(maxMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (await serverReady()) return true;
    await sleep(2000);
  }
  return false;
}

async function pollOnly() {
  const url = `${BASE}/api/studio/cron-poll`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(60000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      log(`⚠️  poll HTTP ${res.status}`, JSON.stringify(data).slice(0, 200));
      return;
    }
    if (data.polled > 0) {
      log(`📤 ${data.polled} vidéo(s) finalisée(s) / publiée(s)`);
    }
  } catch (err) {
    // silencieux si le serveur reboot — le tick suivant réessaie
    if (String(err).includes("fetch failed")) return;
    log(`⚠️  poll: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function tick() {
  const url = `${BASE}/api/studio/cron`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(280000),
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text.slice(0, 300) };
    }
    if (!res.ok) {
      log(`⚠️  HTTP ${res.status}`, JSON.stringify(data).slice(0, 400));
      return;
    }
    if (data.skipped) {
      log(`⏸  ${data.skipped} (polled=${data.polled ?? 0})`);
    } else if (data.generated?.length) {
      log(
        `✅ Nouvelle vidéo: ${data.generated.join(", ")} — ${
          data.themes?.join(" / ") || ""
        } (polled=${data.polled ?? 0})`
      );
    } else {
      log(`OK`, JSON.stringify(data).slice(0, 300));
    }
  } catch (err) {
    log(`❌ ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function main() {
  log("=== Derra Studio AUTO (local) ===");
  log(`Cible: ${BASE}`);
  log(
    `Nouvelle vidéo: ~${Math.round(INTERVAL_MS / 60000)} min · Poll Shotstack: ${Math.round(POLL_MS / 1000)} s`
  );
  log(
    `Créneaux Genève 10/jour: 7h30×2 · 12h×2 · 17h30×3 · 20h×3`
  );
  log("Ctrl+C pour arrêter\n");

  let child = null;
  if (!(await serverReady())) {
    if (!START_SERVER) {
      console.error(`❌ Serveur pas joignable sur ${BASE}. Lance npm run dev -p ${PORT}`);
      process.exit(1);
    }
    child = startNextDev();
    const ok = await waitForServer();
    if (!ok) {
      console.error("❌ Next.js n’a pas démarré à temps");
      child?.kill();
      process.exit(1);
    }
    log("Serveur prêt.\n");
  } else {
    log("Serveur déjà en ligne.\n");
  }

  // Poll immédiat puis souvent (finalise + publie dès que Shotstack finit)
  await pollOnly();
  setInterval(() => {
    void pollOnly();
  }, POLL_MS);

  // Premier tour génération, puis toutes les ~3 min
  await tick();
  setInterval(() => {
    void tick();
  }, INTERVAL_MS);
}

process.on("SIGINT", () => {
  log("Arrêt demandé.");
  process.exit(0);
});

main();
