"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { PlusTile } from "@/components/ui/PlusTile";

/** `still` figures (years, codes) are shown as-is instead of counting up. */
export type Stat = { value: number; suffix?: string; prefix?: string; label: string; still?: boolean };

/**
 * Hairline grid of big figures that count up when they enter. Screen readers
 * get the final figure straight away; the counting copy is aria-hidden.
 */
export function StatGrid({ stats, columns = 2, tone = "light", className }: { stats: readonly Stat[]; columns?: 2 | 3 | 4; tone?: "light" | "dark"; className?: string }) {
  const root = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-count]", root.current).forEach((el) => {
          const target = Number(el.dataset.count);
          const obj = { v: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.v));
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <dl
      ref={root}
      className={cn(
        "grid border-t",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
        tone === "light" ? "border-ink/15" : "border-white/20",
        className,
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className={cn("flex flex-col-reverse justify-end border-b py-24 pr-20 lg:py-30", tone === "light" ? "border-ink/15" : "border-white/20")}>
          <dt className={cn("mt-10 font-mono text-12 uppercase tracking-[0.1em]", tone === "light" ? "text-label" : "text-white/70")}>{s.label}</dt>
          <dd className="text-[4.4rem] font-medium leading-none tracking-[-0.03em] lg:text-h4">
            <span className="sr-only">
              {s.prefix}
              {s.value}
              {s.suffix}
            </span>
            {/* A "+" becomes the amber sign tile used on the homepage figures; other suffixes stay as text. */}
            <span aria-hidden className="inline-flex items-start">
              {s.prefix}
              <span data-count={s.still ? undefined : s.value}>{s.value}</span>
              {s.suffix === "+" ? <PlusTile /> : s.suffix && <span className={tone === "light" ? "text-ink" : "text-amber"}>{s.suffix}</span>}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
