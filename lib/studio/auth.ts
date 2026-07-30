import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/server";
import { isStudioAdminEmail } from "./config";

export async function requireStudioAdmin() {
  const { user } = await getProfile();
  if (!user?.email || !isStudioAdminEmail(user.email)) {
    redirect(`/formation/login?redirect=${encodeURIComponent("/studio")}`);
  }
  return user;
}

export async function getStudioAdminOrNull() {
  const { user } = await getProfile();
  if (!user?.email || !isStudioAdminEmail(user.email)) return null;
  return user;
}

/** Pour les API routes — retourne une Response 401 si non admin */
export async function assertStudioAdminApi(): Promise<
  { ok: true; email: string } | { ok: false; response: Response }
> {
  const { user } = await getProfile();
  if (!user?.email || !isStudioAdminEmail(user.email)) {
    return {
      ok: false,
      response: Response.json({ error: "Non autorisé" }, { status: 401 }),
    };
  }
  return { ok: true, email: user.email };
}

export function assertCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
