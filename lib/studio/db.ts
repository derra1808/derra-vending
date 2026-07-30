import { createAdminClient } from "@/lib/supabase/admin";
import type { StudioPlatform, StudioSettings, StudioVideo } from "./types";

export async function getStudioSettings(): Promise<StudioSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(`studio_settings: ${error.message}`);

  if (!data) {
    const { data: created, error: insertError } = await supabase
      .from("studio_settings")
      .insert({ id: 1, auto_publish: true })
      .select("*")
      .single();
    if (insertError) throw new Error(insertError.message);
    return normalizeSettings(created);
  }

  return normalizeSettings(data);
}

export async function updateStudioSettings(
  patch: Partial<{
    auto_publish: boolean;
    daily_quota: number;
    platforms: StudioPlatform[];
    voice_id: string | null;
    cta_url: string | null;
    publish_hour_cet: number;
    active_theme_id: string | null;
    custom_theme_text: string | null;
  }>
): Promise<StudioSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_settings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return normalizeSettings(data);
}

export async function listStudioVideos(limit = 30): Promise<StudioVideo[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data || []) as StudioVideo[];
}

export async function getStudioVideo(id: string): Promise<StudioVideo | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_videos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as StudioVideo) || null;
}

export async function createStudioVideo(
  row: Partial<StudioVideo> & {
    theme_id: string;
    theme_label: string;
    title: string;
    script: string;
  }
): Promise<StudioVideo> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_videos")
    .insert({
      status: "generating",
      ...row,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as StudioVideo;
}

export async function updateStudioVideo(
  id: string,
  patch: Partial<StudioVideo>
): Promise<StudioVideo> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_videos")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as StudioVideo;
}

export async function countVideosCreatedToday(): Promise<number> {
  const supabase = createAdminClient();
  const { startOfZurichDayIso } = await import("./schedule");
  // Jour civil Genève (pas UTC) — reset ~00:00 Zurich
  const startIso = startOfZurichDayIso();
  // Les échecs ne consomment pas le quota (tests / erreurs)
  const { count, error } = await supabase
    .from("studio_videos")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startIso)
    .neq("status", "failed");
  if (error) throw new Error(error.message);
  return count || 0;
}

/** Nombre de vidéos non-failed créées dans le créneau actuel (jour Genève). */
export async function countGeneratedInCurrentWindow(): Promise<number> {
  const { currentPublishWindow, publishWindowAt, startOfZurichDayIso } =
    await import("./schedule");
  const win = currentPublishWindow();
  if (!win) return 0;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_videos")
    .select("created_at")
    .gte("created_at", startOfZurichDayIso())
    .neq("status", "failed")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);

  return (data || []).filter((row) => {
    const w = publishWindowAt(row.created_at as string);
    return w?.id === win.id;
  }).length;
}

/** True si le créneau actuel a atteint son plafond (ex. matin = 2). */
export async function currentWindowIsFull(): Promise<boolean> {
  const { currentPublishWindow } = await import("./schedule");
  const win = currentPublishWindow();
  if (!win) return true;
  const n = await countGeneratedInCurrentWindow();
  return n >= win.cap;
}

/** Vidéos encore en cours (évite d’empiler un cron toutes les 10 min). */
export async function countVideosInProgress(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("studio_videos")
    .select("id", { count: "exact", head: true })
    .in("status", ["generating", "rendering", "publishing"]);
  if (error) throw new Error(error.message);
  return count || 0;
}

export async function listRecentThemeIds(limit = 12): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("studio_videos")
    .select("theme_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data || [])
    .map((row) => row.theme_id as string)
    .filter(Boolean);
}

function normalizeSettings(row: Record<string, unknown>): StudioSettings {
  return {
    id: 1,
    auto_publish: row.auto_publish !== false,
    daily_quota: Number(row.daily_quota ?? 10),
    platforms: (row.platforms as StudioPlatform[]) || [
      "youtube",
      "tiktok",
      "instagram",
      "facebook",
    ],
    voice_id: (row.voice_id as string) || null,
    cta_url: (row.cta_url as string) || null,
    publish_hour_cet: Number(row.publish_hour_cet ?? 11),
    active_theme_id: (row.active_theme_id as string) || null,
    custom_theme_text: (row.custom_theme_text as string) || null,
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}
