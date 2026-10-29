/**
 * Line-art traffic devices, drawn in the plan-view language of a traffic
 * control plan. All pieces are SVG <g> groups positioned with x/y and
 * sized in user units, so diagrams can compose them freely.
 *
 * Ink is `currentColor`; amber is reserved for cones, signs, lamps and The Line.
 */
import { textToDots } from "@/lib/dotFont";

const INK = "currentColor";
/** TraffiCorp amber: cones, signs, lamps and The Line. */
export const AMBER = "#f79521";

type At = { x: number; y: number; rotate?: number; scale?: number; className?: string };

function place({ x, y, rotate = 0, scale = 1 }: At) {
  return `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
}

/** Cone, side view. Base centred on (x, y). Roughly 28×36 at scale 1. */
export function ConeSide(p: At) {
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <rect x={-14} y={-4} width={28} height={4} fill={INK} />
        <path d="M-10 -4 L-3.2 -36 L3.2 -36 L10 -4 Z" fill={AMBER} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        <path d="M-7.6 -15 L7.6 -15 L6.6 -20 L-6.6 -20 Z" fill="#fff" />
        <path d="M-5.4 -25 L5.4 -25 L4.6 -29 L-4.6 -29 Z" fill="#fff" />
      </g>
    </g>
  );
}

/** Channelising device in plan view (a small cone triangle). */
export function ConePlan(p: At) {
  return (
    <g transform={place(p)} className={p.className}>
      <path data-pop d="M0 -6.5 L5.6 3.5 L-5.6 3.5 Z" fill={AMBER} stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
    </g>
  );
}

/** Drum in plan view. */
export function DrumPlan(p: At) {
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <circle r={7} fill="#fff" stroke={INK} strokeWidth={1} />
        <circle r={4.2} fill="none" stroke={AMBER} strokeWidth={2.4} />
      </g>
    </g>
  );
}

/** Warning sign on a post, with an optional code and legend beside it. */
export function SignPlan({
  code,
  legend,
  side = "right",
  ...p
}: At & { code?: string; legend?: string; side?: "left" | "right" }) {
  const tx = side === "right" ? 20 : -20;
  const anchor = side === "right" ? "start" : "end";
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <line x1={0} y1={0} x2={0} y2={14} stroke={INK} strokeWidth={1.2} />
        <rect x={-9} y={-9} width={18} height={18} transform="rotate(45)" fill={AMBER} stroke={INK} strokeWidth={1.1} />
        <rect x={-5} y={-5} width={10} height={10} transform="rotate(45)" fill="none" stroke={INK} strokeWidth={0.6} />
      </g>
      {(code || legend) && (
        <g data-label fontFamily="var(--font-mono)" fill="#767676" textAnchor={anchor}>
          {code && (
            <text x={tx} y={-2} fontSize={9} letterSpacing={0.4}>
              {code}
            </text>
          )}
          {legend && (
            <text x={tx} y={10} fontSize={9} letterSpacing={0.4} fill="#4b4b4b">
              {legend}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

/** Regulatory sign (speed limit), rectangular. */
export function SpeedSignPlan({ value, side = "left", label = true, ...p }: At & { value: string; side?: "left" | "right"; label?: boolean }) {
  const tx = side === "right" ? 18 : -18;
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <line x1={0} y1={0} x2={0} y2={16} stroke={INK} strokeWidth={1.2} />
        <rect x={-9} y={-12} width={18} height={22} fill="#fff" stroke={INK} strokeWidth={1.1} />
        <text x={0} y={5} fontSize={9} textAnchor="middle" fontFamily="var(--font-mono)" fontWeight={700} fill={INK}>
          {value}
        </text>
      </g>
      {label && <text data-label x={tx} y={2} fontSize={9} letterSpacing={0.4} fontFamily="var(--font-mono)" fill="#767676" textAnchor={side === "right" ? "start" : "end"}>
        R2-1 · {value} MPH
      </text>}
    </g>
  );
}

/** Flagger in plan view: hard hat, shoulders and a STOP/SLOW paddle. */
export function FlaggerPlan(p: At) {
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <ellipse cx={0} cy={0} rx={11} ry={6.5} fill="#fff" stroke={INK} strokeWidth={1} />
        <circle cx={0} cy={0} r={4.6} fill="#fff" stroke={INK} strokeWidth={1} />
        <line x1={9} y1={-2} x2={18} y2={-10} stroke={INK} strokeWidth={1.2} />
        <path
          d="M18 -18.5 L22.4 -18.5 L25.5 -15.4 L25.5 -11 L22.4 -7.9 L18 -7.9 L14.9 -11 L14.9 -15.4 Z"
          fill={AMBER}
          stroke={INK}
          strokeWidth={0.9}
        />
      </g>
    </g>
  );
}

/** Passenger car, plan view, nose pointing up. 40×84 at scale 1. `pop={false}` for cars that are animated as traffic. */
export function CarPlan(p: At & { tone?: "white" | "grey"; pop?: boolean }) {
  const body = p.tone === "grey" ? "#ececec" : "#fff";
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop={p.pop === false ? undefined : true} transform="translate(-20 -42)" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" fill="none">
        <rect x={1} y={1} width={38} height={82} rx={12} fill={body} />
        <path d="M5.5 23 Q20 17.5 34.5 23 L31.5 33.5 Q20 31 8.5 33.5 Z" fill="#dfe4e7" />
        <path d="M8.5 61 Q20 63.5 31.5 61 L33.5 69 Q20 72 6.5 69 Z" fill="#dfe4e7" />
        <line x1={8.5} y1={33.5} x2={8.5} y2={61} />
        <line x1={31.5} y1={33.5} x2={31.5} y2={61} />
        <path d="M12 5 Q20 3 28 5" />
        <rect x={-2.5} y={25} width={4} height={6} rx={1.5} fill={body} />
        <rect x={38.5} y={25} width={4} height={6} rx={1.5} fill={body} />
      </g>
    </g>
  );
}

/** TraffiCorp pilot car: pickup with amber light bar and FOLLOW ME sign. 46×110. */
export function PilotCarPlan(p: At) {
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop transform="translate(-23 -55)" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" fill="none">
        <rect x={1} y={1} width={44} height={108} rx={11} fill="#fff" />
        <path d="M6 22 Q23 16.5 40 22 L37 32 Q23 29.5 9 32 Z" fill="#dfe4e7" />
        <rect x={9} y={32} width={28} height={21} rx={2} fill="#fff" />
        <rect x={10} y={39} width={26} height={6} rx={2} fill={AMBER} className="tc-lamp" />
        <path d="M9 53 L37 53 L38.5 58 L7.5 58 Z" fill="#dfe4e7" />
        <rect x={6} y={61} width={34} height={44} rx={2.5} fill="#fff" />
        <rect x={10} y={66} width={26} height={34} rx={1} fill={AMBER} />
        <path d="M14 3.5 Q23 1.5 32 3.5" />
        <rect x={-2.5} y={24} width={4} height={6} rx={1.5} fill="#fff" />
        <rect x={44.5} y={24} width={4} height={6} rx={1.5} fill="#fff" />
        <g fill="#151515" stroke="none" fontFamily="var(--font-mono)" fontWeight={700} fontSize={5.4} textAnchor="middle">
          <text x={23} y={80}>FOLLOW</text>
          <text x={23} y={88}>ME</text>
        </g>
      </g>
    </g>
  );
}

/** Truck-mounted attenuator: work truck with chevron rear panel. 50×120, nose up. */
export function AttenuatorPlan(p: At) {
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop transform="translate(-25 -60)" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" fill="none">
        <rect x={2} y={1} width={46} height={30} rx={8} fill="#fff" />
        <path d="M7 17 Q25 12 43 17 L41 25 L9 25 Z" fill="#dfe4e7" />
        <rect x={10} y={18} width={30} height={5} rx={2} fill={AMBER} />
        <rect x={1} y={33} width={48} height={64} rx={2} fill="#fff" />
        <rect x={6} y={99} width={38} height={20} fill="#fff" />
        <clipPath id="tma-clip">
          <rect x={6} y={99} width={38} height={20} />
        </clipPath>
        <g clipPath="url(#tma-clip)" stroke="none">
          {[-30, -16, -2, 12, 26, 40].map((o) => (
            <path key={o} d={`M${o} 119 L${o + 7} 119 L${o + 27} 99 L${o + 20} 99 Z`} fill={AMBER} />
          ))}
        </g>
        <rect x={6} y={99} width={38} height={20} />
      </g>
    </g>
  );
}

/** Arrow board in plan view: lamp matrix forming a chevron that flashes in sequence. */
export function ArrowBoardPlan({ dir = "left", ...p }: At & { dir?: "left" | "right" }) {
  const lamps: Array<[number, number, number]> = [];
  // shaft
  for (let i = 0; i < 5; i++) lamps.push([-14 + i * 6, 0, i]);
  // head
  lamps.push([-14, 0, 5], [-8, -6, 5], [-8, 6, 5], [-2, -12, 6], [-2, 12, 6]);
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <path d="M-30 -2 L-38 0 L-30 2" fill="none" stroke={INK} strokeWidth={1} />
        <rect x={-30} y={-20} width={56} height={40} rx={2} fill="#151515" stroke={INK} strokeWidth={1} />
        <g transform={dir === "right" ? "scale(-1 1) translate(4 0)" : undefined}>
          {lamps.map(([lx, ly, seq], i) => (
            <circle key={i} cx={lx} cy={ly} r={2.1} fill={AMBER} className="tc-lamp" style={{ animationDelay: `${(4 - Math.min(seq, 4)) * 0.12}s` }} />
          ))}
        </g>
      </g>
    </g>
  );
}

/** Portable changeable message sign: dark panel with amber dot text. */
export function PcmsPlan({ lines, ...p }: At & { lines: string[] }) {
  const pitch = 2.6;
  const maxLen = Math.max(...lines.map((l) => l.length));
  const w = maxLen * 6 * pitch + 10;
  const h = lines.length * 9 * pitch + 6;
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <line x1={0} y1={h / 2} x2={0} y2={h / 2 + 14} stroke={INK} strokeWidth={1.2} />
        <path d={`M-14 ${h / 2 + 14} L14 ${h / 2 + 14}`} stroke={INK} strokeWidth={1.2} />
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} fill="#151515" stroke={INK} strokeWidth={1} />
        {lines.map((line, li) => {
          const offset = ((maxLen - line.length) * 6 * pitch) / 2;
          return textToDots(line).map(([c, r], i) => (
            <circle
              key={`${li}-${i}`}
              cx={-w / 2 + 5 + offset + c * pitch + pitch / 2}
              cy={-h / 2 + 4 + li * 9 * pitch + r * pitch + pitch / 2}
              r={pitch * 0.38}
              fill={AMBER}
            />
          ));
        })}
      </g>
    </g>
  );
}

/** Automated flagger assistance device: signal head and gate arm. */
export function AfadPlan({ open = false, ...p }: At & { open?: boolean }) {
  return (
    <g transform={place(p)} className={p.className}>
      <g data-pop>
        <rect x={-10} y={-10} width={20} height={20} rx={2} fill="#fff" stroke={INK} strokeWidth={1} />
        <circle cx={0} cy={-3.5} r={2.6} fill={AMBER} />
        <circle cx={0} cy={3.5} r={2.6} fill="none" stroke={INK} strokeWidth={0.8} />
        <g transform={open ? "rotate(-70)" : undefined}>
          <rect x={10} y={-1.6} width={62} height={3.2} fill="#fff" stroke={INK} strokeWidth={0.8} />
          {[16, 30, 44, 58].map((x) => (
            <rect key={x} x={x} y={-1.6} width={7} height={3.2} fill={AMBER} />
          ))}
        </g>
      </g>
    </g>
  );
}

/** Hatch pattern for work areas. Include once inside an SVG's <defs>. */
export function HatchDefs({ id = "tc-hatch" }: { id?: string }) {
  return (
    <pattern id={id} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={8} height={8} fill="#fff" />
      <line x1={0} y1={0} x2={0} y2={8} stroke="#151515" strokeWidth={0.9} />
    </pattern>
  );
}

/** Crew members (hard hats) in plan view. */
export function CrewPlan({ count = 3, ...p }: At & { count?: number }) {
  return (
    <g transform={place(p)} className={p.className}>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} data-pop transform={`translate(${i * 18 - (count - 1) * 9} ${i % 2 ? 8 : 0})`}>
          <ellipse rx={8} ry={5} fill="#fff" stroke={INK} strokeWidth={0.9} />
          <circle r={3.8} fill="#fff" stroke={INK} strokeWidth={0.9} />
        </g>
      ))}
    </g>
  );
}

/** Small mono annotation, like the callouts on a traffic control plan drawing. */
export function Note({ x, y, children, anchor = "start", tone = "grey" }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; tone?: "grey" | "ink" }) {
  return (
    <text data-label x={x} y={y} fontSize={9} letterSpacing={0.5} fontFamily="var(--font-mono)" fill={tone === "ink" ? "#4b4b4b" : "#9a9a9a"} textAnchor={anchor}>
      {children}
    </text>
  );
}
