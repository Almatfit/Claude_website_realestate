"use client";

import { useEffect, useRef } from "react";
import { ArtPanel } from "@/components/art-panel";
import { gsap, SplitText } from "@/lib/gsap";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          const split = headlineRef.current
            ? new SplitText(headlineRef.current, { type: "words" })
            : null;

          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

          if (reduced || !split) {
            tl.set([".hero-eyebrow", ".hero-headline", ".hero-sub", ".hero-cue"], {
              opacity: 1,
              y: 0,
            });
          } else {
            tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.6 })
              .from(
                split.words,
                { opacity: 0, y: 40, duration: 1, stagger: 0.07 },
                "-=0.3"
              )
              .from(".hero-sub", { opacity: 0, y: 16, duration: 0.7 }, "-=0.5")
              .from(".hero-cue", { opacity: 0, duration: 0.8 }, "-=0.3");
          }

          if (!reduced) {
            gsap.to(imgRef.current, {
              scale: 1.08,
              duration: 16,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });

            gsap.to(imgRef.current, {
              yPercent: 14,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }

          return () => split?.revert();
        }
      );

      return () => mm.revert();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink"
    >
      <div ref={imgRef} className="absolute inset-0 scale-[1.02]">
        <ArtPanel variant="coast" className="h-full w-full" label="Oceanfront residence at dusk" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(27,24,18,0.65) 0%, rgba(27,24,18,0.55) 40%, rgba(27,24,18,0.85) 100%)",
        }}
      />

      <div className="relative z-10 w-full px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div className="max-w-4xl">
          <p className="hero-eyebrow mb-5 text-sm text-paper/80">
            Almat Real Estate — Coastal &amp; Metro
          </p>
          <h1
            ref={headlineRef}
            className="hero-headline font-display text-[13vw] leading-[0.95] text-paper sm:text-[9vw] lg:text-[6.4rem]"
          >
            Homes, considered.
          </h1>
          <p className="hero-sub mt-6 max-w-md text-base text-paper/85 sm:text-lg">
            A boutique practice for buyers, sellers, and the properties worth
            waiting for.
          </p>
        </div>
      </div>

      <div className="hero-cue absolute bottom-10 right-6 z-10 hidden items-center gap-3 text-paper/70 sm:right-10 sm:flex lg:right-16">
        <span className="text-xs">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-paper/25">
          <span className="scroll-line absolute inset-x-0 top-0 h-1/2 bg-paper" />
        </span>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .scroll-line {
            animation: scrollcue 2.2s ease-in-out infinite;
          }
        }
        @keyframes scrollcue {
          0% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </section>
  );
}
