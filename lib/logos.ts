/** A logo file and its trimmed artwork size. `weight` nudges airy marks up and solid ones down. */
export type Logo = { name: string; src: string; w: number; h: number; weight?: number };

/**
 * Optical sizing for a row of logos: every mark covers about the same area
 * (round seals grow, wide wordmarks shrink), adjusted by `weight` so thin
 * marks aren't lost next to solid ones. Returns CSS sizes as multiples of a
 * `--logo` length set by the parent.
 */
export function logoBox({ w, h, weight = 1 }: Logo) {
  const aspect = Math.sqrt(w / h);
  return {
    width: `calc(var(--logo) * ${(aspect * weight).toFixed(3)})`,
    height: `calc(var(--logo) * ${(weight / aspect).toFixed(3)})`,
  };
}
