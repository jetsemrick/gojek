import { describe, expect, it } from "vitest";
import {
  cancelSwitch,
  confirmSwitch,
  createCheckoutSession,
  supplyDrop,
  tapNudge,
} from "./checkoutSession.js";
import {
  demoComparison,
  demoTelemetry,
  eligibleCepaaatInput,
} from "./fixtures.js";

function seed(
  overrides: Parameters<typeof eligibleCepaaatInput>[0] = {},
) {
  return {
    ...eligibleCepaaatInput(overrides),
    comparison: demoComparison,
    telemetry: demoTelemetry,
  };
}

describe("checkout session UI-surface stub", () => {
  it("emits an impression when the nudge is shown at render", () => {
    const session = createCheckoutSession(seed());
    expect(session.view.showNudge).toBe(true);
    expect(session.events[0]?.name).toBe("checkout_cheap_nudge_impression");
    expect(session.gojekPlusNudgeVisible).toBe(true);
  });

  it("opens a comparative switcher modal on tap without changing mode", () => {
    const opened = tapNudge(createCheckoutSession(seed()), seed());

    expect(opened.currentMode).toBe("CEPAAAT");
    expect(opened.maintainScroll).toBe(true);
    expect(opened.modal).toEqual({
      kind: "switch_confirm",
      fastEtaMins: 25,
      cheapEtaMins: 55,
      fastNetSpend: 85_000,
      cheapNetSpend: 81_500,
      yesChangeLabel: "Yes, change",
      noCancelLabel: "No, cancel",
    });
    expect(opened.events.map((event) => event.name)).toContain(
      "checkout_cheap_nudge_click",
    );
    expect(opened.events.map((event) => event.name)).toContain(
      "delivery_switcher_modal_view",
    );
  });

  it("switches to MURAAAH, hides PLUS, and keeps the success copy", () => {
    const input = seed();
    const switched = confirmSwitch(
      tapNudge(createCheckoutSession(input), input),
      input,
    );

    expect(switched.currentMode).toBe("MURAAAH");
    expect(switched.gojekPlusNudgeVisible).toBe(false);
    expect(switched.view.showNudge).toBe(false);
    expect(switched.view.reason).toBe("already_on_cheap");
    expect(switched.view.successCopy).toBe("Yay! You saved Rp3,500");
    expect(switched.maintainScroll).toBe(true);
    expect(switched.modal).toBeNull();
  });

  it("keeps CEPAAAT and net spend when the user cancels", () => {
    const input = seed();
    const cancelled = cancelSwitch(
      tapNudge(createCheckoutSession(input), input),
      input,
    );

    expect(cancelled.currentMode).toBe("CEPAAAT");
    expect(cancelled.view.showNudge).toBe(true);
    expect(cancelled.view.fastNetSpend).toBe(85_000);
    expect(cancelled.modal).toBeNull();
  });

  it("withdraws the nudge and keeps Fast total if supply drops before confirm", () => {
    const input = seed();
    const dropped = supplyDrop(createCheckoutSession(input), input);

    expect(dropped.murahAvailable).toBe(false);
    expect(dropped.currentMode).toBe("CEPAAAT");
    expect(dropped.view.showNudge).toBe(false);
    expect(dropped.view.reason).toBe("unavailable");
    expect(dropped.modal).toBeNull();
    expect(dropped.view.fastNetSpend).toBe(85_000);
  });

  it("reverts to CEPAAAT and unhides PLUS if supply drops after switch", () => {
    const input = seed();
    const switched = confirmSwitch(
      tapNudge(createCheckoutSession(input), input),
      input,
    );
    const dropped = supplyDrop(switched, input);

    expect(dropped.currentMode).toBe("CEPAAAT");
    expect(dropped.gojekPlusNudgeVisible).toBe(true);
    expect(dropped.modal).toMatchObject({
      kind: "supply_unavailable",
      currentMode: "CEPAAAT",
      updatedNetSpend: 85_000,
    });
  });
});
