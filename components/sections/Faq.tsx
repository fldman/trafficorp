"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { Container, Grid } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Plus } from "@/components/art/Icons";

type Item = { q: string; a: string };

/** Keyboard-operable accordion: one panel open at a time. */
export function Accordion({ items, defaultOpen = 0 }: { items: readonly Item[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <ul className="border-b border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <li key={item.q} className="border-t border-ink/10">
            <h3>
              <button
                type="button"
                id={`${id}-h`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="tc-link-trigger group flex w-full items-center justify-between gap-24 py-24 text-left text-18 leading-[1.4] lg:py-28 lg:text-20"
              >
                <span className="tc-link">{item.q}</span>
                <Plus className={cn("size-16 shrink-0 transition-transform duration-500 ease-out-expo lg:size-20", isOpen && "rotate-45")} />
              </button>
            </h3>
            <div
              id={`${id}-p`}
              role="region"
              aria-labelledby={`${id}-h`}
              className={cn("grid transition-[grid-template-rows] duration-500 ease-out-expo", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className={cn("max-w-[58rem] pb-28 text-16 text-body transition-opacity duration-500", isOpen ? "opacity-100" : "opacity-0")}>{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Faq({ id, label, title, items }: { id?: string; label: string; title: string; items: readonly Item[] }) {
  return (
    <section id={id} data-header="light" className="relative bg-white pb-[15.4rem] pt-[8.4rem] lg:pb-[30rem] lg:pt-[18rem]">
      <Container>
        <Grid>
          <div className="lg:col-span-5 lg:col-start-2">
            <SectionLabel>{label}</SectionLabel>
            <Reveal as="h2" className="mt-20 text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-40 lg:text-h3 lg:leading-none">
              {title}
            </Reveal>
            <div className="mt-30 lg:mt-50">
              <Button variant="link" href={site.phone.href}>
                Call dispatch {site.phone.display}
              </Button>
            </div>
          </div>
          <div className="mt-50 lg:col-span-7 lg:col-start-9 lg:mt-14">
            <Accordion items={items} />
          </div>
        </Grid>
      </Container>
    </section>
  );
}
