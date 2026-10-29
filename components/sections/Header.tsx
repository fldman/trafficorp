"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeLink } from "@/components/ui/HomeLink";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { useDispatchStatus } from "@/lib/useDispatchStatus";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { nav, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Lamp } from "@/components/ui/Lamp";
import { Close } from "@/components/art/Icons";
import { useQuote } from "@/components/providers/QuoteProvider";

type Theme = "dark" | "light" | "split";

/** Header links: Home first, then the shared site nav (the footer has its own Home). */
const links = [{ label: "Home", href: "/" }, ...nav];

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Live office indicator: the site's LED lamp, lit (with two slow pulses) during office hours and dark after hours. */
function DispatchPill({ dark }: { dark: boolean }) {
  const status = useDispatchStatus();
  return (
    <a
      href={site.phone.href}
      className={cn(
        "hidden h-50 items-center gap-10 px-16 font-mono text-12 uppercase tracking-[0.1em] transition-colors duration-500 xl:flex",
        dark ? "bg-night/70 text-white backdrop-blur-md hover:bg-night/85" : "bg-paper text-ink hover:bg-concrete",
      )}
      // The name starts with the visible text (label, then number) so voice control can match it.
      aria-label={status ? `${status.label} ${site.phone.display}${status.open ? `, ${status.detail}` : ""}. Call dispatch` : `Call dispatch ${site.phone.display}`}
    >
      <Lamp tone={dark ? "dark" : "light"} lit={!!status?.open} />
      <span>{status ? status.label : "Dispatch"}</span>
      <span aria-hidden className={dark ? "text-white/75" : "text-label"}>{site.phone.display}</span>
    </a>
  );
}

/**
 * Where the flagger sits, as a share of the logo box: inside the full logo
 * (500 × 248 artwork), and on the collapsed mark (the flagger file shares the
 * old round logo's 300px canvas). The mark is centred on the same x as the
 * figure in the full logo, so the flagger stays put and only grows a little
 * and settles onto its plate.
 */
const FIGURE = {
  full: { left: "26.2%", top: "-19.35%", width: "41.94%", height: "84.55%" },
  mark: { left: "25.17%", top: "6%", width: "44%", height: "88%" },
};
/** Desktop only (the `lg:` classes read them); tablets and phones pin the mark to the link box. */
const figureVars = (f: (typeof FIGURE)["full"]) => ({ "--fx": f.left, "--fy": f.top, "--fw": f.width, "--fh": f.height }) as React.CSSProperties;

/**
 * Global header. Expanded at the top of the page (wordmark + nav), collapsed
 * once you scroll (square mark + menu button + CTA). It reads the
 * `data-header="dark|light|split"` attribute of whatever section is under it.
 */
export function Header() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const quote = useQuote();

  useGSAP(
    () => {
      const first = document.querySelector<HTMLElement>("[data-header]");
      const initial = first?.dataset.header;
      setTheme(initial === "light" || initial === "split" ? initial : "dark");
      gsap.utils.toArray<HTMLElement>("[data-header]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 5.7%",
          end: "bottom 5.7%",
          // Refresh after pinned sections so positions include their spacing.
          refreshPriority: -10,
          onToggle: (self) => {
            if (!self.isActive) return;
            const t = section.dataset.header;
            setTheme(t === "light" || t === "split" ? t : "dark");
          },
        });
      });
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => setCollapsed(self.scroll() > 80) });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const dark = theme === "dark" && !menuOpen;
  const logoDark = (theme === "dark" || theme === "split") && !menuOpen;
  const small = collapsed || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="fixed left-20 top-20 z-[300] -translate-y-[200%] bg-amber px-20 py-12 font-medium text-ink transition-transform focus:translate-y-0 lg:left-60"
      >
        Skip to content
      </a>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-500", dark ? "on-dark text-white" : "text-ink")}>
        <div className="mx-auto flex max-w-[192rem] items-center justify-between px-20 py-16 lg:px-60 lg:py-32">
          <HomeLink aria-label={`${site.name} home`} className="group relative block size-44 lg:h-56 lg:w-[11.3rem]">
            {/* Desktop collapsing: the rules pull into the flagger, the lettering folds back, the flagger moves to the corner and a square plate grows behind it. Tablets and phones always show the mark, flush with the container edge. */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 origin-[47%_50%] transition-[scale,opacity] ease-out-expo max-lg:hidden",
                small ? "scale-x-0 opacity-0 duration-500" : "duration-700 delay-200",
              )}
            >
              <Image src="/images/brand/logo-rules.png" alt="" fill sizes="120px" className="object-contain object-left" preload />
            </span>
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 origin-[50%_46.8%] transition-[transform,opacity] ease-out-expo max-lg:hidden",
                small ? "opacity-0 duration-500 [transform:perspective(30rem)_rotateX(-90deg)]" : "duration-700 delay-200 [transform:perspective(30rem)_rotateX(0deg)]",
              )}
            >
              <Image src="/images/brand/logo-type-white.png" alt="" fill sizes="120px" preload className={cn("object-contain object-left transition-opacity duration-500", logoDark ? "opacity-100" : "opacity-0")} />
              <Image src="/images/brand/logo-type-dark.png" alt="" fill sizes="120px" className={cn("object-contain object-left transition-opacity duration-500", logoDark ? "opacity-0" : "opacity-100")} />
            </span>
            <span
              aria-hidden
              className={cn(
                "absolute max-lg:inset-0 lg:left-[var(--fx)] lg:top-[var(--fy)] lg:h-[var(--fh)] lg:w-[var(--fw)] lg:transition-[left,top,width,height] lg:duration-700 lg:ease-[cubic-bezier(0.65,0,0.35,1)]",
                small ? "lg:delay-150" : "lg:delay-0",
              )}
              style={figureVars(small ? FIGURE.mark : FIGURE.full)}
            >
              {/* The plate: the same size and fills as the menu and dispatch buttons, so the collapsed header reads as one row of controls. Scale and colour sit on separate layers so the colour fades without the spring. */}
              <span
                className={cn(
                  "absolute inset-0 transition-[scale] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  small ? "scale-100 duration-700 delay-150" : "scale-0 duration-300 max-lg:scale-100",
                )}
              >
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 lg:size-50",
                    logoDark ? "bg-night/70 backdrop-blur-md group-hover:bg-night/85" : "bg-paper group-hover:bg-concrete",
                  )}
                />
              </span>
              <Image src="/images/brand/flagger-figure.png" alt="" fill sizes="60px" className="object-contain" preload />
            </span>
          </HomeLink>

          <div className="flex items-center gap-8">
            <nav
              aria-label="Main"
              className={cn(
                "mr-30 hidden items-center gap-[5.2rem] transition-all duration-500 ease-out-expo lg:flex",
                small ? "pointer-events-none -translate-y-10 opacity-0" : "opacity-100",
              )}
            >
              {links.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    tabIndex={small ? -1 : undefined}
                    className={cn(
                      "relative py-6 text-16 transition-colors duration-300",
                      dark ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-ink",
                      current && (dark ? "text-white" : "text-ink"),
                    )}
                  >
                    {item.label}
                    {current && <span aria-hidden className="absolute inset-x-0 -bottom-2 h-2 bg-amber" />}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                // Desktop: left of the dispatch number; it takes no room while the header is expanded (its gap is cancelled too).
                // Phones and tablets: last in the row, after Get a quote.
                "relative z-[60] flex size-44 shrink-0 items-center justify-center overflow-hidden transition-all duration-500 ease-out-expo max-lg:order-last lg:h-50",
                small ? "opacity-100 lg:w-50" : "lg:invisible lg:pointer-events-none lg:-ml-8 lg:w-0 lg:opacity-0",
                dark ? "bg-night/70 backdrop-blur-md hover:bg-night/85" : "bg-paper hover:bg-concrete",
              )}
            >
              {menuOpen ? (
                <Close className="size-18" />
              ) : (
                <span className="flex w-24 flex-col gap-5" aria-hidden>
                  <span className="h-[1.5px] w-full bg-current" />
                  <span className="h-[1.5px] w-full bg-current" />
                  <span className="h-[1.5px] w-full bg-current" />
                </span>
              )}
            </button>
            <DispatchPill dark={dark} />
            <Button className="relative z-[60] max-md:[&>span:last-child]:hidden" onClick={() => quote.open()}>
              Get a quote
            </Button>
          </div>
        </div>
      </header>
      <Menu open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  );
}

function Menu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const quote = useQuote();
  useFocusTrap(panel, open, onClose, 250);

  // Stay mounted while the panel wipes away after closing (skipped under reduced motion).
  const [closing, setClosing] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    setClosing(!open && !window.matchMedia(MQ.reduce).matches);
  }

  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => unlockScroll();
  }, [open]);

  // Close when the route changes underneath the menu.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el || window.matchMedia(MQ.reduce).matches) return;
      const items = el.querySelectorAll("[data-menu-item]");
      if (open) {
        // Quick wipe down; the links rise in while it's still settling.
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" });
        gsap.from(items, { yPercent: 110, duration: 0.65, stagger: 0.035, ease: "expo.out", delay: 0.15 });
      } else if (closing) {
        gsap.to(items, { yPercent: -30, opacity: 0, duration: 0.25, stagger: 0.02, ease: "power2.in" });
        gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "power3.inOut", delay: 0.05, onComplete: () => setClosing(false) });
      }
    },
    { dependencies: [open, closing], scope: panel },
  );

  if (!open && !closing) return null;

  const items = links;
  return (
    <div ref={panel} id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" inert={!open} data-lenis-prevent className="fixed inset-0 z-40 overflow-y-auto bg-white text-ink">
      <div className="mx-auto flex min-h-full max-w-[192rem] flex-col justify-between gap-60 px-20 pb-40 pt-[12rem] lg:px-60 lg:pb-60 lg:pt-[18rem]">
        <nav aria-label="Menu" className="flex flex-col">
          {items.map((item) => {
            const current = item.href === "/" ? pathname === "/" : isCurrent(pathname, item.href);
            return (
              <span key={item.label} className="overflow-hidden border-b border-ink/10">
                <Link
                  data-menu-item
                  href={item.href}
                  onClick={onClose}
                  aria-current={current ? "page" : undefined}
                  className="group flex items-baseline py-10 text-[4.2rem] font-medium leading-[1.1] tracking-[-0.02em] lg:py-12 lg:text-h4"
                >
                  <span className={cn("transition-transform duration-500 ease-out-expo group-hover:translate-x-12", current && "tc-mark")}>{item.label}</span>
                </Link>
              </span>
            );
          })}
          <span className="overflow-hidden pt-30">
            <span data-menu-item className="block">
              <Button
                size="lg"
                onClick={() => {
                  onClose();
                  quote.open();
                }}
              >
                Get a quote
              </Button>
            </span>
          </span>
        </nav>
        <div className="grid gap-24 border-t border-ink/10 pt-30 text-16 text-body md:grid-cols-3">
          <p>
            Dispatch
            <a href={site.phone.href} className="tc-link mt-4 block w-fit text-24 text-ink">
              {site.phone.display}
            </a>
          </p>
          <p>
            Office hours
            <span className="mt-4 block text-24 text-ink">{site.hours}</span>
          </p>
          <p className="flex gap-24 md:justify-end">
            {site.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="tc-link text-ink">
                {s.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
