"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onLoaded } from "@/lib/scroll";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/ui/Mark";
import { Button } from "@/components/ui/Button";
import { useQuote } from "@/components/providers/QuoteProvider";
import { LogoRow } from "@/components/ui/LogoRow";
import type { Logo } from "@/lib/logos";


type HeroProps = {
  title: readonly string[];
  /** Index of the title line that gets the sign mark. */
  markLine?: number;
  subline: string;
  image: { src: string; alt: string };
  logosLabel: string;
  logos: readonly Logo[];
};

/** Full-height hero: photo, headline, CTA, ruled trust bar. */
export function Hero({ title, markLine = title.length - 1, subline, image, logosLabel, logos }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const quote = useQuote();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(q("[data-hero-bg]"), { scale: 1.3 });
        gsap.set(q("[data-hero-meta]"), { opacity: 0, y: 24 });
        gsap.set(q("[data-hero-rule]"), { scaleX: 0 });

        const intro = gsap.timeline({ paused: true });
        intro.to(q("[data-hero-bg]"), { scale: 1.12, duration: 2.4, ease: "expo.out" }, 0);
        intro.to(q("[data-hero-rule]"), { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.5);
        intro.to(q("[data-hero-meta]"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, ease: "power3.out" }, 0.7);
        const stop = onLoaded(() => intro.play());

        // Scroll-out parallax: the photo lags while the copy lifts away.
        const out = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(q("[data-hero-parallax]"), { yPercent: 18, ease: "none", scrollTrigger: out });
        gsap.to(q("[data-hero-content]"), { yPercent: -10, opacity: 0.15, ease: "none", scrollTrigger: out });
        return stop;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="dark" className="relative flex h-svh min-h-[72rem] flex-col overflow-hidden bg-asphalt text-white md:h-auto md:min-h-svh lg:h-svh lg:min-h-[80rem]">
      <div data-hero-parallax className="absolute inset-0 will-change-transform">
        <div data-hero-bg className="absolute inset-0 origin-center scale-[1.12] will-change-transform">
          <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,6,8,0.94)_0%,rgba(4,6,8,0.45)_42%,rgba(4,6,8,0.5)_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,6,8,0.7)_0%,rgba(4,6,8,0)_58%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[24rem] bg-[linear-gradient(to_bottom,rgba(4,6,8,0.78),rgba(4,6,8,0))]" />

      {/* Scroll cue: lane dashes running down. */}
      <div aria-hidden data-hero-meta className="absolute bottom-[22rem] right-60 hidden flex-col items-center gap-14 lg:flex">
        <span className="font-mono text-12 uppercase tracking-[0.2em] text-white/70 [writing-mode:vertical-rl]">Scroll</span>
        <span className="tc-lane-cue block h-[9rem] w-2 text-amber" />
      </div>

      {/* On tablets the hero is at least a screen tall and grows if its content needs more, so the headline never slides under the header. */}
      <Container className="relative z-10 flex flex-1 flex-col justify-end pb-24 md:pt-[12rem] lg:pb-40 lg:pt-0">
        <div data-hero-content className="will-change-transform">
          <Reveal as="h1" trigger="load" delay={0.15} className="max-w-[17ch] text-[4.8rem] font-medium leading-[0.98] tracking-[-0.025em] md:text-[min(4.8rem,8.6svh)] lg:text-h1 lg:leading-[0.96]">
            {title.map((line, i) => (
              <span key={line} className="block">
                {i === markLine ? <Mark>{line}</Mark> : line}
              </span>
            ))}
          </Reveal>

          <div className="mt-30 flex flex-wrap items-center gap-x-30 gap-y-16 md:mt-24 lg:mt-50">
            <span data-hero-meta>
              <Button size="lg" onClick={() => quote.open()}>
                Get a quote
              </Button>
            </span>
            <span data-hero-meta>
              <Button variant="link" href={site.phone.href} className="!text-white">
                Call dispatch {site.phone.display}
              </Button>
            </span>
          </div>

          <div className="relative mt-40 pt-24 md:mt-24 md:pt-20 lg:mt-[7rem] lg:pt-30">
            <span aria-hidden data-hero-rule className="absolute inset-x-0 top-0 h-px origin-left bg-white/25" />
            <div className="grid gap-24 lg:grid-cols-16 lg:items-end lg:gap-x-20">
              <div data-hero-meta className="lg:col-span-9">
                <p className="font-mono text-12 uppercase tracking-[0.12em] text-white/70">{logosLabel}</p>
                <LogoRow
                  logos={logos}
                  sizes="(min-width: 1200px) 110px, 90px"
                  imageClassName="brightness-0 invert"
                  className="mt-12 [--gap-x:2.4rem] [--gap-y:1.6rem] [--logo:3.2rem] sm:[--gap-x:2.8rem] lg:mt-20 lg:[--gap-x:4rem] lg:[--logo:5.6rem]"
                />
              </div>
              <p data-hero-meta className="max-w-[52rem] text-pretty text-16 text-white/80 lg:col-span-6 lg:col-start-11 lg:text-18">
                {subline}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
