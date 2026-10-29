import { cn } from "@/lib/cn";

/** Page container: 1920px max at design scale, 60px side padding (20px on mobile). */
export function Container({
  as: Tag = "div",
  className,
  children,
  ...rest
}: { as?: React.ElementType; className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[192rem] px-20 lg:px-60", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** The 16-column desktop grid (20px gutters). Collapses to one column below 1200px. */
export function Grid({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-16 lg:gap-x-20", className)} {...rest}>
      {children}
    </div>
  );
}
