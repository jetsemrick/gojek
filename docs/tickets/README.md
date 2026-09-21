# Savings Nudges M1 spike tickets (Path A — mocks)

Markdown backlog for the Gojek checkout **Cheap savings nudge** spike. Ticket IDs are stable so implementation PRs can reference them (`GOTO-S0` … `GOTO-S9`).

**Do not file these in Linear.** This folder is the source of truth.

Source PRD: *[Improve Savings Nudges on Checkout with Consistent Payment Summary](https://docs.google.com/document/d/17iTbU2BXDJGNkCNfAgesbAAMfoVuRldTAMnbMmHZzcA)* (Engineering Contract: US-001–006, REQ-001–012, AC-001–012).

Spike frame:

- Path A uses **mocks** (fixture carts, stubbed supply, no production checkout engine).
- Savings threshold default **Rp2,000**, exposed via a **config hook** (remote-config-ready).
- Copy uses **English PRD templates** (`Save RpX with MURAAAH >`, `Yay! You saved RpX`, `Yes, change`, `No, cancel`).
- Primary metric later: **Cheap Booking Rate +5%**. This spike does **not** run the 50/50 experiment; [GOTO-S3](./GOTO-S3-feature-flag-stub.md) only stubs the flag.

Engineer alignment: README/spec, dual-mode net-spend module, and the feature-flag stub should land against **GOTO-S1 / GOTO-S2 / GOTO-S3**.

## Status legend

| Status | Meaning |
| --- | --- |
| Todo | Not started |
| In progress | Implementation PR in flight |
| Done | Merged / verified |

Statuses live in the index and each ticket file.

## Index

| ID | Ticket | Milestone | Priority | Status | Maps |
| --- | --- | --- | --- | --- | --- |
| [GOTO-S0](./GOTO-S0-contract-lock.md) | M0 contract lock (formula, threshold, copy, telemetry schema) | M0 | P0 | Todo | Contract for US-001–006 / REQ-001–012 / AC-001–012 |
| [GOTO-S1](./GOTO-S1-readme-spec.md) | README/spec in repo | M1a | P0 | Done | M1 scope + AC checklist (all ACs documented) |
| [GOTO-S2](./GOTO-S2-net-spend-module.md) | Dual-mode net-spend module + fixture-cart tests | M1a | P0 | Done | US-001/003, REQ-002/011, AC-002/011 |
| [GOTO-S3](./GOTO-S3-feature-flag-stub.md) | Feature-flag stub for the nudge surface | M1a | P0 | Done | Experiment gate (REQ-001 / AC-001 when flag off) |
| [GOTO-S4](./GOTO-S4-nudge-ui.md) | Nudge UI below Payment Summary (show/hide) | M1b | P1 | Todo | US-001/005, REQ-001/003/007/008, AC-001/003/008 |
| [GOTO-S5](./GOTO-S5-bottom-sheet-switcher.md) | Bottom sheet switcher | M1b | P1 | Todo | US-002/004, REQ-004/005, AC-004/005/007 |
| [GOTO-S6](./GOTO-S6-confirm-switch.md) | Confirm switch (recalc, hide PLUS, success copy, scroll) | M1c | P1 | Todo | US-002/003/006, REQ-006, AC-006 |
| [GOTO-S7](./GOTO-S7-supply-drop-revert.md) | Supply-drop / revert edge flows | M1c | P1 | Todo | REQ-009/010, AC-009/010 |
| [GOTO-S8](./GOTO-S8-telemetry.md) | Telemetry: impression, click, modal view, action, dismiss | M1d | P2 | Todo | REQ-012, AC-012 |
| [GOTO-S9](./GOTO-S9-qa-matrix.md) | QA matrix AC-001–012 + spike demo checklist | M1d | P2 | Todo | AC-001–012 |

## Suggested implementation order

```text
M0   GOTO-S0
M1a  GOTO-S1  GOTO-S2  GOTO-S3     (docs + calc + flag — Done after spike PR #2)
M1b  GOTO-S4 → GOTO-S5
M1c  GOTO-S6 → GOTO-S7
M1d  GOTO-S8  GOTO-S9
```

S1, S2, and S3 can proceed in parallel once S0 is locked. S4 needs S2 + S3. S5 needs S4. S6 needs S2 + S5. S7 needs S4 + S6. S8 needs S0 schema + S4–S6 surfaces. S9 needs the rest of the spike in a demoable state.

## Out of M1 (do not ticket here)

- Payment summary redesign (it stays a financial receipt).
- Repositioning the delivery mode selector next to Payment Summary (future M2).
- Consolidating multiple savings nudges (Gojek PLUS, cart/delivery discounts, Cheap nudge) (future M3).
- Struck-through PRD events: `Checkout_mode_recalculation_success`, `Checkout_booking_completed`.
- Full 50/50 experiment, sample-size analysis, and Cheap Booking Rate instrumentation.
