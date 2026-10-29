"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { useElementSize } from "@/lib/useElementSize";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Mark } from "@/components/ui/Mark";
import { ConeSide } from "@/components/art/Devices";
import { DIAGRAM_H, STATIONS, paddlesAt, trafficAt, WorkZoneDiagram } from "@/components/art/WorkZoneDiagram";
import { PaddleBoard } from "@/components/art/Paddle";

type Feature = { title: string; text: string; side: "left" | "right"; at: number };

type SolutionProps = {
  id?: string;
  label: string;
  title: readonly string[];
  accent: string;
  statement: string;
  features: readonly Feature[];
  /** Opening illustration: none (heading straight into The Line), the flagger's paddle turning STOP → SLOW, or the earlier cone taper. */
  intro?: "none" | "paddle" | "taper";
};

/** Where the drawing tip sits in the viewport while you scroll. */
const TIP = "65%";
/** How far ahead of the tip (drawing units) the road and devices are laid out. */
const AHEAD = 300;

/**
 * "Our answer": the heading and statement, then The Line draws a flagging
 * operation (cars, flaggers and their STOP/SLOW paddles all driven by
 * scroll) while the features appear beside it. `intro` can bring
 * back the earlier openings: a turning paddle, or a taper of cones.
 */
export function Solution({ id, label, title, accent, statement, features, intro = "none" }: SolutionProps) {
  const heading = (
    <>
      <SectionLabel className="relative justify-center">{label}</SectionLabel>
      <Reveal
        as="h2"
        className="relative mx-auto mt-24 max-w-[30rem] text-[3.4rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-40 lg:max-w-[70rem] lg:text-h4 lg:leading-none"
      >
        {title.join(" ")} <Mark>{accent}</Mark>
      </Reveal>
    </>
  );

  return (
    <section
      id={id}
      data-header="light"
      className={cn("relative z-10 bg-white pb-[9.8rem] lg:pb-[22rem]", intro === "taper" ? "pt-[5.6rem] lg:pt-[14.5rem]" : "pt-[8.4rem] lg:pt-[18rem]")}
    >
      {intro === "taper" ? (
        // Heading zone: the lane lines run in from above and meet at its bottom edge.
        <div className="relative h-[62rem] lg:h-[60rem]">
          <MergeTaper />
          <Container className="relative pt-[4rem] text-center lg:pt-[3.5rem]">{heading}</Container>
        </div>
      ) : (
        <>
          <Container className="text-center">{heading}</Container>
          {intro === "paddle" && <PaddleTurn className="mt-60 lg:mt-[8rem]" />}
        </>
      )}

      {/* From the paddle's staff (or the merge cone), a single line continues down. Without an opening, the statement follows the heading directly. */}
      {intro !== "none" && (
        <div className="relative mx-auto h-[8rem] w-px lg:h-[12rem]">
          <LineSegment className="absolute inset-0" />
        </div>
      )}

      <Container className={cn("relative", intro === "none" ? "mt-40 lg:mt-60" : "mt-30 lg:mt-40")}>
        <RevealText className="mx-auto max-w-[84.6rem] text-center">{statement}</RevealText>
      </Container>

      <div className="mt-60 lg:mt-[10rem]">
        <PinnedDiagram features={features} />
      </div>
    </section>
  );
}

/** A vertical piece of The Line that draws downward as it scrolls past the tip. */
function LineSegment({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: `top ${TIP}`, end: `bottom ${TIP}`, scrub: 0.6 } },
        );
      });
    },
    { scope: ref },
  );
  return <div ref={ref} aria-hidden className={cn("origin-top bg-amber", className)} style={{ width: 3, left: -1 }} />;
}

/**
 * The flagger's STOP/SLOW paddle, drawn flat like the site's other signs.
 * As it scrolls through the middle of the screen it turns on its staff from
 * STOP (traffic held) to SLOW (traffic released). Reduced motion shows SLOW.
 */
function PaddleTurn({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 45%", scrub: 0.8 } });
        // Hold on STOP, turn, hold on SLOW.
        tl.fromTo(q("[data-board]"), { rotationY: 0 }, { rotationY: 180, duration: 1, ease: "power2.inOut" }, 0.35).to({}, { duration: 0.35 });
      });
      mm.add(MQ.reduce, () => {
        gsap.set(q("[data-board]"), { rotationY: 180 });
      });
    },
    { scope: root },
  );

  const face = "absolute inset-0 size-full [backface-visibility:hidden]";
  const type = { fontFamily: "var(--font-inter-tight)", fontWeight: 700 } as const;
  // Regular octagon in a 200 box, and the same shape scaled about the centre for the inset border.
  const oct = (k: number) =>
    [
      [58.58, 0],
      [141.42, 0],
      [200, 58.58],
      [200, 141.42],
      [141.42, 200],
      [58.58, 200],
      [0, 141.42],
      [0, 58.58],
    ]
      .map(([x, y]) => `${100 + (x - 100) * k},${100 + (y - 100) * k}`)
      .join(" ");
  const diamond = (k: number) => [[100, 0], [200, 100], [100, 200], [0, 100]].map(([x, y]) => `${100 + (x - 100) * k},${100 + (y - 100) * k}`).join(" ");

  return (
    <div ref={root} aria-hidden className={cn("relative mx-auto flex w-[19rem] flex-col items-center lg:w-[26rem]", className)}>
      <div className="relative aspect-square w-full [perspective:140rem]">
        <div data-board className="relative size-full [transform-style:preserve-3d]">
          <svg viewBox="0 0 200 200" className={face}>
            <polygon points={oct(1)} fill="#b42318" />
            <polygon points={oct(0.9)} fill="none" stroke="#ffffff" strokeWidth={5} />
            <text x="100" y="101" textAnchor="middle" dominantBaseline="central" fontSize="56" letterSpacing="-1" fill="#ffffff" style={type}>
              STOP
            </text>
          </svg>
          <svg viewBox="0 0 200 200" className={cn(face, "[transform:rotateY(180deg)]")}>
            <polygon points={diamond(1)} fill="#f79521" />
            <polygon points={diamond(0.88)} fill="none" stroke="#151515" strokeWidth={5} strokeLinejoin="round" />
            <text x="100" y="101" textAnchor="middle" dominantBaseline="central" fontSize="42" letterSpacing="-0.5" fill="#151515" style={type}>
              SLOW
            </text>
          </svg>
        </div>
      </div>
      {/* The staff; The Line takes over where it ends. */}
      <span className="block h-[9rem] w-[1rem] bg-ink lg:h-[13rem] lg:w-[1.2rem]" />
    </div>
  );
}

const CONES = 7;

/** Two dashed lane lines run in from the top corners and merge at a cone. Kept for `intro="taper"`. */
function MergeTaper() {
  const root = useRef<HTMLDivElement>(null);
  const { w, h } = useElementSize(root);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const left = q("[data-cone='l']");
        const right = q("[data-cone='r']");
        gsap.set([...left, ...right, ...q("[data-node]")], { scale: 0, transformOrigin: "50% 100%" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 62%", scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.fromTo(q("[data-lane]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 }, 0);
        for (let i = 0; i < CONES; i++) {
          const t = (i + 1) / (CONES + 1);
          tl.to([left[i], right[i]], { scale: 1, duration: 0.08, ease: "back.out(2.4)" }, t - 0.06);
        }
        tl.to(q("[data-node]"), { scale: 1, duration: 0.1, ease: "back.out(2)" }, 0.92);
      });
    },
    { scope: root },
  );

  const pos = (side: "l" | "r", t: number) => ({
    left: `${side === "l" ? 2 + 48 * t : 98 - 48 * t}%`,
    top: `${100 * t}%`,
  });

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-[26rem] lg:-top-[28rem]">
      <svg viewBox={`0 0 ${w || 1} ${h || 1}`} className="absolute inset-0 size-full overflow-visible">
        {[`M${w * 0.02} 0 L${w / 2} ${h}`, `M${w * 0.98} 0 L${w / 2} ${h}`].map((d, i) => (
          <path key={i} data-lane d={d} stroke="#c9c9c9" strokeWidth={1.2} strokeDasharray="10 9" fill="none" />
        ))}
      </svg>
      {(["l", "r"] as const).map((side) =>
        Array.from({ length: CONES }, (_, i) => {
          const t = (i + 1) / (CONES + 1);
          return (
            <div key={`${side}${i}`} className="absolute" style={pos(side, t)}>
              <svg data-cone={side} viewBox="-16 -40 32 40" className="absolute bottom-0 left-0 h-[2.6rem] w-auto -translate-x-1/2 overflow-visible text-ink lg:h-[3.8rem]">
                <ConeSide x={0} y={0} />
              </svg>
            </div>
          );
        }),
      )}
      <div className="absolute left-1/2 top-full">
        <svg data-node viewBox="-16 -40 32 40" className="absolute bottom-0 left-0 h-[4rem] w-auto -translate-x-1/2 overflow-visible text-ink lg:h-[6.4rem]">
          <ConeSide x={0} y={0} />
        </svg>
      </div>
    </div>
  );
}

/**
 * Centre drawing with features beside it. The drawing tip stays at a fixed
 * height in the viewport; devices and features appear as the tip passes them.
 */
export function PinnedDiagram({ features }: { features: readonly Feature[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const svg = el.querySelector("svg") as SVGSVGElement;
        const mask = Array.from(el.querySelectorAll<SVGPathElement>("[data-centre-mask]"));
        const tip = Array.from(el.querySelectorAll<SVGPathElement>("[data-centre-tip]"));
        const edges = Array.from(el.querySelectorAll<SVGPathElement>("[data-edge]"));
        const pops = q("[data-pop]") as Element[];
        const labels = q("[data-label]") as Element[];
        const cars = Array.from(el.querySelectorAll<SVGGElement>("[data-car]"));
        const reveal = el.querySelector<SVGRectElement>("[data-reveal]");
        const boards = { a: el.querySelector<HTMLElement>("[data-paddle='a'] [data-board]")!, b: el.querySelector<HTMLElement>("[data-paddle='b'] [data-board]")! };
        const minis = { a: el.querySelector<SVGGElement>("[data-mini='a']")!, b: el.querySelector<SVGGElement>("[data-mini='b']")! };
        const faces: Record<"a" | "b", string | null> = { a: null, b: null };
        // Start from a clean transform so GSAP owns each paddle's rotation.
        Object.values(boards).forEach((board) => (board.style.transform = ""));

        // Each flagger turns their paddle: A from SLOW to STOP, then B from STOP to SLOW, turning the other way.
        const turn = (k: "a" | "b", face: "stop" | "slow", instant: boolean) => {
          if (faces[k] === face) return;
          faces[k] = face;
          gsap.to(boards[k], { rotationY: face === "stop" ? 0 : 180, duration: instant ? 0 : 0.8, ease: "power3.inOut", overwrite: true });
          minis[k].querySelectorAll<SVGElement>("[data-face]").forEach((f) =>
            gsap.to(f, { opacity: f.dataset.face === face ? 1 : 0, duration: instant ? 0 : 0.2, delay: instant ? 0 : 0.3, overwrite: true }),
          );
        };

        gsap.set(mask, { drawSVG: "0%" });
        gsap.set(tip, { drawSVG: "0% 0%" });
        gsap.set(edges, { drawSVG: "0%" });
        gsap.set(pops, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(labels, { autoAlpha: 0 });

        // Height of each device in drawing units, measured once per refresh.
        type Item = { el: Element; y: number; on: boolean; label?: boolean };
        let items: Item[] = [];
        const measure = () => {
          const box = svg.getBoundingClientRect();
          items = [...pops, ...labels].map((node) => {
            const r = node.getBoundingClientRect();
            const at = node.getAttribute("data-at");
            const y = at ? Number(at) : ((r.top + r.height / 2 - box.top) / box.height) * DIAGRAM_H;
            return { el: node, y, on: false, label: labels.includes(node) };
          });
        };

        // Length along each path at a given drawing height, so every line
        // reaches the same height at the same moment (curves are longer than they are tall).
        const table = (path: SVGPathElement) => {
          const total = path.getTotalLength();
          return Array.from({ length: 241 }, (_, i) => {
            const l = (total * i) / 240;
            return [l, path.getPointAtLength(l).y] as const;
          });
        };
        const lengthAt = (rows: ReadonlyArray<readonly [number, number]>, y: number) => {
          let l = 0;
          for (const [len, py] of rows) {
            if (py > y) break;
            l = len;
          }
          return l;
        };
        const centreRows = table(mask[0]);
        const edgeRows = edges.map(table);

        let first = true;
        const update = (p: number) => {
          const head = p * DIAGRAM_H;
          const len = lengthAt(centreRows, head);
          gsap.set(mask, { drawSVG: `0 ${len}` });
          gsap.set(tip, { drawSVG: `${Math.max(0, len - 34)} ${len}`, opacity: p > 0.995 || p < 0.002 ? 0 : 1 });
          // The road and its devices are laid out just ahead of the tip, as they come up the screen.
          edges.forEach((edge, i) => gsap.set(edge, { drawSVG: `0 ${lengthAt(edgeRows[i], head + AHEAD)}` }));
          reveal?.setAttribute("height", String(Math.max(0, head + AHEAD)));
          for (const car of trafficAt(head)) {
            const node = cars.find((c) => c.getAttribute("data-car") === car.id);
            node?.setAttribute("transform", `translate(${car.x.toFixed(1)} ${car.y.toFixed(1)}) rotate(${car.rotate.toFixed(2)})`);
            node?.setAttribute("opacity", car.opacity.toFixed(3));
          }
          const faceNow = paddlesAt(head);
          turn("a", faceNow.a, first);
          turn("b", faceNow.b, first);
          first = false;
          for (const item of items) {
            const on = head + AHEAD >= item.y;
            if (on === item.on) continue;
            item.on = on;
            if (item.label) gsap.to(item.el, { autoAlpha: on ? 1 : 0, duration: 0.4, overwrite: true });
            else gsap.to(item.el, { scale: on ? 1 : 0, duration: on ? 0.55 : 0.25, ease: on ? "back.out(2.2)" : "power2.in", overwrite: true });
          }
        };

        const st = ScrollTrigger.create({
          trigger: svg,
          start: `top ${TIP}`,
          end: `bottom ${TIP}`,
          scrub: 0.6,
          onRefresh: (self) => {
            measure();
            update(self.progress);
          },
          onUpdate: (self) => update(self.progress),
        });
        measure();
        update(st.progress);

        q("[data-feature]").forEach((f) => {
          gsap.from(f, {
            autoAlpha: 0,
            y: 40,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: f, start: `top ${TIP}`, toggleActions: "play none none reverse" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mx-auto w-full max-w-[192rem] px-20 lg:px-60">
      <div className="relative mx-auto w-[26rem] lg:w-[40rem]">
        <WorkZoneDiagram className="block h-auto w-full" />

        {/* Paddle callouts: each flagger's STOP/SLOW paddle, beside their station. */}
        {(["a", "b"] as const).map((k) => (
          <div
            key={k}
            data-paddle={k}
            aria-hidden
            className={cn(
              "pointer-events-none absolute w-[3.6rem] -translate-y-1/2 lg:w-[8rem]",
              k === "a" ? "right-[calc(100%+0.8rem)] lg:right-[calc(100%+2.4rem)]" : "left-[calc(100%+0.8rem)] lg:left-[calc(100%+2.4rem)]",
            )}
            style={{ top: `${(STATIONS[k].y / DIAGRAM_H) * 100}%` }}
          >
            <p className="absolute bottom-[calc(100%+1.2rem)] left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-center font-mono text-12 uppercase leading-[1.5] tracking-[0.1em] text-label lg:block">
              Flagger {k.toUpperCase()}
              <br />
              <span className="text-ink">{k === "a" ? "Southbound" : "Northbound"}</span>
            </p>
            <PaddleBoard initial={k === "a" ? "stop" : "slow"} />
          </div>
        ))}

        {/* Desktop: features hang off the drawing at the height they describe. */}
        {features.map((f) => (
          <div
            key={f.title}
            data-feature
            className={cn(
              "absolute hidden w-[28.5rem] lg:block",
              f.side === "left" ? "right-[calc(100%+11.5rem)] text-right" : "left-[calc(100%+11.5rem)]",
            )}
            style={{ top: `${(f.at / DIAGRAM_H) * 100}%`, transform: "translateY(-30%)" }}
          >
            <h3 className="text-h6 font-medium">{f.title}</h3>
            <p className="mt-20 text-18 text-body">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Mobile and tablet: features as a list under the drawing. */}
      <ul className="mx-auto mt-60 grid max-w-[60rem] gap-40 md:grid-cols-2 lg:hidden">
        {features.map((f, i) => (
          <li key={f.title} className="border-t border-ink/10 pt-20">
            <p className="font-mono text-12 text-label">0{i + 1}</p>
            <h3 className="mt-8 text-[2.6rem] font-medium leading-[1.05]">{f.title}</h3>
            <p className="mt-12 text-16 text-body">{f.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
