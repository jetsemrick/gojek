import { describe, expect, it } from "vitest";
import {
  CHEAP_SAVINGS_NUDGE_FLAG,
  isCheapSavingsNudgeEnabled,
} from "./featureFlag.js";

describe("isCheapSavingsNudgeEnabled", () => {
  it("defaults to off (experiment control)", () => {
    expect(isCheapSavingsNudgeEnabled({})).toBe(false);
    expect(() => isCheapSavingsNudgeEnabled()).not.toThrow();
  });

  it("treats true / 1 / on as enabled", () => {
    expect(
      isCheapSavingsNudgeEnabled({ [CHEAP_SAVINGS_NUDGE_FLAG]: true }),
    ).toBe(true);
    expect(
      isCheapSavingsNudgeEnabled({ [CHEAP_SAVINGS_NUDGE_FLAG]: "true" }),
    ).toBe(true);
    expect(
      isCheapSavingsNudgeEnabled({ CHEAP_SAVINGS_NUDGE_ENABLED: "1" }),
    ).toBe(true);
    expect(
      isCheapSavingsNudgeEnabled({ [CHEAP_SAVINGS_NUDGE_FLAG]: "on" }),
    ).toBe(true);
  });

  it("treats false / empty / unknown as disabled", () => {
    expect(
      isCheapSavingsNudgeEnabled({ [CHEAP_SAVINGS_NUDGE_FLAG]: false }),
    ).toBe(false);
    expect(
      isCheapSavingsNudgeEnabled({ [CHEAP_SAVINGS_NUDGE_FLAG]: "false" }),
    ).toBe(false);
    expect(
      isCheapSavingsNudgeEnabled({ CHEAP_SAVINGS_NUDGE_ENABLED: "" }),
    ).toBe(false);
    expect(
      isCheapSavingsNudgeEnabled({ [CHEAP_SAVINGS_NUDGE_FLAG]: "yes" }),
    ).toBe(false);
  });
});
