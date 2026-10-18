import react, { useRef } from "react";
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import styles from "@stylesheets/ImageViewer.module.css";
import ImageViewer, { openImageViewer } from "@components/ImageViewer";

vi.mock("@components/Icons", () => ({
  CloseButton: vi.fn(() => <span>Close</span>),
  ArrowLeft: vi.fn(() => <span>Arrow Left</span>),
  ArrowRight: vi.fn(() => <span>Arrow Right</span>),
}));

describe("ImageViewer", () => {
  const Wrapper = function () {
    const viewerRef = useRef();
    return <ImageViewer ref={viewerRef} />;
  };

  describe("#openImageViewer", () => {
    test("should open image viewer with indexed image", () => {
      const screen = render(<Wrapper />);
      const viewer = screen.getByTestId("image-viewer");

      expect(viewer.classList).not.toContain(styles.viewerOpen);
      openImageViewer(
        viewer,
        ["/image-1.png", "/image-2.png", "/image-3.png"],
        1,
      );

      screen.rerender(<Wrapper />);

      expect(viewer.classList).toContain(styles.viewerOpen);
      const image = screen.getByAltText(/\/image-2\.png/i);
      expect(image).toBeInTheDocument();
      expect(image.nodeName).toBe("IMG");
      expect(image.src).toBe("http://localhost:3000/image-2.png");
    });
  });

  test("should navigate to previous image using button", async () => {
    const user = userEvent.setup();
    const screen = render(<Wrapper />);

    openImageViewer(
      screen.getByTestId("image-viewer"),
      ["/image-1.png", "/image-2.png", "/image-3.png"],
      2,
    );

    screen.rerender(<Wrapper />);

    await user.click(screen.getByText(/arrow left/i));
    await user.click(screen.getByText(/arrow left/i));

    expect(screen.getByAltText(/\/image-1\.png/i)).toBeInTheDocument();
  });

  test("should navigate to previous image using keyboard", async () => {
    const user = userEvent.setup();
    const screen = render(<Wrapper />);

    openImageViewer(
      screen.getByTestId("image-viewer"),
      ["/image-1.png", "/image-2.png", "/image-3.png"],
      2,
    );

    screen.rerender(<Wrapper />);

    await user.keyboard("{ArrowLeft}{ArrowLeft}");

    expect(screen.getByAltText(/\/image-1\.png/i)).toBeInTheDocument();
  });

  test("should navigate to next image using button", async () => {
    const user = userEvent.setup();
    const screen = render(<Wrapper />);

    openImageViewer(
      screen.getByTestId("image-viewer"),
      ["/image-1.png", "/image-2.png", "/image-3.png"],
      0,
    );

    screen.rerender(<Wrapper />);

    await user.click(screen.getByText(/arrow right/i));
    await user.click(screen.getByText(/arrow right/i));

    expect(screen.getByAltText(/\/image-3\.png/i)).toBeInTheDocument();
  });

  test("should navigate to next image using keyboard", async () => {
    const user = userEvent.setup();
    const screen = render(<Wrapper />);

    openImageViewer(
      screen.getByTestId("image-viewer"),
      ["/image-1.png", "/image-2.png", "/image-3.png"],
      0,
    );

    screen.rerender(<Wrapper />);

    await user.keyboard("{ArrowRight}{ArrowRight}");

    expect(screen.getByAltText(/\/image-3\.png/i)).toBeInTheDocument();
  });

  test("should close image viewer using close button", async () => {
    const user = userEvent.setup();
    const screen = render(<Wrapper />);
    const viewer = screen.getByTestId("image-viewer");

    openImageViewer(
      viewer,
      ["/image-1.png", "/image-2.png", "/image-3.png"],
      0,
    );

    screen.rerender(<Wrapper />);

    expect(viewer.classList).toContain(styles.viewerOpen);
    await user.click(screen.getByText(/close/i));
    expect(viewer.classList).not.toContain(styles.viewerOpen);
  });

  test("should close image viewer using keyboard", async () => {
    const user = userEvent.setup();
    const screen = render(<Wrapper />);
    const viewer = screen.getByTestId("image-viewer");

    openImageViewer(
      viewer,
      ["/image-1.png", "/image-2.png", "/image-3.png"],
      0,
    );

    screen.rerender(<Wrapper />);

    expect(viewer.classList).toContain(styles.viewerOpen);
    await user.keyboard("{Escape}");
    expect(viewer.classList).not.toContain(styles.viewerOpen);
  });
});
