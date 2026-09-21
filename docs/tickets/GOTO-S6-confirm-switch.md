# GOTO-S6: Confirm switch (mode, recalc, PLUS, success copy, scroll)

| Field | Value |
| --- | --- |
| **ID** | GOTO-S6 |
| **Status** | Todo |
| **Milestone** | M1c |
| **Priority** | P1 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

After the user confirms Cheap, the bill has to match the number they were shown: mode switches to MURAAAH, promos/net spend recalculate in place, Gojek PLUS no longer competes on the same screen, success copy proves the saving landed, and the page must not yank scroll. That is the trust moment for US-003 and the PLUS non-competition rule in US-006.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-002, US-003, US-006 |
| **REQ** | REQ-006 |
| **AC** | AC-006 |

Cancel/dismiss remain GOTO-S5 / AC-007.

## Acceptance criteria

- [ ] **AC-006 / REQ-006:** Given the bottom sheet is open, when the user taps **`Yes, change`**:
  - [ ] Delivery mode switches to **MURAAAH**.
  - [ ] Net spend and candidate promos **recalculate** for MURAAAH (GOTO-S2); Payment Summary payable total updates to the Cheap net.
  - [ ] **Gojek PLUS checkout nudge is hidden** (US-006: Cheap and PLUS must not compete on the same screen).
  - [ ] The Cheap savings nudge copy updates to **`Yay! You saved Rp{X}`** (same `{X}` as the pre-switch delta unless recalc produces a documented equal value).
  - [ ] **Scroll position is unchanged** (no auto-scroll to the mode selector or top of checkout).
- [ ] Sheet closes after confirm.
- [ ] A second tap on the post-switch success row does **not** re-open a Fast→Cheap switcher (user is already on MURAAAH).
- [ ] Path A may stub the PLUS nudge as a mock sibling component that becomes hidden; no real subscription flow.

## Out of scope for this ticket

- Opening the sheet and cancel/dismiss (GOTO-S5).
- Supply drop after the switch (GOTO-S7).
- Telemetry `user_action = confirm_switch` (GOTO-S8).
- Struck-through event `Checkout_mode_recalculation_success`.
- Payment method / offer changes (PRD comment: no change on payment option & offer).

## Dependencies

- **GOTO-S5** — confirm CTA and sheet.
- **GOTO-S2** — recalc nets/promos for MURAAAH.
- **GOTO-S4** — nudge surface to retarget with success copy.
- **GOTO-S0** — success template and PLUS-hide rule.
- **GOTO-S3** — flag on.

## Notes for spike

- Mocks OK for PLUS nudge visibility and promo recalc.
- Threshold default Rp2,000 with config hook (already satisfied to reach this screen).
- English PRD copy template: `Yay! You saved Rp{X}`.
