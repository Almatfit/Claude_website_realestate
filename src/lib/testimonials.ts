export type Testimonial = {
  quote: string;
  name: string;
  context: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Sofia found us a house before it ever hit the market, then talked us out of overpaying for it. That's rare.",
    name: "James & Priya Okafor",
    context: "Purchased in Montecito",
  },
  {
    quote:
      "We interviewed four agents. Almat was the only one who told us the truth about our asking price.",
    name: "David Chen",
    context: "Sold in Beverly Hills",
  },
  {
    quote:
      "Relocating from London with two kids and a dog, we needed someone who wouldn't waste our time. Almat didn't.",
    name: "Harriet Voss",
    context: "Relocated from London",
  },
];
