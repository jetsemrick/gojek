#!/usr/bin/env node
/**
 * Thin console demo of the Path A spike.
 *
 * Prints the nudge decision for a fixture cart. This is not production
 * GoFood checkout — fixtures and the flag stub are mocks.
 *
 * Usage:
 *   npm run demo
 *   npm run demo -- --flag-off
 *   npm run demo -- --unavailable
 *   npm run demo -- --mode MURAAAH
 *   npm run demo -- --below-threshold
 *   npm run demo -- --stacked
 *   npm run demo -- --boundary
 */
import {
  cancelSwitch,
  confirmSwitch,
  createCheckoutSession,
  supplyDrop,
  tapNudge,
} from "./checkoutSession.js";
import { isCheapSavingsNudgeEnabled } from "./featureFlag.js";
import {
  demoComparison,
  demoTelemetry,
  eligibleCepaaatInput,
  prdCheapFuturePricing,
  stackedCheapPricing,
} from "./fixtures.js";
import { computeNetSpend } from "./pricing.js";
import type { DualModeNetSpendInput } from "./types.js";

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function buildInput(): DualModeNetSpendInput {
  const envFlag = isCheapSavingsNudgeEnabled();
  const featureFlagEnabled = hasFlag("--flag-off")
    ? false
    : hasFlag("--flag-on")
      ? true
      : envFlag || true;

  const modeArg = argValue("--mode");
  const currentMode = modeArg === "MURAAAH" || hasFlag("--already-cheap")
    ? "MURAAAH"
    : "CEPAAAT";

  if (hasFlag("--stacked")) {
    return eligibleCepaaatInput({
      featureFlagEnabled,
      cheap: stackedCheapPricing,
    });
  }

  if (hasFlag("--below-threshold")) {
    return eligibleCepaaatInput({
      featureFlagEnabled,
      cheap: {
        cartBase: 100_000,
        cartDiscounts: [20_000],
        deliveryBase: 15_000,
        deliveryDiscounts: [10_900],
      },
    });
  }

  if (hasFlag("--boundary")) {
    return eligibleCepaaatInput({
      featureFlagEnabled,
      cheap: {
        cartBase: 100_000,
        cartDiscounts: [20_000],
        deliveryBase: 13_000,
        deliveryDiscounts: [10_000],
      },
    });
  }

  if (hasFlag("--future-cheap")) {
    return eligibleCepaaatInput({
      featureFlagEnabled,
      cheap: prdCheapFuturePricing,
    });
  }

  return eligibleCepaaatInput({
    featureFlagEnabled,
    murahAvailable: !hasFlag("--unavailable"),
    currentMode,
  });
}

function printSection(title: string): void {
  console.log(`\n=== ${title} ===`);
}

const input = buildInput();
const seed = {
  ...input,
  comparison: demoComparison,
  telemetry: demoTelemetry,
};

printSection("Path A spike — mock checkout (not production GoFood)");
console.log("currentMode        ", input.currentMode);
console.log("murahAvailable     ", input.murahAvailable);
console.log("featureFlagEnabled ", input.featureFlagEnabled);
console.log("fastNetSpend       ", computeNetSpend(input.fast));
console.log("cheapNetSpend      ", computeNetSpend(input.cheap));

let session = createCheckoutSession(seed);
printSection("Nudge decision");
console.log("showNudge    ", session.view.showNudge);
console.log("savingsAmount", session.view.savingsAmount);
console.log("reason       ", session.view.reason);
console.log("nudgeCopy    ", session.view.nudgeCopy);

if (session.view.showNudge) {
  session = tapNudge(session, seed);
  printSection("Tap nudge → switcher modal (logic stub)");
  console.log(session.modal);

  if (hasFlag("--cancel")) {
    session = cancelSwitch(session, seed);
    printSection("No, cancel");
  } else {
    session = confirmSwitch(session, seed);
    printSection("Yes, change");
  }

  console.log("currentMode            ", session.currentMode);
  console.log("gojekPlusNudgeVisible  ", session.gojekPlusNudgeVisible);
  console.log("successCopy            ", session.view.successCopy);
  console.log("showNudge after switch ", session.view.showNudge);
}

if (hasFlag("--supply-drop")) {
  session = supplyDrop(session, seed);
  printSection("Supply drop");
  console.log("currentMode           ", session.currentMode);
  console.log("murahAvailable        ", session.murahAvailable);
  console.log("gojekPlusNudgeVisible ", session.gojekPlusNudgeVisible);
  console.log("modal                 ", session.modal);
  console.log("showNudge             ", session.view.showNudge);
}

printSection("Telemetry events (stub payloads, not shipped)");
for (const event of session.events) {
  console.log(event.name, event.params);
}

console.log("");
