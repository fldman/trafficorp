"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Photo in a fixed frame. The frame wipes open from the bottom when it enters,
 * then the image drifts inside it while you scroll. With `lift`, the frame
 * itself also rises slightly against the page for a second layer of depth.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1200px) 30vw, 100vw",
  amount = 8,
  preload,
  position,
  lift,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  amount?: number;
  preload?: boolean;
  /** CSS object-position for the crop, e.g. "50% 80%". */
  position?: string;
  /** How far the frame itself travels, in rem either side of its place. */
  lift?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          frame.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: frame.current, start: "top 92%", once: true },
          },
        );
        gsap.fromTo(
          inner.current,
          { yPercent: -amount, scale: 1.18 },
          {
            yPercent: amount,
            scale: 1.18,
            ease: "none",
            // A short scrub lag keeps the drift soft instead of locked to the wheel.
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
        if (lift) {
          const px = () => lift * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 10);
          gsap.fromTo(
            frame.current,
            { y: () => px() },
            { y: () => -px(), ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true } },
          );
        }
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={cn("relative overflow-hidden bg-concrete", className)}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={position ? { objectPosition: position } : undefined} preload={preload} />
      </div>
    </div>
  );
}
