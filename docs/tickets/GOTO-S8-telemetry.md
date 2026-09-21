# GOTO-S8: Telemetry (impression, click, modal view, action, dismiss)

| Field | Value |
| --- | --- |
| **ID** | GOTO-S8 |
| **Status** | Todo |
| **Milestone** | M1d |
| **Priority** | P2 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

Cheap Booking Rate and the secondary view/tap/switch rates cannot be trusted unless every key interaction emits a complete event. For the spike, a testable emitter (in-memory or log sink) must fire the five non-struck-through PRD events with required parameters so QA can verify AC-012 without production analytics.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-001 (instrumentation for the nudge job) |
| **REQ** | REQ-012 |
| **AC** | AC-012 |

Schema locked in [GOTO-S0](./GOTO-S0-contract-lock.md).

## Acceptance criteria

- [ ] **AC-012 / REQ-012:** Given a user action (or impression), when the corresponding event fires, then emit that event with **all required parameters valid** (non-null IDs; numeric nets/ETAs; enums in the allowed set).
- [ ] **`checkout_cheap_nudge_impression`** — once when the nudge is shown (Fast, Cheap available, delta ≥ threshold, flag on). Does not fire when S4 hides the nudge. Spike may document “once per checkout session while shown” (PRD comment on scroll/payment/mode/cart/bg-fg is unresolved — do **not** spam on scroll).
- [ ] **`checkout_cheap_nudge_click`** — user taps `Save RpX with MURAAAH >`; includes `potential_savings_amount` as Double (the RpX delta).
- [ ] **`delivery_switcher_modal_view`** — sheet becomes visible; includes `fast_eta_mins`, `cheap_eta_mins`, `Fast_net_spend`, `cheap_net_spend`.
- [ ] **`delivery_switcher_modal_action`** — tap `Yes, change` → `user_action=confirm_switch`, `selected_mode=MURAAAH`; tap `No, cancel` → `user_action=cancel_switch`, `selected_mode=CEPAAAT`.
- [ ] **`delivery_switcher_modal_dismiss`** — implicit dismiss only (backdrop / swipe / back); `dismiss_method` in `{backdrop_tap, swipe_down, back_button}`; `current_mode` remains CEPAAAT. Must **not** fire in addition to `modal_action` for the same button tap.
- [ ] Shared parameters on all five: `search_id`, `home_id`, `checkout_session_id` (fixture IDs OK).
- [ ] **Do not emit** struck-through events: `Checkout_mode_recalculation_success`, `Checkout_booking_completed`.
- [ ] Flag off (GOTO-S3) → none of the five events fire.
- [ ] Path A sink is inspectable in tests or a debug log (no requirement to hit production telemetry).

## Out of scope for this ticket

- Production event-name restyle (PRD comment on Gojek naming conventions) — spike uses the **non-struck-through PRD names** from S0.
- Booking-completed / recalc-success events.
- Experiment exposure events and Cheap Booking Rate pipeline.
- Supply-drop specific events.

## Dependencies

- **GOTO-S0** — schema.
- **GOTO-S4** — impression + click surfaces.
- **GOTO-S5** — view, cancel action, dismiss.
- **GOTO-S6** — confirm action.
- **GOTO-S3** — suppress when flag off.

## Notes for spike

- Mocks OK: fixture `search_id` / `home_id` / `checkout_session_id`.
- Threshold default Rp2,000 with config hook (impression only when S4 would show).
- English PRD copy templates identify the click target (`Save RpX with MURAAAH >`) and action buttons.
