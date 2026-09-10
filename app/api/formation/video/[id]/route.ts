import { NextResponse } from "next/server";
import { resolve } from "path";
import { getProfile } from "@/lib/supabase/server";
import { isFormationFreeAccess, getSetupStatus } from "@/lib/formation/config";
import { MEMBER_VIDEOS } from "@/lib/formation/offer";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";
import { hasLifetimeFormationAccess } from "@/lib/formation/access";
import { streamFormationFile } from "@/lib/formation/stream-media";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const video = MEMBER_VIDEOS.find((v) => v.id === id);
  if (!video) {
    return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 });
  }

  const { user, profile } = await getProfile();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  let access = hasLifetimeFormationAccess(user, profile) || isFormationFreeAccess();
  if (!access && getSetupStatus().stripe) {
    const synced = await syncPaidAccessForUser(user.id, user.email);
    if (synced.ok) access = true;
  }
  if (!access) {
    return NextResponse.json({ error: "Accès réservé" }, { status: 403 });
  }

  return streamFormationFile({
    request,
    localPath: resolve(process.cwd(), "private/formation/videos", video.filename),
    kind: "video",
    filename: video.filename,
    contentType: "video/mp4",
  });
}
