/**
 * TraffiCorp's corridor and the regional frame for the maps, as approximate
 * lon/lat waypoints projected with `project()` from mapData. Accurate enough
 * for a stylised regional map, not for navigation.
 */
import { project } from "@/lib/mapData";

type LonLat = readonly [number, number];

/** Smooth path through points (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(points: ReadonlyArray<readonly [number, number]>, tension = 0.5) {
  if (points.length < 2) return "";
  const p = points;
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const P = (pts: readonly LonLat[]) => pts.map(([lon, lat]) => project(lon, lat));

/**
 * TraffiCorp's corridor: Spokane east to Coeur d'Alene on I-90, south on
 * US-95 to Lewiston and Payette, then I-84 to Nampa and Boise.
 */
export const corridor = P([
  [-117.43, 47.66], [-117.1, 47.67], [-116.78, 47.68], [-116.89, 47.33], [-117.0, 46.73], [-117.02, 46.42],
  [-116.12, 45.93], [-116.31, 45.42], [-116.28, 44.97], [-116.44, 44.73], [-116.97, 44.25], [-116.93, 44.08],
  [-116.69, 43.66], [-116.56, 43.54], [-116.39, 43.61], [-116.2, 43.615],
]);

/** Frame used for the zoomed-out view: Washington and Idaho. */
export const region = (() => {
  const [x0, y0] = project(-124.8, 49.1);
  const [x1, y1] = project(-111.0, 42.0);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
})();
