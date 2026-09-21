import type { DeliveryMode } from "./types.js";

/**
 * Telemetry payload stubs from the PRD (AC-012). This spike builds the
 * event shapes; it does not send them to a real analytics pipeline.
 */
export type TelemetryEventName =
  | "checkout_cheap_nudge_impression"
  | "checkout_cheap_nudge_click"
  | "delivery_switcher_modal_view"
  | "delivery_switcher_modal_action"
  | "delivery_switcher_modal_dismiss";

export interface TelemetryContext {
  searchId: string;
  homeId: string;
  checkoutSessionId: string;
}

export interface TelemetryEvent {
  name: TelemetryEventName;
  params: Record<string, string | number | boolean>;
}

export function impressionEvent(
  ctx: TelemetryContext,
  params: {
    currentMode: DeliveryMode;
    cheapAvailable: boolean;
    fastNetSpend: number;
    cheapNetSpend: number;
    gojekPlusNudgeVisible: boolean;
  },
): TelemetryEvent {
  return {
    name: "checkout_cheap_nudge_impression",
    params: {
      search_id: ctx.searchId,
      home_id: ctx.homeId,
      checkout_session_id: ctx.checkoutSessionId,
      current_mode: params.currentMode,
      cheap_available: params.cheapAvailable,
      fast_net_spend: params.fastNetSpend,
      cheap_net_spend: params.cheapNetSpend,
      gojek_plus_nudge_visible: params.gojekPlusNudgeVisible,
    },
  };
}

export function clickEvent(
  ctx: TelemetryContext,
  potentialSavingsAmount: number,
): TelemetryEvent {
  return {
    name: "checkout_cheap_nudge_click",
    params: {
      search_id: ctx.searchId,
      home_id: ctx.homeId,
      checkout_session_id: ctx.checkoutSessionId,
      potential_savings_amount: potentialSavingsAmount,
    },
  };
}

export function modalViewEvent(
  ctx: TelemetryContext,
  params: {
    fastEtaMins: number;
    cheapEtaMins: number;
    fastNetSpend: number;
    cheapNetSpend: number;
  },
): TelemetryEvent {
  return {
    name: "delivery_switcher_modal_view",
    params: {
      search_id: ctx.searchId,
      home_id: ctx.homeId,
      checkout_session_id: ctx.checkoutSessionId,
      fast_eta_mins: params.fastEtaMins,
      cheap_eta_mins: params.cheapEtaMins,
      Fast_net_spend: params.fastNetSpend,
      cheap_net_spend: params.cheapNetSpend,
    },
  };
}

export function modalActionEvent(
  ctx: TelemetryContext,
  params: {
    userAction: "confirm_switch" | "cancel_switch";
    selectedMode: DeliveryMode;
  },
): TelemetryEvent {
  return {
    name: "delivery_switcher_modal_action",
    params: {
      search_id: ctx.searchId,
      home_id: ctx.homeId,
      checkout_session_id: ctx.checkoutSessionId,
      user_action: params.userAction,
      selected_mode: params.selectedMode,
    },
  };
}

export function modalDismissEvent(
  ctx: TelemetryContext,
  params: {
    dismissMethod: "backdrop_tap" | "swipe_down" | "back_button";
    currentMode: DeliveryMode;
  },
): TelemetryEvent {
  return {
    name: "delivery_switcher_modal_dismiss",
    params: {
      search_id: ctx.searchId,
      home_id: ctx.homeId,
      checkout_session_id: ctx.checkoutSessionId,
      dismiss_method: params.dismissMethod,
      current_mode: params.currentMode,
    },
  };
}
