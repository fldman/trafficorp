"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { emptyDraft, type QuoteDraft } from "@/content/quote";
import { Close } from "@/components/art/Icons";
import { QuoteForm, WorkOrder } from "@/components/quote/QuoteForm";

type Props = {
  open: boolean;
  prefill?: Partial<QuoteDraft>;
  initialStep?: number;
  onClose: () => void;
};

/** "Build your work zone" modal, opened from every quote CTA on the site. */
export function QuoteModal({ open, prefill, initialStep = 0, onClose }: Props) {
  const [mounted, setMounted] = useState(open);
  const [draft, setDraft] = useState<QuoteDraft>({ ...emptyDraft, ...prefill });
  const [ticket, setTicket] = useState<string>();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // The provider re-keys this component on every open, so it mounts open.
  // On close, play the exit before unmounting.
  useEffect(() => {
    if (open || !mounted || !root.current) return;
    // Reduced motion: no exit animation, just close (a zero-length timeline never completes).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setMounted(false));
      return () => cancelAnimationFrame(id);
    }
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to(panel.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" });
    tl.to(root.current, { autoAlpha: 0, duration: 0.3 }, "-=0.3");
    return () => {
      tl.kill();
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted || !open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    lockScroll();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.35 });
    gsap.fromTo(panel.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 0.9, ease: "expo.inOut" });
    gsap.fromTo("[data-modal-in]", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: reduce ? 0 : 0.9, stagger: 0.06, ease: "expo.out", delay: reduce ? 0 : 0.45 });

    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])') ?? []);
    setTimeout(() => focusables()[0]?.focus(), reduce ? 0 : 500);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      returnFocus.current?.focus?.();
    };
  }, [mounted, open, onClose]);

  if (!mounted) return null;

  return (
    <div ref={root} data-lenis-prevent className="fixed inset-0 z-[150] bg-night/80" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="absolute inset-0 grid overflow-y-auto overscroll-contain bg-white lg:inset-[3rem] lg:grid-cols-[52rem_1fr] lg:overflow-hidden"
      >
        <aside className="relative flex flex-col bg-amber px-20 pb-30 pt-[8rem] text-ink lg:overflow-y-auto lg:px-50 lg:py-50">
          <p data-modal-in className="font-mono text-12 tracking-[0.08em] text-ink/75">
            QUOTE · DISPATCH
          </p>
          <h2 data-modal-in id="quote-title" className="mt-20 text-[3.8rem] leading-[1.05] font-medium tracking-[-0.01em] lg:mt-30 lg:text-h4 lg:leading-none">
            Build your work zone
          </h2>
          <p data-modal-in className="mt-16 max-w-[40rem] text-16 text-ink/80">
            Three quick steps. Your work order fills in as you go, and dispatch calls you back to confirm.
          </p>
          <div data-modal-in className="mt-30 hidden lg:mt-auto lg:block lg:pt-40">
            <WorkOrder draft={draft} ticket={ticket} />
          </div>
        </aside>

        <div className="relative px-20 pb-40 pt-40 lg:overflow-y-auto lg:px-[8rem] lg:pb-60 lg:pt-[8rem]">
          <div data-modal-in className="h-full">
            <QuoteForm
              initial={prefill}
              initialStep={initialStep}
              onDraftChange={setDraft}
              onSubmitted={(r) => setTicket(r.ticket)}
              inlineSummary="mobile"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close quote form"
          className="fixed right-20 top-20 z-10 flex size-44 items-center justify-center bg-white text-ink transition-colors hover:bg-paper lg:absolute lg:right-30 lg:top-30 lg:size-50 lg:bg-paper lg:hover:bg-concrete"
        >
          <Close className="size-16" />
        </button>
      </div>
    </div>
  );
}
