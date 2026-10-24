import react from "react";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chat } from "@javascript/components/Chat";
import {
  addMessageForm,
  chatRequestForm,
  deleteChatForm,
  joinChatForm,
  leaveChatForm,
} from "../forms";
import userEvent from "@testing-library/user-event";

const messages = {
  data: [
    {
      value: "Hello World!",
      deleted: false,
      pub_id: "m_17gixzcw",
      parent_id: null,
      user: {
        username: "user",
        pub_id: "u_1oxd8ant",
        updated_at: "2026-10-09T11:50:04.143Z",
      },
      chat: {
        pub_id: "c_1lyqnmte",
        name: "Private_49",
      },
      created: "about 2 days ago",
      updated: "about 2 days ago",
    },
    {
      value: "Welcome to my chat",
      deleted: false,
      pub_id: "m_jx7sycpq",
      parent_id: null,
      user: {
        username: "user",
        pub_id: "u_1oxd8ant",
        updated_at: "2026-10-09T11:50:04.143Z",
      },
      chat: {
        pub_id: "c_1lyqnmte",
        name: "Private_49",
      },
      created: "about 2 days ago",
      updated: "about 2 days ago",
    },
  ],
  pages: { totalCount: 2 },
  replies: {},
};

const content = {
  currentUser: { username: "user", pub_id: "u_1oxd8ant" },
  userIsMember: true,
  messages: messages,
  forms: {
    addMessageForm,
    deleteChatForm,
    joinChatForm,
    chatRequestForm,
    leaveChatForm,
  },
};

vi.mock(import("@thoughtbot/superglue"), () => ({ useContent: () => content }));

vi.mock("@components/ImageViewer", () => ({
  default: vi.fn(),
  openImageInViewer: vi.fn(),
}));

vi.mock("@components/Message", () => ({
  default: vi.fn(),
}));

vi.mock("@components/Pagination", () => ({
  default: vi.fn(),
}));

const originalConfirm = window.confirm;
window.confirm = vi.fn(() => false);

const props = {
  chat: {
    name: "Test Chat",
    pub_id: "c_48cuqpbt",
    admin: { username: "user", pub_id: "u_1oxd8ant" },
  },
};

const privateProps = {
  ...props,
  chat: { ...props.chat, private: true },
};

describe("Chat", () => {
  afterEach(() => vi.clearAllMocks());

  afterAll(() => (window.confirm = originalConfirm));

  test("should render chat name", () => {
    render(<Chat {...props} />);

    expect(screen.getByText(/test chat/i)).toBeInTheDocument();
  });

  test("should render link to chat users", () => {
    render(<Chat {...props} />);

    const link = screen.getByText(/users/i);
    expect(link).toBeInTheDocument();
    expect(link.href).toBe("http://localhost:3000/chats/c_48cuqpbt/users");
  });

  test("should render chat messages", async () => {
    const Message = await import("@components/Message");
    render(<Chat {...props} />);

    expect(Message.default).toHaveBeenCalledTimes(2);
    expect(Message.default).toHaveBeenNthCalledWith(
      1,
      {
        message: messages.data[0],
        chat: props.chat,
        replies: undefined,
        openImageInViewer: expect.any(Function),
      },
      undefined,
    );
    expect(Message.default).toHaveBeenNthCalledWith(
      2,
      {
        message: messages.data[1],
        chat: props.chat,
        replies: undefined,
        openImageInViewer: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when user is the chat admin", () => {
    test("should render delete chat button", () => {
      render(<Chat {...props} />);

      const button = screen.getByRole("button", { name: /delete chat/i });
      expect(button).toBeInTheDocument();
    });

    test("should allow admin to delete chat", async () => {
      const user = userEvent.setup();
      render(<Chat {...props} />);

      await user.click(screen.getByRole("button", { name: /delete chat/i }));

      expect(window.confirm).toHaveBeenCalledExactlyOnceWith(
        "You are about to delete this chat. Are you sure?",
      );
    });

    describe("when chat is private", () => {
      test("should allow admin to invite user", async () => {
        const user = userEvent.setup();
        render(<Chat {...privateProps} />);

        await user.click(screen.getByRole("button", { name: /invite user/i }));

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument;
        expect(screen.getByRole("textbox", { name: /username/i }));
        expect(screen.getByRole("button", { name: /invite to chat/i }));
      });
    });
  });

  describe("when user is a chat member", () => {
    const nonAdminProps = { ...props, chat: { admin: {} } };

    beforeEach(() => {
      render(<Chat {...nonAdminProps} />);
    });

    test("should render leave chat button", () => {
      const button = screen.getByRole("button", { name: /leave chat/i });
      expect(button).toBeInTheDocument();
    });

    test("should render add message button", () => {
      const button = screen.getByRole("button", { name: /add message/i });
      expect(button).toBeInTheDocument();
    });

    test("should not render delete chat button", () => {
      const button = screen.queryByRole("button", { name: /delete chat/i });
      expect(button).not.toBeInTheDocument();
    });

    test("should allow user to post new message", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: /add message/i }));

      expect(screen.getByLabelText(/add message/i)).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /add message/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    test("should allow user to leave chat", async () => {
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: /leave chat/i }));

      expect(window.confirm).toHaveBeenCalledExactlyOnceWith(
        "You are about to leave the chat. Are you sure?",
      );
    });
  });

  describe("when user is not a chat member", () => {
    beforeEach(async () => {
      const superglue = await import("@thoughtbot/superglue");
      vi.spyOn(superglue, "useContent").mockReturnValueOnce({
        ...content,
        userIsMember: false,
      });
    });

    test("should render join button", () => {
      render(<Chat {...props} />);

      expect(screen.getByRole("button", { name: /join/i })).toBeInTheDocument();
    });

    describe("when chat is private", () => {
      test("should not render join button", () => {
        render(<Chat {...privateProps} />);

        expect(
          screen.queryByRole("button", { name: /join/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("when user is signed out", () => {
    beforeEach(async () => {
      const superglue = await import("@thoughtbot/superglue");
      vi.spyOn(superglue, "useContent").mockReturnValueOnce({
        ...content,
        currentUser: null,
        userIsMember: false,
      });
      render(<Chat {...props} />);
    });

    test("should not render join chat button", () => {
      expect(
        screen.queryByRole("button", { name: /join chat/i }),
      ).not.toBeInTheDocument();
    });

    test("should not render add message button", () => {
      expect(
        screen.queryByRole("button", { name: /add message/i }),
      ).not.toBeInTheDocument();
    });
  });
});
