"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { onLoaded } from "@/lib/scroll";

/**
 * A warning lamp drawn like one of the board LEDs: a hot core fading into an
 * amber lens, with a soft halo. Each time it scrolls into view (once the
 * loader has cleared) it pulses twice, slowly, then stays lit. Each run is
 * under five seconds, so it never blinks continuously (WCAG 2.2.2).
 * `lit={false}` shows it switched off (an unlit lens, no halo). Decorative.
 */
export function Lamp({ tone = "light", lit = true, className }: { tone?: "light" | "dark"; lit?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | undefined;
    const stop = onLoaded(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          // Leaving the viewport re-arms the lamp; coming back replays the pulses.
          el.toggleAttribute("data-on", entry.isIntersecting);
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(el);
    });
    return () => {
      stop();
      io?.disconnect();
    };
  }, []);

  return <span ref={ref} aria-hidden data-tone={tone} data-off={lit ? undefined : ""} className={cn("tc-beacon", className)} />;
}
