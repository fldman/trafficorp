import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * TraffiCorp's truck (their own photo, cut out) and its wheels. In the photo
 * the hubs sit a few pixels off the tyre centres, so each wheel is rebuilt
 * concentric around its tyre: a fixed tyre ring of even thickness, and the
 * alloy rim on top, which turns. Positions are in artwork pixels.
 */
export const TRUCK = {
  src: "/images/brand/truck.png",
  w: 1037,
  h: 433,
  /** Tyres touch the ground 92.8% of the way down the artwork. */
  ground: 92.8,
  wheels: [
    { id: "front", cx: 167.27, cy: 330.25, box: 156, tyre: 75.74 },
    { id: "rear", cx: 820.37, cy: 330.18, box: 154, tyre: 74.46 },
  ],
} as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/**
 * The truck, standing with its tyres on the bottom edge of its box, so the
 * box's bottom can sit on a road line. Each rim carries `data-wheel` and
 * `data-tyre` (tyre radius as a share of the truck's width) so the caller can
 * turn it by exactly the distance driven. Faces left.
 */
export function Truck({ alt, sizes, className }: { alt: string; sizes: string; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ translate: `0 ${100 - TRUCK.ground}%` }}>
      <Image src={TRUCK.src} alt={alt} width={TRUCK.w} height={TRUCK.h} sizes={sizes} className="block h-auto w-full" />
      {TRUCK.wheels.map((wheel) => {
        const box = {
          left: pct(wheel.cx - wheel.box / 2, TRUCK.w),
          top: pct(wheel.cy - wheel.box / 2, TRUCK.h),
          width: pct(wheel.box, TRUCK.w),
        };
        return (
          <span key={wheel.id} aria-hidden>
            <span className="absolute aspect-square" style={box}>
              <Image src={`/images/brand/truck-tyre-${wheel.id}.png`} alt="" fill sizes="(min-width: 1200px) 8vw, 11vw" className="object-contain" />
            </span>
            <span data-wheel data-tyre={wheel.tyre / TRUCK.w} className="absolute aspect-square will-change-transform" style={box}>
              <Image src={`/images/brand/truck-wheel-${wheel.id}.png`} alt="" fill sizes="(min-width: 1200px) 8vw, 11vw" className="object-contain" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
