/** @vitest-environment jsdom */
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App.js";

afterEach(() => {
  cleanup();
});

function getCheckout() {
  return screen.getByTestId("payment-summary").closest(".phone");
}

describe("Path A checkout mock (GOTO-S4 / S5 / thin S6)", () => {
  it("renders Payment Summary and calculator nudge copy below it", () => {
    render(<App />);

    const summary = screen.getByTestId("payment-summary");
    expect(summary.textContent).toContain("Payment Summary");
    expect(screen.getByTestId("payable-total").textContent).toBe("Rp85,000");
    expect(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    ).toBeTruthy();
    expect(screen.getByTestId("plus-nudge")).toBeTruthy();
  });

  it("hides the nudge when the feature flag is off", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("switch", { name: "cheap_savings_nudge_enabled" }),
    );

    expect(
      screen.queryByRole("button", { name: /Save Rp/ }),
    ).toBeNull();
    expect(screen.getByTestId("calculator-debug").textContent).toContain(
      "flag_off",
    );
  });

  it("hides the nudge when MURAAAH is unavailable", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Fixture scenario" }),
      "unavailable",
    );

    expect(
      screen.queryByRole("button", { name: /Save Rp/ }),
    ).toBeNull();
    expect(screen.getByTestId("calculator-debug").textContent).toContain(
      "unavailable",
    );
  });

  it("opens the switcher with comparative ETAs and net spends", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    );

    const sheet = screen.getByRole("dialog");
    expect(sheet).toBeTruthy();
    expect(within(sheet).getByText("25 min")).toBeTruthy();
    expect(within(sheet).getByText("55 min")).toBeTruthy();
    expect(within(sheet).getAllByText("Rp85,000").length).toBeGreaterThan(0);
    expect(within(sheet).getByText("Rp81,500")).toBeTruthy();
    expect(within(sheet).getByRole("button", { name: "Yes, change" })).toBeTruthy();
    expect(within(sheet).getByRole("button", { name: "No, cancel" })).toBeTruthy();
  });

  it("cancels without leaving CEPAAAT or changing payable", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    );
    await user.click(screen.getByRole("button", { name: "No, cancel" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("payable-total").textContent).toBe("Rp85,000");
    expect(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    ).toBeTruthy();
    expect(getCheckout()?.textContent).toContain("CEPAAAT");
  });

  it("dismisses the sheet from the backdrop without switching", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    );
    await user.click(screen.getByRole("button", { name: "Dismiss switcher" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    ).toBeTruthy();
  });

  it("confirms the happy path: MURAAAH, success copy, PLUS hidden", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Save Rp3,500 with MURAAAH >" }),
    );
    await user.click(screen.getByRole("button", { name: "Yes, change" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("success-copy").textContent).toBe(
      "Yay! You saved Rp3,500",
    );
    expect(screen.getByTestId("payable-total").textContent).toBe("Rp81,500");
    expect(screen.queryByTestId("plus-nudge")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /Save Rp/ }),
    ).toBeNull();
    expect(getCheckout()?.textContent).toContain("MURAAAH");
  });
});
