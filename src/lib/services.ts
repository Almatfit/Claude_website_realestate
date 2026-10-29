export type ServiceImage = {
  src: string;
  alt: string;
  blurDataURL: string;
};

export type Service = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: ServiceImage;
};

export const SERVICES: Service[] = [
  {
    id: "buying",
    name: "Buying",
    tagline: "For those searching, not settling.",
    description:
      "Off-market access, candid comparisons, and inspection oversight from the first walkthrough to the closing table.",
    image: {
      src: "/images/buying-twilight-exterior.webp",
      alt: "Craftsman home at twilight with a lit front entry",
      blurDataURL:
        "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQBACdASoQABQAPu1iqk4ppaQiMAgBMB2JZACdMoR3ACVMbPqMoUWCEAD+nsWB6iRX/bcTadF7Xbl+MszqzNx1pFfrvqgVz4DiV/DZwkAAAA==",
    },
  },
  {
    id: "selling",
    name: "Selling",
    tagline: "Positioning, not just listing.",
    description:
      "Pricing strategy, staging direction, and a curated network of qualified buyers built over a decade of local relationships.",
    image: {
      src: "/images/selling-kitchen.webp",
      alt: "Bright white kitchen with gold hardware",
      blurDataURL:
        "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAAAQAwCdASoQABQAPu1iqU2ppaQpMAgBMB2JZwAALgom8YAA/ld7t3YAk6OBw3qh++e4exQA",
    },
  },
  {
    id: "market-analysis",
    name: "Market analysis",
    tagline: "Numbers, plainly explained.",
    description:
      "Comparative reports and timing guidance that separate a good year to sell from a good decade to hold.",
    image: {
      src: "/images/market-analysis-living-room.webp",
      alt: "Modern living room with a gray sofa and wood coffee tables",
      blurDataURL:
        "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoQABQAPu1iqU2ppaOiMAgBMB2JZQAAUuQQlnnMHMhvRADdoFjEGIVv/9IvEp+wonqN3sizEN1m3SjBDrBVv8wpAAA=",
    },
  },
  {
    id: "relocation",
    name: "Relocation",
    tagline: "Moving, made quiet.",
    description:
      "Full-service coordination for out-of-area and international clients — neighborhood matching, logistics, and a single point of contact throughout.",
    image: {
      src: "/images/relocation-sunset-deck.webp",
      alt: "Sunset view from a covered deck overlooking neighboring homes",
      blurDataURL:
        "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABQAwCdASoQABQAPu1iqU2ppaQiMAgBMB2JYgCdABTLff1aAADdi0VvsTHdznx3zHa2Y653lpRthMW4cd6I2m6R6Hnb7Q3e3wcAAA==",
    },
  },
];
