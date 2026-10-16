import react from "react";
import { afterAll, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import styles from "@stylesheets/Layout.module.css";
import Flash from "@components/Flash";

vi.mock(import("react-redux"), () => ({
  useSelector: vi.fn(() => ({
    success: "Successfull operation completed",
  })),
}));

afterAll(() => vi.clearAllMocks());

describe("Flash", () => {
  test("should render flash success message", async () => {
    render(<Flash />);

    const success = screen.getByText(/successfull operation completed/i);
    expect(success).toBeInTheDocument();
    expect(success.classList.value).toBe(styles.flashSuccess);
  });

  test("should render flash notice message", async () => {
    const redux = await import("react-redux");
    vi.spyOn(redux, "useSelector").mockReturnValueOnce({
      notice: "Notice delivered",
    });

    render(<Flash />);

    const notice = screen.getByText(/notice delivered/i);
    expect(notice).toBeInTheDocument();
    expect(notice.classList.value).toBe(styles.flashNotice);
  });

  test("should render flash alert message", async () => {
    const redux = await import("react-redux");
    vi.spyOn(redux, "useSelector").mockReturnValueOnce({
      alert: "Alert is in progress",
    });

    render(<Flash />);

    const alert = screen.getByText(/alert is in progress/i);
    expect(alert).toBeInTheDocument();
    expect(alert.classList.value).toBe(styles.flashAlert);
  });

  test("should hide flash after 5 seconds", async () => {
    render(<Flash />);

    const message = screen.getByText(/successfull operation completed/i);
    const flash = message.parentElement;

    expect(flash.classList.contains(styles.flashHidden)).toBeFalsy();
    await vi.waitFor(
      () => expect(flash.classList.contains(styles.flashHidden)).toBeTruthy(),
      { timeout: 5100 },
    );
  }, 6000);
});
