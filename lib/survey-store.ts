import fs from "fs";
import path from "path";
import type { SandwichId } from "./surveys";

export type VoteLog = {
  choice: SandwichId;
  at: string;
};

export type MachineStats = {
  thon: number;
  jambon: number;
  saumon: number;
  total: number;
  votes: VoteLog[];
};

type Store = Record<string, MachineStats>;

const DATA_FILE = path.join(process.cwd(), "data", "surveys.json");
const BLOB_PATH = "survey-data.json";

function emptyStats(): MachineStats {
  return { thon: 0, jambon: 0, saumon: 0, total: 0, votes: [] };
}

function isVercel() {
  return Boolean(process.env.VERCEL);
}

function readFileStore(): Store {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Store;
  } catch {
    return {};
  }
}

function writeFileStore(store: Store) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null), "utf8");
}

type RedisClient = {
  hincrby: (key: string, field: string, inc: number) => Promise<number>;
  hgetall: (key: string) => Promise<Record<string, string> | null>;
  lpush: (key: string, value: string) => Promise<number>;
  lrange: (key: string, start: number, end: number) => Promise<string[]>;
};

let redisClient: RedisClient | null = null;

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

async function readRedisStats(machineId: string): Promise<MachineStats> {
  const redis = await getRedis();
  if (!redis) return emptyStats();

  const counts = await redis.hgetall(`survey:${machineId}:counts`);
  const rawVotes = await redis.lrange(`survey:${machineId}:log`, 0, 499);

  if (!counts || Object.keys(counts).length === 0) return emptyStats();

  const votes: VoteLog[] = rawVotes.map((v) => {
    try {
      return JSON.parse(v) as VoteLog;
    } catch {
      return { choice: "jambon", at: "" };
    }
  });

  return {
    thon: Number(counts.thon ?? 0),
    jambon: Number(counts.jambon ?? 0),
    saumon: Number(counts.saumon ?? 0),
    total: Number(counts.total ?? 0),
    votes,
  };
}

async function readBlobStore(): Promise<Store> {
  const { get } = await import("@vercel/blob");
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result) return {};
    const text = await new Response(result.stream).text();
    if (!text) return {};
    return JSON.parse(text) as Store;
  } catch {
    return {};
  }
}

async function writeBlobStore(store: Store) {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, JSON.stringify(store), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readStore(): Promise<Store> {
  if (useBlob()) return readBlobStore();
  return readFileStore();
}

async function writeStore(store: Store) {
  if (useBlob()) {
    await writeBlobStore(store);
    return;
  }
  if (isVercel()) {
    throw new Error("Stockage distant non configuré sur Vercel");
  }
  writeFileStore(store);
}

function addVoteToStats(stats: MachineStats, choice: SandwichId): MachineStats {
  const at = new Date().toISOString();
  const next = { ...stats };
  next[choice] += 1;
  next.total += 1;
  next.votes = [{ choice, at }, ...stats.votes].slice(0, 500);
  return next;
}

export async function getStats(machineId: string): Promise<MachineStats> {
  if (useRedis()) return readRedisStats(machineId);
  const store = await readStore();
  return store[machineId] ?? emptyStats();
}

export async function addVote(machineId: string, choice: SandwichId): Promise<MachineStats> {
  if (useRedis()) {
    const redis = await getRedis();
    if (!redis) throw new Error("Stockage distant indisponible");
    const at = new Date().toISOString();
    await redis.hincrby(`survey:${machineId}:counts`, choice, 1);
    await redis.hincrby(`survey:${machineId}:counts`, "total", 1);
    await redis.lpush(`survey:${machineId}:log`, JSON.stringify({ choice, at }));
    return readRedisStats(machineId);
  }

  const store = await readStore();
  const stats = store[machineId] ?? emptyStats();
  store[machineId] = addVoteToStats(stats, choice);
  await writeStore(store);
  return store[machineId];
}

export async function getAllStats(): Promise<Record<string, MachineStats>> {
  const { MACHINES } = await import("./surveys");
  const out: Record<string, MachineStats> = {};

  if (useRedis()) {
    for (const id of Object.keys(MACHINES)) {
      out[id] = await readRedisStats(id);
    }
    return out;
  }

  const store = await readStore();
  for (const id of Object.keys(MACHINES)) {
    out[id] = store[id] ?? emptyStats();
  }
  return out;
}
