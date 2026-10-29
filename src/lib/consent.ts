import { useSyncExternalStore } from "react";

// Visitor's cookie choice, kept in localStorage (strictly necessary, so it
// needs no consent itself). Analytics and ad pixels load only on "granted".

export type ConsentChoice = "granted" | "denied" | null;

const STORAGE_KEY = "almat-cookie-consent";
const CHANGE_EVENT = "almat-consent-change";
const OPEN_EVENT = "almat-consent-open";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/** No tracking IDs configured means nothing to consent to, so no banner. */
export const TRACKING_CONFIGURED = Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID);

function read(): ConsentChoice {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: "granted" | "denied") {
  const previous = read();
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage blocked (private mode etc.): the choice holds for this page
    // view only, via the event below.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }));
  // Already-loaded GA/Meta scripts can't be unloaded, so a revoke reloads
  // the page to drop them.
  if (previous === "granted" && choice === "denied") window.location.reload();
}

/** Reopens the banner so a visitor can change an earlier choice. */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

let sessionChoice: ConsentChoice = null;

function subscribe(callback: () => void) {
  const onChange = (e: Event) => {
    sessionChoice = (e as CustomEvent<ConsentChoice>).detail;
    callback();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ConsentChoice {
  return read() ?? sessionChoice;
}

/** undefined during SSR/hydration, so nothing flashes before we know. */
export function useConsent(): ConsentChoice | undefined {
  return useSyncExternalStore<ConsentChoice | undefined>(
    subscribe,
    getSnapshot,
    () => undefined
  );
}

export function subscribeToOpenSettings(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
