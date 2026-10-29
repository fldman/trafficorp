import { cn } from "@/lib/cn";

/** Regular octagon (and the same shape scaled about the centre) in a 200 box. */
const octagon = (k: number) =>
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

const diamond = (k: number) =>
  [
    [100, 0],
    [200, 100],
    [100, 200],
    [0, 100],
  ]
    .map(([x, y]) => `${100 + (x - 100) * k},${100 + (y - 100) * k}`)
    .join(" ");

const type = { fontFamily: "var(--font-inter-tight)", fontWeight: 700 } as const;
const face = "absolute inset-0 size-full [backface-visibility:hidden]";

/**
 * A flagger's STOP/SLOW paddle, drawn flat like the site's other signs: a red
 * STOP octagon on the front and an amber SLOW diamond on the back. The board
 * (`data-board`) turns on its Y axis: rotationY 0 shows STOP, 180 shows SLOW.
 * `initial` sets the face shown before any script runs.
 */
export function PaddleBoard({ initial = "stop", className }: { initial?: "stop" | "slow"; className?: string }) {
  return (
    <div className={cn("relative aspect-square [perspective:140rem]", className)}>
      <div data-board className="relative size-full [transform-style:preserve-3d]" style={initial === "slow" ? { transform: "rotateY(180deg)" } : undefined}>
        <svg viewBox="0 0 200 200" className={face}>
          <polygon points={octagon(1)} fill="#b42318" />
          <polygon points={octagon(0.9)} fill="none" stroke="#ffffff" strokeWidth={5} />
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
  );
}
