"use client";

import { useEffect, useRef } from "react";
import { MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { LED, ledSprites } from "@/lib/led";

/**
 * Fade the board out well before its edges: a dark margin on every side and
 * an oval falloff, so the corners are fully dark and nothing reads as cut off.
 */
const FADE = [
  "radial-gradient(ellipse 64% 60% at 50% 46%, #000 34%, rgba(0,0,0,0.5) 64%, transparent 90%)",
  "linear-gradient(to right, transparent 0 5%, #000 28%, #000 72%, transparent 95% 100%)",
  "linear-gradient(to bottom, transparent 0 6%, #000 26%, #000 64%, transparent 90% 100%)",
].join(", ");

/** LED pitch and reach around the pointer, in rem. */
const PITCH = 1.8;
const REACH = 4.2;
/** Lit LEDs are drawn a little below full strength, so the board stays a backdrop. */
const LIT_ALPHA = 0.6;
/** Unlit lens radius: the boards draw it at 62% of a lens that fills 92% of the cell. */
const UNLIT_R = (PITCH * LED.size * 0.62) / 2;
const UNLIT = `radial-gradient(circle at center, ${LED.off} 0 ${UNLIT_R}rem, transparent calc(${UNLIT_R}rem + 0.5px))`;
/** Ripple (ms per px from the pointer) and how long a lamp stays on (ms); outer lamps go off first. */
const DELAY_PER_PX = 1.1;
const HOLD = 360;
const HOLD_LOSS_PER_PX = 2.2;

/** Stable 0–1 value per lamp, so the ragged edge of a lit patch doesn't flicker. */
const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * A board of unlit amber LEDs (the same LEDs as the message boards) behind its
 * children. Moving the pointer, or tabbing onto a child, switches the LEDs
 * around it on in a quick ripple, nearest first; each one pops off again a
 * moment later, outer ones first, so a resting pointer leaves the board dark.
 * Only runs while something is lit. Static under reduced motion.
 */
export function LightField({ children, className }: { children: React.ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ excite: (x: number, y: number) => void } | null>(null);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia(MQ.reduce).matches;

    let dpr = 1;
    let pitch = 16;
    let cols = 0;
    let rows = 0;
    let lit: HTMLCanvasElement | null = null;
    // Per LED: when it switches on (0 = not scheduled), when it switches off, and whether it's on.
    let onAt = new Float64Array(0);
    let offAt = new Float64Array(0);
    let on = new Uint8Array(0);
    const active = new Set<number>();
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (!lit) return;
      const pad = (pitch - lit.width) / 2;
      ctx.globalAlpha = LIT_ALPHA;
      for (const i of active) if (on[i]) ctx.drawImage(lit, (i % cols) * pitch + pad, Math.floor(i / cols) * pitch + pad);
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      // Same pitch as the CSS grid of unlit LEDs underneath, so lit and unlit line up.
      pitch = PITCH * rem * dpr;
      cv.width = Math.round(rect.width * dpr);
      cv.height = Math.round(rect.height * dpr);
      cols = Math.ceil(cv.width / pitch) + 1;
      rows = Math.ceil(cv.height / pitch) + 1;
      onAt = new Float64Array(cols * rows);
      offAt = new Float64Array(cols * rows);
      on = new Uint8Array(cols * rows);
      active.clear();
      ({ lit } = ledSprites(pitch));
      draw();
    };

    const tick = (now: number) => {
      for (const i of active) {
        if (onAt[i] && now >= onAt[i]) {
          on[i] = 1;
          onAt[i] = 0;
        }
        if (on[i] && now >= offAt[i]) on[i] = 0;
        if (!on[i] && !onAt[i]) active.delete(i);
      }
      draw();
      raf = active.size ? requestAnimationFrame(tick) : 0;
    };

    // Switch on the LEDs around a point (CSS px, relative to the field).
    const excite = (px: number, py: number) => {
      if (still || !cols) return;
      const x = px * dpr;
      const y = py * dpr;
      const reach = (REACH * pitch) / PITCH;
      const now = performance.now();
      const c0 = Math.max(0, Math.floor((x - reach) / pitch));
      const c1 = Math.min(cols - 1, Math.ceil((x + reach) / pitch));
      const r0 = Math.max(0, Math.floor((y - reach) / pitch));
      const r1 = Math.min(rows - 1, Math.ceil((y + reach) / pitch));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const d = Math.hypot(c * pitch + pitch / 2 - x, r * pitch + pitch / 2 - y);
          if (d > reach) continue;
          const i = r * cols + c;
          // Solid near the pointer, a ragged edge further out, like a board drawing a shape.
          const t = d / reach;
          if (t > 0.45 && hash(i) > (1 - t) * 1.6) continue;
          const css = d / dpr;
          const start = now + css * DELAY_PER_PX;
          if (!on[i]) onAt[i] = onAt[i] ? Math.min(onAt[i], start) : start;
          offAt[i] = Math.max(offAt[i], now + HOLD - css * HOLD_LOSS_PER_PX);
          active.add(i);
        }
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    api.current = { excite };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      api.current = null;
    };
  }, []);

  // Pointer moves leave a continuous trail: sample the path since the last event.
  const prev = useRef<{ x: number; y: number } | null>(null);
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = wrap.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const p = prev.current;
    const steps = p ? Math.min(6, Math.ceil(Math.hypot(x - p.x, y - p.y) / 30)) : 1;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      api.current?.excite(p ? p.x + (x - p.x) * t : x, p ? p.y + (y - p.y) * t : y);
    }
    prev.current = { x, y };
  };
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLElement) || !e.target.matches(":focus-visible")) return;
    const r = wrap.current!.getBoundingClientRect();
    const t = e.target.getBoundingClientRect();
    api.current?.excite(t.left + t.width / 2 - r.left, t.top + t.height / 2 - r.top);
  };

  return (
    <div ref={wrap} className={cn("relative", className)} onPointerMove={onPointerMove} onPointerLeave={() => (prev.current = null)} onFocusCapture={onFocus}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: FADE, WebkitMaskImage: FADE, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      >
        {/* Unlit LEDs: a crisp CSS grid on the same pitch as the canvas cells. */}
        <span className="absolute inset-0 opacity-45" style={{ backgroundImage: UNLIT, backgroundSize: `${PITCH}rem ${PITCH}rem` }} />
        <canvas ref={canvas} className="absolute inset-0 size-full" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
