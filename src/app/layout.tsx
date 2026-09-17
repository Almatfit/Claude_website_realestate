import type { Metadata } from "next";
import { Libre_Bodoni, Public_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const libreBodoni = Libre_Bodoni({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Almat Real Estate",
  description:
    "Almat Real Estate — curated homes, quiet counsel. Buying, selling, and relocation for discerning clients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${libreBodoni.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-body">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
