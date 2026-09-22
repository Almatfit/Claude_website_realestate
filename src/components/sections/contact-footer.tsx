"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#listings", label: "Listings" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
];

function EqualHousingIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11.5L12 4L21 11.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10V20H18.5V10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20V14H14V20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactFooter() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={rootRef} className="bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="contact-reveal font-display font-medium text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Let&rsquo;s find your
              <br />
              next address.
            </h2>
            <p className="contact-reveal mt-6 max-w-md text-paper/70">
              Whether you&rsquo;re buying, selling, or simply curious what
              your home is worth, we begin with a conversation.
            </p>
            <a
              href="mailto:hello@almatrealestate.com?subject=Consultation%20request"
              className="contact-reveal mt-10 inline-flex rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-verdigris hover:text-paper"
            >
              Schedule a consultation
            </a>
          </div>

          <div className="contact-reveal lg:col-span-4 lg:col-start-9">
            <p className="text-lg font-medium text-paper">Almat Shyntayev</p>
            <p className="mt-1 text-sm text-paper/50">Get in touch</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+12066063011"
                  className="text-lg transition-colors hover:text-verdigris-soft"
                >
                  (206) 606-3011
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@almatrealestate.com"
                  className="text-lg transition-colors hover:text-verdigris-soft"
                >
                  hello@almatrealestate.com
                </a>
              </li>
              <li className="pt-2 text-paper/70">
                1400 112th Ave SE, Ste 100
                <br />
                Bellevue, WA 98004
              </li>
            </ul>
          </div>
        </div>

        <div className="contact-reveal mt-24 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#hero"
            className="font-display text-lg font-medium tracking-tight transition-colors hover:text-paper/80"
          >
            Almat Real Estate
          </a>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-paper/70">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-paper">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-paper/50">
            © {new Date().getFullYear()} Almat Real Estate. All rights
            reserved.
          </p>
        </div>

        <div className="contact-reveal mt-8 border-t border-paper/15 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <EqualHousingIcon className="h-5 w-5 text-paper/60" />
              <span className="text-xs text-paper/60">
                Equal Housing Opportunity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-sm border border-paper/60 text-[11px] font-bold text-paper/60"
              >
                R
              </span>
              <span className="text-xs text-paper/60">REALTOR&reg;</span>
            </div>
            <div
              className={cn(
                "rounded border border-dashed border-paper/30 px-3 py-1.5",
                "text-xs text-paper/40"
              )}
            >
              Real Broker, LLC logo — placeholder, image to be provided
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-paper/40">
            Almat Shyntayev, REALTOR&reg; &mdash; Real Broker, LLC &mdash;
            Washington Real Estate License #26019892.
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-paper/40">
            Information is deemed reliable but not guaranteed. This
            information is provided for consumers&rsquo; personal,
            non-commercial use and may not be used for any purpose other
            than to identify prospective properties consumers may be
            interested in purchasing. Buyers are responsible for
            independently verifying the accuracy of all information. Listing
            data is provided courtesy of the Northwest Multiple Listing
            Service (NWMLS) and is not guaranteed to be accurate by the MLS.
          </p>
        </div>
      </div>
    </footer>
  );
}
