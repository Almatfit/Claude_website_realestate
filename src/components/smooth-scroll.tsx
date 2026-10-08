"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Shared handle to the live Lenis instance (null when not mounted, e.g.
// under prefers-reduced-motion). Consumers like the lead-form modal use
// this to stop/start smooth scrolling while they're open — toggling
// `overflow: hidden` alone doesn't stop Lenis's own scroll-to animation
// from running behind an open overlay.
export const lenisInstance: { current: Lenis | null } = { current: null };

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisInstance.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisInstance.current = null;
    };
  }, []);

  return <>{children}</>;
}
