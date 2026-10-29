import { about, coverage, entry, faq, hero, marquee, members, partners, problem, process, quickQuote, solution, stats, tech, why } from "@/content/home";
import { Hero } from "@/components/sections/Hero";
import { SplitIntro } from "@/components/sections/SplitIntro";
import { StaggerCards } from "@/components/sections/StaggerCards";
import { Solution } from "@/components/sections/Solution";
import { Process } from "@/components/sections/Process";
import { Coverage } from "@/components/sections/Coverage";
import { Tech } from "@/components/sections/Tech";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { EntryPaths } from "@/components/sections/EntryPaths";
import { LogoDrive } from "@/components/sections/LogoDrive";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

/**
 * Homepage. Every section is a reusable component fed from content/home.ts,
 * so service, location and careers pages can be assembled from the same parts.
 */
export default function Home() {
  return (
    <>
      <main id="main">
        <Hero {...hero} logos={members} />
        <SplitIntro id="about" {...about} stats={stats} />
        <StaggerCards id="problem" {...problem} />
        <Solution id="services" {...solution} />
        <Process id="how" {...process} />
        <Coverage id="coverage" {...coverage} />
        <Tech id="tech" {...tech} />
        <FeatureCards id="safety" {...why} />
        <EntryPaths id="start" {...entry} />
        <LogoDrive id="memberships" label={partners.label} title={partners.title} cta={partners.cta} logos={members} truckAlt={partners.truckAlt} />
        <Faq id="faq" {...faq} />
      </main>
      <Footer card="quote" quickQuote={quickQuote} marquee={marquee} />
    </>
  );
}
