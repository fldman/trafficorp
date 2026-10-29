"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ, type ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { logoBox, type Logo } from "@/lib/logos";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { TRUCK, Truck } from "@/components/art/Truck";
import { useQuote } from "@/components/providers/QuoteProvider";

type LogoDriveProps = {
  id?: string;
  label: string;
  title: string;
  cta?: string;
  logos: readonly Logo[];
  truckAlt: string;
};

/** Where the rear tyre meets the road, as a share of the truck's width: the line is painted from there. */
const REAR_WHEEL = TRUCK.wheels[1].cx / TRUCK.w;
const LANE =
  "repeating-linear-gradient(90deg, #f79521 0 2.4rem, transparent 2.4rem 4rem)";

/**
 * Dark logo section. It opens on the heading, the button and the truck; as
 * you scroll, the truck drives off to the left, painting The Line from under its rear tyre,
 * and each logo rises into place once the truck's tail has passed it.
 * Desktop holds the section (CSS sticky) for the drive; mobile scrubs it as it scrolls by.
 * Reduced motion shows the finished row without the truck.
 */
export function LogoDrive({
  id,
  label,
  title,
  cta,
  logos,
  truckAlt,
}: LogoDriveProps) {
  const root = useRef<HTMLElement>(null);
  const quote = useQuote();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const truck = q("[data-truck]")[0] as HTMLElement;
      const lane = q("[data-lane]")[0] as HTMLElement;
      const road = q("[data-road]")[0] as HTMLElement;
      const items = q("[data-logo]") as HTMLElement[];
      const wheels = q("[data-wheel]") as HTMLElement[];

      const drive = (trigger: ScrollTrigger.Vars) => {
        // Geometry in px, re-measured on every refresh.
        let g = { sw: 1, tw: 1, start: 0, end: 0, centres: [] as number[] };
        const measure = () => {
          const s = stage.getBoundingClientRect();
          const sw = stage.clientWidth;
          const tw = truck.offsetWidth;
          g = {
            sw,
            tw,
            start: sw - tw,
            end: -tw - sw * 0.06,
            centres: items.map((el) => {
              const r = el.getBoundingClientRect();
              return r.left + r.width / 2 - s.left;
            }),
          };
        };
        const shown = items.map(() => false);
        const state = { p: 0 };
        const render = () => {
          const x = g.start + (g.end - g.start) * state.p;
          const rear = x + g.tw;
          const brush = x + g.tw * REAR_WHEEL;
          gsap.set(truck, { x });
          // Rims turn by the distance driven: arc length / tyre radius, anticlockwise.
          wheels.forEach((w) =>
            gsap.set(w, {
              rotation:
                (-(g.start - x) / (Number(w.dataset.tyre) * g.tw)) *
                (180 / Math.PI),
            }),
          );
          // The Line comes out from under the rear tyre and replaces the grey road edge as it goes.
          const painted = gsap.utils.clamp(0, 100, (brush / g.sw) * 100);
          lane.style.clipPath = `inset(0 0 0 ${painted}%)`;
          road.style.clipPath = `inset(0 ${100 - painted}% 0 0)`;
          items.forEach((el, i) => {
            const on = rear < g.centres[i];
            if (on === shown[i]) return;
            shown[i] = on;
            gsap.to(el, {
              opacity: on ? 1 : 0,
              y: on ? 0 : 18,
              duration: on ? 0.7 : 0.3,
              ease: on ? "expo.out" : "power2.in",
              overwrite: true,
            });
          });
        };

        gsap.set(items, { opacity: 0, y: 18 });
        measure();
        render();
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            ...trigger,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: () => (measure(), render()),
          },
        });
      };

      const mm = gsap.matchMedia();
      // Desktop holds the stage with CSS sticky (like How it works) while the section scrolls past.
      mm.add(MQ.desktop, () =>
        drive({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
        }),
      );
      mm.add(MQ.mobile, () =>
        drive({ trigger: stage, start: "top 85%", end: "bottom 20%" }),
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={id}
      data-header="dark"
      className="on-dark relative bg-asphalt text-white motion-safe:lg:h-[270vh]"
    >
      <div className="overflow-hidden py-[8.4rem] motion-safe:lg:sticky motion-safe:lg:top-0 motion-safe:lg:flex motion-safe:lg:h-svh motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:py-0 motion-safe:lg:pt-[8rem] lg:py-[16rem]">
        <Container className="text-center">
          <SectionLabel tone="dark" className="justify-center">
            {label}
          </SectionLabel>
          <Reveal
            as="h2"
            className="mx-auto mt-20 max-w-[34rem] text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:max-w-[72rem] lg:text-h3 lg:leading-none"
          >
            {title}
          </Reveal>
          {cta && (
            <div className="mt-30 flex justify-center lg:mt-40">
              <Button size="lg" onClick={() => quote.open()}>
                {cta}
              </Button>
            </div>
          )}
        </Container>

        <Container>
          {/* Below desktop the room above the road is sized to the truck (its part above the road is 38.75% of its width), so it never reaches the button. */}
          <div data-stage className="relative mt-60 pt-[max(4rem,calc(22%-9rem))] md:pt-[max(4rem,calc(19%-9rem))] lg:mt-[7rem] lg:pt-[15rem]">
            {/* One row, raised to the height of the truck's body so the truck hides it as it passes. */}
            <ul className="mb-[1.4rem] grid grid-cols-3 items-center justify-items-center gap-x-16 gap-y-12 [--logo:3.2rem] lg:mb-[6rem] lg:h-[6rem] lg:grid-cols-6 lg:gap-x-20 lg:[--logo:5.2rem]">
              {logos.map((logo) => (
                <li
                  key={logo.name}
                  data-logo
                  className="relative"
                  style={logoBox(logo)}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    sizes="(min-width: 1200px) 110px, 90px"
                    className="object-contain brightness-0 invert"
                  />
                </li>
              ))}
            </ul>

            {/* The grey road edge ahead of the truck, and The Line painted behind it (finished by default). */}
            <div aria-hidden className="relative h-px">
              <span data-road className="absolute inset-0 bg-white/15" style={{ clipPath: "inset(0 100% 0 0)" }} />
              <span
                data-lane
                className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 lg:h-4"
                style={{ backgroundImage: LANE }}
              />
            </div>

            <div
              data-truck
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 w-[56%] will-change-transform motion-reduce:hidden md:w-[48%] lg:w-[60rem]",
              )}
            >
              <Truck alt={truckAlt} sizes="(min-width: 1200px) 45vw, 56vw" />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
