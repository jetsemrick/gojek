/**
 * English string templates from the PRD. No i18n framework in M1.
 *
 * The calculator never owns copy. Callers format RpX from the exact payable
 * delta after dual-mode scoring.
 */

/** PRD uses comma thousands separators in English (Rp2,000). */
export function formatRp(amount: number): string {
  return `Rp${Math.abs(amount).toLocaleString("en-US")}`;
}

/** AC-001 / REQ-001: "Save RpX with MURAAAH >" */
export function saveWithMuraaah(savingsAmount: number): string {
  return `Save ${formatRp(savingsAmount)} with MURAAAH >`;
}

/** AC-006 / REQ-006: "Yay! You saved RpX" */
export function yayYouSaved(savingsAmount: number): string {
  return `Yay! You saved ${formatRp(savingsAmount)}`;
}

export const YES_CHANGE = "Yes, change";
export const NO_CANCEL = "No, cancel";

export const SUPPLY_UNAVAILABLE_TITLE =
  "MURAAAH is no longer available for this order.";
