import { describe, expect, it } from "vitest";
import { dualModeNetSpend } from "./dualModeNetSpend.js";
import {
  eligibleCepaaatInput,
  prdCheapFuturePricing,
  prdCheapPricing,
  prdFastPricing,
  stackedCheapPricing,
} from "./fixtures.js";
import { computeNetSpend, DEFAULT_SAVINGS_THRESHOLD } from "./pricing.js";

describe("computeNetSpend", () => {
  it("matches the PRD Fast payable total (cart + delivery after discounts)", () => {
    expect(computeNetSpend(prdFastPricing)).toBe(85_000);
  });

  it("matches the PRD Cheap payable total", () => {
    expect(computeNetSpend(prdCheapPricing)).toBe(81_500);
  });

  it("gives the same payable for future Cheap base vs current Cheap", () => {
    expect(computeNetSpend(prdCheapFuturePricing)).toBe(
      computeNetSpend(prdCheapPricing),
    );
  });
});

describe("dualModeNetSpend", () => {
  it("shows the nudge when the payable delta is above the default threshold", () => {
    const result = dualModeNetSpend(eligibleCepaaatInput());

    expect(result.fastNetSpend).toBe(85_000);
    expect(result.cheapNetSpend).toBe(81_500);
    expect(result.savingsAmount).toBe(3_500);
    expect(result.showNudge).toBe(true);
    expect(result.reason).toBeNull();
  });

  it("hides the nudge when the payable delta is below the threshold", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({
        cheap: {
          cartBase: 100_000,
          cartDiscounts: [20_000],
          deliveryBase: 15_000,
          deliveryDiscounts: [10_900],
        },
      }),
    );

    expect(result.savingsAmount).toBe(900);
    expect(result.savingsAmount).toBeLessThan(DEFAULT_SAVINGS_THRESHOLD);
    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("below_threshold");
  });

  it("hides the nudge when MURAAAH is unavailable", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({ murahAvailable: false }),
    );

    expect(result.savingsAmount).toBe(3_500);
    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("unavailable");
  });

  it("hides the nudge when the feature flag is off (control)", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({ featureFlagEnabled: false }),
    );

    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("flag_off");
  });

  it("hides the nudge when checkout is already on MURAAAH", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({ currentMode: "MURAAAH" }),
    );

    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("already_on_cheap");
    expect(result.savingsAmount).toBe(3_500);
  });

  it("lets a stacked cheap-only promo change the payable delta", () => {
    const withoutStack = dualModeNetSpend(eligibleCepaaatInput());
    const withStack = dualModeNetSpend(
      eligibleCepaaatInput({ cheap: stackedCheapPricing }),
    );

    expect(withoutStack.savingsAmount).toBe(3_500);
    expect(withStack.cheapNetSpend).toBe(76_500);
    expect(withStack.savingsAmount).toBe(8_500);
    expect(withStack.showNudge).toBe(true);
  });

  it("shows the nudge at the exact 2000 boundary", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({
        cheap: {
          cartBase: 100_000,
          cartDiscounts: [20_000],
          deliveryBase: 13_000,
          deliveryDiscounts: [10_000],
        },
      }),
    );

    expect(result.fastNetSpend).toBe(85_000);
    expect(result.cheapNetSpend).toBe(83_000);
    expect(result.savingsAmount).toBe(2_000);
    expect(result.showNudge).toBe(true);
    expect(result.reason).toBeNull();
  });

  it("treats a 1999 delta as below threshold", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({
        cheap: {
          cartBase: 100_000,
          cartDiscounts: [20_000],
          deliveryBase: 13_001,
          deliveryDiscounts: [10_000],
        },
      }),
    );

    expect(result.savingsAmount).toBe(1_999);
    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("below_threshold");
  });

  it("gates the whole surface with flag_off even if other hide reasons also apply", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({
        featureFlagEnabled: false,
        murahAvailable: false,
        currentMode: "MURAAAH",
      }),
    );

    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("flag_off");
  });

  it("uses a custom threshold when provided", () => {
    const result = dualModeNetSpend(
      eligibleCepaaatInput({ threshold: 4_000 }),
    );

    expect(result.savingsAmount).toBe(3_500);
    expect(result.showNudge).toBe(false);
    expect(result.reason).toBe("below_threshold");
  });
});
