import { Container, Grid } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/ui/Mark";
import { StatGrid, type Stat } from "@/components/ui/StatGrid";

type Img = { src: string; alt: string };

type SplitIntroProps = {
  id?: string;
  label: string;
  title: string;
  /** Phrase at the end of the title set as a sign mark. */
  mark?: string;
  lead: string;
  body: readonly string[];
  link?: { label: string; href: string };
  image: Img;
  stats?: readonly Stat[];
};

/**
 * Label + big heading with a tall photo hanging into the next section on the
 * left; figures and copy on the right. Used for About-type intros.
 */
export function SplitIntro({ id, label, title, mark, lead, body, link, image, stats }: SplitIntroProps) {
  return (
    <section id={id} data-header="light" className="relative z-10 bg-white pt-[8.4rem] lg:pb-[18rem] lg:pt-200">
      <Container>
        <Grid className="lg:grid-rows-[auto_auto_1fr]">
          <SectionLabel className="lg:col-span-10 lg:col-start-1 lg:row-start-1">
            {label}
          </SectionLabel>

          <Reveal
            as="h2"
            className="mt-20 text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:col-span-10 lg:col-start-1 lg:row-start-2 lg:mt-30 lg:text-h3 lg:leading-none"
          >
            {title} {mark && <Mark>{mark}</Mark>}
          </Reveal>

          <div className="mt-50 lg:col-span-5 lg:col-start-12 lg:row-span-3 lg:row-start-1 lg:mt-0">
            {stats && <StatGrid stats={stats} columns={2} />}
            <Reveal as="h3" mode="fade" className="mt-40 text-20 font-medium leading-[1.3] lg:mt-50 lg:max-w-[44rem] lg:text-24">
              {lead}
            </Reveal>
            {body.map((p) => (
              <Reveal key={p.slice(0, 24)} as="p" mode="fade" className="mt-20 text-16 text-body lg:text-18">
                {p}
              </Reveal>
            ))}
            {link && (
              <div className="mt-30">
                <Button variant="link" href={link.href}>
                  {link.label}
                </Button>
              </div>
            )}
          </div>

          <ParallaxImage
            src={image.src}
            alt={image.alt}
            sizes="(min-width: 1200px) 60vw, 100vw"
            amount={10}
            lift={4}
            className="relative z-10 -mb-[9rem] mt-60 aspect-[16/9] w-full lg:col-span-10 lg:col-start-1 lg:row-start-3 lg:-mb-[26rem] lg:mt-0 lg:self-end"
          />
        </Grid>
      </Container>
    </section>
  );
}
