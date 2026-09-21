# GOTO-S5: Bottom sheet switcher

| Field | Value |
| --- | --- |
| **ID** | GOTO-S5 |
| **Status** | Done |
| **Milestone** | M1b |
| **Priority** | P1 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

Seeing the saving is not enough: users need to compare Fast vs Cheap (ETA + payable net) in one place and either confirm or back out without the page jumping. The bottom sheet is that comparison surface — one confirmed action later (GOTO-S6) takes the saving without hunting for the mode selector.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-002, US-004 |
| **REQ** | REQ-004, REQ-005 |
| **AC** | AC-004, AC-005, AC-007 |

Confirm (`Yes, change`) side effects are **GOTO-S6**. This ticket opens the sheet, shows comparison, and handles cancel/dismiss without changing mode.

## Acceptance criteria

- [x] **AC-004 / REQ-004:** Given the nudge is displayed, when the user taps `Save RpX with MURAAAH >`, then a **bottom sheet confirmation modal** opens **without changing / auto-scrolling** the checkout page.
- [x] **AC-005 / REQ-005:** Given the sheet is open, then it presents **comparative delivery modes** (CEPAAAT vs MURAAAH), **comparative ETAs** (e.g. 25m vs 55m), and **comparative net-spend prices** (GOTO-S2 nets) before the user confirms.
- [x] Cheap column may show original price with strikethrough **only for Cheap** on the switcher tray (PRD comment); Fast does not get a strikethrough original.
- [x] CTAs use English PRD templates: **`Yes, change`** and **`No, cancel`**.
- [x] **AC-007 / REQ-006 cancel path:** Given the sheet is open, when the user taps `No, cancel`, then the sheet closes, mode stays **CEPAAAT**, and net spend is unchanged.
- [x] Implicit dismiss (backdrop tap, swipe down, hardware back) also closes without switching mode (telemetry for dismiss is GOTO-S8).
- [x] `Yes, change` is wired as the confirm action; **mode change / recalc / PLUS / success copy** land in GOTO-S6 (a stub callback is OK here if S6 is not merged yet).

## Out of scope for this ticket

- Applying the mode switch, promo recalc, hiding Gojek PLUS, `Yay! You saved RpX` (GOTO-S6).
- Supply-drop while the sheet is open (GOTO-S7).
- Telemetry `delivery_switcher_modal_*` emitters (GOTO-S8).
- Repositioning the existing checkout mode selector (M2).

## Dependencies

- **GOTO-S4** — tap target and show rules.
- **GOTO-S2** — comparative nets (and ETA can be mocked on the fixture).
- **GOTO-S0** — copy + comparison contract.
- **GOTO-S3** — flag on.

## Notes for spike

- Mocks OK: fixture ETAs and nets; reuse an existing tray pattern if the host app has one.
- Threshold default Rp2,000 with config hook (sheet should not open if S4 hid the nudge).
- English PRD copy templates for CTAs; comparison numbers come from S2, not hardcoded claims.
- **Landed:** Web bottom sheet in `web/CheckoutMock.tsx`, bound to `tapNudge` / `cancelSwitch` / `dismissModal`. Backdrop tap + Escape (`back_button`). Confirm CTA is wired; thin S6 happy path lives in the same mock. Swipe-down is not implemented (no gesture library) — backdrop + Escape cover implicit dismiss.
