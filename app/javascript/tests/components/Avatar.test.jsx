import react from "react";
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "@components/Avatar";

vi.mock("@components/Icons", () => ({
  AccountCircle: vi.fn(() => (
    <svg>
      <title>Account Circle</title>
    </svg>
  )),
}));

describe("Avatar", () => {
  test("should render avatar", () => {
    render(
      <Avatar
        avatar={{ url: "https://my_image.png", filename: "my_image" }}
        width={80}
      />,
    );

    const avatar = screen.getByAltText(/my_image/i);
    expect(avatar.src).toBe("https://my_image.png/");
    expect(avatar.width).toBe(80);
    expect(avatar.height).toBe(80);
  });

  describe("when avatar is not provided", () => {
    test("should fallback to account circle", () => {
      render(<Avatar width={75} />);

      const avatar = screen.getByTitle(/account circle/i);
      expect(avatar).toBeInTheDocument();
    });
  });
});
