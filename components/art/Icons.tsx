/** Line icons. Stroke follows currentColor. */

import { useId } from "react";
import { cn } from "@/lib/cn";

type IconProps = { className?: string };

const s48 = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const techIcons = {
  afad: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <rect x="6" y="8" width="10" height="20" rx="2" />
      <circle cx="11" cy="14" r="2.5" />
      <circle cx="11" cy="22" r="2.5" />
      <path d="M11 28v13M6 41h10" />
      <path d="M16 31h26" />
      <path d="M22 29.5v3M28 29.5v3M34 29.5v3M40 29.5v3" />
    </svg>
  ),
  pcms: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <rect x="5" y="7" width="38" height="20" rx="2" />
      <path d="M10 13h0M14 13h0M18 13h0M24 13h0M28 13h0M32 13h0M38 13h0M10 21h0M16 21h0M20 21h0M26 21h0M30 21h0M36 21h0" strokeWidth="2.4" />
      <path d="M24 27v8M14 41l10-6 10 6M10 41h28" />
    </svg>
  ),
  signal: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <rect x="17" y="4" width="14" height="26" rx="3" />
      <circle cx="24" cy="10.5" r="2.6" />
      <circle cx="24" cy="17" r="2.6" />
      <circle cx="24" cy="23.5" r="2.6" />
      <path d="M24 30v6M24 36l-10 8M24 36l10 8M24 36v8" />
    </svg>
  ),
  realtime: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M8 40h32" />
      <path d="M14 40V28M24 40V20M34 40V24" />
      <path d="M12.5 12.5a16.3 16.3 0 0 1 23 0M17 17a9.9 9.9 0 0 1 14 0" />
      <circle cx="24" cy="21" r="1.2" />
    </svg>
  ),
  pedestrian: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <circle cx="21" cy="8" r="3" />
      <path d="M21 13l-4 11 5 5-2 12M17 24l-6 3M21 15l7 6 5-2M22 29l7 5 1 7" />
      <rect x="34" y="24" width="8" height="12" rx="1.5" />
      <circle cx="38" cy="30" r="1.6" />
    </svg>
  ),
  signshop: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M20 4l14 14-14 14L6 18z" />
      <path d="M20 32v12M14 44h12" />
      <path d="M30 30l9-9 4 4-9 9-5 1z" />
    </svg>
  ),
  /** Trailer-mounted arrow board: lamp chevron on a panel. */
  arrowboard: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <rect x="5" y="6" width="38" height="22" rx="2" />
      <path d="M14 17h18M26 11l6 6-6 6" />
      <path d="M24 28v7M12 41h24M16 41l8-6 8 6" />
    </svg>
  ),
  /** Radar speed feedback sign: digits over a radar arc. */
  speed: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <rect x="10" y="4" width="28" height="24" rx="2" />
      <path d="M16 11h5v10h-5M21 16h-5M27 11h5v10h-5z" />
      <path d="M24 28v14M16 42h16" />
      <path d="M38 34a8 8 0 0 0 0-8M42 37a13 13 0 0 0 0-14" />
    </svg>
  ),
  /** Work-zone intrusion alarm: cone sensor sending a pulse. */
  alarm: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M18 40l4-24h4l4 24z" />
      <path d="M14 40h20M20.5 26h7M19.5 32h9" />
      <path d="M33 14a9 9 0 0 1 0 12M37 10a15 15 0 0 1 0 20M15 14a9 9 0 0 0 0 12M11 10a15 15 0 0 0 0 20" />
    </svg>
  ),
  /** Truck-mounted attenuator: truck with a chevron crash cushion. */
  tma: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M4 30V16h16v14M20 22h8l4 8" />
      <rect x="32" y="20" width="12" height="12" />
      <path d="M35 32l6-12M38 32l6-12" />
      <circle cx="10" cy="34" r="3" />
      <circle cx="25" cy="34" r="3" />
      <path d="M4 30h30" />
    </svg>
  ),
  /** Camera trailer for remote monitoring. */
  camera: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M24 16v20M14 42h20M18 42l6-6 6 6" />
      <rect x="12" y="6" width="20" height="10" rx="2" />
      <path d="M32 9l6-3v10l-6-3" />
      <circle cx="18" cy="11" r="1.6" />
    </svg>
  ),
} as const;

export type TechIconKey = keyof typeof techIcons;

/**
 * Job-size icons for "Start where you are". Each has one small gesture when
 * its card (a `group`) is hovered or holds focus; movement is skipped under
 * reduced motion. Class names are written out in full so Tailwind finds them.
 */

export const tierIcons = {
  /** One crew: a traffic cone that wobbles once, as if it's just been set down. */
  day: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <g className="origin-[24px_42px] [transform-box:view-box] motion-safe:group-focus-within:animate-[tc-wobble_0.9s_ease-in-out_1] motion-safe:group-hover:animate-[tc-wobble_0.9s_ease-in-out_1]">
        <path d="M17 40L22 7H26L31 40Z" className="fill-amber" stroke="none" />
        <path d="M20.09 16H27.91L28.76 20H19.24ZM17.97 26H30.03L31.09 31H16.91Z" fill="#fff" stroke="none" />
        {/* Outline last, so the bands never cover it. */}
        <path d="M17 40L22 7H26L31 40Z" />
        <path d="M10 40H38V43H10Z" />
      </g>
    </svg>
  ),
  /** A project: a barricade whose two lamps switch on. */
  project: function ProjectIcon({ className }: IconProps) {
    const rails = `tier-rails-${useId().replace(/[^\w-]/g, "")}`;
    return (
      <svg {...s48} className={className}>
        <defs>
          <clipPath id={rails}>
            <rect x={6} y={20} width={36} height={7} />
            <rect x={6} y={31} width={36} height={7} />
          </clipPath>
        </defs>
        <path d="M12 15V44M36 15V44M8 44h8M32 44h8" />
        {/* White rails over the posts, stripes clipped inside them, then the rail borders on top. */}
        <path d="M6 20h36v7H6zM6 31h36v7H6z" fill="#fff" stroke="none" />
        <path d="M-2 40L20 18M6 40L28 18M14 40L36 18M22 40L44 18M30 40L52 18M38 40L60 18" clipPath={`url(#${rails})`} className="stroke-amber" strokeWidth={2.4} strokeLinecap="butt" />
        <path d="M6 20h36v7H6zM6 31h36v7H6z" />
        {[12, 36].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={10} r={7} stroke="none" className={cn("fill-amber opacity-0 transition-opacity duration-500 group-focus-within:opacity-30 group-hover:opacity-30", i > 0 && "delay-150")} />
            <circle cx={x} cy={10} r={3.2} className={cn("fill-amber/35 transition-[fill] duration-500 group-focus-within:fill-amber group-hover:fill-amber", i > 0 && "delay-150")} />
          </g>
        ))}
      </svg>
    );
  },
  /** A program: a route through several sites; the dashes run on and the pins lift in turn. */
  program: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M2 45C4 44 6 43 8 43C18 43 16 29 24 29S30 16 40 16C42 16 44 15 46 14" strokeDasharray="3 3" className="transition-[stroke-dashoffset] duration-1000 ease-out motion-safe:group-focus-within:[stroke-dashoffset:-12] motion-safe:group-hover:[stroke-dashoffset:-12]" />
      {(
        [
          [8, 43, ""],
          [24, 29, "delay-100"],
          [40, 16, "delay-200"],
        ] as const
      ).map(([x, y, delay]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <g className={cn("transition-[translate] duration-500 ease-out-expo motion-safe:group-focus-within:-translate-y-[3px] motion-safe:group-hover:-translate-y-[3px]", delay)}>
            <path d="M0 0C-1 -2.6 -4 -4.6 -4 -7.6a4 4 0 0 1 8 0C4 -4.6 1 -2.6 0 0Z" className="fill-amber" strokeWidth={1.2} />
            <circle cx={0} cy={-7.6} r={1.3} fill="currentColor" stroke="none" />
          </g>
        </g>
      ))}
    </svg>
  ),
} as const;

export type TierIconKey = keyof typeof tierIcons;

/**
 * Contact-card icons, in the same style as the job-size icons but fixed in
 * colour, so they read the same on the dark card and on its amber hover state:
 * ink outlines, white bodies, amber accents (each with an ink edge), and one
 * small gesture while the card (a `group`) is hovered or focused (movement
 * skipped under reduced motion). Use with `text-ink`.
 */
export const contactIcons = {
  /** Call: a handset that rings once while its signal lights up. */
  call: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      {/* Signal: amber arcs over a wider ink line, so they have a dark edge on any background. */}
      {[
        ["M29 12a7 7 0 0 1 7 7", ""],
        ["M29 6a13 13 0 0 1 13 13", "delay-150"],
      ].map(([d, delay]) => (
        <g key={d} className={cn("opacity-40 transition-opacity duration-500 group-focus-visible:opacity-100 group-hover:opacity-100", delay)}>
          <path d={d} strokeWidth={3.6} />
          <path d={d} className="stroke-amber" strokeWidth={1.6} />
        </g>
      ))}
      <g className="origin-[24px_26px] [transform-box:view-box] motion-safe:group-focus-visible:animate-[tc-wobble_0.9s_ease-in-out_1] motion-safe:group-hover:animate-[tc-wobble_0.9s_ease-in-out_1]">
        <path d="M13 11h6l3 8-4 2.6a18 18 0 0 0 10.4 10.4l2.6-4 8 3v6a3 3 0 0 1-3.2 3A29 29 0 0 1 10 14.2 3 3 0 0 1 13 11Z" fill="#fff" />
      </g>
    </svg>
  ),
  /** Quote: a work-order clipboard whose three boxes tick in turn (three quick steps). */
  quote: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M11 9h26v35H11z" fill="#fff" />
      <path d="M18 5h12v6H18z" className="fill-amber" />
      {[17, 25, 33].map((y, i) => (
        <g key={y}>
          <path d={`M15 ${y}h6v6h-6z`} fill="#fff" />
          <path
            d={`M16.3 ${y + 3.1}l1.5 1.5 2.9-3.1`}
            className={cn(
              "stroke-ink [stroke-dasharray:7] [stroke-dashoffset:7] transition-[stroke-dashoffset] duration-300 ease-out group-focus-visible:[stroke-dashoffset:0] group-hover:[stroke-dashoffset:0] motion-reduce:transition-none",
              ["delay-100", "delay-300", "delay-500"][i],
            )}
            strokeWidth={1.6}
          />
          <path d={`M25 ${y + 3}h8`} />
        </g>
      ))}
    </svg>
  ),
  /** Email: an envelope with an amber letter that lifts out of it. */
  email: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <g className="transition-[translate] duration-500 ease-out-expo motion-safe:group-focus-visible:-translate-y-[4px] motion-safe:group-hover:-translate-y-[4px]">
        <path d="M13 9h22v24H13z" className="fill-amber" />
        <path d="M17 15h14M17 20h10" className="stroke-ink" />
      </g>
      {/* The white envelope covers the letter's lower half; its flap seams are ink so they show on white. */}
      <path d="M6 22h36v20H6z" fill="#fff" />
      <path d="M6 22l18 12 18-12" className="stroke-ink" />
    </svg>
  ),
} as const;

export type ContactIconKey = keyof typeof contactIcons;

/**
 * Benefit icons for the careers page, in the same style as the job-size and
 * contact icons: closed shapes with outlines in the current colour, white
 * bodies, amber accents, and one small gesture while the card (a `group`) is
 * hovered or holds focus (movement skipped under reduced motion).
 */
export const benefitIcons = {
  /** Paid weekly: a calendar with a coin that lifts. */
  pay: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M7 11h34v30H7z" fill="#fff" />
      <path d="M7 11h34v8H7z" className="fill-amber" />
      <path d="M14 7h3v7h-3zM31 7h3v7h-3z" fill="#fff" />
      <path d="M11 23h4v4h-4zM23 23h4v4h-4zM11 30h4v4h-4zM17 30h4v4h-4z" fill="#fff" />
      <path d="M17 23h4v4h-4z" className="fill-amber" />
      <g className="transition-[translate] duration-500 ease-out-expo motion-safe:group-focus-within:-translate-y-[3px] motion-safe:group-hover:-translate-y-[3px]">
        <circle cx={35} cy={35} r={8} className="fill-amber" />
        <g transform="translate(35 35) scale(0.6) translate(-23.8 -29.1)">
          <path d="M27.5 25.2c-.9-1.3-2.3-1.9-3.7-1.9-2.2 0-3.8 1.1-3.8 2.8 0 1.8 1.6 2.4 3.8 2.9s4 1.3 4 3.2c0 1.8-1.7 3-4 3-1.7 0-3.3-.7-4.2-2M23.8 21.4v1.9M23.8 34.9v1.9" strokeWidth={2.6} />
        </g>
      </g>
    </svg>
  ),
  /** Free certification: a flagger card with a seal that wobbles once. */
  cert: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M5 12h38v26H5z" fill="#fff" />
      <path d="M5 12h38v6H5z" className="fill-amber" />
      <circle cx={15} cy={25} r={3.2} fill="#fff" />
      <path d="M9.5 34c.8-3.2 3-4.8 5.5-4.8s4.7 1.6 5.5 4.8Z" fill="#fff" />
      <path d="M25 25h11M25 30h6" />
      <g className="origin-[36px_35px] [transform-box:view-box] motion-safe:group-focus-within:animate-[tc-wobble_0.9s_ease-in-out_1] motion-safe:group-hover:animate-[tc-wobble_0.9s_ease-in-out_1]">
        <circle cx={36} cy={35} r={6.5} className="fill-amber" />
        <path d="M33.3 35.2l1.9 1.9 3.6-3.8" strokeWidth={1.6} />
      </g>
    </svg>
  ),
  /** Gear provided: a hard hat that tips up. */
  gear: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <g className="origin-[24px_37px] transition-[rotate,translate] duration-500 ease-out-expo [transform-box:view-box] motion-safe:group-focus-within:-translate-y-[2px] motion-safe:group-focus-within:-rotate-6 motion-safe:group-hover:-translate-y-[2px] motion-safe:group-hover:-rotate-6">
        <path d="M10 33c0-9.4 6.3-16 14-16s14 6.6 14 16Z" className="fill-amber" />
        <path d="M21 18.2Q24 16.7 27 18.2V33h-6Z" fill="#fff" />
        <path d="M5 33h38v4H5z" fill="#fff" />
      </g>
    </svg>
  ),
  /** Prevailing-wage work: a public building whose flag waves. */
  wage: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <path d="M24 9V2.5" />
      <g className="origin-[24px_4.7px] [transform-box:view-box] motion-safe:group-focus-within:animate-[tc-wobble_0.9s_ease-in-out_1] motion-safe:group-hover:animate-[tc-wobble_0.9s_ease-in-out_1]">
        <path d="M24 2.5h7l-2 2.2 2 2.2h-7Z" className="fill-amber" />
      </g>
      <path d="M24 9l18 9H6Z" className="fill-amber" />
      <path d="M8 18h32v4H8z" fill="#fff" />
      <path d="M10.25 22h3.5v12h-3.5zM18.25 22h3.5v12h-3.5zM26.25 22h3.5v12h-3.5zM34.25 22h3.5v12h-3.5z" fill="#fff" />
      <path d="M7 34h34v4H7z" fill="#fff" />
      <path d="M5 38h38v4H5z" fill="#fff" />
    </svg>
  ),
  /** Local work: a map pin that lifts off its shadow. */
  local: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <ellipse cx={24} cy={42} rx={8} ry={2.2} fill="#fff" />
      <g className="transition-[translate] duration-500 ease-out-expo motion-safe:group-focus-within:-translate-y-[3px] motion-safe:group-hover:-translate-y-[3px]">
        <path d="M24 40s11-10.6 11-19a11 11 0 0 0-22 0c0 8.4 11 19 11 19Z" className="fill-amber" />
        <circle cx={24} cy={21} r={4.2} fill="#fff" />
      </g>
    </svg>
  ),
  /** Come back every season: two arrow bands around a sun; they turn a step forward. */
  season: ({ className }: IconProps) => (
    <svg {...s48} className={className}>
      <g className="origin-center transition-[rotate] duration-700 ease-out-expo [transform-box:view-box] motion-safe:group-focus-within:rotate-45 motion-safe:group-hover:rotate-45">
        <path d="M8.03 18.19A17 17 0 0 1 39.98 18.19L42.8 17.16 39.92 24.6 32.93 20.75 35.75 19.73A12.5 12.5 0 0 0 12.25 19.73Z" fill="#fff" />
        <path d="M39.97 29.81A17 17 0 0 1 8.02 29.81L5.2 30.84 8.08 23.4 15.07 27.25 12.25 28.27A12.5 12.5 0 0 0 35.75 28.27Z" fill="#fff" />
      </g>
      <circle cx={24} cy={24} r={6} className="fill-amber" />
    </svg>
  ),
} as const;

export type BenefitIconKey = keyof typeof benefitIcons;

const s100 = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const whyIcons = {
  card: ({ className }: IconProps) => (
    <svg {...s100} className={className}>
      <rect x="10" y="24" width="80" height="54" rx="4" />
      <circle cx="32" cy="46" r="8" />
      <path d="M20 66c2-7 7-10 12-10s10 3 12 10" />
      <path d="M54 40h26M54 50h20M54 60h14" />
      <path d="M68 12l6 6 12-12" />
    </svg>
  ),
  crew: ({ className }: IconProps) => (
    <svg {...s100} className={className}>
      <path d="M8 86c0-11 7-18 16-18s16 7 16 18" />
      <circle cx="24" cy="56" r="7" />
      <path d="M15 50a9 9 0 0 1 18 0M13 50h22" />
      <path d="M60 86c0-11 7-18 16-18s16 7 16 18" />
      <circle cx="76" cy="56" r="7" />
      <path d="M67 50a9 9 0 0 1 18 0M65 50h22" />
      <path d="M30 92c0-13 9-21 20-21s20 8 20 21" />
      <circle cx="50" cy="52" r="9" />
      <path d="M39 44a11 11 0 0 1 22 0M36 44h28M50 33v-2" />
    </svg>
  ),
  seal: ({ className }: IconProps) => (
    <svg {...s100} className={className}>
      <path d="M50 8l8 6 10-1 3 9 9 5-2 10 5 8-7 7 1 10-10 3-5 9-9-3-8 5-6-8-10-1-1-10-8-6 5-9-3-9 9-5 2-10 10 1z" />
      <circle cx="50" cy="50" r="20" />
      <path d="M41 50l6 6 12-12" />
    </svg>
  ),
  federal: ({ className }: IconProps) => (
    <svg {...s100} className={className}>
      <path d="M14 88h72M18 80h64" />
      <path d="M24 80V50M36 80V50M64 80V50M76 80V50" />
      <path d="M18 50h64M22 44h56" />
      <path d="M30 44c0-12 9-20 20-20s20 8 20 20" />
      <path d="M50 24V12M50 12h10l-3 3 3 3H50" />
      <path d="M46 80V60h8v20" />
    </svg>
  ),
} as const;

export type WhyIconKey = keyof typeof whyIcons;

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4.5 2.5h3l1.5 4-2 1.3a9 9 0 0 0 5.2 5.2l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 3 4.1 1.5 1.5 0 0 1 4.5 2.5z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2.5" y="4.5" width="15" height="11" />
      {/* The flap seam stays a line when the envelope is given a fill. */}
      <path d="M2.5 5l7.5 6 7.5-6" fill="none" />
    </svg>
  );
}

/** Horizontal arrow, the same drawing as the arrow plate on buttons. Used for every link arrow. */
export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
      <path d="M2 10h15M11 4l6 6-6 6" />
    </svg>
  );
}

export function Plus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.4} className={className} aria-hidden>
      <path d="M10 1v18M1 10h18" />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={className} aria-hidden>
      <path d="M3 3l18 18M21 3L3 21" />
    </svg>
  );
}

/** STOP/SLOW paddle, the dispatch icon on the quick-quote card. */
export function Paddle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 76" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 2h20l14 14v20L42 50H22L8 36V16z" />
      <path d="M32 50v24" />
      <text x="32" y="31" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" fill="currentColor" stroke="none" letterSpacing="1">
        STOP
      </text>
    </svg>
  );
}

/**
 * Small traffic cone for inline use (the same drawing as the "one crew" tier
 * icon). Inside a `group/cone` it wobbles once on hover or focus.
 */
export function Cone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" className={className} aria-hidden>
      <g className="origin-[12px_21px] [transform-box:view-box] motion-safe:group-focus-within/cone:animate-[tc-wobble_0.9s_ease-in-out_1] motion-safe:group-hover/cone:animate-[tc-wobble_0.9s_ease-in-out_1]">
        <path d="M7 20L10.5 3.5H13.5L17 20Z" className="fill-amber" stroke="none" />
        <path d="M9.55 8H14.45L14.88 10H9.12ZM8.49 13H15.51L16.05 15.5H7.95Z" fill="#fff" stroke="none" />
        {/* Outline last, so the bands never cover it. */}
        <path d="M7 20L10.5 3.5H13.5L17 20Z" />
        <path d="M4 20H20V22H4Z" />
      </g>
    </svg>
  );
}
