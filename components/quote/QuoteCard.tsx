"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useElementSize } from "@/lib/useElementSize";
import { services } from "@/content/quote";
import { Button } from "@/components/ui/Button";
import { lightField } from "@/components/quote/QuoteForm";
import { useQuote } from "@/components/providers/QuoteProvider";
import { ArrowRight } from "@/components/art/Icons";

const fieldLabel = "mb-8 block font-mono text-12 font-medium uppercase tracking-[0.1em] text-ink";

/** Corner cut and border inset, in rem: an octagon-cornered sign blank with an inset legend border. */
const CUT = 4;
const INSET = 1.2;

/**
 * A road sign that holds a form, drawn flat like the site's other sign art:
 * an amber blank with clipped (octagon) corners, a black inset border that
 * draws itself as the sign comes into view, and a square post
 * running down out of frame. The content fades in once the border has closed.
 */
export function SignCard({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const { w, h } = useElementSize(face);

  useGSAP(
    () => {
      if (!w || !h) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(q("[data-in]"), { opacity: 0, y: 20 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
        tl.from(q("[data-sign]"), { y: 60, duration: 1.1, ease: "expo.out" })
          .fromTo(q("[data-border]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "power2.inOut" }, 0.15)
          .to(q("[data-in]"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.75);
      });
    },
    { scope: root, dependencies: [w, h], revertOnUpdate: true },
  );

  // Inset border in real pixels, following the clipped corners (a 45° cut moves in by inset × tan 22.5°).
  let d = "";
  if (w && h && typeof window !== "undefined") {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
    const i = INSET * rem;
    const c = CUT * rem - i * Math.tan(Math.PI / 8);
    d = `M${i + c} ${i} H${w - i - c} L${w - i} ${i + c} V${h - i - c} L${w - i - c} ${h - i} H${i + c} L${i} ${h - i - c} V${i + c} Z`;
  }
  const clip = `polygon(${CUT}rem 0, calc(100% - ${CUT}rem) 0, 100% ${CUT}rem, 100% calc(100% - ${CUT}rem), calc(100% - ${CUT}rem) 100%, ${CUT}rem 100%, 0 calc(100% - ${CUT}rem), 0 ${CUT}rem)`;

  return (
    <div ref={root} id={id} className={cn("relative", className)}>
      <div data-sign className="relative">
        {/* Post: behind the sign, running down out of the section on desktop. */}
        <div aria-hidden className="absolute left-1/2 top-1/2 hidden h-[200vh] w-[1.4rem] -translate-x-1/2 bg-[#3a3d40] lg:block" />
        <div className="relative">
          <div ref={face} className="relative bg-amber text-ink" style={{ clipPath: clip }}>
            <svg aria-hidden viewBox={`0 0 ${w || 1} ${h || 1}`} className="pointer-events-none absolute inset-0 size-full">
              {d && <path data-border d={d} fill="none" stroke="#151515" strokeWidth={4} strokeLinejoin="miter" />}
            </svg>
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The quick-quote sign: service, start date and place; submitting opens the full quote form with these answers. */
export function QuoteCard({ submit, className }: { submit: string; className?: string }) {
  const quote = useQuote();
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [zip, setZip] = useState("");

  return (
    <SignCard id="quote" className={className}>
      <form
        aria-label="Quick quote"
        className="px-30 pb-[5rem] pt-[5.6rem] lg:px-[5.6rem] lg:pb-[6rem] lg:pt-[6.4rem]"
        onSubmit={(e) => {
          e.preventDefault();
          quote.open({ services: service ? [service] : [], startDate: date, location: zip }, service ? 1 : 0);
        }}
      >
        <p data-in className="text-center font-mono text-12 font-medium uppercase tracking-[0.16em]">
          Dispatch · Work order
        </p>
        <p data-in className="mt-12 text-center text-[3.4rem] font-semibold uppercase leading-[0.95] tracking-[-0.01em] lg:text-[4.4rem]">
          Request a crew
        </p>
        <div className="mt-30 grid gap-16 lg:mt-40">
          <label data-in className="block">
            <span className={fieldLabel}>Service</span>
            <span className="relative block">
              <select value={service} onChange={(e) => setService(e.target.value)} className={cn(lightField, "appearance-none border-ink/25 pr-50 lg:h-60")}>
                <option value="">Choose a service</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-20 top-1/2 h-8 w-12 -translate-y-1/2 text-ink">
                <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </label>
          <div data-in className="grid grid-cols-2 gap-10">
            <label className="block">
              <span className={fieldLabel}>Start date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(lightField, "border-ink/25 lg:h-60")} />
            </label>
            <label className="block">
              <span className={fieldLabel}>City or ZIP</span>
              <input value={zip} onChange={(e) => setZip(e.target.value)} autoComplete="postal-code" className={cn(lightField, "border-ink/25 lg:h-60")} />
            </label>
          </div>
          <div data-in className="pt-8">
            <Button type="submit" variant="dark" size="lg" arrow={false} className="w-full">
              {submit} <ArrowRight className="ml-10 inline-block size-18 align-[-0.2em] text-amber" />
            </Button>
          </div>
        </div>
      </form>
    </SignCard>
  );
}

/** Careers version: a NOW HIRING sign. */
export function ApplyCard({ className }: { className?: string }) {
  return (
    <SignCard id="apply" className={className}>
      <div className="px-30 pb-[5rem] pt-[5.6rem] text-center lg:px-[5.6rem] lg:pb-[6rem] lg:pt-[6.4rem]">
        <p data-in className="font-mono text-12 font-medium uppercase tracking-[0.16em]">
          Flaggers · Crew leads · Supervisors
        </p>
        <p data-in className="mt-16 text-[5.6rem] font-semibold uppercase leading-[0.9] tracking-[-0.01em] lg:text-[8rem]">
          Now
          <br />
          hiring
        </p>
        <p data-in className="mx-auto mt-24 max-w-[34rem] text-16 font-medium">
          No experience needed. Free certification, weekly pay from $18 an hour.
        </p>
        <div data-in className="mt-30">
          <Button size="lg" variant="dark" href={site.applyHref} external arrow={false} className="w-full">
            Apply on BambooHR <ArrowRight className="ml-10 inline-block size-18 align-[-0.2em] text-amber" />
          </Button>
        </div>
      </div>
    </SignCard>
  );
}
