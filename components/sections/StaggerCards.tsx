import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { cn } from "@/lib/cn";

type Item = { title: string; text: string; image: { src: string; alt: string } };

type StaggerCardsProps = {
  id?: string;
  title: string;
  items: readonly Item[];
  tone?: "concrete" | "white";
  className?: string;
};

/**
 * Desktop zigzag slots for up to five cards on the 16-column grid:
 * column placement, vertical offset from the heading, image proportions.
 * Below desktop the cards stack full width with one 4:3 image shape.
 */
const slots = [
  { col: "lg:col-start-13 lg:col-span-4", top: "lg:mt-0", aspect: "lg:aspect-[387/279]" },
  { col: "lg:col-start-4 lg:col-span-4", top: "lg:mt-[48.9rem]", aspect: "lg:aspect-square" },
  { col: "lg:col-start-11 lg:col-span-5", top: "lg:mt-[81.5rem]", aspect: "lg:aspect-[489/390]" },
  { col: "lg:col-start-1 lg:col-span-3", top: "lg:mt-[117.5rem]", aspect: "lg:aspect-[285/429]" },
  { col: "lg:col-start-7 lg:col-span-4", top: "lg:mt-[154.8rem]", aspect: "lg:aspect-[387/418]" },
];

/** Heading that ends in "…" followed by staggered cards, each one way the sentence ends. */
export function StaggerCards({ id, title, items, tone = "concrete", className }: StaggerCardsProps) {
  return (
    <section
      id={id}
      data-header="light"
      className={cn(
        "relative pb-[8.4rem] pt-[11.2rem] lg:py-[18rem]",
        tone === "concrete" ? "bg-concrete" : "bg-white",
        className,
      )}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-16 lg:gap-x-20">
          <Reveal
            as="h2"
            className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:col-span-6 lg:col-start-4 lg:row-start-1 lg:text-h3 lg:leading-none"
          >
            {title}
          </Reveal>

          <ol className="contents">
            {items.slice(0, slots.length).map((item, i) => {
              const slot = slots[i];
              return (
                <li
                  key={item.title}
                  className={cn(
                    "mt-70 lg:row-start-1 lg:self-start",
                    i === 0 && "max-lg:mt-60",
                    slot.col,
                    slot.top,
                  )}
                >
                  <article>
                    <ParallaxImage src={item.image.src} alt={item.image.alt} sizes="(min-width: 1200px) 28vw, 100vw" className={cn("aspect-[4/3] w-full", slot.aspect)} />
                    <Reveal as="h3" className="mt-24 text-[2.6rem] font-medium leading-[1.05] tracking-[-0.01em] lg:mt-30 lg:text-h6">
                      {item.title}
                    </Reveal>
                    <Reveal as="p" mode="fade" className="mt-16 text-16 text-body lg:mt-20">
                      {item.text}
                    </Reveal>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
