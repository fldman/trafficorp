import { cn } from "@/lib/cn";

/** The "+" on a figure as a small sign tile: ink on amber, like the sign marks. Sized in em, so it follows the figure. */
export function PlusTile({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("ml-[0.08em] mt-[0.06em] flex size-[0.36em] shrink-0 items-center justify-center bg-amber text-ink", className)}>
      <svg viewBox="0 0 20 20" className="size-[62%]" fill="currentColor">
        <path d="M8.2 2h3.6v6.2H18v3.6h-6.2V18H8.2v-6.2H2V8.2h6.2z" />
      </svg>
    </span>
  );
}
