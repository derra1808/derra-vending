"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getVisitorId } from "@/lib/formation/visitor-id";

function ping(body: Record<string, unknown>) {
  void fetch("/api/formation/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/formation/stats")) return;
    const vid = getVisitorId();
    const search = searchParams?.toString()
      ? `?${searchParams.toString()}`
      : window.location.search;
    const key = `fv:${pathname}`;
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        ping({
          path: pathname,
          referrer: document.referrer || "",
          search,
          visitorId: vid,
        });
      }
    } catch {
      ping({
        path: pathname,
        referrer: document.referrer || "",
        search,
        visitorId: vid,
      });
    }

    const started = Date.now();
    const maxStay = 30 * 60 * 1000;
    let lastSent = 0;
    let lastSentAt = 0;

    function sendStay(reason: "tick" | "hide" | "leave") {
      const ms = Math.min(Date.now() - started, maxStay);
      if (ms < 1000) return;
      if (lastSent >= maxStay) return;
      const now = Date.now();
      if (reason !== "leave" && lastSentAt && now - lastSentAt < 15000) return;
      lastSentAt = now;
      lastSent = ms;
      ping({ path: pathname, visitorId: vid, ms });
    }

    const first = window.setTimeout(() => sendStay("tick"), 15000);
    const onHide = () => {
      if (document.visibilityState === "hidden") sendStay("hide");
    };
    const onLeave = () => sendStay("leave");
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onLeave);

    return () => {
      sendStay("leave");
      window.clearTimeout(first);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onLeave);
    };
  }, [pathname, searchParams]);

  return null;
}
