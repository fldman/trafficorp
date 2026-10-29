"use client";

import { useQuote } from "@/components/providers/QuoteProvider";

/** Plain text button that opens the quote form. For nav lists and footers. */
export function QuoteLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const quote = useQuote();
  return (
    <button type="button" className={className} onClick={() => quote.open()}>
      {children}
    </button>
  );
}
