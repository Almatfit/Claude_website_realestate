import { GRADIENTS, GLOW, MOTIFS, type ArtVariant } from "@/lib/motifs";

/** Renders the same duotone + line-art motif used by <ArtPanel>, onto a
 * canvas, for use as a WebGL texture (see DistortThumbnail). */
export function drawArt(canvas: HTMLCanvasElement, variant: ArtVariant, size = 900) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const [from, to] = GRADIENTS[variant];
  const glow = GLOW[variant];

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, from);
  grad.addColorStop(1, to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const gx = (glow.cx / 100) * size;
  const gy = (glow.cy / 100) * size;
  const glowGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, size * 0.55);
  glowGrad.addColorStop(0, "rgba(233,200,161,0.55)");
  glowGrad.addColorStop(0.55, "rgba(233,200,161,0.12)");
  glowGrad.addColorStop(1, "rgba(233,200,161,0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, size, size);

  const scale = size / 100;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.strokeStyle = "#1b1812";
  ctx.lineWidth = 1.1 / scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const { paths, circles } = MOTIFS[variant];
  for (const p of paths) {
    ctx.globalAlpha = 0.4 * (p.opacity ?? 1);
    ctx.stroke(new Path2D(p.d));
  }
  for (const c of circles ?? []) {
    ctx.globalAlpha = 0.4 * (c.opacity ?? 1);
    const path = new Path2D();
    path.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
    ctx.stroke(path);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  const vig = ctx.createRadialGradient(
    size * 0.5,
    size * 0.38,
    0,
    size * 0.5,
    size * 0.38,
    size * 0.75
  );
  vig.addColorStop(0, "rgba(27,24,18,0)");
  vig.addColorStop(1, "rgba(27,24,18,0.16)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    data[i] += n;
    data[i + 1] += n;
    data[i + 2] += n;
  }
  ctx.putImageData(imageData, 0, 0);
}
