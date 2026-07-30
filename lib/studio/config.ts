import { COMPANY } from "@/lib/data";
import type { StudioSetupStatus } from "./types";

export function getStudioAdminEmails(): string[] {
  const fromEnv = process.env.STUDIO_ADMIN_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return [COMPANY.email.toLowerCase()];
}

export function isStudioAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getStudioAdminEmails().includes(email.toLowerCase());
}

export function getStudioSetupStatus(): StudioSetupStatus {
  const claude = Boolean(process.env.ANTHROPIC_API_KEY);
  const elevenlabs = Boolean(process.env.ELEVENLABS_API_KEY);
  const shotstack = Boolean(process.env.SHOTSTACK_API_KEY);
  const metricool = Boolean(
    (process.env.METRICOOL_API_TOKEN || process.env.METRICOOL_API_KEY) &&
      process.env.METRICOOL_USER_ID &&
      process.env.METRICOOL_BLOG_ID
  );
  const pexels = Boolean(process.env.PEXELS_API_KEY);
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const supabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const cronSecret = Boolean(process.env.CRON_SECRET);

  return {
    claude,
    elevenlabs,
    shotstack,
    metricool,
    pexels,
    blob,
    supabase,
    cronSecret,
    readyToGenerate:
      claude && elevenlabs && shotstack && pexels && blob && supabase,
    readyToPublish: metricool && supabase,
  };
}

export function getCtaUrl(): string {
  return (
    process.env.STUDIO_CTA_URL ||
    `${process.env.NEXT_PUBLIC_SITE_URL || "https://derra-vending.ch"}/formation`
  );
}

export function getDefaultVoiceId(): string {
  return process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
}
