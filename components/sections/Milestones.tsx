"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Cone } from "@/components/art/Icons";

type Milestone = {
  year: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
  /** A quiet invitation under the text (used on the last marker). */
  invite?: { text: string; label: string; href: string };
};

/**
 * Mile markers on concrete: a sticky heading on the left, and on the right a
 * road of milestones with The Line drawing down beside them. Each marker
 * lights up as the line reaches it (amber diamond, the year turns ink).
 */
export function Milestones({ label, title, items }: { label: string; title: string; items: readonly Milestone[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(q("[data-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-road]")[0], start: "top 60%", end: "bottom 60%", scrub: 0.6 } });
        q("[data-item]").forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => item.toggleAttribute("data-active", self.isActive || self.progress === 1),
          });
          gsap.from(item.querySelector("[data-media]"), { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "expo.inOut", scrollTrigger: { trigger: item, start: "top 80%", once: true } });
        });
      });
      mm.add(MQ.reduce, () => {
        q("[data-item]").forEach((item) => item.setAttribute("data-active", ""));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="light" className="relative bg-concrete py-[8.4rem] lg:py-[20rem]">
      <Container>
        <div className="lg:grid lg:grid-cols-16 lg:gap-x-20">
          <div className="lg:sticky lg:top-[24vh] lg:col-span-6 lg:self-start">
            <SectionLabel>{label}</SectionLabel>
            <Reveal as="h2" className="mt-20 text-[3.8rem] font-medium leading-[1.02] tracking-[-0.02em] lg:mt-30 lg:text-h3 lg:leading-none">
              {title}
            </Reveal>
          </div>

          <ol data-road className="relative mt-60 lg:col-span-9 lg:col-start-8 lg:mt-0">
            <span aria-hidden className="absolute bottom-0 left-[1.1rem] top-0 w-[3px] bg-[repeating-linear-gradient(to_bottom,rgba(21,21,21,0.2)_0_1.4rem,transparent_1.4rem_2.4rem)]" />
            <span aria-hidden data-line className="absolute bottom-0 left-[1.1rem] top-0 w-[3px] origin-top bg-amber" />
            {items.map((m) => (
              <li key={m.year + m.title} data-item className="group relative pb-[8rem] pl-[6rem] last:pb-0 lg:pb-[14rem] lg:pl-[9rem]">
                {/* Milepost marker */}
                <span aria-hidden className="absolute left-0 top-[0.8rem] flex size-[2.5rem] items-center justify-center">
                  <span className="size-full rotate-45 border-2 border-ink/35 bg-concrete transition-colors duration-500 group-data-[active]:border-amber group-data-[active]:bg-amber" />
                </span>
                <p className="text-[6.4rem] font-medium leading-[0.9] tracking-[-0.04em] text-ink/50 transition-colors duration-500 group-data-[active]:text-ink lg:text-[12rem]">
                  {m.year}
                </p>
                <div className="mt-24 grid gap-24 md:grid-cols-[1fr_22rem] md:items-start lg:mt-40 lg:grid-cols-[1fr_28rem] lg:gap-40">
                  <div>
                    <h3 className="text-[2.6rem] font-medium leading-[1.05] lg:text-h6">{m.title}</h3>
                    <p className="mt-14 max-w-[44rem] text-16 text-body lg:text-18">{m.text}</p>
                    {m.invite && (
                      <p className="group/cone mt-30 flex max-w-[44rem] items-start gap-12 border-t border-ink/15 pt-20 text-16 text-body lg:mt-40">
                        <Cone className="mt-[0.1rem] size-[2.2rem] shrink-0 text-ink" />
                        <span>
                          {m.invite.text}{" "}
                          {/* The second cone travels with the link, so a wrap never leaves it stranded at a line end. */}
                          <span className="whitespace-nowrap">
                            <Cone className="mr-8 inline-block size-[2rem] -translate-y-[0.2rem] align-middle text-ink" />
                            <Button variant="link" href={m.invite.href}>
                              {m.invite.label}
                            </Button>
                          </span>
                        </span>
                      </p>
                    )}
                  </div>
                  <div data-media className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                    <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width: 1200px) 18vw, 60vw" className="object-cover grayscale transition-[filter] duration-700 group-data-[active]:grayscale-0" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
