import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0B",
          soft: "#111114",
          muted: "#1A1A1F",
        },
        anthracite: {
          DEFAULT: "#2A2A32",
          light: "#3A3A44",
        },
        gold: {
          DEFAULT: "#c8a24a",
          light: "#E0C98A",
          dim: "#8A7340",
        },
        cream: "#f4f1e8",
        derra: {
          night: "#1a1a2e",
          gold: "#c8a24a",
          cream: "#f4f1e8",
          text: "#444444",
        },
        peace: {
          50: "#f7faf9",
          100: "#eef4f2",
          150: "#e4ece8",
          200: "#d4e4dc",
          lavender: "#f3f1f8",
          "lavender-deep": "#8b7aa8",
          sage: "#6b9080",
          "sage-dark": "#4a6b62",
          "sage-light": "#a4c3b2",
          gold: "#b8a482",
          text: "#2f3e3a",
          muted: "#7a8f88",
          coral: "#e8b4a8",
          "coral-dark": "#c4897a",
        },
        cosmic: {
          void: "#050510",
          deep: "#0D0B1A",
          purple: "#6B4C9A",
          violet: "#4A2C7A",
          gold: "#D4AF37",
          light: "#E8E6F0",
          muted: "#9890A8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        gold: "0 0 40px rgba(201, 169, 98, 0.15)",
        card: "0 24px 64px rgba(0, 0, 0, 0.4)",
        cosmic: "0 0 60px rgba(107, 76, 154, 0.25)",
        peace: "0 4px 24px rgba(107, 144, 128, 0.08), 0 1px 3px rgba(47, 62, 58, 0.04)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        shimmer: "shimmer 2.5s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
