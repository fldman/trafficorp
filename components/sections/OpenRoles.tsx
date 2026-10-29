"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { LightField } from "@/components/ui/LightField";
import { OverlapCard } from "@/components/sections/Tech";
import { Plus } from "@/components/art/Icons";

type Role = {
  title: string;
  where: string;
  type: string;
  pay: string;
  summary: string;
  duties: readonly string[];
  /** Requirements on top of the ones every role shares. */
  extra: readonly string[];
};

type OpenRolesProps = {
  id?: string;
  /** Kept in the content for reference; the amber heading card stands in for a label, as on the homepage. */
  label?: string;
  title: string;
  image: { src: string; alt: string; position?: string };
  apply: { label: string; href: string };
  items: readonly Role[];
  /** Requirements every role shares. */
  everyone: readonly string[];
};

const caption = "font-mono text-12 uppercase tracking-[0.12em] text-white/70";

function Points({ items, strong }: { items: readonly string[]; strong?: boolean }) {
  return (
    <ul className="mt-12 space-y-10">
      {items.map((x) => (
        <li key={x} className={cn("flex gap-12 text-16", strong ? "text-white" : "text-white/75")}>
          <span aria-hidden className={cn("mt-[0.8rem] size-8 shrink-0 rotate-45", strong ? "bg-amber" : "bg-white/40")} />
          {x}
        </li>
      ))}
    </ul>
  );
}

/**
 * Open positions, styled like the smart-tech section on the homepage: a
 * full-bleed band of a road job, the heading on an amber card that overlaps
 * it, and the roles as frosted-glass tiles over a board of LEDs that light up
 * around the pointer, set in the same narrower frame as the closing call to
 * action. Each role opens to what the job involves and what it takes: its own
 * requirements first, then the ones every role shares. Collapsed panels are
 * inert, so their Apply links leave the tab order.
 */
export function OpenRoles({ id, title, image, apply, items, everyone }: OpenRolesProps) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id={id} data-header="dark" className="on-dark relative bg-asphalt text-white">
      <div className="relative">
        <ParallaxImage src={image.src} alt={image.alt} sizes="100vw" position={image.position} className="h-[30rem] w-full md:h-[44rem] lg:h-[56rem]" />
        {/* Reaches 2px past the band, so its sub-pixel bottom edge never shows as a hairline. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-[2px] h-1/2 bg-[linear-gradient(to_top,#111112,rgba(17,17,18,0))]" />
      </div>

      {/* Unlit lamps behind the roles light up around the pointer. */}
      <LightField className="pb-[8.4rem] lg:pb-[18rem]">
        <Container className="relative">
          <div className="mx-auto max-w-[136rem]">
            <OverlapCard title={title} className="relative z-10 -mt-[10rem] lg:-mt-[13.3rem] lg:w-[64.3rem]" />

            <ul className="mt-40 grid gap-12 lg:mt-[6rem] lg:gap-16">
              {items.map((r, i) => {
                const isOpen = open === i;
                const pid = `${base}-${i}`;
                return (
                  <li key={r.title} className={cn("backdrop-blur-[0.6rem] transition-colors duration-300", isOpen ? "bg-white/[0.09]" : "bg-white/[0.05] hover:bg-white/[0.09]")}>
                    <h3>
                      <button
                        type="button"
                        id={`${pid}-h`}
                        aria-expanded={isOpen}
                        aria-controls={`${pid}-p`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex w-full items-start justify-between gap-24 p-24 text-left lg:items-center lg:px-40 lg:py-30"
                      >
                        <span className="min-w-0">
                          <span className="block text-[2.4rem] font-medium leading-[1.1] tracking-[-0.01em] transition-colors duration-300 group-hover:text-amber group-focus-visible:text-amber lg:text-h6">
                            {r.title}
                          </span>
                          <span className={cn(caption, "mt-10 block")}>
                            {r.where} · {r.type}
                            <span className="text-amber lg:hidden"> · {r.pay}</span>
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-30">
                          <span className="hidden font-mono text-14 text-amber lg:block">{r.pay}</span>
                          <Plus className={cn("mt-8 size-18 transition-[rotate] duration-500 ease-out-expo lg:mt-0", isOpen && "rotate-45")} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`${pid}-p`}
                      role="region"
                      aria-labelledby={`${pid}-h`}
                      inert={!isOpen}
                      className={cn("grid transition-[grid-template-rows] duration-500 ease-out-expo", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                    >
                      <div className="overflow-hidden">
                        <div className={cn("grid gap-40 border-t border-white/10 px-24 pb-30 pt-30 transition-opacity duration-500 md:grid-cols-2 lg:gap-50 lg:px-40 lg:pb-40 lg:pt-40", isOpen ? "opacity-100" : "opacity-0")}>
                          <div>
                            <h4 className={caption}>About the role</h4>
                            <p className="mt-12 text-16 text-white/90">{r.summary}</p>
                            <Points items={r.duties} />
                          </div>
                          <div className="md:row-span-2">
                            <h4 className={caption}>Requirements</h4>
                            <Points items={r.extra} strong />
                            <Points items={everyone} />
                          </div>
                          {/* Left column, level with the end of the requirements; last on phones. */}
                          <div className="md:col-start-1 md:row-start-2 md:self-end">
                            <Button href={apply.href} external>
                              {apply.label}
                              <span className="sr-only"> as {r.title.toLowerCase()}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </LightField>
    </section>
  );
}
