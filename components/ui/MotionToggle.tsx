"use client";

import { cn } from "@/lib/cn";

/** Pause/play control for continuously moving content (WCAG 2.2.2). */
export function MotionToggle({ paused, onToggle, label, tone = "light", className }: { paused: boolean; onToggle: () => void; label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      className={cn(
        "inline-flex h-36 items-center gap-10 px-12 font-mono text-12 uppercase tracking-[0.1em] transition-colors duration-300",
        tone === "light" ? "bg-white text-ink ring-1 ring-ink/15 hover:ring-ink/40" : "bg-white/10 text-white hover:bg-white/20",
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 12 12" className="size-10" fill="currentColor">
        {paused ? <path d="M2 1l9 5-9 5z" /> : <path d="M2 1h3v10H2zM7 1h3v10H7z" />}
      </svg>
      {paused ? "Play" : "Pause"} <span className="sr-only">{label}</span>
    </button>
  );
}
