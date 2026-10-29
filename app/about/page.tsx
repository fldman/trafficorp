import type { Metadata } from "next";
import { aboutHero, aboutQuote, aboutStats, crew, milestones, mission } from "@/content/about";
import { marquee, members } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { StatGrid } from "@/components/ui/StatGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Statement } from "@/components/sections/Statement";
import { Milestones } from "@/components/sections/Milestones";
import { Crew } from "@/components/sections/Crew";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "TraffiCorp is a traffic control company from Coeur d'Alene, Idaho, running work zones across Idaho and Washington since 1999.",
};

export default function AboutPage() {
  return (
    <>
      <main id="main">
        <PageHero {...aboutHero} />
        <section data-header="light" className="bg-white pb-[8.4rem] pt-[5.6rem] lg:pb-[16rem] lg:pt-[12rem]">
          <Container>
            <StatGrid stats={aboutStats} columns={4} />
          </Container>
        </section>
        <Crew label={crew.label} title={crew.title} text={crew.text} image={crew.image} rules={crew.rules} members={{ title: crew.membersTitle, logos: members }} />
        <Statement {...mission} />
        <Milestones label="Mile markers" title="How a flagging company became the whole work zone." items={milestones} />
      </main>
      <Footer card="quote" quickQuote={aboutQuote} marquee={marquee} />
    </>
  );
}
