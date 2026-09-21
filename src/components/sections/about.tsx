"use client";

import { useEffect, useRef } from "react";
import { ArtPanel } from "@/components/art-panel";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STATS = [
  { value: 14, decimals: 0, suffix: "", label: "Years in practice" },
  { value: 320, decimals: 0, suffix: "+", label: "Homes represented" },
  { value: 4.9, decimals: 1, suffix: "", label: "Average client rating" },
];

export function About() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = gsap.utils.toArray<HTMLElement>(".stat-value");
        nodes.forEach((node, i) => {
          const stat = STATS[i];
          const proxy = { val: 0 };
          ScrollTrigger.create({
            trigger: node,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(proxy, {
                val: stat.value,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  node.textContent =
                    proxy.val.toFixed(stat.decimals) + stat.suffix;
                },
              });
            },
          });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="bg-paper px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="about-reveal lg:col-span-5">
          <ArtPanel
            variant="stair"
            label="Almat Real Estate studio"
            className="aspect-[4/5] w-full"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="about-reveal font-display font-medium text-4xl text-ink sm:text-5xl">
            About Almat
          </h2>
          <p className="about-reveal mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            Almat is the independent practice of Sofia Lindqvist, a Realtor
            &reg; brokered by Real (Real Broker, LLC), built on a simple
            premise: fewer listings, more attention. Each year Sofia
            represents a small number of exceptional properties, working
            closely with sellers on positioning and with buyers on the
            details that matter after the sale — school boundaries, coastal
            setbacks, the neighbor&rsquo;s renovation plans.
          </p>
          <p className="about-reveal mt-5 max-w-xl leading-relaxed text-ink-soft">
            The practice is small by design. Every client works directly
            with Sofia from first call to final signature — no team, no
            hand-offs.
          </p>

          <div className="about-reveal mt-12 flex flex-wrap gap-x-12 gap-y-8 border-t border-stone pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="stat-value font-display text-4xl text-verdigris">
                  {stat.value.toFixed(stat.decimals)}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
