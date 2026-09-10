export function inAppBrowserName(ua = "") {
  const u = ua.toLowerCase();
  if (u.includes("tiktok") || u.includes("bytedance") || u.includes("musical_ly") || u.includes("ttwebview")) {
    return "TikTok";
  }
  if (u.includes("instagram")) return "Instagram";
  if (u.includes("whatsapp")) return "WhatsApp";
  if (u.includes("fbav") || u.includes("fban") || u.includes("fb_iab") || u.includes("facebook")) {
    return "Facebook";
  }
  return null;
}

/** Try to leave TikTok/Instagram and open Safari or Chrome. User tap required. */
export function openInSystemBrowser(url?: string) {
  if (typeof window === "undefined") return;
  const target = url || window.location.href;
  const ua = window.navigator.userAgent || "";
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);

  if (isAndroid) {
    const rest = target.replace(/^https:\/\//i, "");
    window.location.href =
      "intent://" +
      rest +
      "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
      encodeURIComponent(target) +
      ";end";
    return;
  }

  if (isIOS) {
    const hostPath = target.replace(/^https:\/\//i, "");
    window.location.href = "x-safari-https://" + hostPath;
    window.setTimeout(() => {
      window.location.href = "googlechromes://" + hostPath;
    }, 500);
    return;
  }

  window.open(target, "_blank", "noopener,noreferrer");
}
