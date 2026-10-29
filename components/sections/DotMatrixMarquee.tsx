"use client";

import { useEffect, useRef, useState } from "react";
import { GLYPH_H, textToColumns } from "@/lib/dotFont";
import { cn } from "@/lib/cn";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { ledSprites } from "@/lib/led";

type Props = {
  text: string;
  /** Dot columns advanced per second. Real message boards step, they don't glide. */
  speed?: number;
  color?: string;
  href?: string;
  label?: string;
  className?: string;
};

/**
 * Full-width band drawn like a portable changeable message sign: an amber
 * dot matrix that steps the message across one column at a time. It holds
 * still while the pointer is over it or it has keyboard focus; the pause
 * control only shows when tabbed to. Stays still with reduced motion.
 */
export function DotMatrixMarquee({ text, speed = 14, color = "#f79521", href, label, className }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const holdRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const columns = textToColumns(text);
    const rows = GLYPH_H + 2; // one blank row of dots above and below
    let pitch = 0;
    let visible = 0;
    let offset = 0;
    let lit: HTMLCanvasElement;
    let dim: HTMLCanvasElement;

    const draw = () => {
      ctx.clearRect(0, 0, el.width, el.height);
      const n = columns.length;
      const size = lit.width;
      const pad = (pitch - size) / 2;
      for (let c = 0; c < visible; c++) {
        const mask = columns[(((c + offset) % n) + n) % n];
        for (let r = 0; r < rows; r++) {
          const on = r > 0 && r <= GLYPH_H && mask & (1 << (r - 1));
          ctx.drawImage(on ? lit : dim, c * pitch + pad, r * pitch + pad);
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = el.getBoundingClientRect();
      pitch = (rect.height / rows) * dpr;
      el.width = Math.round(rect.width * dpr);
      el.height = Math.round(rect.height * dpr);
      visible = Math.ceil(el.width / pitch) + 1;
      ({ lit, dim } = ledSprites(pitch, color));
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let last = 0;
    let acc = 0;
    let inView = false;
    const step = 1000 / speed;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!inView || pausedRef.current || holdRef.current) {
        last = t;
        return;
      }
      acc += t - (last || t);
      last = t;
      if (acc >= step) {
        offset += Math.floor(acc / step);
        acc %= step;
        draw();
      }
    };
    const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
    io.observe(el);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [text, speed, color]);

  const Tag = href ? "a" : "div";
  return (
    <div
      className={cn("relative bg-night", className)}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") holdRef.current = true;
      }}
      onPointerLeave={() => (holdRef.current = false)}
      onFocus={() => (holdRef.current = true)}
      onBlur={() => (holdRef.current = false)}
    >
      <Tag {...(href ? { href } : {})} aria-label={label ?? text} className="block pt-[2.4rem] lg:pt-[4rem]">
        <canvas ref={canvas} aria-hidden className="block h-[7.2rem] w-full lg:h-[12rem]" />
      </Tag>
      {/* Kept for keyboard and screen-reader users (WCAG 2.2.2); it appears only when focused. */}
      <MotionToggle
        paused={paused}
        onToggle={() => setPaused((p) => !p)}
        label="message board"
        tone="dark"
        className="pointer-events-none absolute bottom-10 right-20 opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100 motion-reduce:hidden lg:bottom-16 lg:right-60"
      />
    </div>
  );
}
