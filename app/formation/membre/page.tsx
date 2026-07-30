import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getProfile } from "@/lib/supabase/server";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";
import { getSetupStatus, isFormationFreeAccess } from "@/lib/formation/config";
import { FORMATION } from "@/lib/formation/content";
import { MemberDashboard } from "@/components/formation/MemberDashboard";

export default async function MembrePage() {
  const { user, profile } = await getProfile();

  if (!user) {
    redirect("/formation/login?redirect=/formation/membre");
  }

  let access = (profile?.has_paid ?? false) || isFormationFreeAccess();

  if (!access && getSetupStatus().stripe) {
    const synced = await syncPaidAccessForUser(user.id);
    if (synced.ok) {
      access = true;
    }
  }

  if (!access) {
    return (
      <div className="section-night flex min-h-[60vh] items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <Lock className="mx-auto h-10 w-10" style={{ color: "var(--d-gold)" }} />
          <p className="formation-label mt-6">Espace membre</p>
          <h1 className="formation-title mt-4 text-3xl">Formation verrouillée</h1>
          <p className="formation-body mt-5">
            Achète le pack pour accéder à l&apos;ebook, aux bonus et à l&apos;espace vidéo.
          </p>
          <Link href="/formation/pricing" className="formation-btn-primary mt-10 inline-flex">
            Acheter — {FORMATION.ebookPrice} {FORMATION.currency}
          </Link>
        </div>
      </div>
    );
  }

  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "Membre";

  return <MemberDashboard displayName={displayName} />;
}
