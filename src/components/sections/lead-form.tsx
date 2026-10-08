"use client";

import { useId, useState, type FormEvent } from "react";
import { Check, CircleCheck, Loader2 } from "lucide-react";
import { INTEREST_OPTIONS } from "@/lib/lead";
import { cn } from "@/lib/utils";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  consent: boolean;
  company: string; // honeypot — left blank by real visitors
}

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
  consent: false,
  company: "",
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (values.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!values.interest) {
    errors.interest = "Please select an option.";
  }
  if (!values.consent) {
    errors.consent = "Please agree to be contacted before submitting.";
  }

  return errors;
}

const inputClass =
  "w-full border border-paper/25 bg-paper/5 px-4 py-3 text-sm text-paper placeholder:text-paper/40 transition-colors duration-200 focus:border-paper focus:bg-paper/10 focus:outline-none";

// The shared `destructive` token is tuned for the light "paper" sections;
// against this footer's dark ink background it falls to ~3.3:1 contrast,
// under the 4.5:1 WCAG AA floor for text. This lighter red (measured at
// ~5.7:1 against the footer background) is scoped to this form instead.
const errorText = "text-[#f87171]";
const errorBorder = "border-[#f87171]/70";
const invalidInputClass = `${errorBorder} focus:border-[#f87171]`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={cn("mt-1.5 text-xs", errorText)}>
      {message}
    </p>
  );
}

export function LeadForm() {
  const formId = useId();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const errors = validate(values);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function markTouched(key: keyof FormValues) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    setTouched({
      name: true,
      email: true,
      phone: true,
      interest: true,
      message: true,
      consent: true,
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Unexpected response from the server." }));

      if (!res.ok || !data.ok) {
        setStatus("error");
        setFormError(
          data.error ?? "We couldn't submit your request. Please try again."
        );
        return;
      }

      setStatus("success");
      setValues(INITIAL_VALUES);
      setTouched({});
    } catch {
      setStatus("error");
      setFormError(
        "We couldn't reach the server. Check your connection and try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="contact-reveal flex items-start gap-4 border border-verdigris-soft/40 bg-verdigris-soft/10 px-6 py-7"
      >
        <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-verdigris-soft" />
        <div>
          <p className="font-display text-lg text-paper">Thank you — message sent.</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-paper/70">
            We&rsquo;ll be in touch within one business day. For anything
            urgent, call{" "}
            <a href="tel:+12066063011" className="underline underline-offset-2 hover:text-paper">
              (206) 606-3011
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-5 text-sm font-medium text-verdigris-soft underline underline-offset-2 hover:text-paper"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="contact-reveal relative space-y-5"
      aria-describedby={formError ? `${formId}-form-error` : undefined}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="text-xs font-medium uppercase tracking-wide text-paper/60">
            Full name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => markTouched("name")}
            aria-invalid={touched.name && !!errors.name}
            aria-describedby={touched.name && errors.name ? `${formId}-name-error` : undefined}
            className={cn("mt-2", inputClass, touched.name && errors.name && invalidInputClass)}
          />
          <FieldError id={`${formId}-name-error`} message={touched.name ? errors.name : undefined} />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="text-xs font-medium uppercase tracking-wide text-paper/60">
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => markTouched("email")}
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={touched.email && errors.email ? `${formId}-email-error` : undefined}
            className={cn("mt-2", inputClass, touched.email && errors.email && invalidInputClass)}
          />
          <FieldError id={`${formId}-email-error`} message={touched.email ? errors.email : undefined} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-phone`} className="text-xs font-medium uppercase tracking-wide text-paper/60">
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            onBlur={() => markTouched("phone")}
            aria-invalid={touched.phone && !!errors.phone}
            aria-describedby={touched.phone && errors.phone ? `${formId}-phone-error` : undefined}
            className={cn("mt-2", inputClass, touched.phone && errors.phone && invalidInputClass)}
          />
          <FieldError id={`${formId}-phone-error`} message={touched.phone ? errors.phone : undefined} />
        </div>

        <div>
          <label htmlFor={`${formId}-interest`} className="text-xs font-medium uppercase tracking-wide text-paper/60">
            I&rsquo;m interested in
          </label>
          <select
            id={`${formId}-interest`}
            name="interest"
            value={values.interest}
            onChange={(e) => update("interest", e.target.value)}
            onBlur={() => markTouched("interest")}
            aria-invalid={touched.interest && !!errors.interest}
            aria-describedby={touched.interest && errors.interest ? `${formId}-interest-error` : undefined}
            className={cn(
              "mt-2 appearance-none",
              inputClass,
              touched.interest && errors.interest && invalidInputClass,
              values.interest === "" && "text-paper/40"
            )}
          >
            <option value="" disabled className="text-ink">
              Select one
            </option>
            {INTEREST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="text-ink">
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id={`${formId}-interest-error`} message={touched.interest ? errors.interest : undefined} />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-xs font-medium uppercase tracking-wide text-paper/60">
          Message <span className="normal-case text-paper/40">(optional)</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          maxLength={2000}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className={cn("mt-2 resize-none", inputClass)}
        />
      </div>

      {/* Honeypot: hidden from sighted users and assistive tech alike, and
          out of tab order. Real visitors never populate this. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm leading-relaxed text-paper/70">
        <input
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={(e) => update("consent", e.target.checked)}
          onBlur={() => markTouched("consent")}
          aria-invalid={touched.consent && !!errors.consent}
          aria-describedby={touched.consent && errors.consent ? `${formId}-consent-error` : undefined}
          className="peer sr-only"
        />
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-verdigris-soft peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink",
            values.consent ? "border-verdigris-soft bg-verdigris-soft" : "border-paper/35",
            touched.consent && errors.consent && !values.consent && errorBorder
          )}
        >
          {values.consent && <Check className="h-3.5 w-3.5 text-ink" strokeWidth={3} aria-hidden="true" />}
        </span>
        <span>
          I agree to be contacted by Almat Shyntayev via call, email, and
          text about real estate services. Message and data rates may
          apply. Reply STOP to opt out. See our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-paper">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      <FieldError id={`${formId}-consent-error`} message={touched.consent ? errors.consent : undefined} />

      {formError && (
        <p id={`${formId}-form-error`} role="alert" className={cn("text-sm", errorText)}>
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-verdigris hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {status === "submitting" ? "Sending…" : "Schedule a consultation"}
      </button>
    </form>
  );
}
