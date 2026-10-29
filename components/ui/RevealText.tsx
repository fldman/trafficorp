"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Statement paragraph whose words turn from grey to ink as you scroll through it. */
export function RevealText({
  children,
  className,
  tone = "light",
}: {
  children: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(el, { type: "words", wordsClass: "will-change-[color]", aria: "hidden" });
        gsap.fromTo(
          split.words,
          { color: tone === "light" ? "#8c8c8c" : "rgba(255,255,255,.45)" },
          {
            color: tone === "light" ? "#151515" : "#ffffff",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
          },
        );
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={cn("text-24 font-medium leading-[1.2] lg:text-36", className)}>
      {children}
    </p>
  );
}
