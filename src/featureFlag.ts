/**
 * Experiment flag stub. Control = off.
 *
 * In this spike the flag is a simple env/config bit, not a production
 * experiment platform. The calculator takes the resolved boolean so tests
 * can drive it without mutating process.env.
 */
export const SAVINGS_NUDGE_FLAG_KEY = "SAVINGS_NUDGE_ENABLED";

export interface FeatureFlagConfig {
  [SAVINGS_NUDGE_FLAG_KEY]?: string;
}

function truthy(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "on";
}

/** Control group default: surface is off unless explicitly enabled. */
export function isSavingsNudgeEnabled(
  env: FeatureFlagConfig = process.env,
): boolean {
  return truthy(env[SAVINGS_NUDGE_FLAG_KEY]);
}
