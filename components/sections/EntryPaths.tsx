"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import type { QuoteDraft } from "@/content/quote";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useQuote } from "@/components/providers/QuoteProvider";
import { cn } from "@/lib/cn";
import { tierIcons, type TierIconKey } from "@/components/art/Icons";

type Path = {
  tag: string;
  icon: TierIconKey;
  title: string;
  text: string;
  /** Lead-in for a tier that includes the one before it, e.g. "Everything in a crew day, plus". */
  plus?: string;
  includes: readonly string[];
  cta: string;
  prefill: Partial<QuoteDraft> | { services: readonly string[]; duration?: string; role?: string };
};

/**
 * "Start where you are": three ways in, sized by job. Each tier includes the
 * one before and lists more (3, 4, 5), and on desktop the cards sit on a
 * shared baseline, so the growing lists step them up like a staircase; the
 * largest is set dark. Each card opens the quote form filled in for that work.
 */
export function EntryPaths({ id, label, title, paths }: { id?: string; label: string; title: string; paths: readonly Path[] }) {
  const root = useRef<HTMLElement>(null);
  const quote = useQuote();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q("[data-path]").forEach((card, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true }, delay: i * 0.08 });
          tl.from(card, { opacity: 0, y: 70, duration: 1.2, ease: "expo.out" });
          tl.from(card.querySelectorAll("[data-point]"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.3);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} data-header="light" className="relative bg-white pb-[8.4rem] pt-[7rem] lg:pb-[20rem] lg:pt-[16rem]">
      <Container>
        <div className="lg:grid lg:grid-cols-16 lg:gap-x-20">
          <SectionLabel className="lg:col-span-12 lg:col-start-1 lg:row-start-1">
            {label}
          </SectionLabel>
          <Reveal as="h2" className="mt-20 text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:col-span-10 lg:col-start-1 lg:row-start-2 lg:mt-30 lg:text-h3 lg:leading-none">
            {title}
          </Reveal>
        </div>

        <ol className="mt-60 grid gap-20 lg:mt-[10rem] lg:grid-cols-3 lg:items-end">
          {paths.map((p, i) => {
            const dark = i === paths.length - 1;
            const Icon = tierIcons[p.icon];
            return (
              <li
                key={p.title}
                data-path
                className={cn(
                  "group flex flex-col p-24 transition-colors duration-500 lg:p-40",
                  dark ? "on-dark bg-asphalt text-white hover:bg-tile" : "bg-paper hover:bg-concrete",
                )}
              >
                <div className="flex items-start justify-between gap-16">
                  <Icon className={cn("size-[5.6rem] lg:size-[6.4rem]", dark ? "text-white" : "text-ink")} />
                  <span className={cn("px-8 py-4 font-mono text-12 uppercase tracking-[0.12em]", dark ? "bg-amber text-ink" : "bg-ink text-white")}>{p.tag}</span>
                </div>
                <h3 className="mt-30 text-[2.8rem] font-medium leading-[1.05] tracking-[-0.015em] lg:mt-50 lg:text-h5">{p.title}</h3>
                <p className={cn("mt-16 text-16 lg:text-18", dark ? "text-white/75" : "text-body")}>{p.text}</p>
                {p.plus && <p className={cn("mt-30 font-mono text-12 uppercase tracking-[0.12em]", dark ? "text-white/70" : "text-label")}>{p.plus}</p>}
                <ul className={cn("border-t", p.plus ? "mt-12" : "mt-30", dark ? "border-white/15" : "border-ink/15")}>
                  {p.includes.map((x) => (
                    <li key={x} data-point className={cn("flex items-center gap-12 border-b py-12 text-16", dark ? "border-white/15 text-white/90" : "border-ink/15")}>
                      <span aria-hidden className="size-8 shrink-0 rotate-45 bg-amber" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-40">
                  <Button onClick={() => quote.open(p.prefill as Partial<QuoteDraft>, 1)}>{p.cta}</Button>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
