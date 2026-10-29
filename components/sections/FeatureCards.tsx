"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Container, Grid } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/ui/Mark";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { logoBox, type Logo } from "@/lib/logos";
import { PlusTile } from "@/components/ui/PlusTile";

type Item = { value: number; suffix?: string; title: string; text: string };

type FeatureCardsProps = {
  id?: string;
  label: string;
  accent: string;
  title: string;
  intro?: string;
  image: { src: string; alt: string };
  items: readonly Item[];
  /** Certifications shown on a plate that overhangs the photo's top-right corner. */
  certs?: { names: readonly string[]; label: string; logos: readonly Logo[] };
};

/**
 * "Why TraffiCorp": the claim, then the proof as oversized figures that count
 * up as they scroll into view, set flush right against their text; a "+" is a
 * small amber sign tile, like the sign marks. The crew photo sits on the right
 * with a gentle parallax, and the certification plate overhanging its
 * bottom-right corner drifts at its own, slower rate. Screen readers get each
 * final figure.
 */
export function FeatureCards({ id, label, accent, title, intro, image, items, certs }: FeatureCardsProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The certification plate drifts against the photo, a slower second layer.
        const plate = root.current?.querySelector<HTMLElement>("[data-cert]");
        if (plate) {
          const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
          gsap.fromTo(
            plate,
            { y: () => 5 * rem() },
            { y: () => -5 * rem(), ease: "none", scrollTrigger: { trigger: plate.parentElement, start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true } },
          );
        }
        gsap.utils.toArray<HTMLElement>("[data-row]", root.current).forEach((row) => {
          const figure = row.querySelector<HTMLElement>("[data-count]");
          const target = Number(figure?.dataset.count ?? 0);
          const n = { v: 0 };
          if (figure) figure.textContent = "0";
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } });
          tl.from(row, { opacity: 0, y: 40, duration: 1, ease: "expo.out" }).to(
            n,
            { v: target, duration: 1.8, ease: "expo.out", onUpdate: () => figure && (figure.textContent = String(Math.round(n.v))) },
            0.1,
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} data-header="light" className="relative bg-white py-[8.4rem] lg:py-[18rem]">
      <Container>
        <Grid className="gap-y-60">
          <div className="lg:col-span-8">
            <SectionLabel>{label}</SectionLabel>
            <Reveal as="h2" className="mt-20 text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:max-w-[64rem] lg:text-h3 lg:leading-none">
              <Mark>{accent}</Mark> {title}
            </Reveal>
            {intro && <p className="mt-24 max-w-[48rem] text-18 text-body lg:mt-30 lg:text-20">{intro}</p>}

            <ol className="mt-60 border-t border-ink/15 lg:mt-[8rem]">
              {items.map((item) => (
                <li key={item.title} data-row className="grid gap-16 border-b border-ink/15 py-30 sm:grid-cols-[22rem_1fr] sm:items-center sm:gap-30 lg:grid-cols-[30rem_1fr] lg:gap-50 lg:py-50">
                  <p aria-hidden className="flex items-start whitespace-nowrap text-[8.4rem] font-medium leading-[0.85] tracking-[-0.05em] tabular-nums sm:justify-end lg:text-[11.2rem]">
                    <span data-count={item.value}>{item.value}</span>
                    {item.suffix && <PlusTile />}
                  </p>
                  <div>
                    <h3 className="text-[2.4rem] font-medium leading-[1.1] tracking-[-0.01em] lg:text-28">
                      <span className="sr-only">
                        {item.value}
                        {item.suffix}{" "}
                      </span>
                      {item.title}
                    </h3>
                    <p className="mt-10 max-w-[50rem] text-16 text-body lg:text-18">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7 lg:col-start-10 lg:row-start-1">
            <div className="relative lg:mt-[6rem]">
              <ParallaxImage src={image.src} alt={image.alt} sizes="(min-width: 1200px) 42vw, 100vw" position="60% 92%" amount={5} lift={3} className="aspect-[4/5] w-full" />
              {certs && (
                <div data-cert className="absolute -bottom-[2rem] right-0 will-change-transform bg-night px-24 pb-24 pt-20 text-white lg:-bottom-[3.2rem] lg:-right-[3.2rem] lg:px-30 lg:pb-30 lg:pt-24">
                  <p className="font-mono text-12 uppercase tracking-[0.12em] text-white/75 lg:text-13">
                    {certs.names.map((n, i) => (
                      <span key={n}>
                        {i > 0 && " & "}
                        <span className="font-semibold text-amber">{n}</span>
                      </span>
                    ))}{" "}
                    {certs.label}
                  </p>
                  <ul className="mt-16 flex items-center gap-x-30 [--logo:3.8rem] lg:[--logo:4.6rem]">
                    {certs.logos.map((logo) => (
                      <li key={logo.name} className="relative" style={logoBox(logo)}>
                        <Image src={logo.src} alt={logo.name} fill sizes="120px" className="object-contain" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
