"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { QuoteDraft } from "@/content/quote";
import { QuoteModal } from "@/components/quote/QuoteModal";

type Ctx = {
  open: (prefill?: Partial<QuoteDraft>, step?: number) => void;
  close: () => void;
};

const QuoteContext = createContext<Ctx | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}

/** Holds the quote modal so any CTA on any page can open it. */
export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; prefill?: Partial<QuoteDraft>; step: number; key: number }>({
    open: false,
    step: 0,
    key: 0,
  });

  const open = useCallback((prefill?: Partial<QuoteDraft>, step = 0) => {
    setState((s) => ({ open: true, prefill, step, key: s.key + 1 }));
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteModal
        key={state.key}
        open={state.open}
        prefill={state.prefill}
        initialStep={state.step}
        onClose={close}
      />
    </QuoteContext.Provider>
  );
}
