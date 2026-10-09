import { useId } from "react";
import { GRADIENTS, GLOW, MOTIFS, type ArtVariant } from "@/lib/motifs";

export type { ArtVariant };

function Motif({ variant, stroke }: { variant: ArtVariant; stroke: string }) {
  const { paths, circles } = MOTIFS[variant];
  return (
    <g fill="none" stroke={stroke} strokeWidth={0.35} strokeOpacity={0.4} vectorEffect="non-scaling-stroke">
      {paths.map((p, i) => (
        <path key={i} d={p.d} opacity={p.opacity} />
      ))}
      {circles?.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} opacity={c.opacity} />
      ))}
    </g>
  );
}

export function ArtPanel({
  variant,
  className,
  label,
}: {
  variant: ArtVariant;
  className?: string;
  label?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const [from, to] = GRADIENTS[variant];
  const glow = GLOW[variant];

  return (
    <div className={className} aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
          <radialGradient id={`glow-${uid}`} cx={`${glow.cx}%`} cy={`${glow.cy}%`} r="55%">
            <stop offset="0%" stopColor="#e9c8a1" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#e9c8a1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#e9c8a1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`vig-${uid}`} cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#1b1812" stopOpacity="0" />
            <stop offset="100%" stopColor="#1b1812" stopOpacity="0.16" />
          </radialGradient>
          <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.045" intercept="0" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100" height="100" fill={`url(#grad-${uid})`} />
        <rect width="100" height="100" fill={`url(#glow-${uid})`} />
        <Motif variant={variant} stroke="#1b1812" />
        <rect width="100" height="100" fill={`url(#vig-${uid})`} />
        <rect width="100" height="100" filter={`url(#grain-${uid})`} />
      </svg>
    </div>
  );
}
