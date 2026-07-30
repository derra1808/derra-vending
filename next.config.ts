import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      { source: "/jeu-voiture", destination: "/jeu-voiture/index.html" },
      { source: "/jeu-voiture/", destination: "/jeu-voiture/index.html" },
      { source: "/mini-roblox", destination: "/mini-roblox/index.html" },
      { source: "/mini-roblox/", destination: "/mini-roblox/index.html" },
      { source: "/flyer", destination: "/flyer/index.html" },
      { source: "/flyer/", destination: "/flyer/index.html" },
    ];
  },
};

export default nextConfig;
