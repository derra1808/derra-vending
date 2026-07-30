import fs from "fs";
import path from "path";

export type ContactLead = {
  type: "visit" | "callback";
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
  at: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "contacts.json");
const BLOB_PATH = "contact-leads.json";

function isVercel() {
  return Boolean(process.env.VERCEL);
}

function useBlob() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      (isVercel() && process.env.VERCEL_OIDC_TOKEN)
  );
}

function readFileLeads(): ContactLead[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as ContactLead[];
  } catch {
    return [];
  }
}

function writeFileLeads(leads: ContactLead[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), "utf8");
}

async function readBlobLeads(): Promise<ContactLead[]> {
  const { get } = await import("@vercel/blob");
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result) return [];
    const text = await new Response(result.stream).text();
    if (!text) return [];
    return JSON.parse(text) as ContactLead[];
  } catch {
    return [];
  }
}

async function writeBlobLeads(leads: ContactLead[]) {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, JSON.stringify(leads), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readLeads(): Promise<ContactLead[]> {
  if (useBlob()) return readBlobLeads();
  return readFileLeads();
}

async function writeLeads(leads: ContactLead[]) {
  if (useBlob()) {
    await writeBlobLeads(leads);
    return;
  }
  if (isVercel()) {
    throw new Error("Stockage distant non configuré sur Vercel");
  }
  writeFileLeads(leads);
}

export async function addContactLead(lead: Omit<ContactLead, "at">): Promise<ContactLead> {
  const entry: ContactLead = { ...lead, at: new Date().toISOString() };
  const leads = await readLeads();
  leads.unshift(entry);
  await writeLeads(leads.slice(0, 500));
  return entry;
}
