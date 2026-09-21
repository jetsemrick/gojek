# Savings Nudges M1 — Path A spike

Greenfield TypeScript spike for **Improve Savings Nudges on Checkout with Consistent Payment Summary**. This is **not** production GoFood checkout. Pricing fixtures, the feature flag, and the UI surface are mocks so the payable-delta contract can be demoed and tested in isolation.

Source of truth: [PRD](https://docs.google.com/document/d/17iTbU2BXDJGNkCNfAgesbAAMfoVuRldTAMnbMmHZzcA).

## Problem

Organic checkout lands on **CEPAAAT (Fast)**. **MURAAAH (Cheap)** can be a lower *payable* total after stacked promos, but users do not see that unless they hunt the mode selector. The M1 bet: if Cheap is available and the exact payable gap is large enough, show `Save RpX with MURAAAH >` under the payment summary.

## Path A intent

Prove the **dual-mode net-spend contract** first:

- Score CEPAAAT and MURAAAH payable totals from the same cart.
- RpX is always `fastNetSpend − cheapNetSpend` after candidate / stacked discounts — never a static copy claim.
- Gate the whole surface with an experiment flag (control = off).
- Stub the bottom-sheet / telemetry / supply-drop UI as a pure session state machine.

Later PRs can bind this to a real checkout UI, promo engine, and experiment platform.

## In scope (this PR)

- Dual-mode net-spend calculator (`dualModeNetSpend`)
- Feature-flag stub (env / config; default off)
- English string templates from the PRD
- Fixture carts (PRD table + stacked-promo variant)
- Console demo of a nudge decision
- Logic-only stubs for tap / confirm / cancel / supply drop + telemetry *payloads*

## Out of scope

- Real GoFood checkout, promo engine, or pricing APIs
- React Native / Android / iOS / bottom-sheet UI framework
- Experiment dashboards
- Mode-selector reposition (M2) and nudge consolidation (M3)
- i18n framework (Bahasa templates come later)

## Acceptance criteria

| ID | Condition | This spike |
| --- | --- | --- |
| AC-001 | On CEPAAAT, MURAAAH available, delta ≥ threshold (default Rp2,000) → `Save RpX with MURAAAH >` | **Implemented** (calculator + copy) |
| AC-002 | RpX equals exact payable delta after candidate / stacked discounts | **Implemented** |
| AC-003 | Copy filled from session payload against approved templates | **Implemented** |
| AC-004 | Tap opens bottom sheet without page auto-scroll | **Stubbed** (`tapNudge` + `maintainScroll`) |
| AC-005 | Modal shows comparative modes, ETAs, net spend | **Stubbed** (modal payload) |
| AC-006 | “Yes, change” → MURAAAH, recalc, hide PLUS, `Yay! You saved RpX`, keep scroll | **Stubbed** (session reducer) |
| AC-007 | “No, cancel” → close modal, stay CEPAAAT, total unchanged | **Stubbed** |
| AC-008 | Hide if MURAAAH unavailable **or** delta &lt; threshold | **Implemented** |
| AC-009 | Supply drop before tap/confirm → withdraw nudge, keep Fast total | **Stubbed** |
| AC-010 | Supply drop after switch → revert CEPAAAT, unhide PLUS, unavailability modal | **Stubbed** |
| AC-011 | Score MURAAAH net spend in parallel with CEPAAAT | **Implemented** |
| AC-012 | Emit telemetry with required parameters | **Stubbed** (event builders; not shipped) |

Hide reasons (first match): `flag_off` → `already_on_cheap` → `unavailable` → `below_threshold`.

## How to run

```bash
npm install
npm test          # vitest
npm run build     # tsc --noEmit
npm run demo      # PRD fixture, flag treated as on for the demo
```

Demo variants:

```bash
npm run demo -- --flag-off
npm run demo -- --unavailable
npm run demo -- --mode MURAAAH
npm run demo -- --already-cheap
npm run demo -- --below-threshold
npm run demo -- --boundary
npm run demo -- --stacked
npm run demo -- --future-cheap
npm run demo -- --supply-drop
npm run demo -- --cancel
```

The calculator reads a resolved boolean. The stub flag is `SAVINGS_NUDGE_ENABLED=true|1|on` (default **off**, matching experiment control). The demo turns the flag on unless you pass `--flag-off`.

## Layout

```
src/pricing.ts            payable net spend for one mode
src/dualModeNetSpend.ts   show / hide + exact RpX
src/featureFlag.ts        env/config stub (control = off)
src/copy.ts               PRD English templates
src/nudgeSurface.ts       view-model (decision + copy)
src/checkoutSession.ts    UI-surface state machine (stub)
src/telemetry.ts          event payload builders (stub)
src/fixtures.ts           mock carts from the PRD table
src/cli.ts                console demo
```

Payable formula (integer Rupiah):

`netSpend = cartBase − Σ cartDiscounts + deliveryBase − Σ deliveryDiscounts + otherFees`
