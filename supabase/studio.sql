-- Studio vidéo auto Derra Vending
-- Exécuter dans Supabase → SQL Editor après schema.sql

create table if not exists public.studio_settings (
  id int primary key default 1 check (id = 1),
  auto_publish boolean not null default true,
  daily_quota int not null default 5,
  platforms jsonb not null default '["youtube","tiktok","instagram","facebook"]'::jsonb,
  voice_id text default 'JBFqnCBsd6RMkjVDRZzb',
  cta_url text default 'https://derra-vending.ch/formation',
  publish_hour_cet int not null default 11,
  active_theme_id text,
  custom_theme_text text,
  updated_at timestamptz default now()
);

-- Colonnes si table déjà créée avec l'ancienne version
alter table public.studio_settings add column if not exists active_theme_id text;
alter table public.studio_settings add column if not exists custom_theme_text text;
alter table public.studio_settings alter column auto_publish set default true;

insert into public.studio_settings (id, auto_publish)
values (1, true)
on conflict (id) do update set auto_publish = coalesce(public.studio_settings.auto_publish, true);

create table if not exists public.studio_videos (
  id uuid primary key default gen_random_uuid(),
  theme_id text not null,
  theme_label text not null,
  title text not null,
  hook text,
  script text not null,
  caption text,
  hashtags text[] default '{}',
  status text not null default 'generating'
    check (status in (
      'generating',
      'rendering',
      'publishing',
      'published',
      'failed'
    )),
  video_url text,
  audio_url text,
  thumbnail_url text,
  shotstack_id text,
  platforms jsonb default '[]'::jsonb,
  publish_results jsonb default '{}'::jsonb,
  scheduled_at timestamptz,
  published_at timestamptz,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists studio_videos_status_idx on public.studio_videos (status);
create index if not exists studio_videos_created_idx on public.studio_videos (created_at desc);

alter table public.studio_settings enable row level security;
alter table public.studio_videos enable row level security;

drop policy if exists "Service role manages studio_settings" on public.studio_settings;
create policy "Service role manages studio_settings"
  on public.studio_settings for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role manages studio_videos" on public.studio_videos;
create policy "Service role manages studio_videos"
  on public.studio_videos for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
