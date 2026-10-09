import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { ContactFooter } from "@/components/sections/contact-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Almat Real Estate",
  description:
    "How Almat Real Estate collects, uses, and shares personal information from visitors to this site.",
};

const LAST_UPDATED = "September 22, 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav alwaysSolid />
      <main className="bg-paper px-6 pb-28 pt-32 sm:px-10 sm:pb-36 sm:pt-40 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-medium text-ink sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            Last Updated: {LAST_UPDATED}
          </p>

          <div className="mt-12 space-y-12 leading-relaxed text-ink-soft">
            <p>
              Almat Real Estate (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
              &ldquo;our&rdquo;) operates this website. This Privacy Policy
              describes how we collect, use, and share your personal
              information when you visit or interact with this site.
            </p>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                1. Information We Collect
              </h2>
              <p className="mt-4">
                <strong className="text-ink">Information you provide:</strong>{" "}
                When you submit our contact/consultation form, we collect
                your name, email address, and phone number, along with any
                message you include.
              </p>
              <p className="mt-4">
                <strong className="text-ink">
                  Automatically collected information:
                </strong>{" "}
                We use analytics tools (such as Google Analytics) to collect
                information about your visit, including pages viewed, time
                spent on the site, browser/device type, and general location
                (city/state level, derived from IP address). This is
                collected via cookies and similar tracking technologies.
              </p>
              <p className="mt-4">
                <strong className="text-ink">Advertising data:</strong> We
                run advertising campaigns through Google and Meta
                (Facebook/Instagram). These platforms may place cookies or
                pixels on this site to help us measure ad performance and
                show you relevant ads based on your interaction with our
                site, including on other websites you visit
                (&ldquo;retargeting&rdquo;).
              </p>
              <p className="mt-4">
                <strong className="text-ink">Communications data:</strong> If
                you contact us by phone, text, or email, we may retain
                records of that communication, including through our CRM
                (customer relationship management) system, to manage our
                relationship with you and follow up appropriately.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                2. How We Use Your Information
              </h2>
              <p className="mt-4">We use your information to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Respond to your inquiries and provide requested real estate
                  services
                </li>
                <li>
                  Follow up with you by phone, email, or text (SMS)
                  regarding your inquiry
                </li>
                <li>Understand how visitors use our site and improve it</li>
                <li>
                  Measure and improve the effectiveness of our advertising
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                3. SMS/Text Messaging
              </h2>
              <p className="mt-4">
                If you provide your phone number and consent to SMS
                communication, we may contact you by text message regarding
                your inquiry or our services. Message and data rates may
                apply. Message frequency may vary. Reply STOP at any time to
                opt out, or HELP for assistance.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                4. Cookies and Advertising
              </h2>
              <p className="mt-4">
                We use cookies and similar technologies for analytics and
                advertising purposes as described above. You can control
                cookies through your browser settings. To opt out of
                interest-based advertising from our ad partners, you may
                visit:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Google:{" "}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-verdigris underline underline-offset-2 hover:text-ink"
                  >
                    adssettings.google.com
                  </a>
                </li>
                <li>
                  Meta:{" "}
                  <a
                    href="https://www.facebook.com/about/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-verdigris underline underline-offset-2 hover:text-ink"
                  >
                    facebook.com/about/ads
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                California and certain other state residents have the right
                to opt out of the &ldquo;sharing&rdquo; of personal
                information for targeted advertising purposes. To exercise
                this right, contact us using the information in Section 8
                below.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                5. How We Share Your Information
              </h2>
              <p className="mt-4">
                We do not sell your personal information. We share
                information with:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Service providers who help us operate this site and manage
                  client communications (e.g., our CRM platform)
                </li>
                <li>
                  Google and Meta, for advertising and analytics purposes as
                  described above
                </li>
                <li>As required by law or to protect our legal rights</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                6. Data Retention
              </h2>
              <p className="mt-4">
                We retain your information for as long as necessary to
                respond to your inquiry, maintain our business relationship
                with you, and comply with legal or industry recordkeeping
                requirements (including those applicable to licensed real
                estate professionals).
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                7. Your Rights
              </h2>
              <p className="mt-4">
                Depending on your state of residence, you may have the right
                to access, correct, or delete the personal information we
                hold about you, and to opt out of targeted advertising. To
                exercise these rights, contact us using the information
                below.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                8. Contact Us
              </h2>
              <p className="mt-4">
                Almat Shyntayev
                <br />
                Real Broker, LLC
                <br />
                1400 112th Ave SE, Ste 100
                <br />
                Bellevue, WA 98004
                <br />
                Phone:{" "}
                <a
                  href="tel:+12066063011"
                  className="text-verdigris underline underline-offset-2 hover:text-ink"
                >
                  (206) 606-3011
                </a>
                <br />
                Email:{" "}
                <a
                  href="mailto:almat@almatrealestate.com"
                  className="text-verdigris underline underline-offset-2 hover:text-ink"
                >
                  almat@almatrealestate.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-ink">
                9. Changes to This Policy
              </h2>
              <p className="mt-4">
                We may update this Privacy Policy from time to time. The
                &ldquo;Last Updated&rdquo; date at the top reflects the most
                recent revision.
              </p>
            </section>
          </div>
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
