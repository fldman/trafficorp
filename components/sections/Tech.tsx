"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { LightField } from "@/components/ui/LightField";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, techIcons, type TechIconKey } from "@/components/art/Icons";
import { useQuote } from "@/components/providers/QuoteProvider";

type Media = { kind: "video"; src: string; poster: string } | { kind: "image"; src: string; position?: string };
type Tile = {
  title: string;
  icon: TechIconKey;
  text: string;
  service: string;
  size: "big" | "wide" | "tall" | "one";
  at: readonly [number, number];
  /** What the device does; drives the label and the filter. */
  category: string;
  tag?: string;
  /** Shows a LIVE marker (monitored devices). */
  live?: boolean;
  /** Not yet confirmed by TraffiCorp (content note only). */
  confirm?: boolean;
  media?: Media;
  /** Photo for the list layout's preview when the tile has no `media` (the bento keeps those tiles as icons). */
  preview?: Media;
};
type Filter = { key: string; label: string; note?: string };

type TechProps = {
  id?: string;
  title: string;
  image: { src: string; alt: string };
  filters: readonly Filter[];
  tiles: readonly Tile[];
  cta: string;
  /** Link in the corner of the list preview: the same as choosing the device in focus. */
  previewCta: string;
  ctaAt: readonly [number, number];
  /** "list": devices grouped by purpose beside one large preview. "bento": the tile grid with filters. */
  layout?: "list" | "bento";
};

/** Photo opener with an overlapping amber card (ink type, like a sign panel). */
export function OverlapCard({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn("bg-amber px-24 pb-50 pt-40 text-ink lg:px-60 lg:pb-[9rem] lg:pt-[9rem]", className)}>
      <Reveal as="h2" className="text-[3.4rem] font-medium leading-[1.05] tracking-[-0.02em] lg:text-h4 lg:leading-none">
        {title}
      </Reveal>
    </div>
  );
}

type Size = "big" | "wide" | "tall" | "one";
const SPAN: Record<Size, [number, number]> = { big: [2, 2], wide: [2, 1], tall: [1, 2], one: [1, 1] };
/** Mobile spans on the 2-column grid. */
const MOBILE: Record<Size, string> = { big: "col-span-2 row-span-2", wide: "col-span-2", tall: "row-span-2", one: "" };

/** Desktop placement on the 5-column grid; empty cells let the lamp board show through. */
function place(at: readonly [number, number], size: Size) {
  const [cs, rs] = SPAN[size];
  return { ["--c" as string]: at[0], ["--r" as string]: at[1], ["--cs" as string]: cs, ["--rs" as string]: rs };
}
const cell = "lg:[grid-column:var(--c)/span_var(--cs)] lg:[grid-row:var(--r)/span_var(--rs)]";

/** Looping, muted background clip for a tile. Plays only while on screen and never under reduced motion. */
function TileVideo({
  src,
  poster,
  paused,
  className = "absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]",
}: {
  src: string;
  poster: string;
  paused: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (paused || window.matchMedia(MQ.reduce).matches) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [paused]);
  return (
    <video
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/**
 * Bento of the tech over the lamp board, grouped by what each device does.
 * One big video tile for the headline device, selective-colour photo tiles
 * (only the lit device elements keep their colour), quiet icon tiles, one
 * amber call to action and a single empty cell. Filter chips highlight one
 * group and dim the rest. Every tile is a button that opens the quote form
 * with that service selected; hover or focus reveals what it does.
 */
export function TileGrid({
  filters,
  tiles,
  cta,
  ctaAt,
  onPick,
}: {
  filters: readonly Filter[];
  tiles: readonly Tile[];
  cta: string;
  ctaAt: readonly [number, number];
  onPick: (service?: string) => void;
}) {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const labelOf = (key: string) => filters.find((f) => f.key === key)?.label ?? key;
  const count = (key: string) => tiles.filter((t) => t.category === key).length;
  const shown = active ? tiles.filter((t) => t.category === active).length : tiles.length;

  return (
    <div>
      {/* Filter by purpose */}
      <div className="mb-24 flex flex-wrap items-center gap-8 lg:justify-end">
        <span className="mr-6 font-mono text-12 uppercase tracking-[0.12em] text-white/60">Show</span>
        {[{ key: null, label: "All", n: tiles.length }, ...filters.map((f) => ({ key: f.key as string | null, label: f.label, n: count(f.key) }))].map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={active === f.key}
            onClick={() => setActive(f.key)}
            className={cn(
              "inline-flex h-36 items-center gap-8 px-14 font-mono text-12 uppercase tracking-[0.1em] transition-colors duration-300",
              active === f.key ? "bg-amber text-ink" : "bg-white/[0.06] text-white/80 hover:bg-white/[0.12] hover:text-white",
            )}
          >
            {f.label}
            <span className={active === f.key ? "text-ink/70" : "text-white/50"}>{f.n}</span>
          </button>
        ))}
        <p className="sr-only" aria-live="polite">
          {active ? `Showing ${shown} ${labelOf(active).toLowerCase()} devices` : `Showing all ${shown} devices`}
        </p>
      </div>

      {/* Rows are as tall as a column is wide (container units), so every cell stays square. */}
      <div className="[container-type:inline-size]">
        <ul className="grid grid-flow-row-dense grid-cols-2 gap-8 [grid-auto-rows:calc((100cqw-0.8rem)/2)] lg:grid-flow-row lg:grid-cols-5 lg:gap-12 lg:[grid-auto-rows:calc((100cqw-4.8rem)/5)]">
          {tiles.map((tile) => {
            const Icon = techIcons[tile.icon];
            const big = tile.size === "big";
            const media = tile.media;
            // Filtering fades the media and icon of other groups (titles stay readable) and outlines the match.
            const dim = active !== null && tile.category !== active;
            const match = active !== null && !dim;
            const fade = cn("transition-[opacity,filter] duration-500", dim && "opacity-15 grayscale");
            return (
              <li
                key={tile.title}
                data-tile
                className={cn("relative", MOBILE[tile.size], cell)}
                style={place(tile.at, tile.size)}
              >
                <button
                  type="button"
                  onClick={() => onPick(tile.service)}
                  className={cn(
                    "group relative flex size-full flex-col justify-between overflow-hidden text-left transition-colors duration-500",
                    media ? "bg-night" : "bg-white/[0.05] backdrop-blur-[0.6rem] hover:bg-white/[0.09] focus-visible:bg-white/[0.09]",
                    big ? "p-24 lg:p-50" : "p-20 lg:px-30 lg:py-30",
                  )}
                >
                  {media?.kind === "video" && (
                    <span aria-hidden className={cn("absolute inset-0", fade)}>
                      <TileVideo src={media.src} poster={media.poster} paused={paused} />
                    </span>
                  )}
                  {media?.kind === "image" && (
                    <span aria-hidden className={cn("absolute inset-0", fade)}>
                    <Image
                      src={media.src}
                      alt=""
                      fill
                      sizes={tile.size === "one" ? "(min-width: 1200px) 20vw, 50vw" : "(min-width: 1200px) 40vw, 100vw"}
                      className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                      style={{ objectPosition: media.position }}
                    />
                    </span>
                  )}
                  {media && (
                    <span
                      aria-hidden
                      className="absolute -inset-px bg-[linear-gradient(to_top,rgba(4,6,8,0.92)_0%,rgba(4,6,8,0.55)_38%,rgba(4,6,8,0.1)_70%,rgba(4,6,8,0.35)_100%)]"
                    />
                  )}

                  {/* Outline on matching tiles, above any photo. */}
                  <span aria-hidden className={cn("pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_0_1.5px_#f79521] transition-opacity duration-500", match ? "opacity-100" : "opacity-0")} />
                  <span className="relative flex w-full items-start justify-between gap-12">
                    <span className={cn("font-mono text-12 uppercase tracking-[0.12em]", media ? "bg-night/75 px-6 py-2 text-white/85" : "text-white/60")}>
                      {labelOf(tile.category)}
                    </span>
                    {tile.live && (
                      <span className={cn("flex items-center gap-6 bg-night/75 px-6 py-2 font-mono text-12 uppercase tracking-[0.12em] text-amber transition-opacity duration-500", dim && "opacity-40")}>
                        <span aria-hidden className="size-6 rounded-full bg-amber shadow-[0_0_0.8rem_0.1rem_rgba(247,149,33,0.8)]" />
                        {/* Just the dot on phones, where the tile is too narrow for both chips. */}
                        <span className="max-sm:sr-only">Live</span>
                      </span>
                    )}
                    {!media && <Icon className={cn("size-32 shrink-0 text-white/55 transition-[color,opacity] duration-500 group-hover:text-amber group-focus-visible:text-amber lg:size-40", dim && "opacity-25")} />}
                  </span>

                  <span className="relative block">
                    {tile.tag && <span className={cn("mb-14 inline-block px-8 py-4 transition-colors duration-500", dim ? "bg-white/15 text-white" : "bg-amber text-ink", "font-mono text-12 uppercase tracking-[0.1em]")}>{tile.tag}</span>}
                    <span className={cn("block font-medium leading-[1.15] transition-colors duration-500", dim && "text-white/70", big ? "max-w-[40rem] text-[2.8rem] tracking-[-0.015em] lg:text-h5" : "max-w-[24rem] text-18 lg:text-[2.2rem]")}>{tile.title}</span>
                    {big ? (
                      <span className="mt-14 block max-w-[42rem] text-16 text-white/80 lg:text-18">{tile.text}</span>
                    ) : (
                      <span
                        className={cn(
                          "mt-10 max-w-[28rem] text-14 leading-[1.45] text-white/80 lg:grid lg:grid-rows-[0fr] lg:opacity-0 lg:transition-all lg:duration-500 lg:ease-out-expo lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-visible:grid-rows-[1fr] lg:group-focus-visible:opacity-100",
                          // One-cell tiles keep their description for desktop hover; it doesn't fit a phone-sized square.
                          tile.size === "one" ? "hidden" : "block",
                        )}
                      >
                        <span className="lg:overflow-hidden">{tile.text}</span>
                      </span>
                    )}
                    <span
                      className={cn(
                        "mt-12 items-center gap-6 font-mono text-12 uppercase tracking-[0.1em] text-amber",
                        big ? "flex lg:mt-24" : "hidden lg:flex lg:opacity-0 lg:transition-opacity lg:duration-500 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100",
                      )}
                    >
                      Add to quote <ArrowRight className="size-14 transition-transform duration-300 group-hover:translate-x-4" />
                    </span>
                  </span>
                </button>
                {media?.kind === "video" && (
                  <MotionToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="video" tone="dark" className="absolute right-16 top-16 z-10 bg-night/60 backdrop-blur-sm motion-reduce:hidden lg:right-24 lg:top-24" />
                )}
              </li>
            );
          })}
          <li data-tile className={cn("col-span-2", cell)} style={place(ctaAt, "one")}>
            <button
              type="button"
              onClick={() => onPick()}
              className={cn("group flex size-full flex-col justify-between bg-amber p-20 text-left text-ink transition-[background-color,opacity] duration-500 hover:bg-amber-hi lg:p-30", active !== null && "opacity-60")}
            >
              <span className="font-mono text-12 uppercase tracking-[0.12em]">Not sure what you need?</span>
              <span className="flex items-end justify-between gap-16">
                <span className="max-w-[20rem] text-[2.2rem] font-semibold leading-[1.1] lg:text-[2.6rem]">{cta}</span>
                <span className="flex size-44 shrink-0 items-center justify-center bg-ink text-amber lg:size-50">
                  <ArrowRight className="size-18 transition-transform duration-500 ease-out-expo group-hover:translate-x-4 group-focus-visible:translate-x-4" />
                </span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

const mediaOf = (t: Tile) => t.media ?? t.preview;
const thumbOf = (m?: Media) => (m ? (m.kind === "video" ? m.poster : m.src) : undefined);

function LiveMark() {
  return (
    <span className="flex items-center gap-6 font-mono text-12 uppercase tracking-[0.12em] text-amber">
      <span aria-hidden className="size-6 rounded-full bg-amber shadow-[0_0_0.8rem_0.1rem_rgba(247,149,33,0.8)]" />
      Live
    </span>
  );
}

/**
 * The tech as a list grouped by what each device does, beside one large
 * preview. Hovering or focusing a device (or scrolling it past the middle of
 * the screen while the pointer is off the list) shows its photo or clip in the
 * preview; choosing it opens the quote form with that service. Below 1200px
 * there is no preview and each row carries its own thumbnail.
 */
export function DeviceList({
  title,
  filters,
  tiles,
  cta,
  previewCta,
  onPick,
}: {
  title: string;
  filters: readonly Filter[];
  tiles: readonly Tile[];
  cta: string;
  previewCta: string;
  onPick: (service?: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerOnList = useRef(false);

  // Reading order: each group in turn, devices in content order within it.
  const groups = filters.map((f) => ({ ...f, items: tiles.filter((t) => t.category === f.key) })).filter((g) => g.items.length > 0);
  const items = groups.flatMap((g) => g.items);
  const labelOf = (key: string) => filters.find((f) => f.key === key)?.label ?? key;
  const current = mediaOf(items[active]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1200px)", () => {
        q("[data-row]").forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive && !pointerOnList.current) setActive(i);
            },
          });
        });
      });
      mm.add(MQ.motion, () => {
        q("[data-group], [data-row], [data-list-cta]").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
        });
        const preview = q("[data-preview]")[0];
        if (preview) gsap.from(preview, { opacity: 0, y: 60, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: preview, start: "top 88%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="lg:grid lg:grid-cols-16 lg:gap-x-20">
      <div className="lg:col-span-7">
        <OverlapCard title={title} className="relative z-10 -mt-[10rem] lg:-mt-[13.3rem] lg:max-w-[64.3rem]" />

        <div
          className="mt-50 lg:mt-[8rem]"
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") pointerOnList.current = true;
          }}
          onPointerLeave={() => (pointerOnList.current = false)}
        >
          {groups.map((g) => (
            <div key={g.key} className="mt-50 first:mt-0 lg:mt-60">
              <div data-group className="flex flex-wrap items-baseline justify-between gap-x-16 gap-y-4 pb-16">
                <h3 className="font-mono text-12 uppercase tracking-[0.12em] text-amber">{g.label}</h3>
                {g.note && <p className="text-14 text-white/60">{g.note}</p>}
              </div>
              <ul className="flex flex-col gap-6">
                {g.items.map((t) => {
                  const i = items.indexOf(t);
                  const m = mediaOf(t);
                  const thumb = thumbOf(m);
                  return (
                    <li key={t.title} data-row>
                      <button
                        type="button"
                        data-active={i === active}
                        onPointerEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => onPick(t.service)}
                        className="group relative flex w-full items-start gap-16 bg-white/[0.05] p-12 text-left backdrop-blur-[0.6rem] transition-colors duration-300 hover:bg-white/[0.09] lg:items-center lg:gap-24 lg:px-30 lg:py-24 lg:data-[active=true]:bg-white/[0.09]"
                      >
                        {/* The amber edge marks the device in the preview. */}
                        <span aria-hidden className="absolute inset-y-0 left-0 hidden w-[0.3rem] scale-y-0 bg-amber transition-[scale] duration-500 ease-out-expo group-data-[active=true]:scale-y-100 lg:block" />
                        {thumb && (
                          <span aria-hidden className="relative size-[8.8rem] shrink-0 overflow-hidden bg-night lg:hidden">
                            <Image src={thumb} alt="" fill sizes="88px" className="object-cover" style={{ objectPosition: m?.kind === "image" ? m.position : undefined }} />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-10 gap-y-6">
                            <span className="text-18 font-medium leading-[1.2] lg:text-[2.2rem]">{t.title}</span>
                            {t.tag && <span className="bg-amber px-6 py-2 font-mono text-12 uppercase tracking-[0.1em] text-ink">{t.tag}</span>}
                            {t.live && <LiveMark />}
                          </span>
                          <span className="mt-6 block text-14 leading-[1.45] text-white/75 lg:mt-8 lg:text-16">{t.text}</span>
                        </span>
                        <ArrowRight className="size-16 shrink-0 self-center text-white/40 transition-[color,translate] duration-300 group-hover:translate-x-4 group-hover:text-amber group-focus-visible:text-amber lg:size-18 lg:group-data-[active=true]:text-amber" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <button
            type="button"
            data-list-cta
            onClick={() => onPick()}
            className="group mt-50 flex w-full items-center justify-between gap-16 bg-amber p-20 text-left text-ink transition-colors duration-300 hover:bg-amber-hi lg:mt-60 lg:px-30 lg:py-24"
          >
            <span>
              <span className="block font-mono text-12 uppercase tracking-[0.12em]">Not sure what you need?</span>
              <span className="mt-8 block text-[2.2rem] font-semibold leading-[1.1] lg:text-[2.6rem]">{cta}</span>
            </span>
            <span className="flex size-44 shrink-0 items-center justify-center bg-ink text-amber lg:size-50">
              <ArrowRight className="size-18 transition-[translate] duration-500 ease-out-expo group-hover:translate-x-4 group-focus-visible:translate-x-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Preview: every device's photo is stacked here; the one in focus fades in on top. */}
      <div className="hidden lg:col-span-8 lg:col-start-9 lg:block lg:pt-[6.6rem]">
        <div className="sticky top-[12rem]">
          <div data-preview className="relative h-[min(76rem,calc(100svh-16rem))] overflow-hidden bg-night">
            {items.map((t, i) => {
              const m = mediaOf(t);
              const on = i === active;
              const Icon = techIcons[t.icon];
              return (
                <span
                  key={t.title}
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-[opacity,scale] duration-700 ease-out-expo motion-reduce:scale-100",
                    // The outgoing photo holds until the new one has faded in over it, so the panel never dips to black.
                    on ? "z-10 scale-100 opacity-100" : "scale-[1.06] opacity-0 delay-700",
                  )}
                >
                  {m?.kind === "video" && <TileVideo src={m.src} poster={m.poster} paused={paused || !on} className="absolute inset-0 size-full object-cover" />}
                  {m?.kind === "image" && <Image src={m.src} alt="" fill sizes="(min-width: 1200px) 48vw, 1px" className="object-cover" style={{ objectPosition: m.position }} />}
                  {!m && <Icon className="absolute left-1/2 top-1/2 size-[16rem] -translate-x-1/2 -translate-y-1/2 text-white/40" />}
                </span>
              );
            })}
            <span aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-[linear-gradient(to_top,rgba(4,6,8,0.88),rgba(4,6,8,0))]" />
            {items.map((t, i) => (
              <div
                key={t.title}
                aria-hidden
                className={cn(
                  "absolute inset-x-40 bottom-40 z-10 transition-[opacity,translate] duration-500 ease-out-expo",
                  i === active ? "translate-y-0 opacity-100 delay-150" : "translate-y-8 opacity-0",
                )}
              >
                <span className="flex items-center gap-12">
                  <span className="font-mono text-12 uppercase tracking-[0.12em] text-white/80">{labelOf(t.category)}</span>
                  {t.live && <LiveMark />}
                </span>
                <span className="mt-10 block max-w-[48rem] text-h6 font-medium leading-[1.05] tracking-[-0.01em]">{t.title}</span>
              </div>
            ))}
            {/* A second way in: the same as choosing the device in focus on the left. */}
            <button
              type="button"
              onClick={() => onPick(items[active].service)}
              className="tc-link-trigger group absolute bottom-40 right-40 z-20 text-16 font-medium text-white"
            >
              <span className="tc-link-rest inline-flex items-center gap-4">
                {previewCta}
                <ArrowRight className="size-14 transition-[translate] duration-300 group-hover:translate-x-4 group-focus-visible:translate-x-4" />
              </span>
              <span className="sr-only"> for {items[active].title}</span>
            </button>
            {current?.kind === "video" && (
              <MotionToggle paused={paused} onToggle={() => setPaused((p) => !p)} label="video" tone="dark" className="absolute right-24 top-24 z-20 bg-night/60 backdrop-blur-sm motion-reduce:hidden" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tech({ id, title, image, filters, tiles, cta, previewCta, ctaAt, layout = "list" }: TechProps) {
  const root = useRef<HTMLElement>(null);
  const quote = useQuote();
  const pick = (service?: string) => quote.open(service ? { services: [service] } : undefined);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(q("[data-tech-photo]"), { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top -60%", scrub: true } });
        q("[data-tile]").forEach((tile) => {
          gsap.from(tile, { opacity: 0, y: 60, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: tile, start: "top 90%", once: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id={id} data-header="dark" className="on-dark relative bg-asphalt text-white">
      <div className="bg-asphalt">
        <div className="relative h-[46rem] overflow-hidden lg:h-[80rem]">
          <div data-tech-photo className="absolute -inset-y-[10%] inset-x-0 will-change-transform">
            <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,18,0.55),rgba(17,17,18,0)_45%)]" />
        </div>

        {/* Unlit lamps behind the devices light up around the pointer. */}
        <LightField className="pb-[5.6rem] lg:pb-[14rem]">
          <Container className="relative">
            {layout === "list" ? (
              <DeviceList title={title} filters={filters} tiles={tiles} cta={cta} previewCta={previewCta} onPick={pick} />
            ) : (
              <>
                <OverlapCard title={title} className="relative z-10 -mt-[10rem] lg:absolute lg:left-60 lg:top-[-13.3rem] lg:mt-0 lg:w-[64.3rem]" />
                {/* The filter row sits beside the heading card; the grid starts where it used to. */}
                <div className="pt-40 lg:pt-[6.6rem]">
                  <TileGrid filters={filters} tiles={tiles} cta={cta} ctaAt={ctaAt} onPick={pick} />
                </div>
              </>
            )}
          </Container>
        </LightField>
      </div>
    </section>
  );
}
