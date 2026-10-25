import react from "react";
import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Pagination from "@components/Pagination";

const props = {
  pages: {
    current: 2,
    previous: 1,
    count: 3,
    totalCount: 32,
    perPage: 10,
    paths: [
      {
        page: 1,
        url: "/chats/c_184bdgtz?page=1",
      },
      {
        page: 2,
        url: "/chats/c_184bdgtz?page=2",
      },
      {
        page: 3,
        url: "/chats/c_184bdgtz?page=3",
      },
    ],
  },
};

describe("Pagination", () => {
  test("should render pagination status", () => {
    render(<Pagination {...props} />);

    expect(screen.getByText(/showing 11 - 20 of 32/i)).toBeInTheDocument();
  });

  test("should render pagination links", () => {
    render(<Pagination {...props} />);

    expect.assertions(3);
    for (let i = 1; i < 4; i++) {
      expect(screen.getByRole("link", { name: new RegExp(i, "i") }).href).toBe(
        `http://localhost:3000/chats/c_184bdgtz?page=${i}`,
      );
    }
  });

  test("should render previous page link", () => {
    render(<Pagination {...props} />);

    expect(screen.getByRole("link", { name: /</i }).href).toBe(
      "http://localhost:3000/chats/c_184bdgtz?page=1",
    );
  });

  test("should render next page link", () => {
    render(<Pagination {...props} />);

    expect(screen.getByRole("link", { name: />/i }).href).toBe(
      "http://localhost:3000/chats/c_184bdgtz?page=3",
    );
  });

  describe("when page count is smaller than 2", () => {
    beforeEach(() => {
      const lowPageProps = {
        ...props,
        pages: { count: 1 },
      };
      render(<Pagination {...lowPageProps} />);
    });

    test("should render no pagination", () => {
      expect(screen.queryAllByRole("link")).toHaveLength(0);
    });
  });

  describe("when a large number of pages are present", () => {
    beforeEach(() => {
      const paths = [];
      for (let i = 1; i < 16; i++) {
        paths.push({ page: i, url: `/chats/c_184bdgtz?page=${i}` });
      }
      const manyPagesProps = {
        pages: {
          current: 6,
          previous: 5,
          count: 15,
          totalCount: 155,
          perPage: 10,
          paths,
        },
      };
      render(<Pagination {...manyPagesProps} />);
    });

    test("should limit number of rendered page links", () => {
      expect.assertions(15);
      for (let i = 1; i < 16; i++) {
        if (i < 3 || i > 9) {
          expect(
            screen.queryByRole("link", { name: new RegExp(i, "i") }),
          ).not.toBeInTheDocument();
        } else {
          expect(
            screen.getByRole("link", { name: new RegExp(i, "i") }),
          ).toBeInTheDocument();
        }
      }
    });

    test("should render link to first page", () => {
      expect(screen.getByRole("link", { name: /<</i }).href).toBe(
        "http://localhost:3000/chats/c_184bdgtz?page=1",
      );
    });

    test("should render link to last page", () => {
      expect(screen.getByRole("link", { name: />>/i }).href).toBe(
        "http://localhost:3000/chats/c_184bdgtz?page=15",
      );
    });
  });
});
