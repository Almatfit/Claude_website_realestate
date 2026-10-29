"use client";

import { TRACKING_CONFIGURED, openConsentSettings } from "@/lib/consent";

/** Footer link that reopens the cookie banner. Hidden when no tracking is
 * configured, since there's nothing to choose. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!TRACKING_CONFIGURED) return null;
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Cookie settings
    </button>
  );
}
