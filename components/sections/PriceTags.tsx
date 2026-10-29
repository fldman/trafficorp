import Link from "next/link";
import { cn } from "@/lib/cn";
import { Container, Grid } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/art/Icons";

type Item = { price: number; tag: string; free?: boolean; title: string; text: string };

const mono = "font-mono text-12 uppercase tracking-[0.12em]";

/**
 * Classes as tear-off tickets: a tag for who the class is for, the price,
 * then a perforation with notches cut into both edges and the stub. Each
 * ticket books through the same page as the button: it lifts a little while
 * pointed at or focused, and its "Book" line underlines.
 */
export function PriceTags({ id, label, title, text, items, cta, ticketCta }: { id?: string; label: string; title: string; text: string; items: readonly Item[]; cta: { label: string; href: string }; ticketCta: string }) {
  return (
    <section id={id} data-header="light" className="relative scroll-mt-[10rem] bg-concrete py-[8.4rem] lg:py-[18rem]">
      <Container>
        <Grid>
          <div className="lg:col-span-6">
            <SectionLabel>{label}</SectionLabel>
            <Reveal as="h2" className="mt-20 text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:text-h3 lg:leading-none">
              {title}
            </Reveal>
            <p className="mt-30 max-w-[48rem] text-16 text-body lg:text-18">{text}</p>
            <div className="mt-40">
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          </div>

          <ul className="mt-60 grid gap-20 lg:col-span-9 lg:col-start-8 lg:mt-0 lg:grid-cols-3">
            {items.map((it) => (
              <li key={it.title} className="flex">
                <Link
                  href={cta.href}
                  className="tc-link-trigger group relative flex w-full flex-col bg-white transition-[translate,box-shadow] duration-500 ease-out-expo hover:shadow-[0_1.6rem_3rem_-2rem_rgba(21,21,21,0.18)] focus-visible:shadow-[0_1.6rem_3rem_-2rem_rgba(21,21,21,0.18)] motion-safe:hover:-translate-y-[0.6rem] motion-safe:focus-visible:-translate-y-[0.6rem]"
                >
                  <div className="px-24 pt-24 lg:px-30 lg:pt-30">
                    <span className={cn(mono, "inline-block px-8 py-4", it.free ? "bg-amber text-ink" : "bg-paper text-ink/80")}>{it.tag}</span>
                  </div>
                  {/* The dollar sign is set small and pinned to the cap height of the figures. */}
                  <p className="flex items-start px-24 pt-40 text-[6rem] font-medium leading-none tracking-[-0.04em] lg:px-30 lg:pt-[5rem] lg:text-h3">
                    <span className="mr-[0.16em] mt-[0.17em] text-[0.42em] leading-none tracking-normal">$</span>
                    <span>{it.price}</span>
                  </p>
                  {/* Perforation, with notches cut into both edges. */}
                  <div aria-hidden className="relative mt-30">
                    <span className="absolute -left-[1rem] top-1/2 size-[2rem] -translate-y-1/2 rounded-full bg-concrete" />
                    <span className="absolute -right-[1rem] top-1/2 size-[2rem] -translate-y-1/2 rounded-full bg-concrete" />
                    <div className="mx-24 border-t-2 border-dashed border-ink/20 lg:mx-30" />
                  </div>
                  <div className="flex flex-1 flex-col px-24 pb-30 pt-24 lg:px-30">
                    <h3 className="text-20 font-medium leading-[1.2] lg:text-24">{it.title}</h3>
                    <p className="mt-10 text-16 text-body">{it.text}</p>
                    <span className="mt-auto pt-30 text-16 font-medium">
                      <span className="tc-link inline-flex items-center gap-4">
                        {ticketCta}
                        <ArrowRight className="size-14 transition-[translate] duration-300 group-hover:translate-x-4 group-focus-visible:translate-x-4" />
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      </Container>
    </section>
  );
}
