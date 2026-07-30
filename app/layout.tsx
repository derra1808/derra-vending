import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { COMPANY, SEO_KEYWORDS } from "@/lib/data";

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

const title = "Derra Vending — Distributeur automatique premium à Genève";
const description =
  "Installation gratuite de distributeurs automatiques de café, boissons fraîches et snacks à Genève. Maintenance, remplissage et assistance inclus. Entreprises, chantiers, commerces.";

export const metadata: Metadata = {
  metadataBase: new URL("https://derra-vending.ch"),
  title: {
    default: title,
    template: "%s | Derra Vending",
  },
  description,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: COMPANY.founder }],
  creator: COMPANY.name,
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: "https://derra-vending.ch",
    siteName: COMPANY.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://derra-vending.ch",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    description,
    url: "https://derra-vending.ch",
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address,
      addressLocality: "Meyrin",
      postalCode: "1217",
      addressCountry: "CH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.2285,
      longitude: 6.0754,
    },
    areaServed: "Genève",
    founder: {
      "@type": "Person",
      name: COMPANY.founder,
    },
    priceRange: "$$",
    openingHours: "Mo-Su 00:00-24:00",
  };

  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
