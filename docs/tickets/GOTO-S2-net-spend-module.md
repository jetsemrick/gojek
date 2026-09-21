# GOTO-S2: Dual-mode net-spend module + fixture-cart tests

| Field | Value |
| --- | --- |
| **ID** | GOTO-S2 |
| **Status** | Done |
| **Milestone** | M1a |
| **Priority** | P0 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

The number on the nudge is the whole product: users will only switch to Cheap if RpX equals the change in what they actually pay after candidate promos. A dual-mode net-spend module (with unit tests on fixture carts) is the shared calculator for show/hide, copy, the bottom sheet, confirm, and telemetry.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-001, US-003 |
| **REQ** | REQ-002, REQ-011 |
| **AC** | AC-002, AC-011 |

REQ-008’s threshold comparison **consumes** this module’s delta but the hide rule itself is GOTO-S4.

## Acceptance criteria

- [ ] Module evaluates **candidate net spend for CEPAAAT and MURAAAH in parallel** at checkout-render (or equivalent mock session start) — AC-011 / REQ-011.
- [ ] `RpX = exact CEPAAAT net − MURAAAH net` after applying **candidate promos and stacked discounts** for each mode — AC-002 / REQ-002. Not delivery-fee-only, not “perceived discount” / Gojek PLUS strikethrough savings.
- [ ] Output includes at least: `fast_net_spend`, `cheap_net_spend`, `delta_rp` (integer rupiah), `meets_threshold` (delta ≥ configured threshold), and whether MURAAAH is in the candidate set.
- [ ] Threshold comparison uses the **S0 config hook** (default Rp2,000); tests can inject a different threshold.
- [ ] **Unit tests on fixture carts**, including at least:
  - Happy path: delta ≥ 2,000 → `meets_threshold == true`, `delta_rp` matches hand-computed nets.
  - Below threshold: delta = 1,999 (or similar) → `meets_threshold == false`.
  - Exact threshold: delta = 2,000 → `meets_threshold == true`.
  - Mode-specific promos: stacked / candidate promo applied on MURAAAH (and/or CEPAAAT) changes RpX vs a no-promo baseline.
  - Cheap unavailable / not in candidate set → module does not invent a Cheap net that UI could show.
- [ ] Module is pure/deterministic from a session payload (Path A mocks: fixture carts, no live estimate/deals APIs required).

## Out of scope for this ticket

- Rendering the nudge or bottom sheet (GOTO-S4, GOTO-S5).
- Confirm-switch side effects (PLUS hide, success copy, scroll) — GOTO-S6.
- Supply-drop polling / revert — GOTO-S7.
- Emitting telemetry — GOTO-S8.
- Redesigning Payment Summary line items.

## Dependencies

- **GOTO-S0** — locked formula, threshold, and config-hook name.

## Notes for spike

- Mocks OK: fixture carts stand in for resto / estimate / deals payloads.
- Threshold default Rp2,000 with config hook.
- English copy is not this module’s job; it only returns the integer `delta_rp` later tickets interpolate into PRD templates.
- Coordinate with the engineer already starting the dual-mode net-spend module: cite **GOTO-S2** in that PR.
