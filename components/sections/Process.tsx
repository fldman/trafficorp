"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/ui/Mark";

type Media = { kind: "ticket" } | { kind: "photo"; src: string; alt: string };
type Step = { title: string; text: string; media: Media };

type ProcessProps = {
  id?: string;
  label: string;
  title: string;
  mark?: string;
  steps: readonly Step[];
};

/** Illustrative dispatch ticket for step one. */
function TicketPlate() {
  const rows: Array<[string, string]> = [
    ["Service", "Flagging + pilot car"],
    ["Location", "Your road, city or ZIP"],
    ["Start", "Tomorrow, 06:00"],
    ["Crew", "Confirmed by dispatch"],
  ];
  return (
    <div className="flex h-full items-center justify-center bg-amber p-[8%]">
      <div className="w-full max-w-[38rem] bg-white font-mono text-ink shadow-[0_2.4rem_5rem_-2rem_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-dashed border-ink/25 px-20 py-14 text-12 tracking-[0.08em]">
          <span>DISPATCH · WORK ORDER</span>
          <span aria-hidden>◆</span>
        </div>
        <dl className="px-20 py-10 text-12">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-16 border-b border-ink/10 py-8 last:border-0">
              <dt className="w-[8rem] shrink-0 uppercase text-label">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-dashed border-ink/25 px-20 py-12 text-12">{site.phone.display}</p>
      </div>
    </div>
  );
}

/**
 * Pinned process: the section holds while the step cards slide sideways and
 * a small step indicator opposite the heading fills one lane dash per step.
 * Each step has a stop: the first card lines
 * up with the heading, the last ends flush with the content's right edge, and the track rests at each
 * stop before moving on. Mobile and reduced motion show the steps as a list.
 */
export function Process({ id, label, title, mark, steps }: ProcessProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const frame = q("[data-frame]")[0] as HTMLElement;
        const cards = q("[data-step]") as HTMLElement[];
        const count = q("[data-current]")[0] as HTMLElement;
        const name = q("[data-current-name]")[0] as HTMLElement;
        const dashes = q("[data-dash]") as HTMLElement[];
        const n = cards.length;
        let active = -1;

        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          count.textContent = String(i + 1).padStart(2, "0");
          name.textContent = steps[i].title;
          cards.forEach((c, j) => c.toggleAttribute("data-active", j === i));
        };
        setActive(0);

        // Track offset that brings card i to its stop: the track rests on the content's left
        // edge (CSS padding on the viewport, the same maths as Container), and the last card
        // ends on its right edge. The width comes from the heading's container, not the
        // window: above 2400px the content column stops growing and centres, and on
        // ultra-wide screens the window is wider than the whole track.
        const stopX = (i: number) => {
          const cs = getComputedStyle(frame);
          const width = frame.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          return (width - cards[i].offsetWidth) * (i / (n - 1)) - cards[i].offsetLeft;
        };

        // One time unit per step: card i is active over [i, i + 1) and arrives at i + 0.5.
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1, immediateRender: false },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          },
        });
        gsap.set(track, { x: 0 });
        gsap.set(dashes, { scaleX: 0 });
        for (let i = 1; i < n; i++) tl.fromTo(track, { x: () => stopX(i - 1) }, { x: () => stopX(i) }, i - 0.5);
        // Each lane dash fills while its step is on screen.
        dashes.forEach((dash, i) => tl.fromTo(dash, { scaleX: 0 }, { scaleX: 1, ease: "none" }, i));
        tl.to({}, { duration: 0.5 }, n - 0.5); // rest on the last step
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} data-header="dark" className="on-dark relative bg-asphalt text-white motion-safe:lg:h-[500vh]">
      <div className="py-[8.4rem] motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:flex motion-safe:lg:h-svh motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:overflow-hidden motion-safe:lg:py-0 motion-safe:lg:pt-[9rem]">
        <Container data-frame>
          <div className="lg:flex lg:items-end lg:justify-between">
            <div>
              <SectionLabel tone="dark">
                {label}
              </SectionLabel>
              <Reveal as="h2" className="mt-20 max-w-[16ch] text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:text-h3 lg:leading-none">
                {title} {mark && <Mark>{mark}</Mark>}
              </Reveal>
            </div>
            {/* Progress: the current step, and one lane dash per step that fills as you go. */}
            <div aria-hidden className="mt-30 hidden w-[32rem] motion-safe:lg:block">
              <p className="flex items-baseline justify-between gap-20 font-mono text-12 uppercase tracking-[0.12em] text-white/70 lg:text-13">
                <span>
                  Step <span data-current className="text-amber">01</span> / {String(steps.length).padStart(2, "0")}
                </span>
                <span data-current-name className="truncate text-white">
                  {steps[0].title}
                </span>
              </p>
              <span className="mt-14 flex gap-8">
                {steps.map((s) => (
                  <span key={s.title} className="relative h-3 flex-1 bg-white/15">
                    <span data-dash className="absolute inset-0 origin-left bg-amber" />
                  </span>
                ))}
              </span>
            </div>
          </div>
        </Container>

        {/* Desktop: the padding puts the track on the content's left edge (centred 192rem column + 6rem gutter). */}
        <div className="mt-50 lg:mt-[8rem] lg:overflow-visible motion-safe:lg:pl-[calc(max(0px,(100%_-_192rem)_/_2)_+_6rem)]">
          <ol
            data-track
            className="relative mx-auto flex w-full max-w-[192rem] flex-col gap-60 px-20 lg:px-60 motion-safe:lg:mx-0 motion-safe:lg:w-max motion-safe:lg:max-w-none motion-safe:lg:flex-row motion-safe:lg:px-0 motion-safe:lg:gap-20 motion-safe:lg:will-change-transform motion-reduce:lg:grid motion-reduce:lg:grid-cols-3 motion-reduce:lg:gap-x-20"
          >
            {steps.map((s, i) => (
              <li key={s.title} data-step data-active={i === 0 || undefined} className="group/step motion-safe:lg:w-[48rem] motion-safe:lg:shrink-0">
                <div className={cn(
                    "relative aspect-[4/3] overflow-hidden bg-tile transition-[opacity,filter] duration-500",
                    "motion-safe:lg:opacity-50 motion-safe:lg:grayscale motion-safe:lg:group-data-[active]/step:opacity-100 motion-safe:lg:group-data-[active]/step:grayscale-0",
                  )}>
                  {s.media.kind === "ticket" ? (
                    <TicketPlate />
                  ) : (
                    <Image src={s.media.src} alt={s.media.alt} fill sizes="(min-width: 1200px) 28vw, 90vw" className="object-cover" />
                  )}
                </div>
                <div className="mt-24 flex items-baseline gap-16 lg:mt-30">
                  <span className="font-mono text-14 text-amber">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[2.6rem] font-medium leading-[1.05] tracking-[-0.01em] lg:text-h6">{s.title}</h3>
                </div>
                <p className="mt-14 max-w-[42rem] text-16 text-white/75 lg:ml-[3.6rem]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
