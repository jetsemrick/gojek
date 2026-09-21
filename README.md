# Savings Nudges M1 — Path A spike

Greenfield TypeScript + **React/Vite** spike for **Improve Savings Nudges on Checkout with Consistent Payment Summary**. This is **not** production GoFood checkout. Pricing fixtures, the feature flag, and the web UI are **Path A mocks** (fixture carts, stubbed supply / PLUS nudge) so the payable-delta contract can be clicked through in isolation.

- PRD: [Improve Savings Nudges on Checkout with Consistent Payment Summary](https://docs.google.com/document/d/17iTbU2BXDJGNkCNfAgesbAAMfoVuRldTAMnbMmHZzcA)
- In-repo tickets (not Linear): [`docs/tickets/`](./docs/tickets/) — cite **GOTO-S0 … GOTO-S9** in PRs
- **This PR (M1b):** [GOTO-S4](./docs/tickets/GOTO-S4-nudge-ui.md) (nudge UI), [GOTO-S5](./docs/tickets/GOTO-S5-bottom-sheet-switcher.md) (bottom sheet), thin [GOTO-S6](./docs/tickets/GOTO-S6-confirm-switch.md) happy path only
- Already on `main`: **GOTO-S1** (spec), **GOTO-S2** (dual-mode net spend), **GOTO-S3** (feature-flag stub). Contract lock: **GOTO-S0**

## Problem

**CEPAAAT (Fast)** is the default checkout mode. **MURAAAH (Cheap)** savings are hard to discover: comparing modes means scrolling between the selector and the order summary. Users judge affordability by **total payable value**, not delivery fee alone. M1 surfaces an exact payable gap next to Payment Summary so cost-conscious users can switch without hunting.

## Path A / M1 scope

When checkout is on CEPAAAT, MURAAAH is available, and payable delta ≥ threshold, show `Save RpX with MURAAAH >` below Payment Summary and confirm via a bottom-sheet switcher. Also: dual-mode net-spend module, feature-flag stub, telemetry *payloads* for the five in-scope events.

**This PR covers**

- Web checkout mock (`npm run dev`) with Payment Summary + show/hide nudge
- Bottom sheet: comparative ETAs + net spends, `Yes, change` / `No, cancel`, backdrop/Escape dismiss
- Thin S6 happy path: confirm → switch MURAAAH → `Yay! You saved RpX` + hide PLUS mock
- Demo flag toggle (control = off; **dev UI defaults treatment on** so the loop is clickable)
- Threshold config hook in the demo toolbar (default Rp2,000)

**Still stubbed / deferred**

- Full S6 (real scroll-offset lock in a host app; this mock never auto-scrolls)
- GOTO-S7 supply-drop / revert UI
- GOTO-S8 deep telemetry (session already builds the five payloads; no analytics sink)
- Native / React Native (README previously out-of-scoped RN; this spike is **web**)
- Real GoFood checkout / promo engine / i18n

Pricing is **not rewritten** in the UI. The mock imports `dualModeNetSpend`, `evaluateSavingsNudge` / `checkoutSession`, `featureFlag`, `threshold`, `copy`, and fixtures.

## Config (GOTO-S0)

| Key | Default | Role |
| --- | --- | --- |
| `cheap_savings_nudge_enabled` | **off** (control) | Gates the whole Cheap nudge surface (GOTO-S3). Env: `CHEAP_SAVINGS_NUDGE_ENABLED=true\|1\|on`. Demo toolbar overrides this. |
| `min_savings_threshold` | **2000** (Rp2,000) | Remote-config-ready hook; inject `threshold` at calculator call sites. Demo toolbar exposes the same hook. |

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
| AC-001 | Given CEPAAAT checkout, when MURAAAH is available and delta ≥ Rp2,000, then render `Save RpX with MURAAAH >` | **Implemented** (S2 + S4 web) |
| AC-002 | Given displayed RpX, when evaluated, then RpX = exact CEPAAAT − MURAAAH payable net | **Implemented** (S2) |
| AC-003 | Given nudge render, when text populates, then values come from session payload + PRD templates | **Implemented** |
| AC-004 | Given nudge shown, when user taps, then open bottom sheet without auto-scroll | **Implemented** (S5 web) |
| AC-005 | Given sheet open, when displayed, then show comparative modes, ETAs, net spend | **Implemented** (S5 web) |
| AC-006 | Given sheet open, when `Yes, change`, then switch MURAAAH, recalc, hide PLUS, `Yay! You saved RpX`, keep scroll | **Partial** (thin S6 happy path in the mock) |
| AC-007 | Given sheet open, when `No, cancel`, then close, stay CEPAAAT, total unchanged | **Implemented** (S5 web) |
| AC-008 | Given checkout render, when MURAAAH unavailable **or** delta &lt; threshold, then do not render the nudge | **Implemented** (S2 + S4 web) |
| AC-009 | Given nudge rendered, when supply drops before tap/confirm, then withdraw nudge, keep Fast total | **Stubbed** (S7) |
| AC-010 | Given switched to MURAAAH, when supply drops before booking, then revert CEPAAAT, unhide PLUS, unavailability modal | **Stubbed** (S7) |
| AC-011 | Given promo scoring, when evaluating best offer, then score MURAAAH net in parallel with CEPAAAT | **Implemented** (S2) |
| AC-012 | Given user action, when event fires, then emit the matching in-scope event + required params | **Stubbed** (S8 payloads only) |

Hide reasons (first match): `flag_off` → `already_on_cheap` → `unavailable` → `below_threshold`. Flag off ⇒ AC-001 must not fire.

In-scope telemetry (stub payloads): `checkout_cheap_nudge_impression`, `checkout_cheap_nudge_click`, `delivery_switcher_modal_view`, `delivery_switcher_modal_action`, `delivery_switcher_modal_dismiss`.

## How to run the web UI

```bash
npm install
npm run dev
```

Opens the Vite checkout mock (default [http://localhost:5173](http://localhost:5173)). Still frames: [`docs/demo/`](./docs/demo/).

1. Eligible CEPAAAT fixture: Payment Summary total **Rp85,000**, nudge `Save Rp3,500 with MURAAAH >`
2. Tap the nudge → bottom sheet (25 min / 55 min, Rp85,000 vs Rp81,500)
3. `No, cancel` or backdrop / Escape → stay CEPAAAT
4. `Yes, change` → MURAAAH, payable **Rp81,500**, `Yay! You saved Rp3,500`, PLUS mock hidden
5. Toggle `cheap_savings_nudge_enabled` off, or pick hide-rule fixtures (unavailable, below threshold, already MURAAAH)

## How to run library / console

```bash
npm test          # vitest — library + lightweight UI tests
npm run build     # tsc --noEmit
npm run demo      # console PRD fixture; demo treats the flag as on
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
src/checkoutSession.ts    UI-surface state machine (S4–S7 logic)
src/telemetry.ts          five in-scope event builders (stub S8)
src/fixtures.ts           mock carts from the PRD table
src/cli.ts                console demo
web/                      React + Vite checkout mock (GOTO-S4 / S5 / thin S6)
```

Payable formula (integer Rupiah, GOTO-S0):

`net_spend(mode) = cartBase − Σ cartDiscounts + deliveryBase − Σ deliveryDiscounts + otherFees`

`RpX = net_spend(CEPAAAT) − net_spend(MURAAAH)` — not delivery-fee-only, not perceived / strikethrough savings.
