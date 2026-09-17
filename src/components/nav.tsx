"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#listings", label: "Listings" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top+=80",
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const dark = solid || menuOpen;

  return (
    <header
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        dark ? "bg-paper/95 backdrop-blur-sm border-b border-stone" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <a
          href="#hero"
          className={cn(
            "flex items-baseline gap-2 transition-colors duration-500",
            dark ? "text-ink" : "text-paper"
          )}
        >
          <span className="font-display text-2xl leading-none">Almat</span>
          <span className="text-xs font-normal tracking-wide opacity-80">
            Real Estate
          </span>
        </a>

        <ul
          className={cn(
            "hidden items-center gap-9 text-sm transition-colors duration-500 md:flex",
            dark ? "text-ink-soft" : "text-paper/85"
          )}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "relative py-1 transition-colors duration-300 hover:text-verdigris",
                  dark ? "hover:text-verdigris" : "hover:text-paper"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={cn(
            "hidden rounded-full border px-5 py-2.5 text-sm transition-colors duration-500 md:inline-flex",
            dark
              ? "border-verdigris text-verdigris hover:bg-verdigris hover:text-paper"
              : "border-paper/60 text-paper hover:bg-paper hover:text-ink"
          )}
        >
          Schedule a consultation
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={cn(
            "flex h-11 w-11 items-center justify-center md:hidden",
            dark ? "text-ink" : "text-paper"
          )}
        >
          <div className="relative h-3.5 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                menuOpen && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300",
                menuOpen && "-translate-y-[7px] -rotate-45"
              )}
            />
          </div>
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-[72px] flex flex-col justify-between bg-paper px-6 pb-10 pt-6 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href} className="border-b border-stone">
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 font-display text-3xl text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-verdigris px-6 py-4 text-center text-sm text-paper"
          >
            Schedule a consultation
          </a>
        </div>
      )}
    </header>
  );
}
