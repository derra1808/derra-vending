/**
 * Créneaux Genève (Europe/Zurich) — 10 vidéos / jour réparties.
 * matin 2 · midi 2 · aprem 3 · soir 3
 */
export const STUDIO_TIMEZONE = "Europe/Zurich";

export const PUBLISH_WINDOWS = [
  { id: "matin", start: "07:30", end: "08:30", cap: 2 },
  { id: "midi", start: "12:00", end: "13:00", cap: 2 },
  { id: "aprem", start: "17:30", end: "18:30", cap: 3 },
  { id: "soir", start: "20:00", end: "21:30", cap: 3 },
] as const;

export type PublishWindowId = (typeof PUBLISH_WINDOWS)[number]["id"];

/** 10 vidéos / jour. */
export const SCHEDULE_DAILY_QUOTA = PUBLISH_WINDOWS.reduce(
  (sum, w) => sum + w.cap,
  0
);

function parseHm(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function getZurichParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: STUDIO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";
  const hour = Number(get("hour") === "24" ? "0" : get("hour"));
  const minute = Number(get("minute"));
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute,
    second: Number(get("second")),
    minutes: hour * 60 + minute,
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

export function windowForMinutes(
  minutes: number
): (typeof PUBLISH_WINDOWS)[number] | null {
  for (const w of PUBLISH_WINDOWS) {
    if (minutes >= parseHm(w.start) && minutes < parseHm(w.end)) return w;
  }
  return null;
}

export function currentPublishWindow(
  date = new Date()
): (typeof PUBLISH_WINDOWS)[number] | null {
  return windowForMinutes(getZurichParts(date).minutes);
}

export function isInPublishWindow(date = new Date()): boolean {
  return currentPublishWindow(date) !== null;
}

/** Ajoute N jours calendaires à un YMD (UTC noon trick). */
function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + days, 12, 0, 0));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function formatLocal(ymd: string, hm: string, second = "00"): string {
  const [h, m] = hm.split(":");
  return `${ymd}T${h!.padStart(2, "0")}:${m!.padStart(2, "0")}:${second}`;
}

/**
 * Prochaine date/heure Metricool (fuseau Zurich).
 * Dans un créneau → +3 min. Hors créneau → début du prochain.
 */
export function nextPublicationDateTime(date = new Date()): {
  dateTime: string;
  timezone: string;
  windowId: PublishWindowId;
  inWindow: boolean;
} {
  const z = getZurichParts(date);
  const win = windowForMinutes(z.minutes);

  if (win) {
    const inThree = z.minutes + 3;
    const end = parseHm(win.end);
    if (inThree < end) {
      const h = Math.floor(inThree / 60);
      const m = inThree % 60;
      return {
        dateTime: formatLocal(
          z.ymd,
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        ),
        timezone: STUDIO_TIMEZONE,
        windowId: win.id,
        inWindow: true,
      };
    }
  }

  for (const w of PUBLISH_WINDOWS) {
    if (z.minutes < parseHm(w.start)) {
      return {
        dateTime: formatLocal(z.ymd, w.start),
        timezone: STUDIO_TIMEZONE,
        windowId: w.id,
        inWindow: false,
      };
    }
  }

  const tomorrow = addDaysYmd(z.ymd, 1);
  const first = PUBLISH_WINDOWS[0]!;
  return {
    dateTime: formatLocal(tomorrow, first.start),
    timezone: STUDIO_TIMEZONE,
    windowId: first.id,
    inWindow: false,
  };
}

/** Fenêtre Zurich correspondant à un instant (created_at / published_at). */
export function publishWindowAt(
  iso: string | Date
): (typeof PUBLISH_WINDOWS)[number] | null {
  return currentPublishWindow(typeof iso === "string" ? new Date(iso) : iso);
}

/** Début du jour civil Zurich en ISO UTC (pour le quota). */
export function startOfZurichDayIso(date = new Date()): string {
  const z = getZurichParts(date);
  const utcMidnight = Date.parse(`${z.ymd}T00:00:00.000Z`);
  // Zurich = UTC+1/+2 → balaye ±3 h pour trouver 00:00 locale
  for (let delta = -180; delta <= 180; delta++) {
    const candidate = new Date(utcMidnight + delta * 60 * 1000);
    const p = getZurichParts(candidate);
    if (p.ymd === z.ymd && p.hour === 0 && p.minute === 0) {
      return candidate.toISOString();
    }
  }
  return new Date(utcMidnight - 2 * 60 * 60 * 1000).toISOString();
}

export function scheduleHint(date = new Date()): string {
  const win = currentPublishWindow(date);
  if (win) {
    return `Créneau ${win.id} (${win.start}–${win.end}) — jusqu’à ${win.cap} vidéos.`;
  }
  const next = nextPublicationDateTime(date);
  const hm = next.dateTime.slice(11, 16);
  return `Hors créneau — prochaine fenêtre ${next.windowId} vers ${hm}.`;
}

export function currentWindowCap(date = new Date()): number {
  return currentPublishWindow(date)?.cap ?? 0;
}
