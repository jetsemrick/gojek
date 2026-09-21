# GOTO-S1: README / spec in repo

| Field | Value |
| --- | --- |
| **ID** | GOTO-S1 |
| **Status** | Done |
| **Milestone** | M1a |
| **Priority** | P0 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

The spike lives in an empty repo. Engineers (including the in-flight README/spec + net-spend + flag work) need a single in-repo spec that states the problem, M1 Path A scope, the AC-001–012 checklist, and what is explicitly out of scope — so implementation PRs share the same contract as GOTO-S0 without hunting the Google Doc.

## Mapped PRD IDs

Documentation ticket: records the full M1 engineering contract, it does not implement it.

| Kind | IDs |
| --- | --- |
| **US** | US-001 through US-006 (problem + user jobs) |
| **REQ** | REQ-001 through REQ-012 (behaviour list) |
| **AC** | AC-001 through AC-012 (checklist in the spec) |

## Acceptance criteria

- [ ] Repo README (or `docs/` spec linked from README) states the **problem**: Fast is the default checkout mode; Cheap savings are hard to discover; users compare total payable value, not delivery fee alone.
- [ ] Spec states **M1 scope (Path A — mocks)**: Cheap savings nudge below Payment Summary + bottom-sheet switcher on Fast when Cheap is available and net-spend delta ≥ threshold; dual-mode net-spend module; feature-flag stub; telemetry for the five in-scope events.
- [ ] Spec includes an **AC checklist** covering AC-001 through AC-012 (given/when/then, or equivalent checkboxes that map 1:1 to those IDs).
- [ ] Spec lists **out of scope for M1:** Payment Summary redesign; repositioning the mode selector (M2); consolidating multiple savings nudges (M3); struck-through telemetry events; full experiment rollout.
- [ ] Spec names modes **CEPAAAT (Fast)** and **MURAAAH (Cheap)**, the default **Rp2,000** threshold, and the English copy templates from [GOTO-S0](./GOTO-S0-contract-lock.md).
- [ ] Spec tells implementers to cite ticket IDs **GOTO-S0 … GOTO-S9** in PRs (this folder).
- [ ] Spec notes Path A **mocks are acceptable** (fixture carts, stubbed supply / PLUS nudge).

## Out of scope for this ticket

- Product code (net-spend, UI, flag runtime, telemetry emitters) — see GOTO-S2–S8.
- QA execution — see [GOTO-S9](./GOTO-S9-qa-matrix.md).
- Rewriting the Google Doc PRD; this is the in-repo working spec.

## Dependencies

- **GOTO-S0** — formula, threshold, copy, and telemetry schema must be locked so the spec does not drift.

## Notes for spike

- Mocks OK; this ticket is docs only.
- Threshold default Rp2,000 with config hook; document the key name agreed in S0.
- English PRD copy templates only.
- Coordinate with the engineer already starting README/spec: this ID is the one to reference in that PR.
