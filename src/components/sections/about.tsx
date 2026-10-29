"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const WORKING_WITH_ALMAT = [
  "Almat tells you the truth, even when it's hard to hear. If the price or the offer is off, he'll say so. His job is the right outcome, not a comfortable moment.",
  "He responds promptly. You'll never wonder where your transaction stands.",
  "Every client gets the same service, whether the home is $200,000 or $2,000,000.",
  "When a deal gets complicated, Almat stays calm and solves the problem.",
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
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/about-almat.jpg"
              alt="Almat Shyntayev, Realtor with Real Broker, LLC"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover object-[50%_22%]"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="about-reveal font-display font-medium text-4xl text-ink sm:text-5xl">
            About Almat
          </h2>
          <p className="about-reveal mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            Almat Shyntayev has spent the last five years as a real estate
            photographer and videographer. Now, as a licensed Realtor with
            Real Broker, LLC, he brings that experience to every client. He
            has seen what makes a listing stand out and what makes buyers
            keep scrolling, and he knows how to market a home to earn top
            dollar.
          </p>
          <p className="about-reveal mt-5 max-w-xl leading-relaxed text-ink-soft">
            For Almat, marketing starts well before a listing goes live.
            Preparing the home comes first, and then he builds the right
            package for the property, whether that&rsquo;s photography alone
            or photos, video, and social media together. He works with
            buyers and sellers alike. Whether it&rsquo;s a starter home or a
            luxury property, he brings attentiveness, hustle, and
            professionalism to every client.
          </p>
          <p className="about-reveal mt-5 max-w-xl leading-relaxed text-ink-soft">
            On a personal note, Almat is fluent in three languages and is a
            big sports fan who loves both watching and playing. He&rsquo;s
            happiest outdoors.
          </p>
          <p className="about-reveal mt-5 max-w-xl leading-relaxed text-ink-soft">
            Almat serves Bothell, Kirkland, Bellevue, Seattle, and the
            surrounding Eastside and Puget Sound communities. He enjoys
            guiding clients through each step to a successful finish.
          </p>
        </div>

        <div className="about-reveal lg:col-span-12 mt-4 border-t border-stone pt-10 lg:mt-8 lg:pt-12">
          <h3 className="text-sm font-medium tracking-wide text-ink-soft">
            WHAT WORKING WITH ALMAT LOOKS LIKE
          </h3>
          <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
            {WORKING_WITH_ALMAT.map((item) => (
              <li key={item} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-verdigris"
                />
                <p className="leading-relaxed text-ink-soft">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
