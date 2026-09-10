"use client";

import { useEffect, useState } from "react";
import {
  inAppBrowserName,
  openInSystemBrowser,
} from "@/lib/formation/open-external-browser";

export function InAppBrowserBanner() {
  const [app, setApp] = useState<string | null>(null);

  useEffect(() => {
    setApp(inAppBrowserName(navigator.userAgent || ""));
  }, []);

  if (!app) return null;

  return (
    <div
      className="px-4 py-3 text-center"
      style={{
        background: "var(--d-gold)",
        color: "var(--d-night)",
      }}
    >
      <p className="text-sm font-medium leading-snug">
        {app} bloque souvent le paiement. Ouvre cette page dans Safari ou Chrome.
      </p>
      <button
        type="button"
        onClick={() => openInSystemBrowser()}
        className="mt-3 inline-flex w-full max-w-sm items-center justify-center px-4 py-3 text-xs font-bold uppercase tracking-widest"
        style={{
          background: "var(--d-night)",
          color: "var(--d-cream)",
        }}
      >
        Ouvrir dans Safari / Chrome
      </button>
      <p className="mt-2 text-xs leading-snug opacity-80">
        Sinon appuie sur <strong>…</strong> puis <strong>Ouvrir dans le navigateur</strong>.
      </p>
    </div>
  );
}
