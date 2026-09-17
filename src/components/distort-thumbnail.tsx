"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArtPanel, type ArtVariant } from "@/components/art-panel";
import { drawArt } from "@/lib/canvas-art";
import { cn } from "@/lib/utils";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float resAspect = uResolution.x / uResolution.y;
    vec2 ratio = vec2(
      min(resAspect / uImageAspect, 1.0),
      min(uImageAspect / resAspect, 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 m = coverUv(uMouse);
    float dist = distance(uv, m);
    float falloff = smoothstep(0.4, 0.0, dist) * uHover;
    vec2 dir = uv - m;
    dir /= (length(dir) + 0.0001);
    float ripple = sin(dist * 26.0 - uTime * 2.2) * 0.5 + 0.5;
    vec2 displaced = uv + dir * falloff * ripple * 0.045;
    gl_FragColor = texture2D(uTexture, displaced);
  }
`;

/**
 * A listing thumbnail rendered through a WebGL plane with a pointer-follow
 * ripple/displacement shader — a restrained "premium" hover effect rather
 * than a full 3D scene. Falls back to the plain <ArtPanel> image when
 * WebGL is unavailable or reduced motion is requested.
 */
export function DistortThumbnail({
  variant,
  className,
  label,
}: {
  variant: ArtVariant;
  className?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const offscreen = document.createElement("canvas");
    drawArt(offscreen, variant, 900);
    const texture = new THREE.CanvasTexture(offscreen);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: 1 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let targetHover = 0;
    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    };
    const onPointerEnter = () => {
      targetHover = 1;
    };
    const onPointerLeave = () => {
      targetHover = 0;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      uniforms.uHover.value +=
        (targetHover - uniforms.uHover.value) * 0.08;
      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(() => {
      setReady(true);
      tick();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      material.dispose();
      mesh.geometry.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <ArtPanel
        variant={variant}
        label={label}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-700",
          ready && "opacity-0"
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-700",
          !ready && "opacity-0"
        )}
      />
    </div>
  );
}
