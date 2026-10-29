"use client";

import type Lenis from "lenis";

/**
 * A tiny shared handle on the smooth scroller, so the preloader, modal and
 * menu can pause scrolling without prop drilling.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  document.documentElement.classList.add("is-locked");
  instance?.stop();
}

export function unlockScroll() {
  document.documentElement.classList.remove("is-locked");
  instance?.start();
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

/** Fired once the first-load preloader has finished (or was skipped). */
export const LOADED_EVENT = "tc:loaded";
let loaded = false;

export function markLoaded() {
  if (loaded) return;
  loaded = true;
  window.dispatchEvent(new Event(LOADED_EVENT));
}

export function onLoaded(cb: () => void) {
  if (loaded) {
    cb();
    return () => {};
  }
  window.addEventListener(LOADED_EVENT, cb, { once: true });
  return () => window.removeEventListener(LOADED_EVENT, cb);
}
