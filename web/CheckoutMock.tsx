import type {
  CheckoutSessionState,
  SwitcherModal,
} from "../src/checkoutSession.js";
import { formatRp } from "../src/copy.js";
import { computeNetSpend } from "../src/pricing.js";
import type { DeliveryMode, ModePricing } from "../src/types.js";

export interface CheckoutMockProps {
  session: CheckoutSessionState;
  fastPricing: ModePricing;
  cheapPricing: ModePricing;
  confirmedThisSession: boolean;
  onTapNudge: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss: () => void;
}

function sum(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

function PaymentSummary({
  mode,
  pricing,
}: {
  mode: DeliveryMode;
  pricing: ModePricing;
}) {
  const cartDiscounts = sum(pricing.cartDiscounts);
  const deliveryDiscounts = sum(pricing.deliveryDiscounts);
  const otherFees = pricing.otherFees ?? 0;
  const total = computeNetSpend(pricing);

  return (
    <section className="card" data-testid="payment-summary">
      <header className="card-header">
        <h2>Payment Summary</h2>
        <span className="mode-pill">{mode}</span>
      </header>
      <dl className="receipt">
        <div>
          <dt>Cart subtotal</dt>
          <dd>{formatRp(pricing.cartBase)}</dd>
        </div>
        {cartDiscounts > 0 ? (
          <div className="discount">
            <dt>Cart discounts</dt>
            <dd>−{formatRp(cartDiscounts)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Delivery fee</dt>
          <dd>{formatRp(pricing.deliveryBase)}</dd>
        </div>
        {deliveryDiscounts > 0 ? (
          <div className="discount">
            <dt>
              {mode === "CEPAAAT"
                ? "PLUS delivery discount"
                : "MURAAAH delivery discount"}
            </dt>
            <dd>−{formatRp(deliveryDiscounts)}</dd>
          </div>
        ) : null}
        {otherFees > 0 ? (
          <div>
            <dt>Other fees</dt>
            <dd>{formatRp(otherFees)}</dd>
          </div>
        ) : null}
        <div className="total">
          <dt>Total payable</dt>
          <dd data-testid="payable-total">{formatRp(total)}</dd>
        </div>
      </dl>
    </section>
  );
}

function SavingsNudgeRow({
  copy,
  onTap,
}: {
  copy: string;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      className="nudge-row"
      data-testid="savings-nudge"
      onClick={onTap}
    >
      {copy}
    </button>
  );
}

function SuccessRow({ copy }: { copy: string }) {
  return (
    <p className="success-row" data-testid="success-copy">
      {copy}
    </p>
  );
}

function PlusNudge() {
  return (
    <aside className="plus-nudge" data-testid="plus-nudge">
      <span className="plus-badge">Gojek PLUS</span>
      <p>Save more on delivery with PLUS — mock sibling, hidden after Cheap confirm.</p>
    </aside>
  );
}

function SwitcherSheet({
  modal,
  onConfirm,
  onCancel,
  onDismiss,
}: {
  modal: SwitcherModal;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="sheet-root">
      <button
        type="button"
        className="sheet-backdrop"
        aria-label="Dismiss switcher"
        onClick={onDismiss}
      />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="switcher-title"
        data-testid="switcher-sheet"
      >
        <div className="sheet-handle" aria-hidden="true" />
        <h2 id="switcher-title">Switch to MURAAAH?</h2>
        <p className="sheet-lead">
          Compare ETA and payable net spend before you change delivery mode.
        </p>
        <div className="compare">
          <article className="compare-col">
            <h3>CEPAAAT</h3>
            <p className="eta">{modal.fastEtaMins} min</p>
            <p className="price">{formatRp(modal.fastNetSpend)}</p>
          </article>
          <article className="compare-col cheap">
            <h3>MURAAAH</h3>
            <p className="eta">{modal.cheapEtaMins} min</p>
            <p className="price">
              <s className="original">{formatRp(modal.fastNetSpend)}</s>
              <strong>{formatRp(modal.cheapNetSpend)}</strong>
            </p>
          </article>
        </div>
        <div className="sheet-actions">
          <button type="button" className="btn primary" onClick={onConfirm}>
            {modal.yesChangeLabel}
          </button>
          <button type="button" className="btn ghost" onClick={onCancel}>
            {modal.noCancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CheckoutMock({
  session,
  fastPricing,
  cheapPricing,
  confirmedThisSession,
  onTapNudge,
  onConfirm,
  onCancel,
  onDismiss,
}: CheckoutMockProps) {
  const pricing =
    session.currentMode === "MURAAAH" ? cheapPricing : fastPricing;
  const showSuccess =
    confirmedThisSession && session.currentMode === "MURAAAH";
  const modal =
    session.modal?.kind === "switch_confirm" ? session.modal : null;

  return (
    <div className="phone">
      <header className="phone-status">
        <span>Path A fixture</span>
        <span>not GoFood prod</span>
      </header>
      <div className="merchant">
        <p className="eyebrow">Checkout</p>
        <h1>Warung Demo</h1>
        <p className="muted">
          Fixture cart from the PRD table. Delivery mode selector stays up
          here — the savings nudge sits below Payment Summary.
        </p>
        <div className="mode-selector" aria-label="Delivery mode selector mock">
          <span
            className={
              session.currentMode === "CEPAAAT" ? "chip on" : "chip"
            }
          >
            CEPAAAT · 25 min
          </span>
          <span
            className={
              session.currentMode === "MURAAAH" ? "chip on cheap" : "chip"
            }
          >
            MURAAAH · 55 min
          </span>
        </div>
      </div>

      <ul className="cart">
        <li>
          <span>Nasi goreng komplit</span>
          <span>fixture</span>
        </li>
        <li>
          <span>Ayam goreng</span>
          <span>fixture</span>
        </li>
        <li>
          <span>Es teh manis</span>
          <span>fixture</span>
        </li>
      </ul>

      <PaymentSummary mode={session.currentMode} pricing={pricing} />

      {session.view.showNudge && session.view.nudgeCopy ? (
        <SavingsNudgeRow copy={session.view.nudgeCopy} onTap={onTapNudge} />
      ) : null}

      {showSuccess ? <SuccessRow copy={session.view.successCopy} /> : null}

      {session.gojekPlusNudgeVisible ? <PlusNudge /> : null}

      <button type="button" className="btn place" disabled>
        Place order (mock)
      </button>

      {modal ? (
        <SwitcherSheet
          modal={modal}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onDismiss={onDismiss}
        />
      ) : null}
    </div>
  );
}
