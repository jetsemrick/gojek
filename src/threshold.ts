/**
 * Remote-config-ready threshold hook (GOTO-S0 / GOTO-S2).
 * Default Rp2,000. Later swap the reader to a remote-config SDK without
 * changing calculator call sites that already pass `threshold`.
 */
export const MIN_SAVINGS_THRESHOLD_KEY = "min_savings_threshold";
export const DEFAULT_MIN_SAVINGS_THRESHOLD = 2_000;

export interface ThresholdConfig {
  [MIN_SAVINGS_THRESHOLD_KEY]?: string | number;
  MIN_SAVINGS_THRESHOLD?: string | number;
}

function hostEnv(): ThresholdConfig {
  return typeof process !== "undefined" && process.env ? process.env : {};
}

export function getMinSavingsThreshold(
  config: ThresholdConfig = hostEnv(),
): number {
  const raw =
    config[MIN_SAVINGS_THRESHOLD_KEY] ?? config.MIN_SAVINGS_THRESHOLD;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.trunc(raw);
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return DEFAULT_MIN_SAVINGS_THRESHOLD;
}
