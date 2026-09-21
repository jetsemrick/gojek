import { describe, expect, it } from "vitest";
import {
  DEFAULT_MIN_SAVINGS_THRESHOLD,
  getMinSavingsThreshold,
  MIN_SAVINGS_THRESHOLD_KEY,
} from "./threshold.js";

describe("getMinSavingsThreshold", () => {
  it("defaults to Rp2,000", () => {
    expect(getMinSavingsThreshold({})).toBe(2_000);
    expect(DEFAULT_MIN_SAVINGS_THRESHOLD).toBe(2_000);
  });

  it("reads the named config hook", () => {
    expect(
      getMinSavingsThreshold({ [MIN_SAVINGS_THRESHOLD_KEY]: 4_000 }),
    ).toBe(4_000);
    expect(
      getMinSavingsThreshold({ [MIN_SAVINGS_THRESHOLD_KEY]: "2500" }),
    ).toBe(2_500);
  });
});
