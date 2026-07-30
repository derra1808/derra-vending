export type StudioPlatform = "youtube" | "tiktok" | "instagram" | "facebook";

export type StudioVideoStatus =
  | "generating"
  | "rendering"
  | "publishing"
  | "published"
  | "failed";

export interface StudioTheme {
  id: string;
  label: string;
  angle: string;
  keywords: string[];
  visualQuery: string;
}

export interface GeneratedScript {
  title: string;
  hook: string;
  script: string;
  caption: string;
  hashtags: string[];
}

export interface StudioSettings {
  id: number;
  auto_publish: boolean;
  daily_quota: number;
  platforms: StudioPlatform[];
  voice_id: string | null;
  cta_url: string | null;
  publish_hour_cet: number;
  active_theme_id: string | null;
  custom_theme_text: string | null;
  updated_at: string;
}

export interface StudioVideo {
  id: string;
  theme_id: string;
  theme_label: string;
  title: string;
  hook: string | null;
  script: string;
  caption: string | null;
  hashtags: string[] | null;
  status: StudioVideoStatus;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  shotstack_id: string | null;
  platforms: StudioPlatform[] | null;
  publish_results: Record<string, unknown> | null;
  scheduled_at: string | null;
  published_at: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudioSetupStatus {
  claude: boolean;
  elevenlabs: boolean;
  shotstack: boolean;
  metricool: boolean;
  pexels: boolean;
  blob: boolean;
  supabase: boolean;
  cronSecret: boolean;
  readyToGenerate: boolean;
  readyToPublish: boolean;
}
