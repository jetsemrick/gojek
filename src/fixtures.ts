import type { DualModeNetSpendInput, ModePricing } from "./types.js";

/**
 * Fixture carts derived from the PRD comparison table.
 * These are mocks for the Path A spike — not live GoFood checkout payloads.
 */

/** PRD Fast (CEPAAAT): cart 100k − 20k + delivery 15k − Plus 10k. */
export const prdFastPricing: ModePricing = {
  cartBase: 100_000,
  cartDiscounts: [20_000],
  deliveryBase: 15_000,
  deliveryDiscounts: [10_000],
};

/** PRD Cheap current (MURAAAH): same cart, delivery 13.5k − 12k implicit. */
export const prdCheapPricing: ModePricing = {
  cartBase: 100_000,
  cartDiscounts: [20_000],
  deliveryBase: 13_500,
  deliveryDiscounts: [12_000],
};

/** Future Cheap base (4.5k − 3k). Same payable as current Cheap. */
export const prdCheapFuturePricing: ModePricing = {
  cartBase: 100_000,
  cartDiscounts: [20_000],
  deliveryBase: 4_500,
  deliveryDiscounts: [3_000],
};

/** Cheap with an extra stacked cart promo (5k) on top of the PRD cart discount. */
export const stackedCheapPricing: ModePricing = {
  ...prdCheapPricing,
  cartDiscounts: [20_000, 5_000],
};

export const demoTelemetry = {
  searchId: "search_demo_001",
  homeId: "home_demo_001",
  checkoutSessionId: "checkout_demo_001",
};

export const demoComparison = {
  fastEtaMins: 25,
  cheapEtaMins: 55,
};

export function eligibleCepaaatInput(
  overrides: Partial<DualModeNetSpendInput> = {},
): DualModeNetSpendInput {
  return {
    currentMode: "CEPAAAT",
    murahAvailable: true,
    featureFlagEnabled: true,
    fast: prdFastPricing,
    cheap: prdCheapPricing,
    ...overrides,
  };
}
