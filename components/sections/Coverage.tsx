"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { MAP, project, states as statePaths } from "@/lib/mapData";
import { region } from "@/lib/geo";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/ui/Mark";
import { Button } from "@/components/ui/Button";
import { lightField } from "@/components/quote/QuoteForm";
import { useQuote } from "@/components/providers/QuoteProvider";

type Hub = { name: string; short: string; lon: number; lat: number; side: "left" | "right" };
type Seed = { name: string; state: string; lon: number; lat: number };
type Tier = { badge: string; text: string };
type Place = { name: string; lon: number; lat: number; faint?: boolean };
type Abroad = { name: string; region: string; country: string };

type CoverageProps = {
  id?: string;
  label: string;
  title: string;
  mark?: string;
  intro: string;
  inputLabel: string;
  placeholder: string;
  picksLabel: string;
  picks: readonly string[];
  start: string;
  rings: { near: number; range: number };
  tiers: { near: Tier; range: Tier; far: Tier; home: string };
  outOfState: string;
  missing: string;
  abroad: { badge: string; text: string; places: readonly Abroad[]; words: readonly string[] };
  legend: { hub: string; area: string };
  hubs: readonly Hub[];
  seed: readonly Seed[];
  states: readonly Place[];
};

/**
 * Every town and ZIP in WA, ID, OR and MT (GeoNames, CC BY 4.0; built by a
 * script, not hand-edited). `places`: [name, state, lat, lon, population],
 * largest first. `zips`: [zip, town, state, lat, lon].
 */
type Lookup = {
  places: [string, string, number, number, number][];
  zips: [string, string, string, number, number][];
  keys: string[];
};
let lookup: Promise<Lookup> | null = null;
const loadLookup = () =>
  (lookup ??= import("@/content/coverage-places.json").then((m) => {
    const data = m.default as unknown as Omit<Lookup, "keys">;
    return { ...data, keys: data.places.map((p) => norm(p[0])) };
  }));

/** The map frame: Washington and Idaho with a little margin, in projected map units. */
const PAD = 24;
const VB = { x: region.x - PAD, y: region.y - PAD, w: region.w + PAD * 2, h: region.h + PAD * 2 };
/** Map units per mile (the projection uses 100 units per degree of latitude). */
const PER_MILE = MAP.k / 69.05;
const MAIN = new Set(["Washington", "Idaho"]);
/** How many earlier lookups stay on the map as small dots. */
const HISTORY = 5;
/** Within this many miles of a hub counts as "in town". */
const HOME_MILES = 4;
/** Map units (about 40 miles) within which an earlier lookup's name would collide with a hub tag or the pin. */
const CROWDED = 60;

/** Projected point plus its position as a share of the map frame, for HTML labels. */
function at(lon: number, lat: number) {
  const [x, y] = project(lon, lat);
  const inFrame = x >= VB.x && x <= VB.x + VB.w && y >= VB.y && y <= VB.y + VB.h;
  return { x, y, inFrame, left: `${((x - VB.x) / VB.w) * 100}%`, top: `${((y - VB.y) / VB.h) * 100}%` };
}

/** Great-circle distance in miles. */
function miles(a: { lon: number; lat: number }, b: { lon: number; lat: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
}

/** Canadian postcodes (A1A 1A1) are a sure sign the job is outside the U.S. */
const CA_POSTCODE = /^[a-z]\d[a-z] ?\d[a-z]\d$/i;

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "");
}

type Where = { name: string; state: string; lon: number; lat: number; zip?: string };
type Option = { kind: "place"; where: Where; key: string } | { kind: "abroad"; name: string; state: string; key: string; country: string };

const keyOf = (w: Where) => (w.zip ? `${w.zip} · ${w.name}, ${w.state}` : `${w.name}, ${w.state}`);

/** Up to 8 suggestions: ZIPs by prefix, or towns (largest first) that start with, then contain, the text. "Moscow, ID" narrows to a state. */
function search(text: string, data: Lookup | null, abroad: readonly Abroad[]): Option[] {
  const [head, tail] = text.split(",").map((s) => s.trim());
  const q = norm(head ?? "");
  if (!q || !data) return [];
  if (/^\d{3,5}$/.test(q)) {
    return data.zips
      .filter((z) => z[0].startsWith(q))
      .slice(0, 8)
      .map(([zip, name, state, lat, lon]) => {
        const where = { name, state, lat, lon, zip };
        return { kind: "place" as const, where, key: keyOf(where) };
      });
  }
  const st = tail && /^[a-z]{2}$/i.test(tail) ? tail.toUpperCase() : null;
  const hits: number[] = [];
  const inside: number[] = [];
  data.keys.forEach((k, i) => {
    if (st && data.places[i][1] !== st) return;
    if (k.startsWith(q)) hits.push(i);
    else if (q.length > 2 && k.includes(q)) inside.push(i);
  });
  const foreign = abroad
    .filter((p) => norm(p.name).startsWith(q))
    .slice(0, 2)
    .map((p) => ({ kind: "abroad" as const, name: p.name, state: p.region, key: `${p.name}, ${p.region}`, country: p.country }));
  const towns = [...hits, ...inside].slice(0, 8 - foreign.length).map((i) => {
    const [name, state, lat, lon] = data.places[i];
    const where = { name, state, lat, lon };
    return { kind: "place" as const, where, key: keyOf(where) };
  });
  return [...towns, ...foreign];
}

/**
 * Coverage as a lookup. The map stays simple: Washington and Idaho, the two
 * hubs, and one shape for the normal service area (land within 200 miles of
 * either hub). Each town or ZIP you look up drops onto the map with a
 * dimension line to its nearest hub; the last few stay as small dots. The
 * search covers every town and ZIP in WA, ID, OR and MT, loaded on demand.
 */
export function Coverage(props: CoverageProps) {
  const { id, label, title, mark, intro, inputLabel, placeholder, picksLabel, picks, start, rings, tiers, outOfState, abroad, legend } = props;
  const root = useRef<HTMLElement>(null);
  const quote = useQuote();
  const inputId = "coverage-town";
  const listId = "coverage-towns";

  const hubs = useMemo(() => props.hubs.map((h) => ({ ...h, ...at(h.lon, h.lat) })), [props.hubs]);

  /** A place with its map position, nearest hub and distance. */
  const locate = (w: Where) => {
    const dist = hubs.map((h) => miles(w, h));
    const i = dist.indexOf(Math.min(...dist));
    const m = Math.round(dist[i]);
    return { ...w, ...at(w.lon, w.lat), key: keyOf(w), nearest: hubs[i], miles: m, home: m <= HOME_MILES };
  };
  type Spot = ReturnType<typeof locate>;

  const seeds = useMemo(() => props.seed.map((s) => locate(s)), [props.seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const [selected, setSelected] = useState<Spot>(() => seeds.find((s) => s.name === start) ?? seeds[0]);
  const [history, setHistory] = useState<Spot[]>([]);
  /** A place we can't put on the map: not found, or outside the U.S. */
  const [outside, setOutside] = useState<{ kind: "missing" | "abroad"; label: string } | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState<Lookup | null>(null);

  // Fetch the town list as the section comes near, so it's ready before anyone types.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        loadLookup().then(setData);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const matches = useMemo(() => search(query, data, abroad.places), [query, data, abroad.places]);

  const isAbroad = (text: string) => {
    const t = norm(text).trim();
    if (CA_POSTCODE.test(text.trim())) return true;
    const parts = t.split(/[\s,]+/);
    return abroad.words.some((w) => (w.includes(" ") ? t.includes(w) : parts.includes(w)));
  };

  const pick = (spot: Spot) => {
    // The town we're leaving stays on the map as a small dot.
    setHistory((h) => [...(outside ? [] : [selected]), ...h].filter((x, i, all) => x.key !== spot.key && all.findIndex((y) => y.key === x.key) === i).slice(0, HISTORY));
    setSelected(spot);
    setOutside(null);
    setQuery(spot.key);
    setOpen(false);
  };
  const choose = (o: Option) => {
    if (o.kind === "place") return pick(locate(o.where));
    setOutside({ kind: "abroad", label: o.key });
    setQuery(o.key);
    setOpen(false);
  };
  /** Enter on free text: take the best match, or explain that we can't place it. */
  const resolveTyped = async (typed: string) => {
    const list = search(typed, data ?? (await loadLookup()), abroad.places);
    if (list.length) return choose(list[0]);
    setOutside({ kind: isAbroad(typed) ? "abroad" : "missing", label: typed });
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(0);
      } else setActive((a) => Math.min(matches.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const typed = query.trim();
      if (open && matches.length) choose(matches[active]);
      else if (typed) resolveTyped(typed);
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else setQuery("");
    }
  };

  const home = selected.home;
  const tierKey = selected.miles <= rings.near ? "near" : selected.miles <= rings.range ? "range" : "far";
  const tier = tiers[tierKey];
  const summary = home
    ? tiers.home.replace("{hub}", selected.nearest.name)
    : tier.text.replace("{miles}", String(selected.miles)).replace("{hub}", selected.nearest.short);
  const extra = selected.state === "OR" || selected.state === "MT" ? outOfState : null;
  const live = outside
    ? `${outside.label}: ${outside.kind === "abroad" ? abroad.text : props.missing}`
    : `${selected.key}: ${selected.miles} miles from ${selected.nearest.name}. ${tier.badge}.`;

  // Dimension line from the nearest hub to the town, with end ticks.
  const hub = selected.nearest;
  const onMap = !outside && selected.inFrame;
  const showLink = onMap && !home;
  const dx = selected.x - hub.x;
  const dy = selected.y - hub.y;
  const len = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [(-dy / len) * 7, (dx / len) * 7];
  const linkD = `M${hub.x} ${hub.y} L${selected.x} ${selected.y}`;
  const ticksD = `M${hub.x + nx} ${hub.y + ny} L${hub.x - nx} ${hub.y - ny} M${selected.x + nx} ${selected.y + ny} L${selected.x - nx} ${selected.y - ny}`;
  const mid = { left: `${((hub.x + dx / 2 - VB.x) / VB.w) * 100}%`, top: `${((hub.y + dy / 2 - VB.y) / VB.h) * 100}%` };

  // The name goes past the pin, away from the hub, so it never sits on the line (flipped if it would leave the map);
  // the miles chip sits beside the line's midpoint, on the side away from the hub's name tag.
  const [lx, ly] = [dx / len, dy / len];
  let [ux, uy] = [lx, ly];
  const share = { x: (selected.x - VB.x) / VB.w, y: (selected.y - VB.y) / VB.h };
  // Near a side edge, go above or below instead; near the top or bottom, go sideways (never back onto the line).
  if ((share.x < 0.14 && ux < -0.3) || (share.x > 0.86 && ux > 0.3)) [ux, uy] = [0, share.y < 0.12 ? 1 : -1];
  else if ((share.y < 0.1 && uy < -0.3) || (share.y > 0.9 && uy > 0.3)) [ux, uy] = [share.x > 0.5 ? -1 : 1, 0];
  // Chip side: on a near-flat line, the town's side (away from the hub's tag, which sits level with the hub);
  // otherwise the side opposite the tag.
  let [px, py] = [-ly, lx];
  if (Math.abs(px) < 0.3 ? (ly < 0) !== (py < 0) : (hub.side === "right") === px > 0) [px, py] = [-px, -py];
  // Snapped to eight directions: the box's nearest edge (or corner, on a diagonal) sits `gap` from the point.
  const snap = (v: number) => (Math.abs(v) > 0.38 ? Math.sign(v) : 0);
  const outward = (x: number, y: number, gap: string) =>
    `translate(calc(-50% + ${snap(x) * 50}% + ${snap(x)} * ${gap}), calc(-50% + ${snap(y) * 50}% + ${snap(y)} * ${gap}))`;
  const nameAt = outward(home ? 0 : ux, home ? -1 : uy, "1.4rem");
  // A flat line heading into the hub's tag needs the chip lifted clear of the tag.
  const intoTag = Math.abs(ly) < 0.3 && (hub.side === "right") === lx > 0;
  const milesAt = outward(px, py, intoTag ? "1.8rem" : "0.8rem");
  const R = rings.range * PER_MILE;
  const edgeId = (h: Hub) => `cov-edge-${h.short.replace(/\W/g, "")}`;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The area grows out of both hubs, then the hubs land and the first town's line draws.
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-map]")[0], start: "top 75%", once: true } });
        root.current?.querySelectorAll<SVGCircleElement>("[data-ring]").forEach((el) => {
          tl.from(el, { scale: 0, svgOrigin: el.dataset.origin, duration: 1.6, ease: "expo.out" }, 0);
        });
        tl.from(q("[data-hub]"), { scale: 0, duration: 0.6, ease: "back.out(2.4)", stagger: 0.15 }, 0.3)
          .from(q("[data-pin]"), { opacity: 0, scale: 0.6, duration: 0.35, ease: "back.out(2)" }, 1)
          .fromTo(q("[data-link-mask]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 1)
          .from(q("[data-pick]"), { opacity: 0, scale: 0.6, duration: 0.45, ease: "back.out(2)" }, 1.4);
      });
    },
    { scope: root },
  );

  // When the town changes, the pin lands at once, the line draws out to it, then the name and miles appear.
  const shown = useRef(selected.key);
  useGSAP(
    () => {
      if (shown.current === selected.key) return;
      shown.current = selected.key;
      if (window.matchMedia(MQ.reduce).matches) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(q("[data-pin]"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
      gsap.fromTo(q("[data-link-mask]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(q("[data-pick]"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", delay: 0.35 });
    },
    { scope: root, dependencies: [selected.key] },
  );

  const dots = history.filter((h) => h.inFrame && h.key !== selected.key);

  return (
    <section ref={root} id={id} data-header="light" className="relative overflow-x-clip bg-concrete-2 py-[8.4rem] lg:py-[18rem]">
      <Container>
        <div className="grid gap-y-50 lg:grid-cols-16 lg:gap-x-20">
          <div className="lg:col-span-6 lg:row-start-1">
            <SectionLabel>{label}</SectionLabel>
            <Reveal as="h2" className="mt-20 text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] lg:mt-30 lg:text-h3 lg:leading-none">
              {title} {mark && <Mark>{mark}</Mark>}
            </Reveal>
            <p className="mt-24 max-w-[50rem] text-18 text-body lg:mt-30">{intro}</p>
          </div>

          {/* The map: decorative; the search below gives the same answers in text. */}
          <div data-map aria-hidden className="lg:col-span-10 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="relative" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
              <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="tc-world absolute inset-0 size-full" fill="none">
                <defs>
                  <clipPath id="cov-land">
                    {Object.entries(statePaths).map(([n, d]) => (
                      <path key={n} d={d} />
                    ))}
                  </clipPath>
                  {/* Each hub's edge minus the part inside the other hub's circle, so only the outline of the combined area shows. */}
                  {hubs.map((h) => (
                    <mask key={h.name} id={edgeId(h)} maskUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}>
                      <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="#fff" />
                      {hubs
                        .filter((o) => o.name !== h.name)
                        .map((o) => (
                          <circle key={o.name} cx={o.x} cy={o.y} r={R} fill="#000" />
                        ))}
                    </mask>
                  ))}
                  <mask id="cov-link" maskUnits="userSpaceOnUse" x={VB.x} y={VB.y} width={VB.w} height={VB.h}>
                    <path data-link-mask d={linkD} stroke="#fff" strokeWidth={24} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" style={{ vectorEffect: "none" }} />
                  </mask>
                </defs>

                {/* Land: neighbours grey, Washington and Idaho white. */}
                {Object.entries(statePaths)
                  .filter(([n]) => !MAIN.has(n))
                  .map(([n, d]) => (
                    <path key={n} d={d} fill="#e6eaed" />
                  ))}
                <g style={{ filter: "drop-shadow(0 0.8rem 1.6rem rgba(21, 21, 21, 0.1))" }}>
                  {Object.entries(statePaths)
                    .filter(([n]) => MAIN.has(n))
                    .map(([n, d]) => (
                      <path key={n} d={d} fill="#ffffff" />
                    ))}
                </g>

                {/* The normal service area: one solid light-amber wash over land, so it reads as a single area across state lines. */}
                <g clipPath="url(#cov-land)">
                  {hubs.map((h) => (
                    <circle key={h.name} data-ring data-origin={`${h.x} ${h.y}`} cx={h.x} cy={h.y} r={R} fill="#fdebd5" />
                  ))}
                </g>

                {/* State lines over the wash. */}
                {Object.entries(statePaths)
                  .filter(([n]) => !MAIN.has(n))
                  .map(([n, d]) => (
                    <path key={n} d={d} stroke="#ffffff" strokeWidth={1.2} strokeLinejoin="round" />
                  ))}
                {Object.entries(statePaths)
                  .filter(([n]) => MAIN.has(n))
                  .map(([n, d]) => (
                    <path key={n} d={d} stroke="#151515" strokeWidth={1.1} strokeLinejoin="round" />
                  ))}

                {/* The area's edge: each hub's circle minus the part inside the other's. */}
                <g clipPath="url(#cov-land)">
                  {hubs.map((h) => (
                    <g key={h.name} mask={`url(#${edgeId(h)})`}>
                      <circle data-ring data-origin={`${h.x} ${h.y}`} cx={h.x} cy={h.y} r={R} stroke="#d97706" strokeWidth={1.6} strokeDasharray="7 5" />
                    </g>
                  ))}
                </g>

                {showLink && (
                  <g mask="url(#cov-link)" stroke="#151515" strokeWidth={1.4}>
                    <path d={linkD} />
                    <path d={ticksD} />
                  </g>
                )}
              </svg>

              <div className="absolute inset-0">
                {props.states.map((s) => {
                  const p = at(s.lon, s.lat);
                  return (
                    <span
                      key={s.name}
                      className={cn("pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 font-mono text-12 tracking-[0.4em] sm:block", s.faint ? "text-ink/45" : "text-ink/60")}
                      style={{ left: p.left, top: p.top }}
                    >
                      {s.name}
                    </span>
                  );
                })}

                {/* Earlier lookups: small dots that can be picked again. Close to a hub or the current pin, the name waits for hover so labels don't pile up. */}
                {dots.map((t) => {
                  const crowded =
                    hubs.some((h) => Math.hypot(h.x - t.x, h.y - t.y) < CROWDED) ||
                    Math.hypot(selected.x - t.x, selected.y - t.y) < CROWDED ||
                    (showLink && Math.hypot(hub.x + dx / 2 - t.x, hub.y + dy / 2 - t.y) < CROWDED);
                  return (
                    <span key={t.key} onClick={() => pick(t)} className="group/town absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-8" style={{ left: t.left, top: t.top }}>
                      <span className="block size-[max(0.7rem,6px)] rounded-full bg-ink/55 transition-[scale,background-color] duration-300 group-hover/town:scale-150 group-hover/town:bg-ink" />
                      <span
                        className={cn(
                          "pointer-events-none absolute top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap font-mono text-12 uppercase tracking-[0.06em] transition-[color,opacity] duration-300 group-hover/town:text-ink sm:block",
                          t.x > VB.x + VB.w * 0.75 ? "right-full" : "left-full",
                          crowded ? "bg-white px-4 text-ink opacity-0 group-hover/town:opacity-100" : "text-ink/60",
                        )}
                      >
                        {t.zip ?? t.name}
                      </span>
                    </span>
                  );
                })}

                {hubs.map((h) => (
                  <span key={h.name} className="pointer-events-none absolute" style={{ left: h.left, top: h.top }}>
                    <span data-hub className="absolute -left-12 -top-12 flex size-24 items-center justify-center">
                      <span className="size-14 rotate-45 border-2 border-ink bg-amber" />
                    </span>
                    <span
                      className={cn(
                        "absolute top-0 hidden -translate-y-1/2 whitespace-nowrap bg-ink px-8 py-4 font-mono text-12 uppercase tracking-[0.06em] text-white sm:block",
                        h.side === "left" ? "right-20" : "left-20",
                      )}
                    >
                      {h.name}
                    </span>
                  </span>
                ))}

                {/* Picked town. GSAP scales the anchors; the offsets live on the inner spans so the two don't fight. */}
                {onMap && (
                  <>
                    <span data-pin className="pointer-events-none absolute" style={{ left: selected.left, top: selected.top }}>
                      <span className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink", home ? "size-40" : "size-16 bg-white")} />
                    </span>
                    {!home && (
                      <span data-pick className="pointer-events-none absolute" style={{ left: selected.left, top: selected.top }}>
                        <span className="absolute whitespace-nowrap border border-ink bg-white px-8 py-4 font-mono text-12 uppercase tracking-[0.06em] text-ink" style={{ transform: nameAt }}>
                          {selected.zip ?? selected.name}
                        </span>
                      </span>
                    )}
                    {showLink && selected.miles >= 45 && (
                      <span data-pick className="pointer-events-none absolute" style={mid}>
                        <span className="absolute whitespace-nowrap bg-amber px-6 py-2 font-mono text-12 text-ink" style={{ transform: milesAt }}>
                          {selected.miles} MI
                        </span>
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <ul className="mt-24 flex flex-wrap items-center gap-x-30 gap-y-12 font-mono text-12 uppercase tracking-[0.08em] text-label lg:justify-end">
              <li className="flex items-center gap-10">
                <span className="size-10 rotate-45 border-2 border-ink bg-amber" />
                {legend.hub}
              </li>
              <li className="flex items-center gap-10">
                <span className="h-14 w-22 border-[1.5px] border-dashed border-[#d97706] bg-amber/20" />
                {legend.area}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:row-start-2">
            <label htmlFor={inputId} className="mb-10 block font-mono text-12 uppercase tracking-[0.1em] text-label">
              {inputLabel}
            </label>
            <div className="relative">
              <input
                id={inputId}
                role="combobox"
                aria-expanded={open && matches.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={open && matches.length ? `${listId}-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
                value={query}
                placeholder={placeholder}
                onFocus={() => {
                  if (!data) loadLookup().then(setData);
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                  setActive(0);
                }}
                onClick={() => setOpen(true)}
                onKeyDown={onKeyDown}
                onBlur={() => setOpen(false)}
                className={cn(lightField, "lg:h-60")}
              />
              <ul
                id={listId}
                role="listbox"
                aria-label="Towns and ZIP codes"
                hidden={!open || matches.length === 0}
                data-lenis-prevent
                className="absolute inset-x-0 top-full z-20 mt-4 max-h-[30rem] overflow-y-auto border border-ink/15 bg-white py-6 shadow-[0_2rem_4rem_-2rem_rgba(0,0,0,0.25)]"
              >
                {matches.map((o, i) => (
                  <li
                    key={o.key}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(o);
                    }}
                    onMouseMove={() => setActive(i)}
                    className={cn("flex cursor-pointer items-baseline justify-between gap-20 px-20 py-10 text-16", i === active && "bg-concrete")}
                  >
                    {o.kind === "place" ? (
                      <span>
                        {o.where.zip && <span className="font-mono">{o.where.zip} · </span>}
                        {o.where.name}, <span className="text-label">{o.where.state}</span>
                      </span>
                    ) : (
                      <span>
                        {o.name}, <span className="text-label">{o.state}</span>
                      </span>
                    )}
                    <span className="font-mono text-12 text-label">{o.kind === "place" ? `${locate(o.where).miles} mi` : o.country}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-8">
              <span className="mr-4 font-mono text-12 uppercase tracking-[0.1em] text-label">{picksLabel}</span>
              {picks.map((name) => {
                const t = seeds.find((x) => x.name === name);
                if (!t) return null;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={!outside && selected.key === t.key}
                    onClick={() => pick(t)}
                    className="h-36 border border-ink/15 bg-white px-14 text-14 transition-colors duration-300 hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <div className="mt-30 bg-white">
              {outside?.kind === "abroad" ? (
                <div className="p-24 lg:p-30">
                  <div className="flex flex-wrap items-start justify-between gap-16">
                    <div>
                      <p className="font-mono text-12 uppercase tracking-[0.1em] text-label">Job site</p>
                      <p className="mt-10 text-[2.8rem] font-medium leading-none tracking-[-0.015em] lg:text-h6">{outside.label}</p>
                    </div>
                    <span className="border border-ink/30 px-10 py-6 font-mono text-12 uppercase tracking-[0.1em] text-ink">{abroad.badge}</span>
                  </div>
                  <p className="mt-16 text-16 text-body">{abroad.text}</p>
                </div>
              ) : outside ? (
                <div className="p-24 lg:p-30">
                  <p className="font-mono text-12 uppercase tracking-[0.1em] text-label">Job site</p>
                  <p className="mt-10 text-[2.8rem] font-medium leading-none tracking-[-0.015em] lg:text-h6">{outside.label}</p>
                  <p className="mt-16 text-16 text-body">{props.missing}</p>
                  <div className="mt-24 flex flex-wrap items-center gap-x-24 gap-y-14">
                    <Button onClick={() => quote.open({ location: outside.label })}>Get a quote</Button>
                    <Button variant="link" href={site.phone.href}>
                      Call {site.phone.display}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-16 border-b border-ink/10 p-24 lg:p-30">
                    <div>
                      <p className="font-mono text-12 uppercase tracking-[0.1em] text-label">Job site</p>
                      <p className="mt-10 text-[2.8rem] font-medium leading-none tracking-[-0.015em] lg:text-h6">{selected.key}</p>
                    </div>
                    <span
                      className={cn(
                        "px-10 py-6 font-mono text-12 uppercase tracking-[0.1em]",
                        tierKey === "near" ? "bg-amber text-ink" : tierKey === "range" ? "bg-ink text-white" : "border border-ink/30 text-ink",
                      )}
                    >
                      {tier.badge}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 border-b border-ink/10 font-mono text-13">
                    <div className="border-r border-ink/10 px-24 py-20 lg:px-30">
                      <dt className="text-12 uppercase tracking-[0.1em] text-label">Nearest hub</dt>
                      <dd className="mt-8 text-ink">{selected.nearest.name}</dd>
                    </div>
                    <div className="px-24 py-20 lg:px-30">
                      <dt className="text-12 uppercase tracking-[0.1em] text-label">Distance</dt>
                      <dd className="mt-8 text-ink">{home ? "In town" : `${selected.miles} mi`}</dd>
                    </div>
                  </dl>
                  <div className="p-24 lg:p-30">
                    <p className="text-16 text-body">
                      {summary}
                      {extra && ` ${extra}`}
                    </p>
                    <div className="mt-24 flex flex-wrap items-center gap-x-24 gap-y-14">
                      <Button onClick={() => quote.open({ location: selected.key })}>Get a quote for {selected.zip ?? selected.name}</Button>
                      <Button variant="link" href={site.phone.href}>
                        Call {site.phone.display}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              {live}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
