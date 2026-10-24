import react from "react";
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "@components/Modal";

vi.mock("@components/Icons", () => ({
  CloseButton: vi.fn(() => <svg title="close modal">Close</svg>),
}));

describe("Modal", () => {
  test("should render children", () => {
    const children = (
      <label>
        Favorite Color
        <input type="text"></input>
      </label>
    );

    render(<Modal>{children}</Modal>);

    expect(screen.getByLabelText(/favorite color/i)).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /favorite color/i }),
    ).toBeInTheDocument();
  });

  test("should call a setter function when closing via button click", async () => {
    const user = userEvent.setup();
    const setterFunc = vi.fn();
    render(<Modal setterFunc={setterFunc} />);

    await user.click(screen.getByTitle(/close modal/i));

    expect(setterFunc).toHaveBeenCalledExactlyOnceWith(false);
  });

  test("should call a setter function when closing via keyboard press", async () => {
    const user = userEvent.setup();
    const setterFunc = vi.fn();
    render(<Modal setterFunc={setterFunc} />);

    await user.keyboard("{Escape}");

    expect(setterFunc).toHaveBeenCalledExactlyOnceWith(false);
  });
});
