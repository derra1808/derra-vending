import fs from "fs";
import path from "path";

import type { ConsultationSnapshot } from "./horoscope/consultation-snapshot";

export type HoroscopeConsultation = {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthTime: string;
  at: string;
  bilan?: ConsultationSnapshot;
};

export type HoroscopeStats = {
  total: number;
  consultations: HoroscopeConsultation[];
};

const DATA_FILE = path.join(process.cwd(), "data", "horoscope-consultations.json");
const BLOB_PATH = "horoscope-consultations.json";
const LOG_KEY = "horoscope:log";
const TOTAL_KEY = "horoscope:counts";

type RedisClient = {
  hincrby: (key: string, field: string, inc: number) => Promise<number>;
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  lpush: (key: string, value: string) => Promise<number>;
  lrange: (key: string, start: number, end: number) => Promise<string[]>;
};

let redisClient: RedisClient | null = null;

function isVercel() {
  return Boolean(process.env.VERCEL);
}

function useRedis() {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

function useBlob() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      (isVercel() && process.env.VERCEL_OIDC_TOKEN)
  );
}

async function getRedis(): Promise<RedisClient | null> {
  if (!useRedis()) return null;
  if (redisClient) return redisClient;

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({ url: upstashUrl, token: upstashToken });
    redisClient = {
      hincrby: (key, field, inc) => redis.hincrby(key, field, inc),
      hgetall: (key) => redis.hgetall<Record<string, string>>(key),
      lpush: (key, value) => redis.lpush(key, value),
      lrange: (key, start, end) => redis.lrange<string>(key, start, end),
    };
    return redisClient;
  }

  const { kv } = await import("@vercel/kv");
  redisClient = {
    hincrby: (key, field, inc) => kv.hincrby(key, field, inc),
    hgetall: (key) => kv.hgetall<Record<string, string>>(key),
    lpush: (key, value) => kv.lpush(key, value),
    lrange: (key, start, end) => kv.lrange<string>(key, start, end),
  };
  return redisClient;
}

function readFileConsultations(): HoroscopeConsultation[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as HoroscopeConsultation[];
  } catch {
    return [];
  }
}

function writeFileConsultations(consultations: HoroscopeConsultation[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(consultations, null, 2), "utf8");
}

async function readBlobConsultations(): Promise<HoroscopeConsultation[]> {
  const { get } = await import("@vercel/blob");
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result) return [];
    const text = await new Response(result.stream).text();
    if (!text) return [];
    return JSON.parse(text) as HoroscopeConsultation[];
  } catch {
    return [];
  }
}

async function writeBlobConsultations(consultations: HoroscopeConsultation[]) {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, JSON.stringify(consultations), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readConsultations(): Promise<HoroscopeConsultation[]> {
  if (useBlob()) return readBlobConsultations();
  return readFileConsultations();
}

async function writeConsultations(consultations: HoroscopeConsultation[]) {
  if (useBlob()) {
    await writeBlobConsultations(consultations);
    return;
  }
  if (isVercel()) {
    throw new Error("Stockage distant non configuré sur Vercel");
  }
  writeFileConsultations(consultations);
}

async function readRedisStats(): Promise<HoroscopeStats> {
  const redis = await getRedis();
  if (!redis) return { total: 0, consultations: [] };

  const counts = await redis.hgetall(TOTAL_KEY);
  const raw = await redis.lrange(LOG_KEY, 0, 499);
  const consultations: HoroscopeConsultation[] = raw.map((entry) => {
    try {
      return JSON.parse(entry) as HoroscopeConsultation;
    } catch {
      return { firstName: "?", lastName: "?", birthDate: "", birthTime: "", at: "" };
    }
  });

  return {
    total: Number(counts?.total ?? consultations.length),
    consultations,
  };
}

export async function getHoroscopeStats(): Promise<HoroscopeStats> {
  if (useRedis()) return readRedisStats();

  const consultations = await readConsultations();
  return { total: consultations.length, consultations };
}

export async function addHoroscopeConsultation(
  data: Omit<HoroscopeConsultation, "at">
): Promise<HoroscopeConsultation> {
  const entry: HoroscopeConsultation = { ...data, at: new Date().toISOString() };

  if (useRedis()) {
    const redis = await getRedis();
    if (!redis) throw new Error("Stockage distant indisponible");
    await redis.hincrby(TOTAL_KEY, "total", 1);
    await redis.lpush(LOG_KEY, JSON.stringify(entry));
    return entry;
  }

  const consultations = await readConsultations();
  consultations.unshift(entry);
  await writeConsultations(consultations.slice(0, 500));
  return entry;
}
