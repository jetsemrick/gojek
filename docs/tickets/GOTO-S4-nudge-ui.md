# GOTO-S4: Nudge UI below Payment Summary (show / hide)

| Field | Value |
| --- | --- |
| **ID** | GOTO-S4 |
| **Status** | Todo |
| **Milestone** | M1b |
| **Priority** | P1 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

Users on Fast whose order would cost less on Cheap should see that payable saving next to Payment Summary, so they do not have to scroll to the mode selector and subtract figures. The same surface must stay silent when Cheap is unavailable or the gap is below the configured threshold — offering a saving the user cannot take (or that does not justify the longer ETA) would burn trust.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-001, US-005 |
| **REQ** | REQ-001, REQ-003, REQ-007, REQ-008 |
| **AC** | AC-001, AC-003, AC-008 |

## Acceptance criteria

- [ ] **AC-001 / REQ-001:** Given checkout renders on CEPAAAT, when MURAAAH is available **and** net-spend delta ≥ configured threshold (default Rp2,000) **and** the GOTO-S3 flag is on, then render **below Payment Summary**: `Save Rp{X} with MURAAAH >`.
- [ ] **Placement:** directly below Payment Summary (not at the mode selector). Payment Summary itself is unchanged (financial receipt).
- [ ] **AC-003 / REQ-003:** `{X}` is interpolated from the session payload (GOTO-S2 `delta_rp`) against the approved S0 template. No static/generic claims (“Save more with Cheap”).
- [ ] **AC-008 / REQ-007 / REQ-008:** Given checkout render, when MURAAAH is unavailable (driver supply or SDF restriction) **OR** net savings &lt; threshold, then **do not render** the Cheap savings nudge.
- [ ] Flag off (GOTO-S3) also does not render the nudge.
- [ ] Hide/show re-evaluates when the mock session’s nets, availability, or threshold change (cart fixture update), not only on first paint.
- [ ] Nudge is tappable; tap behaviour is implemented in GOTO-S5 (this ticket may stub a no-op callback, but the control must be the tap target).

## Out of scope for this ticket

- Bottom sheet contents and confirm/cancel (GOTO-S5, GOTO-S6).
- Mid-flow supply drop after render (GOTO-S7) — initial hide only.
- Telemetry impression/click (GOTO-S8) — wire the surface so S8 can hook it.
- Gojek PLUS hide after switch (GOTO-S6).
- Payment Summary redesign; extra savings-nudge orchestration.

## Dependencies

- **GOTO-S0** — copy templates, threshold, show rules.
- **GOTO-S2** — `delta_rp`, availability, `meets_threshold`.
- **GOTO-S3** — flag must be on to show.

## Notes for spike

- Mocks OK: compose Payment Summary + nudge from fixture session state.
- Threshold default Rp2,000 with config hook.
- English PRD copy template: `Save Rp{X} with MURAAAH >`.
