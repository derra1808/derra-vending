import Link from "next/link";
import { FormationLogo } from "./FormationLogo";

export function FormationFooter() {
  return (
    <footer className="formation-footer formation-content">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <FormationLogo size={36} showText={false} href="/formation" />
          <div>
            <p className="text-[11px] tracking-[0.22em]" style={{ color: "var(--d-cream)" }}>
              DERRA VENDING
            </p>
            <p className="formation-body mt-1 text-sm">Formation vending · Europe</p>
          </div>
        </div>
        <div className="flex gap-8 text-[13px]">
          <Link href="/mentions-legales" className="formation-nav-link">
            Mentions légales
          </Link>
          <Link href="/politique-confidentialite" className="formation-nav-link">
            Confidentialité
          </Link>
          <Link href="/premium" className="formation-nav-link">
            Site vending
          </Link>
        </div>
      </div>
    </footer>
  );
}
