"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { onLoaded } from "@/lib/scroll";

type Mode = "lines" | "fade";

type RevealProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  /** "lines": each line slides up out of a mask (headings). "fade": lines rise and fade (body copy). */
  mode?: Mode;
  /** "scroll" waits for the element to enter the viewport; "load" waits for the preloader. */
  trigger?: "scroll" | "load";
  delay?: number;
  start?: string;
  id?: string;
};

/** Splits text into lines and reveals them on scroll. Static when reduced motion is on. */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  mode = "lines",
  trigger = "scroll",
  delay = 0,
  start = "top 88%",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let played = false;
        let current: gsap.core.Timeline | null = null;
        const play = () => {
          played = true;
          current?.play();
        };

        const split = SplitText.create(el, {
          type: "lines",
          mask: mode === "lines" ? "lines" : undefined,
          autoSplit: true,
          // Keep a screen-reader copy of the text instead of an aria-label, which isn't allowed on a <p> or <div>.
          aria: "hidden",
          onSplit(self) {
            self.masks?.forEach((m) => m.classList.add("split-mask"));
            const from =
              mode === "lines"
                ? { yPercent: 105, duration: 1.25, stagger: 0.09, ease: "expo.out" }
                : { yPercent: 40, opacity: 0, duration: 1, stagger: 0.07, ease: "power3.out" };
            // A re-split (fonts arriving, a resize) moves this timeline to where the old one had got to.
            // Once play() has fired it must keep running from there, or the lines freeze half inside their masks.
            current = gsap.timeline({ paused: !played, delay });
            current.from(self.lines, from, 0);
            // Sign marks wipe in once their line has arrived. The letters start in the
            // heading's own colour (white on dark sections) and turn ink as the amber passes under them.
            const marks = el.querySelectorAll(".tc-mark");
            if (marks.length) {
              gsap.set(marks, { "--mark-from": getComputedStyle(el).color });
              current.fromTo(
                marks,
                { backgroundSize: "0% 100%", "--mark-p": "0%" },
                { backgroundSize: "100% 100%", "--mark-p": "100%", duration: 0.9, stagger: 0.08, ease: "expo.inOut" },
                0.45,
              );
            }
            return current;
          },
        });

        let stopWaiting = () => {};
        let st: ScrollTrigger | undefined;
        if (trigger === "load") stopWaiting = onLoaded(play);
        else st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });

        return () => {
          stopWaiting();
          st?.kill();
          split.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
