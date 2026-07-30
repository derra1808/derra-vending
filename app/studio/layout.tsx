import type { Metadata } from "next";
import { requireStudioAdmin } from "@/lib/studio/auth";

export const metadata: Metadata = {
  title: "Studio vidéo",
  robots: { index: false, follow: false },
};

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStudioAdmin();
  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Derra Vending
            </p>
            <h1 className="font-display text-2xl text-cream">Studio vidéo</h1>
          </div>
          <a
            href="/formation/membre"
            className="text-sm text-cream/60 transition hover:text-gold"
          >
            Espace membre
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
