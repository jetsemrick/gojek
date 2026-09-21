import { useEffect, useMemo, useState } from "react";
import {
  cancelSwitch,
  confirmSwitch,
  createCheckoutSession,
  dismissModal,
  tapNudge,
  type CheckoutSessionState,
} from "../src/checkoutSession.js";
import { formatRp } from "../src/copy.js";
import { CheckoutMock } from "./CheckoutMock.js";
import {
  SCENARIOS,
  buildSessionInput,
  defaultDemoFlagOn,
  defaultDemoThreshold,
  type ScenarioId,
} from "./demo.js";

export function App() {
  const [scenario, setScenario] = useState<ScenarioId>("eligible");
  const [flagOn, setFlagOn] = useState(defaultDemoFlagOn);
  const [threshold, setThreshold] = useState(defaultDemoThreshold);
  const [confirmedThisSession, setConfirmedThisSession] = useState(false);

  const seed = useMemo(
    () => buildSessionInput(scenario, flagOn, threshold),
    [scenario, flagOn, threshold],
  );

  const [session, setSession] = useState<CheckoutSessionState>(() =>
    createCheckoutSession(seed),
  );

  useEffect(() => {
    setSession(createCheckoutSession(seed));
    setConfirmedThisSession(false);
  }, [seed]);

  useEffect(() => {
    if (session.modal === null) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSession((current) => dismissModal(current, seed, "back_button"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session.modal, seed]);

  const selected = SCENARIOS.find((option) => option.id === scenario);

  return (
    <div className="app">
      <aside className="panel">
        <p className="kicker">Path A · Savings Nudges M1</p>
        <h1>Checkout mock</h1>
        <p>
          Fixture screen for{" "}
          <strong>GOTO-S4</strong> (nudge under Payment Summary) and{" "}
          <strong>GOTO-S5</strong> (bottom-sheet switcher). Thin{" "}
          <strong>GOTO-S6</strong> happy path: confirm → MURAAAH → success copy
          + hide PLUS. Not production GoFood.
        </p>
        <p className="muted">
          Pricing is imported from <code>dualModeNetSpend</code>,{" "}
          <code>checkoutSession</code>, <code>copy</code>,{" "}
          <code>featureFlag</code>, <code>threshold</code>, and fixtures. This
          UI does not recompute RpX.
        </p>

        <label className="field">
          <span>Fixture scenario</span>
          <select
            aria-label="Fixture scenario"
            value={scenario}
            onChange={(event) =>
              setScenario(event.target.value as ScenarioId)
            }
          >
            {SCENARIOS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <em>{selected?.hint}</em>
        </label>

        <label className="field toggle">
          <span>Feature flag</span>
          <span className="toggle-row">
            <input
              type="checkbox"
              role="switch"
              checked={flagOn}
              onChange={(event) => setFlagOn(event.target.checked)}
              aria-label="cheap_savings_nudge_enabled"
            />
            <code>cheap_savings_nudge_enabled</code>
            <strong>{flagOn ? "treatment (on)" : "control (off)"}</strong>
          </span>
          <em>Control default is off. Dev demo starts treatment on.</em>
        </label>

        <label className="field">
          <span>min_savings_threshold</span>
          <input
            type="number"
            min={0}
            step={1}
            value={threshold}
            aria-label="min_savings_threshold"
            onChange={(event) => {
              const next = Number.parseInt(event.target.value, 10);
              setThreshold(Number.isFinite(next) ? next : 0);
            }}
          />
          <em>Config hook default Rp2,000. Re-evaluates show/hide on change.</em>
        </label>

        <dl className="debug" data-testid="calculator-debug">
          <div>
            <dt>showNudge</dt>
            <dd>{String(session.view.showNudge)}</dd>
          </div>
          <div>
            <dt>reason</dt>
            <dd>{session.view.reason ?? "shown"}</dd>
          </div>
          <div>
            <dt>delta_rp</dt>
            <dd>{formatRp(session.view.savingsAmount)}</dd>
          </div>
          <div>
            <dt>currentMode</dt>
            <dd>{session.currentMode}</dd>
          </div>
        </dl>
      </aside>

      <main className="stage">
        <CheckoutMock
          session={session}
          fastPricing={seed.fast}
          cheapPricing={seed.cheap}
          confirmedThisSession={confirmedThisSession}
          onTapNudge={() => setSession((current) => tapNudge(current, seed))}
          onConfirm={() => {
            setSession((current) => confirmSwitch(current, seed));
            setConfirmedThisSession(true);
          }}
          onCancel={() => setSession((current) => cancelSwitch(current, seed))}
          onDismiss={() =>
            setSession((current) =>
              dismissModal(current, seed, "backdrop_tap"),
            )
          }
        />
      </main>
    </div>
  );
}
