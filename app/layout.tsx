import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { QuoteProvider } from "@/components/providers/QuoteProvider";
import { Header } from "@/components/sections/Header";
import { Preloader } from "@/components/sections/Preloader";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TraffiCorp | Traffic control for Idaho & Washington work zones",
    template: "%s | TraffiCorp",
  },
  description:
    "Flaggers, pilot cars, temporary signals, message boards and full work-zone setups across Idaho and Washington. Certified crews, custom traffic control plans, staffed on time.",
  // Private preview: keep it out of search engines until launch.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "TraffiCorp | We don't go with the flow. We control it.",
    description: "Traffic control for work zones across Idaho and Washington.",
    type: "website",
    siteName: "TraffiCorp",
  },
};

export const viewport: Viewport = {
  themeColor: "#111112",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrains.variable}`}>
      <head>
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <QuoteProvider>
          <SmoothScroll />
          <Preloader />
          <Header />
          {children}
        </QuoteProvider>
        <AgentationProvider />
      </body>
    </html>
  );
}
