"use client";

import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/testimonials";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={direction === "left" ? "" : "rotate-180"}
    >
      <path
        d="M11 4L6 9L11 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="1.5" width="3.2" height="11" fill="currentColor" />
      <rect x="8.8" y="1.5" width="3.2" height="11" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 1.5L12 7L3 12.5V1.5Z" fill="currentColor" />
    </svg>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const quoteRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(0);

  // Stop autoplay once the carousel scrolls off-screen so it doesn't keep
  // announcing changes via aria-live to a screen-reader user who has moved
  // on to reading a different section (WCAG 2.2.2).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || interacting || offscreen || userPaused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [reducedMotion, interacting, offscreen, userPaused]);

  useEffect(() => {
    if (index === prevIndex.current) return;
    prevIndex.current = index;
    if (reducedMotion || !quoteRef.current) return;
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [index, reducedMotion]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const current = TESTIMONIALS[index];
  const autoplaying = !reducedMotion && !userPaused;

  const go = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      className="testimonial-reveal bg-paper px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div ref={quoteRef} aria-live="polite">
          <p className="font-display text-3xl italic leading-snug text-ink sm:text-4xl">
            &ldquo;{current.quote}&rdquo;
          </p>
          <p className="mt-8 text-sm text-ink-soft">
            {current.name} — {current.context}
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-verdigris"
          >
            <Chevron direction="left" />
          </button>
          <span className="text-xs text-ink-soft">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-verdigris"
          >
            <Chevron direction="right" />
          </button>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={autoplaying ? "Pause testimonial rotation" : "Resume testimonial rotation"}
              aria-pressed={!autoplaying}
              className="ml-2 flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-verdigris"
            >
              {autoplaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
