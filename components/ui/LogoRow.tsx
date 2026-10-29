"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { logoBox, type Logo } from "@/lib/logos";

/**
 * Logos that flow from the left and wrap, filling each row. If the last row
 * would hold a single logo, the one before it moves down as well, so a wrapped
 * row always ends on at least two (4 + 2, never 5 + 1). Set `--logo` (optical
 * size), `--gap-x` and `--gap-y` on the list through `className`.
 */
export function LogoRow({ logos, className, imageClassName, sizes }: { logos: readonly Logo[]; className?: string; imageClassName?: string; sizes: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];
    const n = items.length;
    if (n < 3) return;
    // Logos are centred in their row, so a shared row means a shared vertical centre.
    const centre = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    };
    const fix = () => {
      const before = items[n - 3];
      before.style.marginInlineEnd = "";
      if (Math.abs(centre(items[n - 1]) - centre(items[n - 2])) < 2) return;
      // Fill the rest of this row with margin, so the next logo starts a new one beside the last.
      const space = list.getBoundingClientRect().right - before.getBoundingClientRect().right;
      before.style.marginInlineEnd = `${Math.max(0, space - 1)}px`;
    };
    fix();
    const ro = new ResizeObserver(fix);
    ro.observe(list);
    return () => ro.disconnect();
  }, [logos]);

  return (
    <ul ref={ref} className={cn("flex flex-wrap items-center gap-x-[var(--gap-x)] gap-y-[var(--gap-y)]", className)}>
      {logos.map((logo) => (
        <li key={logo.name} className="relative shrink-0" style={logoBox(logo)}>
          <Image src={logo.src} alt={logo.name} fill sizes={sizes} className={cn("object-contain", imageClassName)} />
        </li>
      ))}
    </ul>
  );
}
