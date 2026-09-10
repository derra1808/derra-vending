import { NextResponse } from "next/server";
import { resolve } from "path";
import { getProfile } from "@/lib/supabase/server";
import { isFormationFreeAccess, getSetupStatus } from "@/lib/formation/config";
import { FORMATION_AUDIO_TRACKS } from "@/lib/formation/audio-tracks";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";
import { hasLifetimeFormationAccess } from "@/lib/formation/access";
import { streamFormationFile } from "@/lib/formation/stream-media";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const track = FORMATION_AUDIO_TRACKS.find((t) => t.id === id);
  if (!track) {
    return NextResponse.json({ error: "Piste introuvable" }, { status: 404 });
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
    localPath: resolve(process.cwd(), "private/formation/audio", track.filename),
    kind: "audio",
    filename: track.filename,
    contentType: "audio/mpeg",
  });
}
