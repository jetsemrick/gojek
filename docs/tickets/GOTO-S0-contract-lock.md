# GOTO-S0: M0 contract lock

| Field | Value |
| --- | --- |
| **ID** | GOTO-S0 |
| **Status** | Todo |
| **Milestone** | M0 |
| **Priority** | P0 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

Checkout today does not give Fast (CEPAAAT) users a trustworthy, comparable Cheap (MURAAAH) saving next to Payment Summary. Before any UI or engine work, the spike needs a locked contract: how net spend is computed, when the nudge is allowed to show (Rp2,000 default, config-hooked), which English copy templates are legal, and which telemetry events are in vs struck through. That lock is what later tickets and the engineer’s README/spec + net-spend PR can cite.

## Mapped PRD IDs

This ticket **locks the contract** used by every later spike ticket. It does not implement product behaviour.

| Kind | IDs |
| --- | --- |
| **US** | US-001, US-002, US-003, US-004, US-005, US-006 |
| **REQ** | REQ-001 through REQ-012 |
| **AC** | AC-001 through AC-012 (definitions only; verification is GOTO-S9) |

## Acceptance criteria

- [ ] **Net-spend formula is written and reviewed:** `net_spend(mode)` = final payable total for that delivery mode after applying candidate promos and stacked discounts; displayed saving `RpX = net_spend(CEPAAAT) − net_spend(MURAAAH)` (exact integer rupiah, no rounding display tricks).
- [ ] **Formula notes cover both modes at checkout render** (REQ-011 / AC-011): CEPAAAT and MURAAAH candidate nets are evaluated together; RpX is not a delivery-fee-only or “perceived discount” figure.
- [ ] **Threshold contract:** show the Cheap nudge only when current mode is CEPAAAT, MURAAAH is available, and `RpX ≥ min_savings_threshold`. Default `min_savings_threshold = 2000` (Rp2,000).
- [ ] **Config hook (remote-config-ready):** threshold lives behind a named config key with a local default of `2000`; swapping the source to remote config later must not require changing call sites.
- [ ] **English PRD copy templates are listed as the only legal strings for M1:**
  - Nudge (pre-switch): `Save Rp{X} with MURAAAH >`
  - Nudge (post-switch): `Yay! You saved Rp{X}`
  - Sheet confirm: `Yes, change`
  - Sheet cancel: `No, cancel`
  - `{X}` is the session-calculated delta formatted as rupiah (e.g. `2,000`), never a static or generic claim (REQ-003 / AC-003).
- [ ] **Telemetry schema (in-scope events only — non-struck-through from the PRD):**

  | Event | Trigger | Required parameters |
  | --- | --- | --- |
  | `checkout_cheap_nudge_impression` | Nudge rendered (Fast, Cheap available, delta ≥ threshold) | `search_id`, `home_id`, `checkout_session_id`, `current_mode`, `cheap_available`, `fast_net_spend`, `cheap_net_spend`, `gojek_plus_nudge_visible` |
  | `checkout_cheap_nudge_click` | User taps `Save RpX with MURAAAH >` | `search_id`, `home_id`, `checkout_session_id`, `potential_savings_amount` (Double) |
  | `delivery_switcher_modal_view` | Bottom sheet shown | `search_id`, `home_id`, `checkout_session_id`, `fast_eta_mins`, `cheap_eta_mins`, `Fast_net_spend`, `cheap_net_spend` |
  | `delivery_switcher_modal_action` | User taps `Yes, change` or `No, cancel` | `search_id`, `home_id`, `checkout_session_id`, `user_action` (`confirm_switch` / `cancel_switch`), `selected_mode` (`MURAAAH` / `CEPAAAT`) |
  | `delivery_switcher_modal_dismiss` | Implicit dismiss (backdrop, swipe, back) | `search_id`, `home_id`, `checkout_session_id`, `dismiss_method`, `current_mode` |

- [ ] **Struck-through events are explicitly out of this contract:** `Checkout_mode_recalculation_success`, `Checkout_booking_completed`.
- [ ] Contract is committed in-repo (this ticket file plus [GOTO-S1](./GOTO-S1-readme-spec.md) spec) so GOTO-S1 / S2 / S3 PRs can reference `GOTO-S0`.

## Out of scope for this ticket

- Implementing the net-spend module, UI, flag, or event emitters.
- Redesigning Payment Summary, moving the mode selector, or consolidating multiple savings nudges.
- Localization (Bahasa) — English PRD templates only for the spike.
- Wiring remote config in production; only the hook + default is required.
- Full experiment design (50/50 traffic, sample-size analysis).

## Dependencies

- None. This is the first ticket.

## Notes for spike

- Mocks are OK for later implementation tickets; this ticket is documentation/contract only.
- Threshold default is **Rp2,000** with a **config hook** (remote-config-ready).
- Use **English PRD copy templates** exactly as listed above.
- Parameter names in the telemetry table match the PRD (including `Fast_net_spend` on `delivery_switcher_modal_view`).
