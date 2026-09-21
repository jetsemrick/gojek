import { describe, expect, it } from "vitest";
import {
  isSavingsNudgeEnabled,
  SAVINGS_NUDGE_FLAG_KEY,
} from "./featureFlag.js";

describe("isSavingsNudgeEnabled", () => {
  it("defaults to off (experiment control)", () => {
    expect(isSavingsNudgeEnabled({})).toBe(false);
  });

  it("treats true / 1 / on as enabled", () => {
    expect(isSavingsNudgeEnabled({ [SAVINGS_NUDGE_FLAG_KEY]: "true" })).toBe(
      true,
    );
    expect(isSavingsNudgeEnabled({ [SAVINGS_NUDGE_FLAG_KEY]: "1" })).toBe(true);
    expect(isSavingsNudgeEnabled({ [SAVINGS_NUDGE_FLAG_KEY]: "on" })).toBe(
      true,
    );
  });

  it("treats false / empty / unknown as disabled", () => {
    expect(isSavingsNudgeEnabled({ [SAVINGS_NUDGE_FLAG_KEY]: "false" })).toBe(
      false,
    );
    expect(isSavingsNudgeEnabled({ [SAVINGS_NUDGE_FLAG_KEY]: "" })).toBe(false);
    expect(isSavingsNudgeEnabled({ [SAVINGS_NUDGE_FLAG_KEY]: "yes" })).toBe(
      false,
    );
  });
});
