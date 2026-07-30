import type { Metadata } from "next";
import { FormationBackground } from "@/components/formation/FormationLogo";
import { FormationFooter } from "@/components/formation/FormationFooter";
import { FormationHeader } from "@/components/formation/FormationHeader";
import "./formation.css";

export const metadata: Metadata = {
  title: "Le Café en Dépôt Gratuit — Formation Vending Europe",
  description:
    "De 5 machines à 40 en 2 ans et demi. Méthode café en dépôt gratuit, testée à Genève, applicable partout en Europe. Par Ibrahim Derra, Derra Vending.",
};

export default function FormationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="formation-theme min-h-screen font-sans antialiased">
      <FormationBackground />
      <FormationHeader />
      <main className="formation-content">{children}</main>
      <FormationFooter />
    </div>
  );
}
