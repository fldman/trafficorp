import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { cn } from "@/lib/cn";
import { Mark } from "@/components/ui/Mark";

type PageHeroProps = {
  label: string;
  /** Title text; `mark` (a word or phrase inside it) is set as a sign mark. */
  title: string;
  mark?: string;
  intro: string;
  /** `position` sets the crop (CSS object-position), e.g. "50% 65%". */
  image?: { src: string; alt: string; position?: string };
  /** Slot under the intro (buttons, a status line). */
  actions?: React.ReactNode;
  className?: string;
};

function withMark(title: string, mark?: string) {
  if (!mark || !title.includes(mark)) return title;
  const [before, ...rest] = title.split(mark);
  return (
    <>
      {before}
      <Mark>{mark}</Mark>
      {rest.join(mark)}
    </>
  );
}

/**
 * Inner-page opener: eyebrow, a large headline and intro, and a full-bleed
 * photo that opens underneath.
 */
export function PageHero({ label, title, mark, intro, image, actions, className }: PageHeroProps) {
  return (
    <section data-header="light" className={cn("relative bg-white pt-[14rem] lg:pt-[22rem]", className)}>
      <Container>
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-30 border-t border-ink/15 pt-30 lg:mt-40 lg:grid lg:grid-cols-16 lg:gap-x-20 lg:pt-50">
          <Reveal as="h1" trigger="load" className="text-[4.6rem] font-medium leading-[1] tracking-[-0.03em] lg:col-span-11 lg:text-[12rem] lg:leading-[0.94]">
            {withMark(title, mark)}
          </Reveal>
          <div className="mt-30 lg:col-span-4 lg:col-start-13 lg:mt-0 lg:self-end">
            <Reveal as="p" mode="fade" trigger="load" delay={0.4} className="text-18 text-body lg:text-20">
              {intro}
            </Reveal>
            {actions && <div className="mt-30">{actions}</div>}
          </div>
        </div>
      </Container>
      {image && (
        <div className="mt-60 lg:mt-[10rem]">
          <ParallaxImage src={image.src} alt={image.alt} position={image.position} sizes="100vw" preload amount={10} className="h-[48rem] w-full lg:h-[86rem]" />
        </div>
      )}
    </section>
  );
}
