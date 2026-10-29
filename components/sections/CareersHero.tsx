import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/ui/Mark";
import { Lamp } from "@/components/ui/Lamp";

type CareersHeroProps = {
  label: string;
  title: readonly string[];
  intro: string;
  image: { src: string; alt: string };
  apply: string;
  /** The black plate on the photo, styled like the certification plate on the homepage. */
  hiring: { label: string; roles: string; pay: string };
};

/** Careers opener: two-line headline, apply CTA, and a crew photo with a black "now hiring" plate overlapping its corner. */
export function CareersHero({ label, title, intro, image, apply, hiring }: CareersHeroProps) {
  return (
    <section data-header="light" className="relative overflow-hidden bg-white pb-[5.6rem] pt-[14rem] lg:pb-[6rem] lg:pt-[20rem]">
      <Container>
        <div className="lg:grid lg:grid-cols-16 lg:gap-x-20">
          <div className="lg:col-span-9">
            <SectionLabel>{label}</SectionLabel>
            <Reveal as="h1" trigger="load" className="mt-24 text-[5rem] font-medium leading-[0.98] tracking-[-0.035em] lg:mt-40 lg:text-[13rem] lg:leading-[0.92]">
              <span className="block">{title[0]}</span>
              <span className="block">
                <Mark>{title[1]}</Mark>
              </span>
            </Reveal>
            <Reveal as="p" mode="fade" trigger="load" delay={0.4} className="mt-30 max-w-[54rem] text-18 text-body lg:mt-50 lg:text-20">
              {intro}
            </Reveal>
            <div className="mt-40 flex flex-wrap items-center gap-x-30 gap-y-16">
              <Button size="lg" href={apply} external>
                Apply now
              </Button>
              <Button variant="link" href="#classes">
                Training & classes
              </Button>
            </div>
          </div>
          <div className="relative mt-60 lg:col-span-6 lg:col-start-11 lg:mt-0">
            <ParallaxImage src={image.src} alt={image.alt} preload sizes="(min-width: 1200px) 36vw, 100vw" className="aspect-[4/5] w-full" />
            <div className="absolute -bottom-[2rem] right-0 bg-night px-24 pb-24 pt-20 text-white lg:-bottom-[3.2rem] lg:-right-[3.2rem] lg:px-30 lg:pb-30 lg:pt-24">
              <p className="flex items-center gap-10 font-mono text-12 uppercase tracking-[0.12em] text-white/75 lg:text-13">
                <Lamp tone="dark" />
                <span className="font-semibold text-amber">{hiring.label}</span>
              </p>
              <p className="mt-12 text-18 font-medium lg:text-20">{hiring.roles}</p>
              <p className="mt-4 font-mono text-12 uppercase tracking-[0.1em] text-white/70">{hiring.pay}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
