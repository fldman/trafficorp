import type { Metadata } from "next";
import { benefits, careersFaq, careersHero, classes, requirements, roles } from "@/content/careers";
import { site } from "@/lib/site";
import { CareersHero } from "@/components/sections/CareersHero";
import { InfoGrid } from "@/components/sections/InfoGrid";
import { OpenRoles } from "@/components/sections/OpenRoles";
import { PriceTags } from "@/components/sections/PriceTags";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Careers",
  description: "Flagger and traffic control jobs across Idaho and Washington. No experience needed, free certification, weekly pay from $18/hr.",
};

export default function CareersPage() {
  return (
    <>
      <main id="main">
        <CareersHero {...careersHero} />
        <InfoGrid {...benefits} />
        <OpenRoles id="positions" {...roles} everyone={requirements.items} />
        <PriceTags id="classes" {...classes} />
        <Faq {...careersFaq} />
      </main>
      <Footer card="apply" marquee={`NOW HIRING ▸ FLAGGERS & SUPERVISORS ▸ ${site.phone.display} ▸ `} />
    </>
  );
}
