"use client";

import { useEffect, useRef } from "react";
import { DistortThumbnail } from "@/components/distort-thumbnail";
import { LISTINGS, type Listing } from "@/lib/listings";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const numberFmt = new Intl.NumberFormat("en-US");

function ListingCard({ listing }: { listing: Listing }) {
  const large = listing.size === "large";
  return (
    <div
      className={cn(
        "listing-reveal group",
        large ? "lg:col-span-7" : "lg:col-span-4"
      )}
    >
      <div
        className={cn(
          "reveal-clip relative overflow-hidden bg-paper-deep",
          large ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[4/5]"
        )}
      >
        <DistortThumbnail
          variant={listing.variant}
          label={`${listing.title}, ${listing.location}`}
          className="reveal-img h-full w-full"
        />
      </div>
      <div className="reveal-meta mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink sm:text-2xl">
            {listing.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{listing.location}</p>
        </div>
        <p className="whitespace-nowrap text-right font-display text-lg text-ink sm:text-xl">
          {listing.price}
        </p>
      </div>
      <p className="reveal-meta mt-3 text-sm text-ink-soft">
        {listing.beds} bd &nbsp;·&nbsp; {listing.baths} ba &nbsp;·&nbsp;{" "}
        {numberFmt.format(listing.sqft)} sqft
      </p>
    </div>
  );
}

export function FeaturedListings() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".listing-reveal");

        cards.forEach((card) => {
          const clip = card.querySelector(".reveal-clip");
          const img = card.querySelector(".reveal-img");
          const meta = card.querySelectorAll(".reveal-meta");

          gsap.set(clip, { clipPath: "inset(0% 0% 100% 0%)" });
          gsap.set(img, { scale: 1.18 });
          gsap.set(meta, { opacity: 0, y: 16 });

          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            onEnter: () => {
              gsap.to(clip, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                ease: "power3.out",
              });
              gsap.to(img, { scale: 1, duration: 1.5, ease: "power3.out" });
              gsap.to(meta, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.06,
                delay: 0.15,
                ease: "power2.out",
              });
            },
          });
        });

        gsap.from(".quote-reveal", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".quote-reveal", start: "top 82%" },
        });

        gsap.from(".listings-head-el", {
          opacity: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".listings-head-el", start: "top 88%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="listings"
      ref={rootRef}
      className="bg-paper px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:mb-20 sm:flex-row sm:items-end">
          <h2 className="listings-head-el font-display font-medium text-4xl text-ink sm:text-5xl lg:text-6xl">
            Featured properties
          </h2>
          <a
            href="#contact"
            className="listings-head-el border-b border-ink/30 pb-0.5 text-sm text-ink-soft transition-colors hover:border-verdigris hover:text-verdigris"
          >
            Enquire about our full portfolio
          </a>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12 lg:gap-y-20">
          {LISTINGS.filter((l) => l.size === "large").map((listing) => (
            <div key={listing.id} className="lg:col-span-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                <ListingCard listing={listing} />
                <div className="quote-reveal lg:col-span-5">
                  <p className="font-display text-2xl italic text-ink sm:text-3xl">
                    &ldquo;A quiet architectural statement above the Pacific,
                    unchanged in outlook for forty years.&rdquo;
                  </p>
                  <p className="mt-6 text-ink-soft">
                    Set on a private bluff with unobstructed ocean views, this
                    five-bedroom residence pairs post-and-beam architecture
                    with a slow, considered renovation. Walls of glass, white
                    oak floors throughout, and a motor court for six.
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-16 lg:col-span-12 lg:grid-cols-12">
            {LISTINGS.filter((l) => l.size === "small").map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
