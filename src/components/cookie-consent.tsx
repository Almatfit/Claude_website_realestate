"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  GA_MEASUREMENT_ID,
  META_PIXEL_ID,
  TRACKING_CONFIGURED,
  setConsent,
  subscribeToOpenSettings,
  useConsent,
} from "@/lib/consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** GA4 + Meta pixel, rendered only after the visitor accepts cookies. */
function TrackingScripts() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);

  // The pixel's init snippet fires the first PageView; client-side route
  // changes need their own. (GA4's enhanced measurement already tracks
  // history changes on its own.)
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(GA_MEASUREMENT_ID)});`}
          </Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(META_PIXEL_ID)});fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

export function CookieConsent() {
  const consent = useConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => subscribeToOpenSettings(() => setSettingsOpen(true)), []);

  if (!TRACKING_CONFIGURED || consent === undefined) return null;

  const showBanner = consent === null || settingsOpen;

  const choose = (choice: "granted" | "denied") => {
    setSettingsOpen(false);
    setConsent(choice);
  };

  return (
    <>
      {consent === "granted" && <TrackingScripts />}
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl border border-stone bg-paper p-5 text-ink shadow-[0_12px_40px_-12px_rgba(27,24,18,0.35)] sm:p-6"
        >
          <p className="text-sm leading-relaxed text-ink-soft">
            We use cookies for analytics (Google Analytics) and to measure our
            ads on Google and Meta. They&rsquo;re only set if you accept. See
            our{" "}
            <a
              href="/privacy-policy"
              className="text-verdigris underline underline-offset-2 hover:text-ink"
            >
              Privacy Policy
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="bg-verdigris px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="border border-ink/30 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
