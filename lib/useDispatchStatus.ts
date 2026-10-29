"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export type DispatchStatus = { open: boolean; label: string; detail: string };

function compute(now = new Date()): DispatchStatus {
  const { days, from, to, timeZone } = site.openHours;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "numeric", hour12: false }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const open = (days as readonly number[]).includes(day) && hour >= from && hour < to;
  return open
    ? { open, label: "Office open", detail: "until 6 PM PT" }
    : { open, label: "After hours", detail: "call dispatch" };
}

/** Office open/closed in Pacific time. Null until mounted, so server and client markup match. */
export function useDispatchStatus() {
  const [status, setStatus] = useState<DispatchStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(compute());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return status;
}
