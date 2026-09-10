import type { Metadata } from "next";
import { Suspense } from "react";
import { FormationBackground } from "@/components/formation/FormationLogo";
import { FormationFooter } from "@/components/formation/FormationFooter";
import { FormationHeader } from "@/components/formation/FormationHeader";
import { VisitTracker } from "@/components/formation/VisitTracker";
import { InAppBrowserBanner } from "@/components/formation/InAppBrowserBanner";
import { getProfile } from "@/lib/supabase/server";
import { hasLifetimeFormationAccess } from "@/lib/formation/access";
import "./formation.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Formation café et snack — 47 CHF",
  description:
    "Café et snack en dépôt gratuit. 50 distributeurs en 2 ans et demi à Genève. Vidéos exclusives, scripts, contrat. 47 CHF.",
};

export default async function FormationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getProfile();
  const signedIn = Boolean(user);
  const hasPaid = hasLifetimeFormationAccess(user, profile);

  return (
    <div className="formation-theme min-h-screen font-sans antialiased">
      <Suspense fallback={null}>
        <VisitTracker />
      </Suspense>
      <InAppBrowserBanner />
      <FormationBackground />
      <FormationHeader signedIn={signedIn} hasPaid={hasPaid} />
      <main className="formation-content">{children}</main>
      <FormationFooter />
    </div>
  );
}
