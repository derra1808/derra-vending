import { getStudioSetupStatus } from "@/lib/studio/config";
import { getStudioSettings, listStudioVideos } from "@/lib/studio/db";
import { STUDIO_THEMES } from "@/lib/studio/themes";
import { StudioDashboard } from "@/components/studio/StudioDashboard";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  let videos: Awaited<ReturnType<typeof listStudioVideos>> = [];
  let settings: Awaited<ReturnType<typeof getStudioSettings>> | null = null;
  let dbError: string | null = null;

  try {
    [videos, settings] = await Promise.all([
      listStudioVideos(40),
      getStudioSettings(),
    ]);
  } catch (err) {
    dbError =
      err instanceof Error
        ? err.message
        : "Tables studio absentes — exécute supabase/studio.sql";
  }

  const setup = getStudioSetupStatus();

  return (
    <StudioDashboard
      themes={STUDIO_THEMES}
      videos={videos}
      settings={settings}
      setup={setup}
      dbError={dbError}
    />
  );
}
