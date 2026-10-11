// Mortgage estimate math: standard fixed-rate amortization, property tax /
// insurance / HOA add-ons, and automatic PMI below 20% down. Pure functions,
// no React — easy to unit-test in isolation (see scripts in this session's
// scratch dir for the verification run against known reference figures).

export const LOAN_TERMS = [10, 15, 20, 25, 30] as const;
export type LoanTermYears = (typeof LOAN_TERMS)[number];

export type RateMode = "percent" | "dollar";

export interface MortgageInput {
  /** Home purchase price, dollars. */
  homePrice: number;
  /** Down payment, in whichever unit `downPaymentMode` specifies. */
  downPayment: number;
  downPaymentMode: RateMode;
  /** Annual nominal interest rate, percent (e.g. 6.5 for 6.5%). */
  interestRate: number;
  termYears: LoanTermYears;
  /** Annual property tax, in whichever unit `propertyTaxMode` specifies. */
  propertyTax: number;
  propertyTaxMode: RateMode;
  /** Annual homeowner's insurance, dollars. */
  homeInsuranceAnnual: number;
  /** Monthly HOA dues, dollars. */
  hoaMonthly: number;
  /** Estimated annual PMI rate, percent of loan balance (e.g. 0.5). */
  pmiRate: number;
}

export interface MortgageBreakdownItem {
  key: "principalInterest" | "propertyTax" | "insurance" | "hoa" | "pmi";
  label: string;
  monthly: number;
  /** Share of the total monthly payment, 0–1. 0 when total is 0. */
  share: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  /** True when the entered down payment (before clamping) is at least the
   * home price — i.e. there'd be no loan at all. Drives a UI hint. */
  downPaymentExceedsPrice: boolean;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  pmiApplies: boolean;
  totalMonthly: number;
  breakdown: MortgageBreakdownItem[];
}

/** Clamp to a finite, non-negative number. Invalid/empty input becomes 0 —
 * callers never see NaN or a negative payment. */
export function toNonNegativeNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/** Parses a user-typed numeric string (commas, $, %, stray spaces allowed)
 * into a clamped non-negative number. Returns 0 for empty/invalid input so
 * the calculator never breaks mid-keystroke. */
export function parseNumericInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return 0;
  return toNonNegativeNumber(Number.parseFloat(cleaned));
}

function resolveAmount(
  value: number,
  mode: RateMode,
  base: number
): number {
  const v = toNonNegativeNumber(value);
  return mode === "percent" ? (base * v) / 100 : v;
}

/** The standard fixed-rate amortization formula, M = P[r(1+r)^n]/[(1+r)^n-1],
 * with the r=0 edge case (straight-line division) handled explicitly since
 * the formula is 0/0-indeterminate there. */
export function monthlyPrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  termYears: number
): number {
  const n = Math.round(termYears * 12);
  if (n <= 0 || principal <= 0) return 0;

  const r = toNonNegativeNumber(annualRatePercent) / 100 / 12;
  if (r === 0) return principal / n;

  const factor = Math.pow(1 + r, n);
  return (principal * (r * factor)) / (factor - 1);
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = toNonNegativeNumber(input.homePrice);

  const rawDownPayment = resolveAmount(
    input.downPayment,
    input.downPaymentMode,
    homePrice
  );
  // A down payment can't exceed the price — clamp so the loan never goes
  // negative (covers the "down payment larger than price" edge case).
  const downPaymentExceedsPrice = homePrice > 0 && rawDownPayment >= homePrice;
  const downPaymentAmount = Math.min(rawDownPayment, homePrice);
  const downPaymentPercent = homePrice > 0 ? (downPaymentAmount / homePrice) * 100 : 0;

  const loanAmount = Math.max(0, homePrice - downPaymentAmount);

  const monthlyPrincipalInterest = monthlyPrincipalAndInterest(
    loanAmount,
    input.interestRate,
    input.termYears
  );

  const annualPropertyTax = resolveAmount(
    input.propertyTax,
    input.propertyTaxMode,
    homePrice
  );
  const monthlyPropertyTax = annualPropertyTax / 12;
  const monthlyInsurance = toNonNegativeNumber(input.homeInsuranceAnnual) / 12;
  const monthlyHoa = toNonNegativeNumber(input.hoaMonthly);

  // PMI kicks in automatically under 20% down, on the loan balance — and
  // never applies once the loan itself is paid off (loanAmount 0).
  const pmiApplies = loanAmount > 0 && downPaymentPercent < 20;
  const monthlyPmi = pmiApplies
    ? (loanAmount * toNonNegativeNumber(input.pmiRate)) / 100 / 12
    : 0;

  const totalMonthly =
    monthlyPrincipalInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyHoa +
    monthlyPmi;

  const share = (n: number) => (totalMonthly > 0 ? n / totalMonthly : 0);

  const breakdown: MortgageBreakdownItem[] = [
    {
      key: "principalInterest",
      label: "Principal & interest",
      monthly: monthlyPrincipalInterest,
      share: share(monthlyPrincipalInterest),
    },
    {
      key: "propertyTax",
      label: "Property tax",
      monthly: monthlyPropertyTax,
      share: share(monthlyPropertyTax),
    },
    {
      key: "insurance",
      label: "Homeowner's insurance",
      monthly: monthlyInsurance,
      share: share(monthlyInsurance),
    },
    {
      key: "hoa",
      label: "HOA dues",
      monthly: monthlyHoa,
      share: share(monthlyHoa),
    },
    {
      key: "pmi",
      label: "PMI",
      monthly: monthlyPmi,
      share: share(monthlyPmi),
    },
  ];

  return {
    loanAmount,
    downPaymentAmount,
    downPaymentPercent,
    downPaymentExceedsPrice,
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyPmi,
    pmiApplies,
    totalMonthly,
    breakdown,
  };
}

export function formatCurrency(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatPercent(fraction: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number.isFinite(fraction) ? fraction : 0);
}
