import type { ModePricing } from "./types.js";
import { DEFAULT_MIN_SAVINGS_THRESHOLD } from "./threshold.js";

export const DEFAULT_SAVINGS_THRESHOLD = DEFAULT_MIN_SAVINGS_THRESHOLD;

function sum(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

/**
 * Payable net spend for one delivery mode after stacked cart and delivery
 * discounts. This is the amount the user would actually pay — not perceived
 * savings or strikethrough marketing figures.
 *
 * netSpend = cartBase − Σ cartDiscounts + deliveryBase − Σ deliveryDiscounts
 *            + otherFees
 */
export function computeNetSpend(pricing: ModePricing): number {
  return (
    pricing.cartBase -
    sum(pricing.cartDiscounts) +
    pricing.deliveryBase -
    sum(pricing.deliveryDiscounts) +
    (pricing.otherFees ?? 0)
  );
}
