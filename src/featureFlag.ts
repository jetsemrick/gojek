/**
 * Feature-flag stub for the Cheap savings nudge surface (GOTO-S3).
 *
 * Experiment design is 50/50 control (off) vs treatment (on). This spike
 * does not bucket traffic — it only gates the surface. Control default = off.
 *
 * Swap-ready: resolve this boolean from env/config today; replace the
 * body of `isCheapSavingsNudgeEnabled` with the real experiment SDK later
 * without renaming call sites.
 *
 * Threshold is a *separate* hook (`min_savings_threshold` in threshold.ts).
 */
export const CHEAP_SAVINGS_NUDGE_FLAG = "cheap_savings_nudge_enabled";

export interface FeatureFlagConfig {
  [CHEAP_SAVINGS_NUDGE_FLAG]?: boolean | string;
  CHEAP_SAVINGS_NUDGE_ENABLED?: string;
}

function truthy(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "on";
}

function hostEnv(): FeatureFlagConfig {
  return typeof process !== "undefined" && process.env ? process.env : {};
}

/** Control group default: surface is off unless explicitly enabled. */
export function isCheapSavingsNudgeEnabled(
  config: FeatureFlagConfig = hostEnv(),
): boolean {
  const named = config[CHEAP_SAVINGS_NUDGE_FLAG];
  if (typeof named === "boolean") {
    return named;
  }
  if (typeof named === "string") {
    return truthy(named);
  }
  return truthy(config.CHEAP_SAVINGS_NUDGE_ENABLED);
}

/** @deprecated Use isCheapSavingsNudgeEnabled */
export const isSavingsNudgeEnabled = isCheapSavingsNudgeEnabled;
export const SAVINGS_NUDGE_FLAG_KEY = CHEAP_SAVINGS_NUDGE_FLAG;
