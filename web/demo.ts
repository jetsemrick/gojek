import type { CreateSessionInput } from "../src/checkoutSession.js";
import {
  demoComparison,
  demoTelemetry,
  eligibleCepaaatInput,
  stackedCheapPricing,
} from "../src/fixtures.js";
import { isCheapSavingsNudgeEnabled } from "../src/featureFlag.js";
import { getMinSavingsThreshold } from "../src/threshold.js";
import type { DualModeNetSpendInput, ModePricing } from "../src/types.js";

export type ScenarioId =
  | "eligible"
  | "unavailable"
  | "already_cheap"
  | "below_threshold"
  | "boundary"
  | "stacked";

export interface ScenarioOption {
  id: ScenarioId;
  label: string;
  hint: string;
}

export const SCENARIOS: readonly ScenarioOption[] = [
  {
    id: "eligible",
    label: "Eligible CEPAAAT",
    hint: "PRD fixture — delta Rp3,500, show nudge",
  },
  {
    id: "unavailable",
    label: "MURAAAH unavailable",
    hint: "Hide reason: unavailable",
  },
  {
    id: "already_cheap",
    label: "Already MURAAAH",
    hint: "Hide reason: already_on_cheap",
  },
  {
    id: "below_threshold",
    label: "Below threshold",
    hint: "Delta Rp900 — hide",
  },
  {
    id: "boundary",
    label: "Exact Rp2,000",
    hint: "Boundary — show nudge",
  },
  {
    id: "stacked",
    label: "Stacked promo",
    hint: "Delta Rp8,500 — show nudge",
  },
];

const belowThresholdCheap: ModePricing = {
  cartBase: 100_000,
  cartDiscounts: [20_000],
  deliveryBase: 15_000,
  deliveryDiscounts: [10_900],
};

const boundaryCheap: ModePricing = {
  cartBase: 100_000,
  cartDiscounts: [20_000],
  deliveryBase: 13_000,
  deliveryDiscounts: [10_000],
};

/** Treatment on in Vite dev so the demo is clickable without env flags. */
export function defaultDemoFlagOn(): boolean {
  if (import.meta.env.DEV) {
    return true;
  }
  return isCheapSavingsNudgeEnabled();
}

export function defaultDemoThreshold(): number {
  return getMinSavingsThreshold();
}

export function buildSessionInput(
  scenario: ScenarioId,
  featureFlagEnabled: boolean,
  threshold: number,
): CreateSessionInput {
  const overrides: Partial<DualModeNetSpendInput> = {
    featureFlagEnabled,
    threshold,
  };

  switch (scenario) {
    case "unavailable":
      overrides.murahAvailable = false;
      break;
    case "already_cheap":
      overrides.currentMode = "MURAAAH";
      break;
    case "below_threshold":
      overrides.cheap = belowThresholdCheap;
      break;
    case "boundary":
      overrides.cheap = boundaryCheap;
      break;
    case "stacked":
      overrides.cheap = stackedCheapPricing;
      break;
    default:
      break;
  }

  return {
    ...eligibleCepaaatInput(overrides),
    comparison: demoComparison,
    telemetry: demoTelemetry,
  };
}
