/**
 * Plan-view drawing of a flagging operation on a two-lane road, in the style
 * of a traffic control plan (MUTCD TA-10: lane closure, one lane two-way,
 * flaggers at each end). The northbound lane is closed for the work space;
 * Flagger A holds southbound traffic at the top, Flagger B holds northbound
 * traffic at the bottom, and they take turns releasing traffic through the
 * one open lane. The amber centreline is The Line.
 *
 * Units: viewBox 0 0 400 1500. Southbound runs down the left lane,
 * northbound up the right lane.
 *
 * The traffic choreography (`trafficAt`) is a pure function of how far the
 * drawing has been revealed (`head`, in drawing units), so the section can
 * scrub it with scroll and reduced motion can show a single frame.
 */
import { CarPlan, ConeSide, CrewPlan, HatchDefs, Note, AMBER, SignPlan } from "@/components/art/Devices";

export const DIAGRAM_W = 400;
export const DIAGRAM_H = 1500;

/** Road extent and lane geometry. */
const ROAD = { top: 20, bottom: 1470, left: 110, centre: 200, right: 290 };
const LANE = { sb: 155, nb: 245 };

/** Where things sit along the road (y, drawing units). */
export const STATIONS = {
  /** Flagger A's stop bar across the southbound lane, and the flagger. */
  a: { bar: 400, x: 80, y: 418 },
  /** Downstream taper at the top end of the work space (northbound exit). */
  exitTaper: { from: 440, to: 520 },
  /** Cones along the centreline beside the work space. */
  channel: { from: 540, to: 990 },
  work: { from: 570, to: 950 },
  /** Transition taper closing the northbound lane. */
  entryTaper: { from: 1000, to: 1100 },
  b: { bar: 1140, x: 320, y: 1122 },
};

/** Scroll heights (drawing units) at which the flaggers turn their paddles. */
export const TURN = { a: 470, b: 1000 };

export const paths = {
  centre: `M${ROAD.centre} ${ROAD.top} L${ROAD.centre} ${ROAD.bottom}`,
  left: `M${ROAD.left} ${ROAD.top} L${ROAD.left} ${ROAD.bottom}`,
  right: `M${ROAD.right} ${ROAD.top} L${ROAD.right} ${ROAD.bottom}`,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** Northbound path: up the right lane, across into the open lane around the work space, and back. */
function northboundX(y: number) {
  const { entryTaper: e, exitTaper: x } = STATIONS;
  if (y >= e.to) return LANE.nb;
  if (y > e.from) return lerp(LANE.nb, LANE.sb, smooth((e.to - y) / (e.to - e.from)));
  if (y >= x.to) return LANE.sb;
  if (y > x.from) return lerp(LANE.sb, LANE.nb, smooth((x.to - y) / (x.to - x.from)));
  return LANE.nb;
}

/** Heading of a northbound car (degrees, nose up = 0), from the slope of its path. */
function northboundTilt(y: number) {
  return (Math.atan2(northboundX(y - 2) - northboundX(y + 2), 4) * 180) / Math.PI;
}

/** Ease a value towards a stop: unchanged until `soft`, then settles at `stop`. */
const settle = (raw: number, stop: number, soft = 60) => (raw < stop - soft ? raw : stop - soft * Math.exp(-(raw - (stop - soft)) / soft));

export type CarPose = { id: string; x: number; y: number; rotate: number; opacity: number };

/** Fade cars in and out within the ends of the road, so none sit past the break lines. */
const visible = (y: number) => smooth((y - ROAD.top - 20) / 60) * smooth((ROAD.bottom - 50 - y) / 60);

/**
 * Where every car is when the drawing has been revealed to `head`.
 * Southbound: two cars come down; the first passes Flagger A on SLOW, the
 * second arrives as A turns to STOP and waits at the bar. Northbound: two
 * cars wait at Flagger B until the open lane is clear, then B turns to SLOW
 * and they drive up through the work zone.
 */
export function trafficAt(head: number): CarPose[] {
  const s1 = 1.3 * head - 140;
  const s2 = settle(1.3 * head - 300, STATIONS.a.bar - 44);
  const n1 = head < TURN.b ? STATIONS.b.bar + 44 : STATIONS.b.bar + 44 - 1.8 * (head - TURN.b);
  const n2 = head < TURN.b + 40 ? STATIONS.b.bar + 154 : STATIONS.b.bar + 154 - 1.8 * (head - TURN.b - 40);
  return [
    { id: "s1", x: LANE.sb, y: s1, rotate: 180, opacity: visible(s1) },
    { id: "s2", x: LANE.sb, y: s2, rotate: 180, opacity: visible(s2) },
    { id: "n1", x: northboundX(n1), y: n1, rotate: northboundTilt(n1), opacity: visible(n1) },
    { id: "n2", x: northboundX(n2), y: n2, rotate: northboundTilt(n2), opacity: visible(n2) },
  ];
}

/** Paddle faces at a given reveal height. */
export const paddlesAt = (head: number) => ({ a: head < TURN.a ? "slow" : "stop", b: head < TURN.b ? "stop" : "slow" }) as const;

/** The frame shown without motion: A holding southbound, northbound coming through. */
export const STILL_HEAD = 1180;

const cones = [
  // Downstream taper: from the centreline back out to the right edge.
  ...Array.from({ length: 4 }, (_, i) => [lerp(208, 282, i / 3), lerp(STATIONS.exitTaper.to, STATIONS.exitTaper.from, i / 3)]),
  // Channel along the centreline beside the work space.
  ...Array.from({ length: 13 }, (_, i) => [208, lerp(STATIONS.channel.from, STATIONS.channel.to, i / 12)]),
  // Transition taper closing the northbound lane.
  ...Array.from({ length: 5 }, (_, i) => [lerp(208, 282, (i + 1) / 5), lerp(STATIONS.entryTaper.from, STATIONS.entryTaper.to, (i + 1) / 5)]),
];

/** A drafting break line across the road, marking where the drawing is cut. */
function BreakLine({ y }: { y: number }) {
  return <path d={`M96 ${y} H190 L195 ${y - 8} L205 ${y + 8} L210 ${y} H304`} stroke="currentColor" strokeWidth={1} />;
}

/** Outline arrow showing the direction of travel in a lane. */
function LaneArrow({ x, y, dir }: { x: number; y: number; dir: "up" | "down" }) {
  const s = dir === "up" ? -1 : 1;
  return (
    <path
      data-label
      d={`M${x} ${y - 16 * s} L${x} ${y + 10 * s} M${x - 6} ${y + 3 * s} L${x} ${y + 11 * s} L${x + 6} ${y + 3 * s}`}
      stroke="#b4b4b4"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/**
 * Flagger in plan view with a small STOP/SLOW paddle that mirrors the large
 * callout (`data-mini` faces are switched by the section). Faces right by
 * default; `mirror` faces left.
 */
function FlaggerStation({ id, x, y, mirror, initial }: { id: string; x: number; y: number; mirror?: boolean; initial: "stop" | "slow" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${mirror ? -1 : 1} 1)`}>
      <g data-pop>
        <ellipse rx={11} ry={6.5} fill="#fff" stroke="currentColor" strokeWidth={1} />
        <circle r={4.6} fill="#fff" stroke="currentColor" strokeWidth={1} />
        <line x1={9} y1={-2} x2={17} y2={-9} stroke="currentColor" strokeWidth={1.2} />
        <g data-mini={id} transform="translate(21 -14)">
          <polygon data-face="stop" points="-3.3,-8 3.3,-8 8,-3.3 8,3.3 3.3,8 -3.3,8 -8,3.3 -8,-3.3" fill="#b42318" stroke="currentColor" strokeWidth={0.8} opacity={initial === "stop" ? 1 : 0} />
          <polygon data-face="slow" points="0,-8.5 8.5,0 0,8.5 -8.5,0" fill={AMBER} stroke="currentColor" strokeWidth={0.8} opacity={initial === "slow" ? 1 : 0} />
        </g>
      </g>
    </g>
  );
}

export function WorkZoneDiagram({ className, maskId = "tc-centre-mask" }: { className?: string; maskId?: string }) {
  const still = trafficAt(STILL_HEAD);
  const tone: Record<string, "white" | "grey"> = { s1: "grey", s2: "white", n1: "white", n2: "grey" };
  const { a, b, work, channel } = STATIONS;

  return (
    <svg viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`} className={className} aria-hidden fill="none" overflow="visible">
      <defs>
        <HatchDefs id="tc-hatch-zone" />
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={DIAGRAM_W} height={DIAGRAM_H}>
          <path data-centre-mask d={paths.centre} stroke="#fff" strokeWidth={10} />
        </mask>
        {/* Reveals the road surface and shoulders with the drawing (full height without script). */}
        <clipPath id={`${maskId}-reveal`}>
          <rect data-reveal x={-200} y={0} width={DIAGRAM_W + 400} height={DIAGRAM_H} />
        </clipPath>
      </defs>

      <g className="text-ink">
        {/* Road surface and shoulders, revealed with the drawing; then the road edges */}
        <g clipPath={`url(#${maskId}-reveal)`}>
          <rect x={ROAD.left} y={ROAD.top} width={ROAD.right - ROAD.left} height={ROAD.bottom - ROAD.top} fill="#f6f7f8" />
          <path d={`M80 ${ROAD.top} L80 ${ROAD.bottom}`} stroke="#e2e2e2" strokeWidth={1} strokeDasharray="2 6" />
          <path d={`M320 ${ROAD.top} L320 ${ROAD.bottom}`} stroke="#e2e2e2" strokeWidth={1} strokeDasharray="2 6" />
        </g>
        <path data-edge d={paths.left} stroke="currentColor" strokeWidth={1.5} />
        <path data-edge d={paths.right} stroke="currentColor" strokeWidth={1.5} />
        <g data-label>
          <BreakLine y={ROAD.top} />
        </g>
        <g data-label>
          <BreakLine y={ROAD.bottom} />
        </g>

        {/* Direction of travel */}
        <LaneArrow x={LANE.sb} y={58} dir="down" />
        <LaneArrow x={LANE.nb} y={1432} dir="up" />
        <Note x={LANE.sb} y={92} anchor="middle">SB</Note>
        <Note x={LANE.nb} y={1404} anchor="middle">NB</Note>

        {/* Work space in the closed northbound lane */}
        <g data-pop data-at={work.from + 120}>
          <rect x={220} y={work.from} width={62} height={work.to - work.from} fill="url(#tc-hatch-zone)" stroke="currentColor" strokeWidth={1} />
        </g>
        <CrewPlan x={251} y={730} count={2} />
        <Note x={336} y={746} anchor="start" tone="ink">WORK</Note>
        <Note x={336} y={759} anchor="start" tone="ink">SPACE</Note>
        <Note x={336} y={485} anchor="start">TAPER</Note>
        <Note x={336} y={1056} anchor="start">TAPER</Note>
        <Note x={336} y={978} anchor="start">BUFFER</Note>

        {/* Southbound advance warning: signs on the driver's right (page left). */}
        <SignPlan x={64} y={110} code="W20-1" legend="ROAD WORK AHEAD" side="left" />
        <SignPlan x={64} y={210} code="W20-4" legend="ONE LANE ROAD" side="left" />
        <SignPlan x={64} y={310} code="W20-7" legend="FLAGGER" side="left" />

        {/* Northbound advance warning: signs on the driver's right (page right). */}
        <SignPlan x={336} y={1250} code="W20-7" legend="FLAGGER" side="right" />
        <SignPlan x={336} y={1350} code="W20-4" legend="ONE LANE ROAD" side="right" />
        <SignPlan x={336} y={1450} code="W20-1" legend="ROAD WORK AHEAD" side="right" />

        {/* Flagger stations: stop bars across the held lanes. */}
        <path data-label d={`M${ROAD.left + 3} ${a.bar} L${ROAD.centre - 3} ${a.bar}`} stroke="currentColor" strokeWidth={2.4} strokeDasharray="5 4" />
        <path data-label d={`M${ROAD.centre + 3} ${b.bar} L${ROAD.right - 3} ${b.bar}`} stroke="currentColor" strokeWidth={2.4} strokeDasharray="5 4" />
        <FlaggerStation id="a" x={a.x} y={a.y} initial="stop" />
        <FlaggerStation id="b" x={b.x} y={b.y} mirror initial="slow" />
        {/* Leaders out to the paddle callouts beside the drawing. */}
        <path data-label d={`M${a.x - 14} ${a.y} H-24`} stroke="#c4c4c4" strokeWidth={0.8} strokeDasharray="2 3" />
        <path data-label d={`M${b.x + 14} ${b.y} H424`} stroke="#c4c4c4" strokeWidth={0.8} strokeDasharray="2 3" />

        {/* Channelising devices, on a faint guide along the closed lane's edge */}
        <path d={`M208 ${channel.from} L208 ${channel.to}`} stroke="#f2d3ad" strokeWidth={0.8} />
        {cones.map(([x, y], i) => (
          <ConeSide key={i} x={x} y={y + 7} scale={0.42} />
        ))}


      </g>

      {/* The Line: dashed lane paint revealed by the mask, led by a solid tip */}
      <path d={paths.centre} stroke={AMBER} strokeWidth={3} strokeDasharray="16 12" mask={`url(#${maskId})`} />
      <path data-centre-tip d={paths.centre} stroke={AMBER} strokeWidth={3} strokeLinecap="round" />

      {/* Traffic drives over the lane paint. */}
      <g className="text-ink">
        {still.map((car) => (
          <g key={car.id} data-car={car.id} transform={`translate(${car.x} ${car.y}) rotate(${car.rotate})`} opacity={car.opacity}>
            <CarPlan x={0} y={0} scale={0.92} tone={tone[car.id]} pop={false} />
          </g>
        ))}
      </g>
    </svg>
  );
}
