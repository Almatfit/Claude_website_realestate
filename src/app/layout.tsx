import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LeadFormModalProvider } from "@/components/lead-form-modal";
import { HashScrollOnLoad } from "@/components/hash-scroll-on-load";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_TITLE =
  "Almat Real Estate - WA Real Estate Broker in Bellevue & Seattle";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | Almat Real Estate",
  },
  description:
    "Almat Real Estate — curated homes, quiet counsel. Buying, selling, and relocation for discerning clients.",
  openGraph: {
    title: SITE_TITLE,
  },
  twitter: {
    title: SITE_TITLE,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body">
        <SmoothScroll>
          <LeadFormModalProvider>{children}</LeadFormModalProvider>
        </SmoothScroll>
        <HashScrollOnLoad />
        <CookieConsent />
      </body>
    </html>
  );
}
