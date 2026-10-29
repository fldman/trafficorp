/**
 * The site's amber LED, shared by every dot-matrix surface (loader board,
 * footer message board, the lamp field behind the tech tiles) so they all
 * look like the same hardware. Returns pre-rendered sprites for one cell.
 */
export const LED = {
  /** Lens size as a share of the cell pitch. */
  size: 0.92,
  /** Unlit lens colour on asphalt / night. */
  off: "#24190d",
  core: "#fff1d6",
} as const;

export function ledSprites(pitch: number, color = "#f79521") {
  const make = (lit: boolean) => {
    const c = document.createElement("canvas");
    c.width = c.height = Math.max(2, Math.ceil(pitch * LED.size));
    const g = c.getContext("2d")!;
    const r = c.width / 2;
    if (lit) {
      const grad = g.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, LED.core);
      grad.addColorStop(0.28, color);
      grad.addColorStop(0.62, color);
      grad.addColorStop(1, "rgba(247,149,33,0)");
      g.fillStyle = grad;
    } else g.fillStyle = LED.off;
    g.beginPath();
    g.arc(r, r, lit ? r : r * 0.62, 0, Math.PI * 2);
    g.fill();
    return c;
  };
  return { lit: make(true), dim: make(false) };
}
