import {
  NO_CANCEL,
  SUPPLY_UNAVAILABLE_TITLE,
  YES_CHANGE,
} from "./copy.js";
import { evaluateSavingsNudge } from "./nudgeSurface.js";
import {
  clickEvent,
  impressionEvent,
  modalActionEvent,
  modalDismissEvent,
  modalViewEvent,
  type TelemetryContext,
  type TelemetryEvent,
} from "./telemetry.js";
import type {
  DeliveryMode,
  DualModeNetSpendInput,
  SavingsNudgeView,
} from "./types.js";

/**
 * Pure-logic stub of the checkout UI surface (AC-004–007, AC-009–010).
 *
 * This is not a real bottom-sheet framework, React Native, or GoFood
 * checkout. It models the session so the pricing contract can be demoed
 * and the later UI PR has a state machine to bind to.
 */

export interface ModeComparison {
  fastEtaMins: number;
  cheapEtaMins: number;
}

export interface SwitcherModal {
  kind: "switch_confirm";
  fastEtaMins: number;
  cheapEtaMins: number;
  fastNetSpend: number;
  cheapNetSpend: number;
  yesChangeLabel: string;
  noCancelLabel: string;
}

export interface SupplyUnavailableModal {
  kind: "supply_unavailable";
  title: string;
  currentMode: DeliveryMode;
  updatedNetSpend: number;
}

export type CheckoutModal = SwitcherModal | SupplyUnavailableModal;

export interface CheckoutSessionState {
  view: SavingsNudgeView;
  currentMode: DeliveryMode;
  murahAvailable: boolean;
  gojekPlusNudgeVisible: boolean;
  /** True when a real UI should keep the current scroll offset (AC-004/006). */
  maintainScroll: boolean;
  modal: CheckoutModal | null;
  events: TelemetryEvent[];
}

export interface CreateSessionInput extends DualModeNetSpendInput {
  comparison: ModeComparison;
  telemetry: TelemetryContext;
}

function pricingInputFrom(
  state: CheckoutSessionState,
  seed: DualModeNetSpendInput,
): DualModeNetSpendInput {
  return {
    currentMode: state.currentMode,
    murahAvailable: state.murahAvailable,
    featureFlagEnabled: seed.featureFlagEnabled,
    threshold: seed.threshold,
    fast: seed.fast,
    cheap: seed.cheap,
  };
}

function plusVisible(mode: DeliveryMode): boolean {
  return mode === "CEPAAAT";
}

export function createCheckoutSession(
  input: CreateSessionInput,
): CheckoutSessionState {
  const view = evaluateSavingsNudge(input);
  const events: TelemetryEvent[] = [];
  if (view.showNudge) {
    events.push(
      impressionEvent(input.telemetry, {
        currentMode: input.currentMode,
        cheapAvailable: input.murahAvailable,
        fastNetSpend: view.fastNetSpend,
        cheapNetSpend: view.cheapNetSpend,
        gojekPlusNudgeVisible: plusVisible(input.currentMode),
      }),
    );
  }

  return {
    view,
    currentMode: input.currentMode,
    murahAvailable: input.murahAvailable,
    gojekPlusNudgeVisible: plusVisible(input.currentMode),
    maintainScroll: true,
    modal: null,
    events,
  };
}

/** AC-004: tap opens the switcher modal; caller must not auto-scroll. */
export function tapNudge(
  state: CheckoutSessionState,
  seed: CreateSessionInput,
): CheckoutSessionState {
  if (!state.view.showNudge) {
    return state;
  }

  const modal: SwitcherModal = {
    kind: "switch_confirm",
    fastEtaMins: seed.comparison.fastEtaMins,
    cheapEtaMins: seed.comparison.cheapEtaMins,
    fastNetSpend: state.view.fastNetSpend,
    cheapNetSpend: state.view.cheapNetSpend,
    yesChangeLabel: YES_CHANGE,
    noCancelLabel: NO_CANCEL,
  };

  return {
    ...state,
    maintainScroll: true,
    modal,
    events: [
      ...state.events,
      clickEvent(seed.telemetry, state.view.savingsAmount),
      modalViewEvent(seed.telemetry, modal),
    ],
  };
}

/** AC-006: confirm switch to MURAAAH, hide PLUS nudge, keep scroll. */
export function confirmSwitch(
  state: CheckoutSessionState,
  seed: CreateSessionInput,
): CheckoutSessionState {
  if (state.modal?.kind !== "switch_confirm") {
    return state;
  }

  const next: CheckoutSessionState = {
    ...state,
    currentMode: "MURAAAH",
    gojekPlusNudgeVisible: false,
    maintainScroll: true,
    modal: null,
    events: [
      ...state.events,
      modalActionEvent(seed.telemetry, {
        userAction: "confirm_switch",
        selectedMode: "MURAAAH",
      }),
    ],
  };

  return {
    ...next,
    view: evaluateSavingsNudge(pricingInputFrom(next, seed)),
  };
}

/** AC-007: cancel keeps CEPAAAT and the payable total. */
export function cancelSwitch(
  state: CheckoutSessionState,
  seed: CreateSessionInput,
): CheckoutSessionState {
  if (state.modal?.kind !== "switch_confirm") {
    return state;
  }

  return {
    ...state,
    currentMode: "CEPAAAT",
    maintainScroll: true,
    modal: null,
    events: [
      ...state.events,
      modalActionEvent(seed.telemetry, {
        userAction: "cancel_switch",
        selectedMode: "CEPAAAT",
      }),
    ],
  };
}

export function dismissModal(
  state: CheckoutSessionState,
  seed: CreateSessionInput,
  dismissMethod: "backdrop_tap" | "swipe_down" | "back_button",
): CheckoutSessionState {
  if (state.modal === null) {
    return state;
  }

  return {
    ...state,
    modal: null,
    events: [
      ...state.events,
      modalDismissEvent(seed.telemetry, {
        dismissMethod,
        currentMode: state.currentMode,
      }),
    ],
  };
}

/**
 * AC-009 / AC-010: MURAAAH supply drops.
 * Before confirm: withdraw nudge, keep Fast total.
 * After switch, before booking: revert to CEPAAAT, unhide PLUS, show modal.
 */
export function supplyDrop(
  state: CheckoutSessionState,
  seed: CreateSessionInput,
): CheckoutSessionState {
  const switched = state.currentMode === "MURAAAH";

  const next: CheckoutSessionState = {
    ...state,
    murahAvailable: false,
    currentMode: "CEPAAAT",
    gojekPlusNudgeVisible: true,
    maintainScroll: true,
    modal: switched
      ? {
          kind: "supply_unavailable",
          title: SUPPLY_UNAVAILABLE_TITLE,
          currentMode: "CEPAAAT",
          updatedNetSpend: state.view.fastNetSpend,
        }
      : null,
  };

  return {
    ...next,
    view: evaluateSavingsNudge(pricingInputFrom(next, seed)),
  };
}
