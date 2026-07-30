import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://derra-vending.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/chantiers/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/commerces/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/flyer/`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${base}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/politique-confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
