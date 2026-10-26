import react from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { signOutForm } from "../forms";
import Sidebar from "@components/Sidebar";

const content = {
  currentUser: null,
  contacts: [],
  requestCount: 0,
  signOutForm: signOutForm,
};

vi.mock(import("@thoughtbot/superglue"), () => ({ useContent: () => content }));

describe("Sidebar", () => {
  test("should render home link", () => {
    render(<Sidebar />);

    const link = screen.getByRole("link", { name: /^home$/i });
    expect(link).toBeInTheDocument();
    expect(link.href).toBe("http://localhost:3000/");
  });

  test("should render chats link", () => {
    render(<Sidebar />);

    const link = screen.getByRole("link", { name: /chats/i });
    expect(link).toBeInTheDocument();
    expect(link.href).toBe("http://localhost:3000/chats");
  });

  describe("when user is signed in", () => {
    beforeEach(async () => {
      const superglue = await import("@thoughtbot/superglue");
      vi.spyOn(superglue, "useContent").mockReturnValueOnce({
        ...content,
        currentUser: { username: "test-user", pub_id: "u_1oxd8ant" },
        contacts: [
          { username: "first-contact", pub_id: "u_c82hwozm" },
          { username: "second-contact", pub_id: "u_dg7rozdn" },
        ],
      });
      render(<Sidebar />);
    });

    test("should render user home link", () => {
      const link = screen.getByRole("link", { name: /^test-user user home$/i });
      expect(link).toBeInTheDocument();
      expect(link.href).toBe("http://localhost:3000/users/u_1oxd8ant");
    });

    test("should render user settings link", () => {
      const link = screen.getByRole("link", { name: /^user settings$/i });
      expect(link).toBeInTheDocument();
      expect(link.href).toBe("http://localhost:3000/user/settings#requests");
    });

    test("should render sign out button", () => {
      const button = screen.getByRole("button", { name: /^sign out$/i });
      expect(button).toBeInTheDocument();
    });

    test("should render contacts", () => {
      const list = screen.getByRole("list");
      const firstContact = within(list).getByRole("link", {
        name: /^first-contact$/i,
      });
      const secondContact = within(list).getByRole("link", {
        name: /^second-contact$/i,
      });
      expect(firstContact).toBeInTheDocument();
      expect(secondContact).toBeInTheDocument();
      expect(firstContact.href).toBe("http://localhost:3000/users/u_c82hwozm");
      expect(secondContact.href).toBe("http://localhost:3000/users/u_dg7rozdn");
    });
  });
});
