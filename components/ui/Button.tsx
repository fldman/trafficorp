import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "ghost" | "light" | "link";
type Size = "sm" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Show the square arrow cell (on by default for primary and dark). */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AsLink = Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type AsButton = Common & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "group/btn relative inline-flex items-stretch whitespace-nowrap text-16 leading-[1.8rem] font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50";

/** Label panel colours. Every pair is 7:1 or better. */
const panel: Record<Exclude<Variant, "link">, string> = {
  primary: "bg-amber text-ink group-hover/btn:bg-amber-hi",
  dark: "bg-ink text-white group-hover/btn:bg-ink-2",
  ghost: "bg-transparent text-current ring-1 ring-inset ring-current/30 group-hover/btn:ring-current",
  light: "bg-paper text-ink group-hover/btn:bg-concrete",
};

/** Arrow cell colours: the inverse of the panel, like a sign's arrow plate. */
const cell: Record<Exclude<Variant, "link">, string> = {
  primary: "bg-ink text-amber",
  dark: "bg-amber text-ink",
  ghost: "bg-current/10 text-current",
  light: "bg-ink text-white",
};

const height: Record<Size, string> = { sm: "h-50", lg: "h-65" };
const padX: Record<Size, string> = { sm: "px-20", lg: "px-30" };
const cellW: Record<Size, string> = { sm: "w-50", lg: "w-65" };

/** Label that rolls up on hover, like a split-flap. */
function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0">
        {children}
      </span>
    </span>
  );
}

function Arrow({ size }: { size: Size }) {
  return (
    <span aria-hidden className="relative block overflow-hidden">
      <svg viewBox="0 0 20 20" className={cn("block transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-[150%]", size === "lg" ? "size-20" : "size-16")} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M2 10h15M11 4l6 6-6 6" />
      </svg>
      <svg viewBox="0 0 20 20" className={cn("absolute inset-0 block -translate-x-[150%] transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0", size === "lg" ? "size-20" : "size-16")} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M2 10h15M11 4l6 6-6 6" />
      </svg>
    </span>
  );
}

/** Underlined text link: an amber rule at rest; on hover the text colour slides over it from the left (`.tc-link-rest`). */
function Underline({ children }: { children: React.ReactNode }) {
  return <span className="tc-link-rest inline-block">{children}</span>;
}

function Inner({ variant, size, arrow, children }: { variant: Variant; size: Size; arrow: boolean; children: React.ReactNode }) {
  if (variant === "link") return <Underline>{children}</Underline>;
  return (
    <>
      <span className={cn("flex flex-1 items-center justify-center transition-colors duration-300", height[size], padX[size], panel[variant])}>
        <Roll>{children}</Roll>
      </span>
      {arrow && (
        <span className={cn("flex items-center justify-center transition-colors duration-300", height[size], cellW[size], cell[variant])}>
          <Arrow size={size} />
        </span>
      )}
    </>
  );
}

/** Sign-style button: label panel plus an arrow cell. Renders a link when `href` is set. */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "sm", className, children } = props;
  const arrow = props.arrow ?? (variant === "primary" || variant === "dark");
  const classes = cn(base, variant === "link" && "tc-link-trigger text-ink text-18 leading-[1.6] font-medium", className);
  const inner = (
    <Inner variant={variant} size={size} arrow={arrow}>
      {children}
    </Inner>
  );

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _a; void _c; void _ch;
    if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
          {inner}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, type = "button", ...rest } = props as AsButton;
  void _v; void _s; void _a; void _c; void _ch;
  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
