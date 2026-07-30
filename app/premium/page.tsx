import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Realizations } from "@/components/Realizations";
import { Solutions } from "@/components/Solutions";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { WhyChoose } from "@/components/WhyChoose";

export default function PremiumPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyChoose />
        <Solutions />
        <HowItWorks />
        <Clients />
        <Stats />
        <Realizations />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
