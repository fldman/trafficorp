import { project, states } from "@/lib/mapData";
import { corridor, region, smoothPath } from "@/lib/geo";

const CORRIDOR = smoothPath(corridor);

/** Small static map of Washington and Idaho with one highlighted point. */
export function RegionMap({ lon, lat, label, className }: { lon: number; lat: number; label: string; className?: string }) {
  const [x, y] = project(lon, lat);
  const pad = 30;
  const vb = `${region.x - pad} ${region.y - pad} ${region.w + pad * 2} ${region.h + pad * 2}`;
  return (
    <svg viewBox={vb} className={className} role="img" aria-label={`Map of Washington and Idaho showing ${label}`}>
      {Object.entries(states).map(([name, d]) => (
        <path key={name} d={d} fill={name === "Washington" || name === "Idaho" ? "#ffffff" : "#e3e8eb"} stroke={name === "Washington" || name === "Idaho" ? "#151515" : "#c6cfd5"} strokeWidth={name === "Washington" || name === "Idaho" ? 2 : 1.5} />
      ))}
      <path d={CORRIDOR} fill="none" stroke="#f79521" strokeWidth={5} strokeDasharray="12 8" strokeLinecap="round" />
      <circle cx={x} cy={y} r={34} fill="#f79521" opacity={0.25} />
      <rect x={x - 13} y={y - 13} width={26} height={26} transform={`rotate(45 ${x} ${y})`} fill="#f79521" stroke="#151515" strokeWidth={3.5} />
    </svg>
  );
}
