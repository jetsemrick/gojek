# GOTO-S3: Feature-flag stub for the nudge surface

| Field | Value |
| --- | --- |
| **ID** | GOTO-S3 |
| **Status** | Done |
| **Milestone** | M1a |
| **Priority** | P0 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

The later experiment is 50% control (nudge off) vs 50% treatment (nudge on), with Cheap Booking Rate +5% as the primary metric. The spike does not run that experiment, but every nudge surface must already be gated so control users never see Cheap savings UI. A stub flag is the kill switch and the future experiment hook.

## Mapped PRD IDs

No dedicated US/REQ for the experiment flag. The stub is the **gate in front of** REQ-001 / AC-001 (and therefore S4–S8). When the flag is off, AC-001 must not fire.

| Kind | IDs |
| --- | --- |
| **US** | — (platform gate; experiment design in PRD) |
| **REQ** | REQ-001 (gated) |
| **AC** | AC-001 must not hold when flag is off; AC-008-style “do not render” when disabled |

## Acceptance criteria

- [ ] A named flag exists for the **Cheap savings nudge surface** (e.g. `cheap_savings_nudge_enabled`) with a default of **off**.
- [ ] When the flag is **off**, checkout must not render the Payment Summary Cheap nudge, must not open the switcher sheet from that surface, and must not emit the five in-scope nudge/switcher events.
- [ ] When the flag is **on**, later tickets (S4+) may show the nudge subject to S0 show rules.
- [ ] Stub is **swap-ready**: local/dev override now; later replaceable by the real experiment SDK without renaming call sites on the nudge surface.
- [ ] Spike does **not** implement 50/50 bucketing, sample-size analysis, or Cheap Booking Rate computation.
- [ ] README/spec (GOTO-S1) documents the flag name and default.

## Out of scope for this ticket

- Nudge UI, sheet, confirm, supply-drop, telemetry emitters.
- Full experiment platform (assignment, exposure logging, metric pipelines).
- Guardrail metrics (checkout-to-booking, Gojek PLUS conversion, defect rate).

## Dependencies

- **GOTO-S0** — surface name and show-rule contract the flag wraps.
- **GOTO-S1** (soft) — flag name recorded in the in-repo spec.

## Notes for spike

- Mocks OK: a boolean in config / environment is enough.
- Threshold stays a **separate** config hook (S0); do not overload the flag as the Rp2,000 threshold.
- English copy templates are unused here.
- Coordinate with the engineer already starting the feature-flag stub: cite **GOTO-S3** in that PR.
