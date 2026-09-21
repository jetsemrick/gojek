# GOTO-S9: QA matrix AC-001–012 + spike demo checklist

| Field | Value |
| --- | --- |
| **ID** | GOTO-S9 |
| **Status** | Todo |
| **Milestone** | M1d |
| **Priority** | P2 |
| **Spike** | M1 Path A — mocks |

## Problem / user value

Path A is a demoable mock of the Cheap savings nudge. Without a matrix that walks AC-001–012 and a short demo script, we cannot tell whether the spike actually proved Fast→Cheap switch-without-scroll, honest RpX, PLUS hide, and supply-drop revert — the evidence the team needs before a real checkout engine integration.

## Mapped PRD IDs

| Kind | IDs |
| --- | --- |
| **US** | US-001 through US-006 (covered via ACs) |
| **REQ** | REQ-001 through REQ-012 (covered via ACs) |
| **AC** | AC-001 through AC-012 |

## Acceptance criteria

### QA matrix (execute on the Path A mock)

- [ ] **AC-001:** Fast + Cheap available + delta ≥ threshold (default Rp2,000) + flag on → `Save RpX with MURAAAH >` below Payment Summary.
- [ ] **AC-002:** Displayed RpX equals hand-computed CEPAAAT net − MURAAAH net on the fixture (promos applied).
- [ ] **AC-003:** Copy is the S0 template with session values; mutating the fixture delta updates RpX (no hardcoded “Save Rp2,000”).
- [ ] **AC-004:** Tap nudge → bottom sheet opens; checkout scroll position unchanged.
- [ ] **AC-005:** Sheet shows both modes, both ETAs, both net-spend prices.
- [ ] **AC-006:** `Yes, change` → mode MURAAAH, totals/promos recalc, PLUS hidden, copy `Yay! You saved RpX`, scroll preserved.
- [ ] **AC-007:** `No, cancel` → sheet closes, still CEPAAAT, net spend unchanged.
- [ ] **AC-008:** Cheap unavailable **or** delta &lt; threshold (e.g. Rp1,999) **or** flag off → nudge not rendered.
- [ ] **AC-009:** After nudge is shown, stub a pre-confirm supply drop → nudge gone, sheet closed if open, Fast total unchanged.
- [ ] **AC-010:** After confirm switch, stub a pre-booking supply drop → revert CEPAAAT, PLUS unhidden, unavailability modal with updated net, acknowledge required to proceed.
- [ ] **AC-011:** Fixture with distinct Cheap vs Fast promo scoring still produces both nets in one evaluation (no “only current mode” calc).
- [ ] **AC-012:** Five in-scope events fire with required parameters; struck-through events do not.

### Spike demo checklist

- [ ] Flag **off**: checkout looks like today’s Fast checkout (no Cheap nudge).
- [ ] Flag **on**, happy path: show nudge → sheet → confirm → success copy + PLUS gone; call out RpX vs Payment Summary.
- [ ] Below-threshold fixture: no nudge.
- [ ] Cheap-unavailable fixture: no nudge.
- [ ] Cancel and implicit dismiss: still Fast.
- [ ] Supply drop before confirm; supply drop after confirm.
- [ ] Scroll preservation called out on open sheet and on confirm.
- [ ] Telemetry sink shown for impression, click, view, confirm, cancel, dismiss.
- [ ] Call out **out of M1**: Payment Summary not redesigned; mode selector not moved; multiple nudges not consolidated; experiment not live.

- [ ] Matrix + demo script live in-repo (this file is sufficient) and linked from GOTO-S1 spec.

## Out of scope for this ticket

- Building new product surfaces (S2–S8).
- Device lab / production checkout.
- Statistical readout of Cheap Booking Rate +5%.
- Localization QA.

## Dependencies

- **GOTO-S1** — spec/AC checklist to execute against.
- **GOTO-S2 through GOTO-S8** — behaviour under test.
- **GOTO-S0** — expected numbers, copy, schema.

## Notes for spike

- Mocks OK: all rows run on fixture carts and stubbed supply/PLUS/flag.
- Threshold default Rp2,000 with config hook — include one row that raises/lowers the hook to prove it is not hardcoded.
- English PRD copy templates are the expected strings in AC-001/003/006.
