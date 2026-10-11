"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useLeadFormModal } from "@/components/lead-form-modal";
import {
  LOAN_TERMS,
  calculateMortgage,
  formatCurrency,
  formatPercent,
  parseNumericInput,
  type LoanTermYears,
  type MortgageBreakdownItem,
  type RateMode,
} from "@/lib/mortgage";

interface FieldState {
  homePrice: string;
  downPayment: string;
  downPaymentMode: RateMode;
  interestRate: string;
  termYears: LoanTermYears;
  propertyTax: string;
  propertyTaxMode: RateMode;
  homeInsuranceAnnual: string;
  hoaMonthly: string;
  pmiRate: string;
}

const DEFAULTS: FieldState = {
  homePrice: "650000",
  downPayment: "20",
  downPaymentMode: "percent",
  interestRate: "6.5",
  termYears: 30,
  propertyTax: "1",
  propertyTaxMode: "percent",
  homeInsuranceAnnual: "1400",
  hoaMonthly: "0",
  pmiRate: "0.5",
};

const CHART_COLORS: Record<MortgageBreakdownItem["key"], string> = {
  principalInterest: "#2b3b30",
  propertyTax: "#5c6b54",
  insurance: "#8a7f68",
  hoa: "#b7ac99",
  pmi: "#9c5a34",
};

const fieldLabelClass = "text-xs font-medium uppercase tracking-wide text-ink-soft";
const inputBaseClass =
  "w-full border border-stone bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-colors duration-200 focus:border-verdigris focus:outline-none";

function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  ariaLabel,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={fieldLabelClass}>
          {label}
        </label>
      )}
      <div className={cn("relative", label && "mt-2")}>
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(inputBaseClass, prefix && "pl-7", suffix && "pr-8")}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function UnitToggle({
  mode,
  onToggle,
  groupLabel,
}: {
  mode: RateMode;
  onToggle: () => void;
  groupLabel: string;
}) {
  return (
    <div role="group" aria-label={groupLabel} className="inline-flex border border-stone text-xs">
      <button
        type="button"
        onClick={mode !== "dollar" ? onToggle : undefined}
        aria-pressed={mode === "dollar"}
        className={cn(
          "px-2.5 py-1 transition-colors",
          mode === "dollar" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
        )}
      >
        $
      </button>
      <button
        type="button"
        onClick={mode !== "percent" ? onToggle : undefined}
        aria-pressed={mode === "percent"}
        className={cn(
          "border-l border-stone px-2.5 py-1 transition-colors",
          mode === "percent" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
        )}
      >
        %
      </button>
    </div>
  );
}

function Donut({ breakdown, total }: { breakdown: MortgageBreakdownItem[]; total: number }) {
  const size = 168;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="-rotate-90 shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--stone)"
        strokeWidth={strokeWidth}
      />
      {total > 0 &&
        breakdown.map((item) => {
          if (item.monthly <= 0) return null;
          const dash = item.share * circumference;
          const offset = -cumulative * circumference;
          cumulative += item.share;
          return (
            <circle
              key={item.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={CHART_COLORS[item.key]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
            />
          );
        })}
    </svg>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={fieldLabelClass}>{children}</p>;
}

export function MortgageCalculator() {
  const rootRef = useRef<HTMLElement>(null);
  const { openModal } = useLeadFormModal();
  const formId = useId();
  const [fields, setFields] = useState<FieldState>(DEFAULTS);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".calc-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  function update<K extends keyof FieldState>(key: K, value: FieldState[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function toggleUnitMode(
    valueKey: "downPayment" | "propertyTax",
    modeKey: "downPaymentMode" | "propertyTaxMode"
  ) {
    setFields((prev) => {
      const homePriceNum = parseNumericInput(prev.homePrice);
      const currentNum = parseNumericInput(prev[valueKey]);
      const currentMode = prev[modeKey];

      if (homePriceNum <= 0) {
        // Nothing sensible to convert to/from without a price — just flip
        // the unit and let the user re-enter the number.
        return { ...prev, [modeKey]: currentMode === "percent" ? "dollar" : "percent" };
      }

      if (currentMode === "percent") {
        const dollars = (currentNum / 100) * homePriceNum;
        return {
          ...prev,
          [modeKey]: "dollar",
          [valueKey]: String(Math.round(dollars)),
        };
      }

      const percent = (currentNum / homePriceNum) * 100;
      return {
        ...prev,
        [modeKey]: "percent",
        [valueKey]: String(Math.round(percent * 10) / 10),
      };
    });
  }

  function handleReset() {
    setFields(DEFAULTS);
  }

  const result = useMemo(
    () =>
      calculateMortgage({
        homePrice: parseNumericInput(fields.homePrice),
        downPayment: parseNumericInput(fields.downPayment),
        downPaymentMode: fields.downPaymentMode,
        interestRate: parseNumericInput(fields.interestRate),
        termYears: fields.termYears,
        propertyTax: parseNumericInput(fields.propertyTax),
        propertyTaxMode: fields.propertyTaxMode,
        homeInsuranceAnnual: parseNumericInput(fields.homeInsuranceAnnual),
        hoaMonthly: parseNumericInput(fields.hoaMonthly),
        pmiRate: parseNumericInput(fields.pmiRate),
      }),
    [fields]
  );

  function handleTalkToAlmat() {
    const price = parseNumericInput(fields.homePrice);
    const note =
      `Mortgage calculator estimate — home price ${formatCurrency(price)}, ` +
      `est. monthly payment ${formatCurrency(result.totalMonthly)}/mo ` +
      `(${fields.termYears}-yr fixed @ ${fields.interestRate || "0"}%).`;
    openModal({ initialMessage: note });
  }

  return (
    <section
      id="mortgage-calculator"
      ref={rootRef}
      className="scroll-mt-24 bg-paper-deep px-6 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="calc-reveal max-w-2xl">
          <h2 className="font-display font-medium text-4xl text-ink sm:text-5xl">
            Mortgage Calculator
          </h2>
          <p className="mt-4 text-ink-soft">
            Estimate your monthly payment in seconds.
          </p>
        </div>

        {/* Condensed total, pinned near the top while scrolling on mobile —
            the full breakdown below stays reachable, but the headline
            number never scrolls out of view. */}
        <div className="calc-reveal sticky top-[88px] z-10 -mx-6 mt-8 flex items-baseline justify-between border-y border-stone bg-paper-deep/95 px-6 py-4 backdrop-blur-sm sm:-mx-10 sm:px-10 lg:hidden">
          <span className={fieldLabelClass}>Est. monthly payment</span>
          <span className="font-display text-2xl text-ink">
            {formatCurrency(result.totalMonthly)}
            <span className="ml-1 font-body text-sm font-normal normal-case text-ink-soft">
              /mo
            </span>
          </span>
        </div>

        <div className="calc-reveal mt-10 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* INPUTS */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <NumberField
                id={`${formId}-price`}
                label="Home price"
                prefix="$"
                value={fields.homePrice}
                onChange={(v) => update("homePrice", v)}
                placeholder="650,000"
              />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={`${formId}-down`} className={fieldLabelClass}>
                    Down payment
                  </label>
                  <UnitToggle
                    mode={fields.downPaymentMode}
                    onToggle={() => toggleUnitMode("downPayment", "downPaymentMode")}
                    groupLabel="Down payment unit"
                  />
                </div>
                <div className="mt-2">
                  <NumberField
                    id={`${formId}-down`}
                    value={fields.downPayment}
                    onChange={(v) => update("downPayment", v)}
                    prefix={fields.downPaymentMode === "dollar" ? "$" : undefined}
                    suffix={fields.downPaymentMode === "percent" ? "%" : undefined}
                  />
                </div>
              </div>

              <NumberField
                id={`${formId}-rate`}
                label="Interest rate"
                suffix="%"
                value={fields.interestRate}
                onChange={(v) => update("interestRate", v)}
                placeholder="6.5"
              />

              <div>
                <label htmlFor={`${formId}-term`} className={fieldLabelClass}>
                  Loan term
                </label>
                <select
                  id={`${formId}-term`}
                  value={fields.termYears}
                  onChange={(e) =>
                    update("termYears", Number(e.target.value) as LoanTermYears)
                  }
                  className={cn(inputBaseClass, "mt-2 appearance-none")}
                >
                  {LOAN_TERMS.map((term) => (
                    <option key={term} value={term}>
                      {term}-year fixed
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={`${formId}-tax`} className={fieldLabelClass}>
                    Property tax (annual)
                  </label>
                  <UnitToggle
                    mode={fields.propertyTaxMode}
                    onToggle={() => toggleUnitMode("propertyTax", "propertyTaxMode")}
                    groupLabel="Property tax unit"
                  />
                </div>
                <div className="mt-2">
                  <NumberField
                    id={`${formId}-tax`}
                    value={fields.propertyTax}
                    onChange={(v) => update("propertyTax", v)}
                    prefix={fields.propertyTaxMode === "dollar" ? "$" : undefined}
                    suffix={fields.propertyTaxMode === "percent" ? "%" : undefined}
                  />
                </div>
              </div>

              <NumberField
                id={`${formId}-insurance`}
                label="Homeowner's insurance (annual)"
                prefix="$"
                value={fields.homeInsuranceAnnual}
                onChange={(v) => update("homeInsuranceAnnual", v)}
                placeholder="1,400"
              />

              <NumberField
                id={`${formId}-hoa`}
                label="HOA dues (monthly)"
                prefix="$"
                value={fields.hoaMonthly}
                onChange={(v) => update("hoaMonthly", v)}
                placeholder="0"
              />

              <NumberField
                id={`${formId}-pmi`}
                label="Estimated PMI rate (annual)"
                suffix="%"
                value={fields.pmiRate}
                onChange={(v) => update("pmiRate", v)}
                placeholder="0.5"
              />
            </div>

            {result.downPaymentExceedsPrice && (
              <p className="mt-5 text-sm text-ink-soft">
                Your down payment covers the full price — no loan needed, so
                there&rsquo;s no mortgage payment to estimate.
              </p>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="mt-8 inline-flex items-center gap-2 border border-stone px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-7">
            <div className="border border-stone bg-paper p-8 sm:p-10 lg:sticky lg:top-28">
              <SectionLabel>Estimated monthly payment</SectionLabel>
              <p className="mt-2 font-display text-5xl text-ink sm:text-6xl">
                {formatCurrency(result.totalMonthly)}
                <span className="ml-1 text-lg font-body font-normal text-ink-soft">
                  /mo
                </span>
              </p>

              <div className="mt-10 grid grid-cols-1 items-center gap-8 sm:grid-cols-[auto_1fr]">
                <div className="flex justify-center sm:justify-start">
                  <Donut breakdown={result.breakdown} total={result.totalMonthly} />
                </div>
                <ul className="space-y-3">
                  {result.breakdown.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="flex items-center gap-2 text-ink-soft">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[item.key] }}
                        />
                        {item.label}
                      </span>
                      <span className="whitespace-nowrap font-medium text-ink">
                        {formatCurrency(item.monthly)}{" "}
                        <span className="font-normal text-ink-soft">
                          ({formatPercent(item.share)})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.loanAmount > 0 &&
                (result.pmiApplies ? (
                  <p className="mt-8 border-l-2 border-verdigris py-1 pl-4 text-sm leading-relaxed text-ink-soft">
                    PMI is included because your down payment is under 20%.
                    Estimated at {fields.pmiRate || "0"}% of the loan balance
                    per year — adjust it on the left if your lender quotes a
                    different rate.
                  </p>
                ) : (
                  <p className="mt-8 text-sm text-ink-soft">
                    No PMI included — your down payment is 20% or more.
                  </p>
                ))}

              <button
                type="button"
                onClick={handleTalkToAlmat}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-verdigris sm:w-auto"
              >
                Talk to Almat about pre-approval
              </button>

              <p className="mt-6 text-xs leading-relaxed text-ink-soft">
                This calculator provides estimates for informational purposes
                only and is not a loan offer or commitment to lend. Actual
                payments depend on your lender, credit, and property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
