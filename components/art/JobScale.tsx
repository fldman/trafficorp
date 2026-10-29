/**
 * Three small traffic control plans that show a job growing, drawn in the
 * same plan-view language as the "Our answer" drawing: a day's lane closure
 * with one flagger, a project closure with signs, a message board and two
 * flaggers, and a corridor map with work zones strung along it.
 *
 * Everything is in user units on a 443-wide sheet (the card's inner width in
 * rem × 10), so each height matches its card's plan box. Road parts sit in a
 * clip (`data-wipe`) the card reveals left to right; devices carry `data-pop`
 * and labels `data-label` for the card's entrance.
 */
import { AMBER, CarPlan, ConePlan, CrewPlan, FlaggerPlan, HatchDefs, PcmsPlan, SignPlan } from "@/components/art/Devices";

export const SCALE_W = 443;
export const SCALE_H = { day: 160, project: 240, program: 320 } as const;
export type JobScale = keyof typeof SCALE_H;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** `n` evenly spaced points from (x0, y0) to (x1, y1). */
const run = (n: number, x0: number, y0: number, x1: number, y1: number) =>
  Array.from({ length: n }, (_, i) => [lerp(x0, x1, i / (n - 1)), lerp(y0, y1, i / (n - 1))] as const);

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end" }) {
  return (
    <text data-label x={x} y={y} fontSize={10} letterSpacing={0.6} fontFamily="var(--font-mono)" fill="#6b6b6b" textAnchor={anchor}>
      {children}
    </text>
  );
}

/** Outline arrow for the direction of travel in a lane. */
function Arrow({ x, y, dir }: { x: number; y: number; dir: "left" | "right" }) {
  const s = dir === "right" ? 1 : -1;
  return (
    <path
      data-label
      d={`M${x - 12 * s} ${y} H${x + 8 * s} M${x + 2 * s} ${y - 5} L${x + 9 * s} ${y} L${x + 2 * s} ${y + 5}`}
      stroke="#b4b4b4"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Two-lane road straight across the sheet, centreline at `y`, with The Line as lane paint. */
function Road({ y, lane, wipe }: { y: number; lane: number; wipe: string }) {
  const top = y - lane;
  const bottom = y + lane;
  const across = (yy: number) => `M-10 ${yy} H${SCALE_W + 10}`;
  return (
    <g clipPath={`url(#${wipe})`}>
      <rect x={-10} y={top} width={SCALE_W + 20} height={lane * 2} fill="#f6f7f8" />
      <path d={`${across(top - 14)} ${across(bottom + 14)}`} stroke="#e2e2e2" strokeWidth={1} strokeDasharray="2 6" />
      <path d={`${across(top)} ${across(bottom)}`} stroke="currentColor" strokeWidth={1.2} />
      <path d={across(y)} stroke={AMBER} strokeWidth={2.2} strokeDasharray="12 9" />
    </g>
  );
}

/** One crew for a day: a short closure of the eastbound lane, one flagger holding traffic. */
function Day({ id }: { id: string }) {
  const cones = [...run(4, 178, 101, 228, 83), ...run(6, 240, 83, 316, 83), ...run(3, 328, 85, 352, 101)];
  // Drawn a little closer than the others: a small job fills its sheet.
  return (
    <g transform="translate(222 82) scale(1.15) translate(-222 -82)">
      <Road y={78} lane={26} wipe={`${id}-wipe`} />
      <Arrow x={44} y={65} dir="left" />
      <Arrow x={404} y={91} dir="right" />
      <g data-pop>
        <rect x={236} y={87} width={84} height={13} fill={`url(#${id}-hatch)`} stroke="currentColor" strokeWidth={0.9} />
      </g>
      {cones.map(([x, y], i) => (
        <ConePlan key={i} x={x} y={y} scale={0.8} />
      ))}
      <CrewPlan x={278} y={92} count={2} scale={0.7} />
      <SignPlan x={56} y={128} scale={0.7} />
      <CarPlan x={98} y={91} rotate={90} scale={0.38} />
      <FlaggerPlan x={148} y={124} scale={0.8} />
      <CarPlan x={300} y={65} rotate={-90} scale={0.38} tone="grey" />
      <SignPlan x={392} y={30} scale={0.7} />
      <Label x={278} y={140}>WORK SPACE</Label>
    </g>
  );
}

/** A project: a longer closure with advance signs and a message board, a flagger at each end. */
function Project({ id }: { id: string }) {
  const cones = [...run(4, 116, 143, 164, 125), ...run(9, 174, 125, 302, 125), ...run(3, 314, 127, 338, 143)];
  return (
    <>
      <Road y={120} lane={26} wipe={`${id}-wipe`} />
      <Arrow x={40} y={107} dir="left" />
      <Arrow x={408} y={133} dir="right" />
      <SignPlan x={22} y={172} scale={0.7} />
      <CarPlan x={58} y={133} rotate={90} scale={0.38} />
      <PcmsPlan x={66} y={204} scale={0.75} lines={["ONE", "LANE"]} />
      <FlaggerPlan x={106} y={168} scale={0.8} />
      <g data-pop>
        <rect x={172} y={129} width={134} height={13} fill={`url(#${id}-hatch)`} stroke="currentColor" strokeWidth={0.9} />
      </g>
      {cones.map(([x, y], i) => (
        <ConePlan key={i} x={x} y={y} scale={0.8} />
      ))}
      <CrewPlan x={239} y={134} count={3} scale={0.7} />
      <CarPlan x={252} y={107} rotate={-90} scale={0.38} tone="grey" />
      <FlaggerPlan x={352} y={72} rotate={180} scale={0.8} />
      <SignPlan x={420} y={68} scale={0.7} />
      <Label x={239} y={174}>WORK SPACE</Label>
    </>
  );
}

/** The corridor: one cubic through the sheet; work zones sit on it at these points. */
const CORRIDOR = [
  [-20, 268],
  [170, 268],
  [240, 78],
  [463, 70],
] as const;

/** Rounded so the server and the browser print identical numbers (their trig differs in the last digits). */
const r2 = (n: number) => Math.round(n * 100) / 100;

function corridorAt(t: number) {
  const u = 1 - t;
  const [p0, p1, p2, p3] = CORRIDOR;
  const at = (i: 0 | 1) => u ** 3 * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t ** 3 * p3[i];
  const slope = (i: 0 | 1) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]);
  return { x: r2(at(0)), y: r2(at(1)), angle: r2((Math.atan2(slope(1), slope(0)) * 180) / Math.PI) };
}

/** Work zones along the corridor, labelled by milepost; labels alternate sides of the road. */
const ZONES = [
  { t: 0.14, mp: "MP 3", side: 1 },
  { t: 0.38, mp: "MP 11", side: -1 },
  { t: 0.6, mp: "MP 18", side: 1 },
  { t: 0.84, mp: "MP 26", side: -1 },
] as const;

/** A season-long program: a corridor map with a work zone at each milepost and the dispatch yard. */
function Program({ id }: { id: string }) {
  const [p0, p1, p2, p3] = CORRIDOR.map((p) => p.join(" "));
  const d = `M${p0} C${p1} ${p2} ${p3}`;
  const minor = (path: string) => (
    <>
      <path d={path} stroke="currentColor" strokeWidth={13} opacity={0.35} />
      <path d={path} stroke="#f6f7f8" strokeWidth={11} />
    </>
  );
  return (
    <>
      <g clipPath={`url(#${id}-wipe)`}>
        {/* Side streets under the corridor */}
        {minor("M118 -10 V330")}
        {minor("M338 -10 V330")}
        {minor("M-10 132 H118")}
        {minor("M338 250 H453")}
        {minor("M34 222 V262")}
        {/* The corridor, with The Line down the middle */}
        <path d={d} stroke="currentColor" strokeWidth={26} />
        <path d={d} stroke="#f6f7f8" strokeWidth={23.6} />
        <path d={d} stroke={AMBER} strokeWidth={1.8} strokeDasharray="10 8" />
      </g>

      {/* North arrow */}
      <g data-label transform="translate(28 34)">
        <circle r={11} stroke="#c4c4c4" strokeWidth={1} />
        <path d="M0 -7 L4 5 L0 2 L-4 5 Z" fill="currentColor" />
        <text y={-15} fontSize={9} fontFamily="var(--font-mono)" fill="#6b6b6b" textAnchor="middle">
          N
        </text>
      </g>

      {/* Dispatch yard on its access road */}
      <g data-pop>
        <rect x={25} y={205} width={18} height={18} fill="currentColor" />
        <rect x={31} y={211} width={6} height={6} fill={AMBER} />
      </g>
      <Label x={34} y={196}>DISPATCH</Label>

      {ZONES.map(({ t, mp, side }) => {
        const { x, y, angle } = corridorAt(t);
        const rad = (angle * Math.PI) / 180;
        // Unit normal to the road, flipped to the label's side.
        const nx = -Math.sin(rad) * side;
        const ny = Math.cos(rad) * side;
        const off = (k: number) => `${r2(x + nx * k)} ${r2(y + ny * k)}`;
        return (
          <g key={mp}>
            <g transform={`translate(${x} ${y}) rotate(${angle})`}>
              <g data-pop>
                <rect x={-18} y={1.5} width={36} height={8} fill={`url(#${id}-hatch)`} stroke={AMBER} strokeWidth={1.6} />
              </g>
            </g>
            <path data-label d={`M${off(15)} L${off(28)}`} stroke="#c4c4c4" strokeWidth={0.9} strokeDasharray="2 2" />
            <Label x={r2(x + nx * 36)} y={r2(y + ny * 36 + 3.5)}>
              {mp}
            </Label>
          </g>
        );
      })}
    </>
  );
}

export function JobScaleArt({ scale, className }: { scale: JobScale; className?: string }) {
  const id = `tc-scale-${scale}`;
  const h = SCALE_H[scale];
  return (
    <svg viewBox={`0 0 ${SCALE_W} ${h}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden fill="none">
      <defs>
        <HatchDefs id={`${id}-hatch`} />
        <clipPath id={`${id}-wipe`}>
          <rect data-wipe x={-10} y={-10} width={SCALE_W + 20} height={h + 20} />
        </clipPath>
      </defs>
      <g className="text-ink">
        {scale === "day" && <Day id={id} />}
        {scale === "project" && <Project id={id} />}
        {scale === "program" && <Program id={id} />}
      </g>
    </svg>
  );
}
