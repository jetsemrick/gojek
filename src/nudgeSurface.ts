import { yayYouSaved, saveWithMuraaah } from "./copy.js";
import { dualModeNetSpend } from "./dualModeNetSpend.js";
import type { DualModeNetSpendInput, SavingsNudgeView } from "./types.js";

/**
 * UI-surface view-model: pricing decision plus PRD string templates.
 * The React checkout mock in `web/` binds to this; no production GoFood UI.
 */
export function evaluateSavingsNudge(
  input: DualModeNetSpendInput,
): SavingsNudgeView {
  const decision = dualModeNetSpend(input);
  return {
    ...decision,
    nudgeCopy: decision.showNudge
      ? saveWithMuraaah(decision.savingsAmount)
      : null,
    successCopy: yayYouSaved(decision.savingsAmount),
  };
}
