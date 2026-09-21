# GOTO-S7: Supply-drop / revert edge flows

| Field | Value |
| --- | --- |
| **ID** | GOTO-S7 |
| **Status** | Todo |
| **Milestone** | M1c |
| **Priority** | P1 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

Cheap availability can disappear between first paint and purchase (driver supply / SDF). If we keep advertising a saving the user cannot take, or silently leave them on a dead Cheap mode, we create a bad bill and a CCU ticket. These flows withdraw the offer before action, and after a switch they revert to Fast, restore PLUS, and force an explicit acknowledge of the new price.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-005 |
| **REQ** | REQ-009, REQ-010 |
| **AC** | AC-009, AC-010 |

## Acceptance criteria

- [ ] **AC-009 / REQ-009:** Given the Cheap nudge is already rendered, when MURAAAH supply drops **before tap/confirm**, then:
  - [ ] Withdraw the nudge (hide `Save RpX with MURAAAH >`).
  - [ ] If the bottom sheet is open, **close it**.
  - [ ] **Do not change** the payable total; mode stays **CEPAAAT**.
- [ ] **AC-010 / REQ-010:** Given the user has already switched to MURAAAH, when supply drops **before proceeding booking**, then:
  - [ ] Revert mode to **CEPAAAT**.
  - [ ] **Unhide** the Gojek PLUS checkout nudge.
  - [ ] Launch a **confirmation modal** informing the user of supply unavailability and showing the **updated CEPAAAT net spend**.
  - [ ] User **must acknowledge** that modal before they can proceed to purchase (P1 in PRD comments).
- [ ] Path A may **stub supply** with an explicit mock control (e.g. “drop Cheap supply now”) rather than a live fulfilment poll — document the stub in the spec (GOTO-S1).
- [ ] After AC-009, a later supply restore may show the nudge again only if S4 show rules still hold (flag on, delta ≥ threshold, Cheap available).

## Out of scope for this ticket

- Production fulfilment/PSDR polling architecture (PRD engineering comment: real BE refresh is future work).
- Initial hide when Cheap is already unavailable at first paint (GOTO-S4 / AC-008).
- Telemetry for supply-drop (not in the in-scope event list).
- Struck-through `Checkout_booking_completed`.

## Dependencies

- **GOTO-S4** — nudge surface to withdraw.
- **GOTO-S5** — sheet to close on pre-confirm drop.
- **GOTO-S6** — switched-to-MURAAAH state, PLUS hide/unhide, updated nets.
- **GOTO-S2** — CEPAAAT net after revert.
- **GOTO-S0** — edge-flow contract.
- **GOTO-S3** — flag still gates the Cheap nudge on restore.

## Notes for spike

- Mocks OK and expected: a fixture toggle for “MURAAAH unavailable” is the Path A stand-in for estimate/fulfilment refresh.
- Threshold default Rp2,000 with config hook (unchanged by supply).
- English PRD copy templates apply to the Cheap nudge; the **unavailability modal** copy is not specified in the PRD — use a clear English spike string (e.g. informing supply unavailability + updated price) and mark it as spike-only.
