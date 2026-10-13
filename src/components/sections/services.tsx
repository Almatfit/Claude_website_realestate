"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SERVICES } from "@/lib/services";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Services() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mobilePinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // === Desktop (unchanged) ===
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

      // === Mobile/tablet pinned stepper (new) ===
      // A separate matchMedia instance so the block above — desktop's
      // pinned panel and its own reduced-motion fallback — is never
      // touched by this logic. Below 1024px with motion allowed, this
      // pins .mobile-stage for roughly 4 x 90vh of scroll and steps
      // `active` through the four services; reduced motion at any width
      // is handled entirely by the desktop matchMedia above (for the
      // desktop markup) and by the motion-reduce: CSS variant below
      // (for the mobile markup), so this branch only ever needs to
      // exist for "mobile and motion is fine".
      const mmMobile = gsap.matchMedia();

      mmMobile.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          // iOS/Android toggling their address bar fires a resize that
          // isn't a real layout change; ScrollTrigger's own guard for
          // that (ignoreMobileResize) keeps the pin's start/end stable
          // instead of recalculating (and jumping) on every toggle.
          ScrollTrigger.config({ ignoreMobileResize: true });

          const st = ScrollTrigger.create({
            trigger: mobilePinRef.current,
            start: "top top+=80",
            // window.innerHeight (not a static vh value) so this is
            // measured against whatever the real, current viewport is;
            // invalidateOnRefresh re-measures it on orientation change
            // without fighting the ignoreMobileResize guard above.
            end: () => `+=${window.innerHeight * SERVICES.length * 0.9}`,
            invalidateOnRefresh: true,
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
      );

      return () => {
        mm.revert();
        mmMobile.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={rootRef}
      className="bg-paper-deep px-6 sm:px-10 lg:px-16"
    >
      {/* Desktop — exactly as before */}
      <div className="hidden lg:block">
        <div
          ref={pinRef}
          className="mx-auto flex max-w-[1600px] min-h-screen flex-col justify-center py-24 lg:py-0"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display font-medium text-4xl text-ink sm:text-5xl">
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
                          "font-display font-medium text-2xl transition-colors duration-300 sm:text-3xl",
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
                  <Image
                    key={service.id}
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={service.image.blurDataURL}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
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
      </div>

      {/* Mobile/tablet — pinned stepper, built for the phone screen */}
      <div className="lg:hidden">
        <div className="pb-10 pt-24">
          <h2 className="font-display font-medium text-4xl text-ink">
            What we do
          </h2>
        </div>

        {/* Pinned stepper: hidden under reduced motion in favor of the
            plain stacked list below. */}
        <div className="motion-reduce:hidden">
          <div
            ref={mobilePinRef}
            data-mobile-service-stage=""
            className="relative h-[calc(100svh-80px)] w-full overflow-hidden"
          >
            <div className="relative h-[55%] w-full overflow-hidden">
              {SERVICES.map((service, i) => (
                <Image
                  key={service.id}
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={service.image.blurDataURL}
                  sizes="100vw"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    active === i ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>

            <div className="relative h-[45%] w-full">
              {SERVICES.map((service, i) => (
                <div
                  key={service.id}
                  className={cn(
                    "absolute inset-0 flex flex-col justify-center px-6 pb-16 transition-opacity duration-500",
                    active === i ? "opacity-100" : "opacity-0"
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                    {service.tagline}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-medium text-ink">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-ink-soft">{service.description}</p>
                </div>
              ))}

              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
                <div className="flex items-center gap-2" aria-hidden="true">
                  {SERVICES.map((service, i) => (
                    <span
                      key={service.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                        active === i ? "bg-verdigris" : "bg-stone"
                      )}
                    />
                  ))}
                </div>
                <span
                  className="text-xs tabular-nums text-ink-soft"
                  aria-hidden="true"
                >
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(SERVICES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reduced motion: plain stacked cards, no pin, no animation. */}
        <ul className="hidden motion-reduce:block">
          {SERVICES.map((service) => (
            <li key={service.id} className="pb-16 last:pb-20">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={service.image.blurDataURL}
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-soft">
                {service.tagline}
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium text-ink">
                {service.name}
              </h3>
              <p className="mt-2 text-ink-soft">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
