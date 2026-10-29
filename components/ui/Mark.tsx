import { cn } from "@/lib/cn";

/**
 * The sign mark: ink type on an amber band, the way a work-zone sign is
 * printed. Use it for the one phrase in a heading that carries the point.
 * `Reveal` wipes it in after the line arrives; without JS it's simply shown.
 * A single-word mark is kept whole (inline-block): otherwise its padded start
 * can be left at the end of the previous line as an amber sliver.
 */
export function Mark({ children, className }: { children: React.ReactNode; className?: string }) {
  const single = typeof children === "string" && !/\s/.test(children.trim());
  return (
    <span className={cn("tc-mark", single && "inline-block", className)}>
      <span className="tc-mark-text">{children}</span>
    </span>
  );
}
