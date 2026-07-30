import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./horoscope.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Derra — Bilan cosmique · Astrologie & Numérologie",
  },
  description:
    "Découvrez votre bilan astrologique et numérologique complet : signe zodiacal, chemin de vie, passé, présent et projections sur 5 et 10 ans.",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Derra",
    title: "Derra — Bilan cosmique",
  },
};

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${cormorant.variable} horoscope-page font-sans text-peace-text`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="horoscope-orb-sage absolute -left-32 top-0 h-[500px] w-[500px] rounded-full" />
        <div className="horoscope-orb-lavender absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
