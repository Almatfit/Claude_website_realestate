import type { ArtVariant } from "@/lib/motifs";

export type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  variant: ArtVariant;
  size: "large" | "small";
};

export const LISTINGS: Listing[] = [
  {
    id: "bluff-house",
    title: "The Bluff House",
    location: "Malibu Coast",
    price: "$8,450,000",
    beds: 5,
    baths: 6,
    sqft: 6200,
    variant: "coast",
    size: "large",
  },
  {
    id: "modernist-linden",
    title: "Modernist on Linden",
    location: "Beverly Hills",
    price: "$4,200,000",
    beds: 4,
    baths: 5,
    sqft: 3850,
    variant: "facade",
    size: "small",
  },
  {
    id: "archive-loft",
    title: "The Archive Loft",
    location: "Downtown Arts District",
    price: "$1,890,000",
    beds: 2,
    baths: 2,
    sqft: 1640,
    variant: "window",
    size: "small",
  },
  {
    id: "casa-de-piedra",
    title: "Casa de Piedra",
    location: "Montecito",
    price: "$6,975,000",
    beds: 6,
    baths: 7,
    sqft: 7100,
    variant: "arch",
    size: "small",
  },
];
