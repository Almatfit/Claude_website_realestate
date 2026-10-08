"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/modal";
import { LeadForm } from "@/components/sections/lead-form";

interface LeadFormModalContextValue {
  /** Opens the modal. Pass an explicit `opener` when the triggering
   * element won't still be in the DOM once the modal closes (e.g. a
   * button inside a menu overlay that closes itself first) — otherwise
   * the currently focused element is used automatically. */
  openModal: (opener?: HTMLElement | null) => void;
}

const LeadFormModalContext = createContext<LeadFormModalContextValue | null>(
  null
);

/** Any "Schedule a consultation" CTA calls this to open the shared lead
 * form modal — the same LeadForm component and /api/lead endpoint the
 * inline footer form uses, just presented as a dialog. */
export function useLeadFormModal() {
  const ctx = useContext(LeadFormModalContext);
  if (!ctx) {
    throw new Error(
      "useLeadFormModal must be used within <LeadFormModalProvider>"
    );
  }
  return ctx;
}

export function LeadFormModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const openModal = useCallback((opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <LeadFormModalContext.Provider value={{ openModal }}>
      {children}
      <Modal
        open={open}
        onClose={closeModal}
        titleId={titleId}
        descriptionId={descriptionId}
        returnFocusRef={openerRef}
      >
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <h2
            id={titleId}
            className="font-display pr-10 text-2xl font-medium text-paper sm:text-3xl"
          >
            Schedule a consultation
          </h2>
          <p id={descriptionId} className="mt-2 max-w-sm text-sm text-paper/70">
            Tell us a bit about what you&rsquo;re looking for — we&rsquo;ll
            follow up within one business day.
          </p>
          <div className="mt-8">
            <LeadForm />
          </div>
          {/* Placed after the form in DOM/tab order on purpose: it's
              absolutely positioned top-right regardless, but this keeps
              autofocus-on-open landing on the name field (the first
              focusable element) rather than this close button. */}
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-paper/60 transition-colors hover:text-paper sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </Modal>
    </LeadFormModalContext.Provider>
  );
}
