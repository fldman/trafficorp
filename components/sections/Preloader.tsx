"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { lockScroll, markLoaded, unlockScroll } from "@/lib/scroll";
import { GLYPH_H, textToColumns } from "@/lib/dotFont";
import { ledSprites } from "@/lib/led";

const STAGES = ["PLANNING", "SIGNING", "STAFFING"];
const COLS = 57; // 9 characters + margins
const ROWS = 19; // two 7-dot lines, a gap and margins
/** The frosted layer is one element (two would blur each other along the middle); the exit opens a gap from the centre outwards. */
const parted = (gap: number) =>
  `polygon(0% 0%, 100% 0%, 100% ${50 - gap}%, 0% ${50 - gap}%, 0% ${50 + gap}%, 100% ${50 + gap}%, 100% 100%, 0% 100%)`;

/**
 * First-load screen: a portable message sign on a dark plate, floating over a
 * heavily blurred and darkened view of the page underneath. Amber
 * dots run the deployment sequence over a counter; at 100% the board reads
 * ROAD OPEN, fades, and the screen parts down the middle.
 * Lives in the root layout, so it plays once, and only when the visit starts on
 * the homepage. Other entry pages and in-site navigation never show it.
 */
export function Preloader() {
  const pathname = usePathname();
  // Frozen at mount: later navigation must not bring the screen back.
  const [home] = useState(() => pathname === "/");
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      if (!home) {
        markLoaded();
        return;
      }
      const el = root.current!;
      if (window.matchMedia(MQ.reduce).matches) {
        el.style.display = "none";
        markLoaded();
        return;
      }

      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      lockScroll();
      // Keep keyboard focus out of the page underneath while the board is up.
      const behind = Array.from(document.body.children).filter((n) => n !== el && !n.contains(el)) as HTMLElement[];
      behind.forEach((n) => n.setAttribute("inert", ""));

      const q = gsap.utils.selector(el);
      const frost = el.querySelector<HTMLElement>("[data-frost]")!;
      const cv = canvas.current!;
      const ctx = cv.getContext("2d")!;
      let pitch = 0;
      let lit: HTMLCanvasElement | null = null;
      let dim: HTMLCanvasElement | null = null;
      let lines: [string, string] = [STAGES[0], "0%"];
      let on = true;
      let cancelled = false;

      const draw = () => {
        if (!lit || !dim) return;
        ctx.clearRect(0, 0, cv.width, cv.height);
        const rendered = lines.map((t) => {
          const cols = textToColumns(t);
          cols.pop(); // trailing spacer
          return { cols, start: Math.floor((COLS - cols.length) / 2) };
        });
        const size = lit.width;
        const pad = (pitch - size) / 2;
        for (let c = 0; c < COLS; c++) {
          for (let r = 0; r < ROWS; r++) {
            let isLit = false;
            const line = r >= 2 && r < 2 + GLYPH_H ? 0 : r >= 10 && r < 10 + GLYPH_H ? 1 : -1;
            if (on && line >= 0) {
              const { cols, start } = rendered[line];
              const mask = cols[c - start];
              const row = r - (line === 0 ? 2 : 10);
              isLit = !!mask && (mask & (1 << row)) !== 0;
            }
            ctx.drawImage(isLit ? lit : dim, c * pitch + pad, r * pitch + pad);
          }
        }
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = cv.getBoundingClientRect();
        cv.width = Math.round(rect.width * dpr);
        cv.height = Math.round(rect.height * dpr);
        pitch = cv.width / COLS;
        ({ lit, dim } = ledSprites(pitch));
        draw();
      };
      resize();
      window.addEventListener("resize", resize);

      const progress = { p: 0 };
      const render = () => {
        const p = progress.p;
        const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(p * STAGES.length * 1.02))];
        lines = [stage, `${Math.round(p * 100)}%`];
        draw();
      };

      const heroImage = document.querySelector<HTMLImageElement>("[data-hero-bg] img");
      const assets = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        heroImage && !heroImage.complete
          ? new Promise((r) => {
              heroImage.addEventListener("load", r, { once: true });
              heroImage.addEventListener("error", r, { once: true });
            })
          : Promise.resolve(),
        new Promise((r) => setTimeout(r, 1500)),
      ]);

      const intro = gsap.timeline();
      intro.from(q("[data-board]"), { autoAlpha: 0, y: 16, duration: 0.7, ease: "power2.out" });
      intro.to(progress, { p: 0.88, duration: 2, ease: "power1.inOut", onUpdate: render }, 0.1);

      const finish = () => {
        if (cancelled) return;
        const outro = gsap.timeline({
          onComplete: () => {
            el.style.display = "none";
            behind.forEach((n) => n.removeAttribute("inert"));
            unlockScroll();
          },
        });
        outro.to(progress, { p: 1, duration: 0.45, ease: "power2.out", onUpdate: render });
        outro.add(() => {
          lines = ["ROAD", "OPEN"];
          draw();
        });
        // Two slow flashes, like a sign changing phase (well under 3 per second).
        outro.add(() => { on = false; draw(); }, "+=0.45");
        outro.add(() => { on = true; draw(); }, "+=0.22");
        outro.to(q("[data-board]"), { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, "+=0.35");
        outro.add(() => markLoaded(), "-=0.1");
        // The glass parts down the middle, top half up and bottom half down.
        const gap = { g: 0 };
        outro.to(gap, { g: 50, duration: 1.1, ease: "expo.inOut", onUpdate: () => void (frost.style.clipPath = parted(gap.g)) }, "-=0.05");
      };
      assets.then(() => intro.then(finish));

      return () => {
        cancelled = true;
        window.removeEventListener("resize", resize);
        behind.forEach((n) => n.removeAttribute("inert"));
        unlockScroll();
      };
    },
    { scope: root },
  );

  if (!home) return null;

  return (
    <div ref={root} data-preloader aria-hidden className="fixed inset-0 z-[200] overflow-hidden">
      {/* Frosted glass: the page shows through heavily blurred and darkened; white underneath still reads as tile (#212121). */}
      <div
        data-frost
        className="absolute inset-0 bg-night/75 backdrop-blur-[4rem] backdrop-brightness-[0.45] backdrop-saturate-[1.4]"
        style={{ clipPath: parted(0) }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div data-board className="w-[88vw] max-w-[118rem] lg:w-[72vw]">
          <div className="bg-night/90 p-[1.6%] shadow-[0_3rem_8rem_-2rem_rgba(0,0,0,0.6)]">
            <canvas ref={canvas} className="block w-full" style={{ aspectRatio: `${COLS} / ${ROWS}` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
