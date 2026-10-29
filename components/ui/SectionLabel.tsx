import { cn } from "@/lib/cn";
import { Lamp } from "@/components/ui/Lamp";

/**
 * Section eyebrow: a lit barricade lamp and the name in mono caps.
 * Ink at 80% (10:1+ on white and concrete); white at 85% on dark.
 */
export function SectionLabel({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-14 font-mono text-12 font-medium uppercase leading-none tracking-[0.12em] lg:text-13",
        tone === "light" && "text-ink/80",
        tone === "dark" && "text-white/85",
        className,
      )}
    >
      <Lamp tone={tone} />
      <span>{children}</span>
    </p>
  );
}
