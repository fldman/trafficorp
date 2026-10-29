import type { Metadata } from "next";
import { channels, contactCoverage, contactHero } from "@/content/contact";
import { coverage, faq, marquee } from "@/content/home";
import { ContactHero } from "@/components/sections/ContactHero";
import { Coverage } from "@/components/sections/Coverage";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call TraffiCorp dispatch on (208) 665-4683, request a quote, or find which of our two hubs, Coeur d'Alene or Nampa, Idaho, is closest to your job.",
};

export default function ContactPage() {
  return (
    <>
      <main id="main">
        <ContactHero {...contactHero} channels={channels} />
        <Coverage id="coverage" {...coverage} {...contactCoverage} />
        <Faq {...faq} />
      </main>
      <Footer card="none" marquee={marquee} />
    </>
  );
}
