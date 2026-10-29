import { ImageResponse } from "next/og";

export const alt = "TraffiCorp: We don't go with the flow. We control it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share card: amber field with ink type (like a work-zone sign), dashed lane line, the headline. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#f79521", color: "#151515", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.8, letterSpacing: 2 }}>TRAFFICORP · IDAHO & WASHINGTON</div>
        <div style={{ display: "flex", gap: 22, marginTop: 28, marginBottom: 40 }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} style={{ width: 48, height: 5, background: "#151515" }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1.05, fontWeight: 600 }}>
          <span>We don&apos;t go with the flow.</span>
          <span>We control it.</span>
        </div>
      </div>
    ),
    size,
  );
}
