import { NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import { resolve } from "path";
import { Readable } from "stream";
import { getProfile } from "@/lib/supabase/server";
import { isFormationFreeAccess } from "@/lib/formation/config";
import { MEMBER_DOWNLOADS } from "@/lib/formation/offer";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";
import { getSetupStatus } from "@/lib/formation/config";

const ALLOWED = new Set<string>(MEMBER_DOWNLOADS.map((d) => d.file));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file || !ALLOWED.has(file) || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return NextResponse.json({ error: "Fichier invalide" }, { status: 400 });
  }

  const { user, profile } = await getProfile();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  let access = (profile?.has_paid ?? false) || isFormationFreeAccess();
  if (!access && getSetupStatus().stripe) {
    const synced = await syncPaidAccessForUser(user.id);
    if (synced.ok) access = true;
  }

  if (!access) {
    return NextResponse.json({ error: "Accès réservé aux membres" }, { status: 403 });
  }

  const path = resolve(process.cwd(), "private/formation", file);
  if (!existsSync(path)) {
    return NextResponse.json({ error: "Fichier manquant — contacte le support" }, { status: 404 });
  }

  const stat = statSync(path);
  const stream = createReadStream(path);
  const webStream = Readable.toWeb(stream) as ReadableStream;

  const contentType = file.endsWith(".csv")
    ? "text/csv; charset=utf-8"
    : file.endsWith(".pdf")
      ? "application/pdf"
      : "application/octet-stream";

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
