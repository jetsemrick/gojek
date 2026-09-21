import { computeNetSpend, DEFAULT_SAVINGS_THRESHOLD } from "./pricing.js";
import type { DualModeNetSpendInput, DualModeNetSpendResult } from "./types.js";

function hidden(
  result: Omit<DualModeNetSpendResult, "showNudge">,
): DualModeNetSpendResult {
  return { ...result, showNudge: false };
}

/**
 * Dual-mode payable comparison that decides whether the Cheap savings nudge
 * should appear on CEPAAAT checkout.
 *
 * RpX is always `fastNetSpend − cheapNetSpend` (exact payable delta after
 * candidate promos / stacked discounts). This module never invents copy or
 * static savings claims.
 */
export function dualModeNetSpend(
  input: DualModeNetSpendInput,
): DualModeNetSpendResult {
  const fastNetSpend = computeNetSpend(input.fast);
  const cheapNetSpend = computeNetSpend(input.cheap);
  const savingsAmount = fastNetSpend - cheapNetSpend;
  const threshold = input.threshold ?? DEFAULT_SAVINGS_THRESHOLD;
  const amounts = { savingsAmount, fastNetSpend, cheapNetSpend };

  if (!input.featureFlagEnabled) {
    return hidden({ ...amounts, reason: "flag_off" });
  }

  if (input.currentMode === "MURAAAH") {
    return hidden({ ...amounts, reason: "already_on_cheap" });
  }

  if (!input.murahAvailable) {
    return hidden({ ...amounts, reason: "unavailable" });
  }

  if (savingsAmount < threshold) {
    return hidden({ ...amounts, reason: "below_threshold" });
  }

  return { showNudge: true, ...amounts, reason: null };
}
