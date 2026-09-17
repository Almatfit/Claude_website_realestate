"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const NAV_LINKS = [
  { href: "#listings", label: "Listings" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
];

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
            <h2 className="contact-reveal font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
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
              className="contact-reveal mt-10 inline-flex rounded-full bg-paper px-7 py-3.5 text-sm text-ink transition-colors hover:bg-verdigris hover:text-paper"
            >
              Schedule a consultation
            </a>
          </div>

          <div className="contact-reveal lg:col-span-4 lg:col-start-9">
            <p className="text-sm text-paper/50">Get in touch</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+13105550148"
                  className="text-lg transition-colors hover:text-verdigris-soft"
                >
                  (310) 555-0148
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
                1204 Ocean Front Walk
                <br />
                Santa Monica, CA 90405
              </li>
            </ul>
          </div>
        </div>

        <div className="contact-reveal mt-24 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-lg">Almat Real Estate</span>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper/70">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-paper">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-paper/50">
            © {new Date().getFullYear()} Almat Real Estate. DRE #01234567.
          </p>
        </div>
      </div>
    </footer>
  );
}
