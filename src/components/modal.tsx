"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { lenisInstance } from "@/components/smooth-scroll";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((el) => el.tabIndex !== -1 && el.offsetParent !== null);
}

function noopSubscribe() {
  return () => {};
}

/** True once hydrated on the client — portals need `document`, which
 * isn't available during SSR. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

/** Generic, reusable dialog: portal, role="dialog" + aria-modal, focus
 * trap, Esc/backdrop-click to close, body scroll + Lenis lock, GSAP
 * open/close motion (skipped under prefers-reduced-motion).
 *
 * Every dismissal path (Esc, backdrop click, or a caller's own close
 * button) calls the same `onClose`, which just flips `open` to false —
 * the component stays mounted for the exit animation and unmounts
 * itself afterward, so the animation is identical regardless of how
 * the close was triggered. */
export function Modal({
  open,
  onClose,
  titleId,
  descriptionId,
  returnFocusRef,
  children,
}: ModalProps) {
  const mounted = useMounted();
  const [rendered, setRendered] = useState(open);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Mirror `open` into `rendered` the instant it becomes true, and
  // (only when there's no exit animation to play) the instant it
  // becomes false — a render-phase state adjustment, not an effect.
  // See https://react.dev/learn/you-might-not-need-an-effect.
  if (open && !rendered) {
    setRendered(true);
  }
  if (!open && rendered && reducedMotion) {
    setRendered(false);
  }

  // Scroll lock + Lenis pause + focus restore, active for the full time
  // the dialog is rendered (including the exit-animation window).
  useEffect(() => {
    if (!rendered) return;
    const opener = returnFocusRef?.current ?? null;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    lenisInstance.current?.stop();

    return () => {
      document.documentElement.style.overflow = "";
      lenisInstance.current?.start();
      const toFocus = opener ?? previouslyFocused.current;
      toFocus?.focus();
    };
  }, [rendered, returnFocusRef]);

  // Play the exit animation when `open` goes false, then unmount.
  // (The reduced-motion case is handled synchronously above instead.)
  useEffect(() => {
    if (open || !rendered || reducedMotion) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => setRendered(false),
    });
    tl.to(panel, { opacity: 0, y: 10, scale: 0.98, duration: 0.18 }, 0).to(
      overlay,
      { opacity: 0, duration: 0.2 },
      0
    );
    return () => {
      tl.kill();
    };
  }, [open, rendered, reducedMotion]);

  // Entrance animation + initial focus once the dialog is rendered.
  useEffect(() => {
    if (!rendered || !open) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    const raf = requestAnimationFrame(() => {
      const [first] = getFocusable(panel);
      (first ?? panel).focus();
    });

    if (!reducedMotion) {
      gsap.set(panel, { opacity: 0, y: 16, scale: 0.98 });
      gsap.set(overlay, { opacity: 0 });
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(overlay, { opacity: 1, duration: 0.25 })
        .to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.35 }, "-=0.15");
    }

    return () => cancelAnimationFrame(raf);
  }, [rendered, open, reducedMotion]);

  // Esc to close + Tab focus trap, active while rendered.
  useEffect(() => {
    if (!rendered) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = getFocusable(panel);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [rendered, onClose]);

  function handleBackdropMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!mounted || !rendered) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/75 p-4 sm:p-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto bg-ink text-paper shadow-2xl outline-none sm:max-h-[calc(100svh-3rem)]"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
