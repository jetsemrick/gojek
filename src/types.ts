/** Delivery modes from the PRD. CEPAAAT = Fast, MURAAAH = Cheap. */
export type DeliveryMode = "CEPAAAT" | "MURAAAH";

/**
 * Why the savings nudge is hidden.
 *
 * Evaluated in this order (first match wins):
 * 1. flag_off — experiment control; gates the whole surface
 * 2. already_on_cheap — current mode is already MURAAAH
 * 3. unavailable — MURAAAH not offered (supply / SDF)
 * 4. below_threshold — payable delta is under the configured minimum
 */
export type HiddenReason =
  | "flag_off"
  | "already_on_cheap"
  | "unavailable"
  | "below_threshold";

/**
 * Integer currency units (Rupiah). All amounts in this spike are integers;
 * never floats. Discounts are positive amounts subtracted from their base.
 */
export interface ModePricing {
  /** Cart subtotal before cart-level promos. */
  cartBase: number;
  /** Stacked cart-level promo amounts (candidate + applied). */
  cartDiscounts: readonly number[];
  /** Delivery fee before delivery-level discounts. */
  deliveryBase: number;
  /** Stacked delivery discounts (Gojek Plus, implicit cheap, etc.). */
  deliveryDiscounts: readonly number[];
  /** Other payable line items (service fee, small-order fee, …). */
  otherFees?: number;
}

export interface DualModeNetSpendInput {
  currentMode: DeliveryMode;
  /** Whether MURAAAH can be selected for this session. */
  murahAvailable: boolean;
  /** Experiment treatment. Control = false (surface off). */
  featureFlagEnabled: boolean;
  /** Minimum payable delta to show the nudge. Default 2000. */
  threshold?: number;
  fast: ModePricing;
  cheap: ModePricing;
}

export interface DualModeNetSpendResult {
  showNudge: boolean;
  /** CEPAAAT net spend − MURAAAH net spend. Exact payable delta. */
  savingsAmount: number;
  fastNetSpend: number;
  cheapNetSpend: number;
  reason: HiddenReason | null;
}

export interface SavingsNudgeView extends DualModeNetSpendResult {
  /** "Save RpX with MURAAAH >" when shown; otherwise null. */
  nudgeCopy: string | null;
  /** "Yay! You saved RpX" — used after a confirmed switch. */
  successCopy: string;
}
