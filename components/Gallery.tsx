import Image from "next/image";
import { GALLERY_FEATURED } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

export function Gallery() {
  return (
    <section className="bg-ink-soft py-24 md:py-32" id="galerie">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Galerie"
          title="Équipements premium & cafés de qualité"
          subtitle="Distributeurs modernes, machines à café professionnelles et installations soignées dans des environnements exigeants."
        />

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY_FEATURED.map((item, i) => (
            <Reveal key={item.src} delay={i * 0.06}>
              <div className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/5">
                <div className="relative">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={i % 3 === 0 ? 800 : 500}
                    className="w-full object-cover transition duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
