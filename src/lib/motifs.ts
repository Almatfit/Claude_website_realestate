export type ArtVariant = "facade" | "arch" | "coast" | "window" | "plan" | "stair";

export const GRADIENTS: Record<ArtVariant, [string, string]> = {
  facade: ["#f3ecdf", "#e2d6bf"],
  arch: ["#efe7dc", "#d8cbb8"],
  coast: ["#eeeae1", "#c9cdc0"],
  window: ["#f1ece2", "#ddd0b8"],
  plan: ["#eee8dc", "#d9cdb5"],
  stair: ["#efeae0", "#ddd0ba"],
};

export const GLOW: Record<ArtVariant, { cx: number; cy: number }> = {
  facade: { cx: 78, cy: 18 },
  arch: { cx: 50, cy: 30 },
  coast: { cx: 78, cy: 24 },
  window: { cx: 30, cy: 15 },
  plan: { cx: 85, cy: 20 },
  stair: { cx: 20, cy: 85 },
};

export type MotifPath = { d: string; opacity?: number };
export type MotifCircle = { cx: number; cy: number; r: number; opacity?: number };

export const MOTIFS: Record<ArtVariant, { paths: MotifPath[]; circles?: MotifCircle[] }> = {
  facade: {
    paths: [
      { d: "M12 78 L12 40 L50 18 L88 40 L88 78 Z" },
      { d: "M12 40 L88 40" },
      { d: "M50 18 L50 78" },
      { d: "M17 50 L27 50 L27 64 L17 64 Z" },
      { d: "M29 50 L39 50 L39 64 L29 64 Z" },
      { d: "M61 50 L71 50 L71 64 L61 64 Z" },
      { d: "M73 50 L83 50 L83 64 L73 64 Z" },
      { d: "M4 78 L96 78" },
    ],
  },
  arch: {
    paths: [
      { d: "M28 82 L28 42 A22 22 0 0 1 72 42 L72 82" },
      { d: "M36 82 L36 46 A14 14 0 0 1 64 46 L64 82" },
      { d: "M6 82 L94 82" },
      { d: "M28 82 L28 88 M72 82 L72 88" },
    ],
  },
  coast: {
    paths: [
      { d: "M-4 46 Q 18 36 40 44 T 78 40 T 104 46", opacity: 0.5 },
      { d: "M-4 58 Q 22 50 46 57 T 104 56", opacity: 0.75 },
      { d: "M-4 68 L104 68" },
      { d: "M-4 74 Q 20 71 44 74 T 104 73", opacity: 0.4 },
      { d: "M-4 80 Q 30 77 60 80 T 104 79", opacity: 0.22 },
    ],
    circles: [{ cx: 78, cy: 22, r: 6, opacity: 0.5 }],
  },
  window: {
    paths: [
      { d: "M14 10 L86 10 L86 90 L14 90 Z" },
      { d: "M32 10 L32 90" },
      { d: "M50 10 L50 90" },
      { d: "M68 10 L68 90" },
      { d: "M14 50 L86 50" },
    ],
  },
  plan: {
    paths: [
      { d: "M10 90 L10 14 L58 14 L58 40 L90 40 L90 90 Z" },
      { d: "M10 60 L44 60 L44 90" },
      { d: "M58 40 L58 60" },
    ],
    circles: [
      { cx: 20, cy: 22, r: 1.4 },
      { cx: 68, cy: 50, r: 1.4 },
    ],
  },
  stair: {
    paths: [0, 1, 2, 3, 4, 5].map((i) => ({
      d: `M${14 + i * 12} ${82 - i * 11} L${26 + i * 12} ${82 - i * 11} L${26 + i * 12} ${71 - i * 11}`,
    })).concat([{ d: "M8 84 L92 84" }]),
  },
};
