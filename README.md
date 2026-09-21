# Savings Nudges M1 — Path A spike

Greenfield TypeScript spike for **Improve Savings Nudges on Checkout with Consistent Payment Summary**. This is **not** production GoFood checkout. Pricing fixtures, the feature flag, and the UI surface are **Path A mocks** (fixture carts, stubbed supply / PLUS nudge) so the payable-delta contract can be demoed in isolation.

- PRD: [Improve Savings Nudges on Checkout with Consistent Payment Summary](https://docs.google.com/document/d/17iTbU2BXDJGNkCNfAgesbAAMfoVuRldTAMnbMmHZzcA)
- In-repo tickets (not Linear): [`docs/tickets/`](./docs/tickets/) — cite **GOTO-S0 … GOTO-S9** in PRs
- This PR implements **GOTO-S1** (spec), **GOTO-S2** (dual-mode net spend + tests), **GOTO-S3** (feature-flag stub). Contract lock: **GOTO-S0**.

## Problem

**CEPAAAT (Fast)** is the default checkout mode. **MURAAAH (Cheap)** savings are hard to discover: comparing modes means scrolling between the selector and the order summary. Users judge affordability by **total payable value**, not delivery fee alone. M1 surfaces an exact payable gap next to Payment Summary so cost-conscious users can switch without hunting.

## Path A / M1 scope

When checkout is on CEPAAAT, MURAAAH is available, and payable delta ≥ threshold, show `Save RpX with MURAAAH >` below Payment Summary and confirm via a bottom-sheet switcher (logic stub in this PR). Also: dual-mode net-spend module, feature-flag stub, telemetry *payloads* for the five in-scope events.

**This PR (M1a):** GOTO-S1 + S2 + S3, plus thin logic stubs for S4–S8 so the calculator is demoable. No real bottom-sheet UI framework.

## Config (GOTO-S0)

| Key | Default | Role |
| --- | --- | --- |
| `cheap_savings_nudge_enabled` | **off** (control) | Gates the whole Cheap nudge surface (GOTO-S3). Env: `CHEAP_SAVINGS_NUDGE_ENABLED=true\|1\|on`. |
| `min_savings_threshold` | **2000** (Rp2,000) | Remote-config-ready hook; inject `threshold` at calculator call sites. |

English templates (only legal M1 copy): `Save Rp{X} with MURAAAH >` · `Yay! You saved Rp{X}` · `Yes, change` · `No, cancel`. `{X}` is the session delta (e.g. `2,000`).

## Out of scope for M1

- Payment Summary redesign (it stays a financial receipt)
- Repositioning the delivery mode selector (future M2)
- Consolidating PLUS / cart-discount / Cheap nudges (future M3)
- Struck-through events: `Checkout_mode_recalculation_success`, `Checkout_booking_completed`
- Full 50/50 experiment, sample-size analysis, Cheap Booking Rate (+5% is a later primary metric)
- Real GoFood checkout / promo engine / native UI / i18n

## AC checklist (AC-001–012)

| ID | Given / when / then | Spike |
| --- | --- | --- |
| AC-001 | Given CEPAAAT checkout, when MURAAAH is available and delta ≥ Rp2,000, then render `Save RpX with MURAAAH >` | **Implemented** (S2 + copy) |
| AC-002 | Given displayed RpX, when evaluated, then RpX = exact CEPAAAT − MURAAAH payable net | **Implemented** (S2) |
| AC-003 | Given nudge render, when text populates, then values come from session payload + PRD templates | **Implemented** |
| AC-004 | Given nudge shown, when user taps, then open bottom sheet without auto-scroll | **Stubbed** (S4/S5) |
| AC-005 | Given sheet open, when displayed, then show comparative modes, ETAs, net spend | **Stubbed** (S5) |
| AC-006 | Given sheet open, when `Yes, change`, then switch MURAAAH, recalc, hide PLUS, `Yay! You saved RpX`, keep scroll | **Stubbed** (S6) |
| AC-007 | Given sheet open, when `No, cancel`, then close, stay CEPAAAT, total unchanged | **Stubbed** (S5) |
| AC-008 | Given checkout render, when MURAAAH unavailable **or** delta &lt; threshold, then do not render the nudge | **Implemented** (S2) |
| AC-009 | Given nudge rendered, when supply drops before tap/confirm, then withdraw nudge, keep Fast total | **Stubbed** (S7) |
| AC-010 | Given switched to MURAAAH, when supply drops before booking, then revert CEPAAAT, unhide PLUS, unavailability modal | **Stubbed** (S7) |
| AC-011 | Given promo scoring, when evaluating best offer, then score MURAAAH net in parallel with CEPAAAT | **Implemented** (S2) |
| AC-012 | Given user action, when event fires, then emit the matching in-scope event + required params | **Stubbed** (S8 payloads only) |

Hide reasons (first match): `flag_off` → `already_on_cheap` → `unavailable` → `below_threshold`. Flag off ⇒ AC-001 must not fire.

In-scope telemetry (stub payloads): `checkout_cheap_nudge_impression`, `checkout_cheap_nudge_click`, `delivery_switcher_modal_view`, `delivery_switcher_modal_action`, `delivery_switcher_modal_dismiss`.

## How to run

```bash
npm install
npm test          # vitest
npm run build     # tsc --noEmit
npm run demo      # PRD fixture; demo treats the flag as on
```

```bash
npm run demo -- --flag-off
npm run demo -- --unavailable
npm run demo -- --mode MURAAAH
npm run demo -- --below-threshold
npm run demo -- --boundary
npm run demo -- --stacked
npm run demo -- --supply-drop
npm run demo -- --cancel
```

## Layout

```
docs/tickets/             GOTO-S0–S9 (from the tickets PR; do not file in Linear)
src/pricing.ts            payable net spend for one mode
src/dualModeNetSpend.ts   show / hide + exact RpX (GOTO-S2)
src/threshold.ts          min_savings_threshold hook (default 2000)
src/featureFlag.ts        cheap_savings_nudge_enabled (GOTO-S3, default off)
src/copy.ts               PRD English templates
src/nudgeSurface.ts       view-model (decision + copy)
src/checkoutSession.ts    UI-surface state machine (stub S4–S7)
src/telemetry.ts          five in-scope event builders (stub S8)
src/fixtures.ts           mock carts from the PRD table
src/cli.ts                console demo
```

Payable formula (integer Rupiah, GOTO-S0):

`net_spend(mode) = cartBase − Σ cartDiscounts + deliveryBase − Σ deliveryDiscounts + otherFees`

`RpX = net_spend(CEPAAAT) − net_spend(MURAAAH)` — not delivery-fee-only, not perceived / strikethrough savings.
