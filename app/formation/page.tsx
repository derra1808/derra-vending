import { FaqSection } from "@/components/formation/FaqSection";
import { OffersStrip } from "@/components/formation/OffersStrip";
import { TestimonialsSection } from "@/components/formation/TestimonialsSection";
import { PaidMemberMedia } from "@/components/formation/PaidMemberMedia";

export default function FormationPage() {
  return (
    <>
      <PaidMemberMedia />
      <OffersStrip />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
