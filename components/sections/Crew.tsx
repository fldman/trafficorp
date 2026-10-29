"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { GLYPH_H, textToColumns } from "@/lib/dotFont";
import { ledSprites } from "@/lib/led";
import type { Logo } from "@/lib/logos";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { LogoRow } from "@/components/ui/LogoRow";

type Rule = { title: string; board: readonly string[]; text: string };

type CrewProps = {
  label: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
  rules: { title: string; items: readonly Rule[] };
  members: { title: string; logos: readonly Logo[] };
};

const COLS = 59; // nine characters a line, with three dots of margin each side
const ROWS = 27; // three 7-dot lines, 2-dot gaps between them, a dot of margin top and bottom
const LINE_GAP = 2;
/** Mobile: how long each rule stays on the board. */
const HOLD_MS = 2800;
/** How long one message takes to roll off and the next to roll on. */
const ROLL_MS = 650;
const caption = "font-mono text-12 uppercase tracking-[0.12em] text-white/70 lg:text-13";

/** `null` until measured on the client, so nothing commits to a layout before it knows. */
function useMedia(query: string) {
  const [match, setMatch] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/**
 * A portable message sign: a three-line amber dot matrix in a black housing.
 * A new message rolls up from below one dot row at a time, pushing the old
 * one off the top, the way real boards scroll between phases (LEDs only ever
 * switch on or off). The first message rolls in from a blank board.
 */
function MessageBoard({ lines, on }: { lines: readonly string[]; on: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const show = useRef<(msg: readonly string[] | null, roll: boolean) => void>(() => {});

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    let sprites: ReturnType<typeof ledSprites> | null = null;
    let pitch = 0;
    // Two stacked frames: `from` on top, `to` underneath; `offset` is how many rows have scrolled.
    let from = new Uint8Array(COLS * ROWS);
    let to = from;
    let offset = 0;
    let raf = 0;

    const bitmap = (msg: readonly string[] | null) => {
      const out = new Uint8Array(COLS * ROWS);
      if (!msg) return out;
      const top = Math.floor((ROWS - (msg.length * GLYPH_H + (msg.length - 1) * LINE_GAP)) / 2);
      msg.forEach((t, i) => {
        const cols = textToColumns(t);
        cols.pop(); // trailing spacer
        const start = Math.floor((COLS - cols.length) / 2);
        const y = top + i * (GLYPH_H + LINE_GAP);
        cols.forEach((mask, c) => {
          for (let r = 0; r < GLYPH_H; r++) if (mask & (1 << r)) out[(y + r) * COLS + start + c] = 1;
        });
      });
      return out;
    };

    const render = () => {
      if (!sprites) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const pad = (pitch - sprites.lit.width) / 2;
      for (let r = 0; r < ROWS; r++) {
        const v = r + offset;
        const src = v < ROWS ? from : to;
        const row = (v < ROWS ? v : v - ROWS) * COLS;
        for (let c = 0; c < COLS; c++) ctx.drawImage(src[row + c] ? sprites.lit : sprites.dim, c * pitch + pad, r * pitch + pad);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      cv.width = Math.round(rect.width * dpr);
      cv.height = Math.round(rect.height * dpr);
      pitch = cv.width / COLS;
      sprites = ledSprites(pitch);
      render();
    };

    show.current = (msg, roll) => {
      cancelAnimationFrame(raf);
      // A roll still under way finishes at once; the next one starts from its message.
      from = offset > 0 ? to : from;
      to = bitmap(msg);
      offset = 0;
      if (!roll) {
        from = to;
        render();
        return;
      }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / ROLL_MS);
        const next = Math.round((0.5 - Math.cos(Math.PI * p) / 2) * ROWS);
        if (next !== offset) {
          offset = next;
          render();
        }
        if (p < 1) raf = requestAnimationFrame(tick);
        else {
          from = to;
          offset = 0;
        }
      };
      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    show.current(on ? lines : null, on && !window.matchMedia(MQ.reduce).matches);
  }, [lines, on]);

  return (
    <div className="bg-[#0b0d10] p-[1.2rem] shadow-[0_3rem_8rem_-2rem_rgba(0,0,0,0.8)] ring-1 ring-white/10 lg:p-[1.6rem]">
      <canvas ref={canvas} aria-hidden className="block w-full" style={{ aspectRatio: `${COLS} / ${ROWS}` }} />
    </div>
  );
}

/**
 * The crew, the rules they work by and the memberships as one scene: the
 * heading, intro and certification logos beside a message board, set in the
 * same narrower frame as the closing call to action, over the team photo,
 * which rises out of the dark. On desktop the scene holds while you scroll
 * and the board steps through the rules. Tablets and phones stack it all,
 * the board cycles by itself, and (as with reduced motion) every rule is
 * listed under the board.
 */
export function Crew({ label, title, text, image, rules, members }: CrewProps) {
  const root = useRef<HTMLElement>(null);
  const boardWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [powered, setPowered] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const pinned = useMedia(MQ.desktop);
  const motion = useMedia(MQ.motion);
  const n = rules.items.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      // The scene holds with CSS sticky while the spacer under it scrolls past; that stretch picks the rule on the board.
      mm.add(MQ.desktop, () => {
        const run = q("[data-pin-run]")[0] as HTMLElement;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${run.offsetHeight}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          onRefresh: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
        });
        gsap.fromTo(q("[data-rise]"), { yPercent: 10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: 0.6 } });
      });
      mm.add(MQ.mobile, () => {
        gsap.fromTo(q("[data-rise]"), { yPercent: 10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: q("[data-rise]")[0], start: "top bottom", end: "top 35%", scrub: 0.6 } });
      });
    },
    { scope: root },
  );

  // The board switches on the first time it comes into view, and only cycles while visible.
  useEffect(() => {
    const el = boardWrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setPowered(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (pinned !== false || motion !== true || paused || held || !inView) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), HOLD_MS);
    return () => window.clearInterval(id);
  }, [pinned, motion, paused, held, inView, n]);

  const rule = rules.items[active];

  return (
    <section ref={root} data-header="dark" className="on-dark relative bg-night text-white">
      {/* Taller than the screen on desktop: it holds at the top while the rules play, then scrolls on to show the rest of the photo and the padding under it. */}
      <div className="relative pb-[8.4rem] motion-safe:lg:sticky motion-safe:lg:top-0 lg:pb-[13rem]">
        <Container className="relative z-10 pt-[8.4rem] lg:pt-[13rem]">
          <div className="mx-auto max-w-[136rem] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,54rem)] lg:items-center lg:gap-x-[10rem]">
            <div>
              <SectionLabel tone="dark">{label}</SectionLabel>
              <Reveal as="h2" className="mt-20 text-balance text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:text-h3 lg:leading-none">
                {title}
              </Reveal>
              <p className="mt-24 max-w-[46rem] text-16 text-white/75 lg:mt-30 lg:text-18">{text}</p>
              <div className="mt-40 lg:mt-50">
                <h3 className={caption}>{members.title}</h3>
                <LogoRow
                  logos={members.logos}
                  sizes="90px"
                  imageClassName="brightness-0 invert"
                  className="mt-14 [--gap-x:2.4rem] [--gap-y:1.4rem] [--logo:2.8rem] lg:mt-16 lg:[--gap-x:3rem] lg:[--logo:3.4rem]"
                />
              </div>
            </div>

            {/* Tablets and phones: the board cycles by itself and holds still while pointed at or focused. The pause control (WCAG 2.2.2) stays out of sight until a keyboard user tabs to it, as on the footer board. */}
            <div
              ref={boardWrap}
              className="relative mt-60 lg:mt-0"
              onPointerEnter={(e) => e.pointerType !== "touch" && setHeld(true)}
              onPointerLeave={() => setHeld(false)}
              onFocus={() => setHeld(true)}
              onBlur={() => setHeld(false)}
            >
              <MessageBoard lines={rule.board} on={powered || motion === false} />
              <MotionToggle
                paused={paused}
                onToggle={() => setPaused((p) => !p)}
                label="rules board"
                tone="dark"
                className="pointer-events-none absolute bottom-10 right-10 opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100 motion-reduce:hidden motion-safe:lg:hidden"
              />

              {/* Desktop: the rule's sentence under the board, and a lane dash per rule. The list below carries the text for screen readers. */}
              <div aria-hidden className="mt-24 hidden motion-safe:lg:block">
                <p key={active} className="min-h-[6rem] max-w-[48rem] animate-[tc-page-in_0.7s_ease-out_0.25s_both] text-18 text-white/80">
                  {rule.text}
                </p>
                <span className="mt-16 flex gap-8">
                  {rules.items.map((r, i) => (
                    <span key={r.title} className="relative h-3 flex-1 bg-white/15">
                      <span className={cn("absolute inset-0 origin-left bg-amber transition-[scale] duration-700 ease-in-out", i <= active ? "scale-x-100" : "scale-x-0")} />
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <ul aria-label={rules.title} className="mt-40 grid gap-y-24 border-t border-white/15 pt-30 md:mt-60 lg:col-span-2 lg:grid-cols-4 lg:gap-x-20 motion-safe:lg:sr-only">
              {rules.items.map((r) => (
                <li key={r.title}>
                  <h3 className="text-20 font-medium leading-[1.2] text-white">{r.title}</h3>
                  <p className="mt-8 text-16 text-white/70">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>

        {/* The photo rises out of the night: its dark tree canopy slides under the content above (a quarter of the photo on desktop). */}
        <div data-rise className="mx-auto w-full max-w-[192rem]">
          <div className="relative -mt-[6%] aspect-[5/4] overflow-hidden md:-mt-[12%] md:aspect-[16/10] lg:-mt-[16.67%] lg:aspect-[3/2]">
            {/* Starts 2px down, under the opaque top of the fade, so its edge never shows as a hairline. */}
            <div className="absolute inset-x-0 bottom-0 top-[2px]">
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1920px) 1920px, 100vw" className="object-cover object-[50%_70%] lg:object-center" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,#040608_0%,rgba(4,6,8,0.7)_14%,rgba(4,6,8,0)_32%)]" />
          </div>
        </div>
      </div>
      {/* Desktop: the scroll distance the scene holds for (four rules). */}
      <div aria-hidden data-pin-run className="hidden motion-safe:lg:block motion-safe:lg:h-[260vh]" />
    </section>
  );
}
