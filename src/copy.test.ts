import { describe, expect, it } from "vitest";
import {
  formatRp,
  NO_CANCEL,
  saveWithMuraaah,
  yayYouSaved,
  YES_CHANGE,
} from "./copy.js";
import { evaluateSavingsNudge } from "./nudgeSurface.js";
import { eligibleCepaaatInput } from "./fixtures.js";

describe("copy templates", () => {
  it("formats integer Rupiah with comma thousands separators", () => {
    expect(formatRp(2000)).toBe("Rp2,000");
    expect(formatRp(3500)).toBe("Rp3,500");
  });

  it("fills the PRD nudge template from the session delta", () => {
    expect(saveWithMuraaah(3500)).toBe("Save Rp3,500 with MURAAAH >");
  });

  it("fills the PRD post-switch success template", () => {
    expect(yayYouSaved(3500)).toBe("Yay! You saved Rp3,500");
  });

  it("keeps the modal action labels from the PRD", () => {
    expect(YES_CHANGE).toBe("Yes, change");
    expect(NO_CANCEL).toBe("No, cancel");
  });
});

describe("evaluateSavingsNudge", () => {
  it("populates nudge copy from the calculator delta, not static claims", () => {
    const view = evaluateSavingsNudge(eligibleCepaaatInput());
    expect(view.nudgeCopy).toBe("Save Rp3,500 with MURAAAH >");
    expect(view.successCopy).toBe("Yay! You saved Rp3,500");
  });

  it("omits nudge copy when the calculator hides the surface", () => {
    const view = evaluateSavingsNudge(
      eligibleCepaaatInput({ featureFlagEnabled: false }),
    );
    expect(view.nudgeCopy).toBeNull();
    expect(view.showNudge).toBe(false);
  });
});
