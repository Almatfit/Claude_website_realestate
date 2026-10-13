"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { lenisInstance } from "@/components/smooth-scroll";

/** Scrolls to the URL's #hash target on a fresh page load (a direct visit,
 * or a cross-page nav link like /#mortgage-calculator from another page).
 *
 * The browser's own native hash scroll fires too early here: sections like
 * Services reserve extra document height for a GSAP ScrollTrigger pin,
 * computed client-side after hydration, so the native jump lands against a
 * shorter, stale layout and ends up well short of the real target. This
 * waits for the page to finish loading, asks ScrollTrigger to recompute
 * pinned-section heights, then scrolls once that settles. */
export function HashScrollOnLoad() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    let target: Element | null;
    try {
      target = document.querySelector(hash);
    } catch {
      return;
    }
    if (!target) return;

    function scrollToTarget() {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        if (lenisInstance.current) {
          lenisInstance.current.scrollTo(hash, { immediate: true });
        } else {
          target?.scrollIntoView({ behavior: "auto", block: "start" });
        }
      });
    }

    if (document.readyState === "complete") {
      scrollToTarget();
      return;
    }

    window.addEventListener("load", scrollToTarget, { once: true });
    return () => window.removeEventListener("load", scrollToTarget);
  }, []);

  return null;
}
