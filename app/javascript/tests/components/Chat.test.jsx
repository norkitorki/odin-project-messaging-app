import react from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chat } from "@javascript/components/Chat";

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
    deleteChatForm: vi.fn(),
    joinChatForm: vi.fn(),
  },
};

vi.mock(import("@thoughtbot/superglue"), () => ({ useContent: () => content }));

vi.mock("@components/ImageViewer", () => ({
  default: vi.fn(() => <div>Image Viewer</div>),
  openImageInViewer: vi.fn(),
}));

vi.mock("@components/Message", () => ({
  default: vi.fn(),
}));

vi.mock("@components/Pagination", () => ({
  default: vi.fn(() => <div>Pagination</div>),
}));

vi.mock("@components/Modal", () => ({
  default: vi.fn(() => <div>Modal</div>),
}));

vi.mock("@components/Forms", () => ({
  AddMessageForm: vi.fn(),
  ChatRequestForm: vi.fn(),
  DeleteChatForm: vi.fn(() => <button type="submit">Delete Chat</button>),
  JoinChatForm: vi.fn(() => <button type="submit">Join Chat</button>),
  LeaveChatForm: vi.fn(() => <button type="submit">Leave Chat</button>),
}));

const props = {
  chat: {
    name: "Test Chat",
    pub_id: "c_48cuqpbt",
    admin: { username: "user", pub_id: "u_1oxd8ant" },
  },
};

describe("Chat", () => {
  afterEach(() => vi.clearAllMocks());

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
  });

  describe("when user is a chat member", () => {
    beforeEach(() => {
      const nonAdminProps = { ...props, chat: { admin: {} } };
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
  });

  describe("when user is not a chat member", () => {
    beforeEach(async () => {
      const superglue = await import("@thoughtbot/superglue");
      vi.spyOn(superglue, "useContent").mockReturnValueOnce({
        ...content,
        userIsMember: false,
      });
      render(<Chat {...props} />);
    });

    test("should render join chat button", () => {
      const button = screen.getByRole("button", { name: /join chat/i });
      expect(button).toBeInTheDocument();
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
