"use client";

import { useEffect, useRef, useState } from "react";
import { ArtPanel } from "@/components/art-panel";
import { SERVICES } from "@/lib/services";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Services() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          pinned: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          plain: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { pinned } = context.conditions as { pinned: boolean };

          if (pinned) {
            const st = ScrollTrigger.create({
              trigger: pinRef.current,
              start: "top top+=80",
              end: `+=${SERVICES.length * 70}%`,
              pin: true,
              scrub: 0.4,
              onUpdate: (self) => {
                const idx = Math.min(
                  SERVICES.length - 1,
                  Math.floor(self.progress * SERVICES.length)
                );
                setActive(idx);
              },
            });
            return () => st.kill();
          }

          gsap.from(".service-row", {
            opacity: 0,
            y: 24,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: pinRef.current, start: "top 80%" },
          });
        }
      );

      return () => mm.revert();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="bg-paper-deep px-6 sm:px-10 lg:px-16"
    >
      <div ref={pinRef} className="mx-auto flex max-w-[1600px] min-h-screen flex-col justify-center py-24 lg:py-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              What we do
            </h2>
            <ul className="mt-10 border-t border-stone">
              {SERVICES.map((service, i) => (
                <li key={service.id} className="service-row border-b border-stone">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={cn(
                        "font-display text-2xl transition-colors duration-300 sm:text-3xl",
                        active === i ? "text-verdigris" : "text-ink"
                      )}
                    >
                      {service.name}
                    </span>
                    <span
                      className={cn(
                        "hidden text-sm transition-colors duration-300 sm:inline",
                        active === i ? "text-ink-soft" : "text-ink-soft/0"
                      )}
                    >
                      {service.tagline}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              {SERVICES.map((service, i) => (
                <ArtPanel
                  key={service.id}
                  variant={service.variant}
                  label={service.name}
                  className={cn(
                    "absolute inset-0 h-full w-full transition-opacity duration-500",
                    active === i ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>
            <p className="mt-6 min-h-[4.5em] text-ink-soft">
              {SERVICES[active].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
