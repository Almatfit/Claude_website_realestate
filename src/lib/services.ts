import type { ArtVariant } from "@/lib/motifs";

export type Service = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  variant: ArtVariant;
};

export const SERVICES: Service[] = [
  {
    id: "buying",
    name: "Buying",
    tagline: "For those searching, not settling.",
    description:
      "Off-market access, candid comparisons, and inspection oversight from the first walkthrough to the closing table.",
    variant: "arch",
  },
  {
    id: "selling",
    name: "Selling",
    tagline: "Positioning, not just listing.",
    description:
      "Pricing strategy, staging direction, and a curated network of qualified buyers built over a decade of local relationships.",
    variant: "facade",
  },
  {
    id: "market-analysis",
    name: "Market analysis",
    tagline: "Numbers, plainly explained.",
    description:
      "Comparative reports and timing guidance that separate a good year to sell from a good decade to hold.",
    variant: "plan",
  },
  {
    id: "relocation",
    name: "Relocation",
    tagline: "Moving, made quiet.",
    description:
      "Full-service coordination for out-of-area and international clients — neighborhood matching, logistics, and a single point of contact throughout.",
    variant: "stair",
  },
];
