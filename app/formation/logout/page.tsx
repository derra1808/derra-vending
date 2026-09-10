"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function LogoutInner() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const next = search.get("next") || "/formation/signup?product=ebook&redirect=%2Fformation";
    const supabase = createClient();
    void (async () => {
      if (supabase) await supabase.auth.signOut();
      router.replace(next);
      router.refresh();
    })();
  }, [router, search]);

  return (
    <div className="section-night flex min-h-[40vh] items-center justify-center px-6 py-24">
      <p className="formation-body">Déconnexion…</p>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense
      fallback={
        <div className="section-night flex min-h-[40vh] items-center justify-center px-6 py-24">
          <p className="formation-body">Déconnexion…</p>
        </div>
      }
    >
      <LogoutInner />
    </Suspense>
  );
}
