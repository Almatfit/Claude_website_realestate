export const INTEREST_OPTIONS = [
  { value: "buying", label: "Buying" },
  { value: "selling", label: "Selling" },
  { value: "buying-selling", label: "Buying & Selling" },
  { value: "other", label: "Other" },
] as const;

export type LeadInterest = (typeof INTEREST_OPTIONS)[number]["value"];

export function interestLabel(value: string): string {
  return (
    INTEREST_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}
