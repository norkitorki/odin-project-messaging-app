import react from "react";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import styles from "@stylesheets/Message.module.css";
import { addMessageForm, deleteMessageForm, editMessageForm } from "../forms";
import Message from "@components/Message";

const content = {
  currentUser: { username: "test-user", pub_id: "u_1oxd8ant" },
  userIsMember: true,
  messageQuery: null,
  parentQuery: null,
  forms: {
    addMessageForm: addMessageForm,
    deleteMessageForm: deleteMessageForm,
    editMessageForm: editMessageForm,
  },
};

vi.mock(import("@thoughtbot/superglue"), () => ({ useContent: () => content }));

vi.mock("@components/Icons", () => ({
  Edit: vi.fn(() => <span>Edit Icon</span>),
  Link: vi.fn(() => <span>Link Icon</span>),
  Reply: vi.fn(() => <span>Reply Icon</span>),
  Delete: vi.fn(() => <span>Delete Icon</span>),
  CloseButton: vi.fn(() => <span>Close Button</span>),
}));

vi.mock("@components/Avatar", () => ({
  default: vi.fn(),
}));

const originalConfirm = window.confirm;
const originalAlert = window.alert;
const originalScroll = window.scroll;
window.confirm = vi.fn(() => false);
window.alert = vi.fn();
window.scroll = vi.fn();

const props = {
  message: {
    pub_id: "m_1k8sbyxp",
    value: "First message",
    parent_id: null,
    deleted: false,
    created: "about 2 weeks ago",
    updated: "about 2 weeks ago",
    user: content.currentUser,
  },
  chat: {
    pub_id: "c_f82cmzua",
    name: "First Chat",
    admin: content.currentUser,
    images: {},
  },
  replies: null,
  openImageInViewer: vi.fn(),
};

describe("Message", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.confirm = originalConfirm;
    window.alert = originalAlert;
    window.scroll = originalScroll;
  });

  test("should render link to user", () => {
    render(<Message {...props} />);

    const link = screen.getByRole("link", { name: /test-user/i });
    expect(link).toBeInTheDocument();
    expect(link.classList.value).toBe(styles.authorBadge);
    expect(link.href).toBe("http://localhost:3000/users/u_1oxd8ant");
  });

  test("should render message value", () => {
    render(<Message {...props} />);

    expect(screen.getByText(/first message/i)).toBeInTheDocument();
  });

  test("should copy message link", async () => {
    const user = userEvent.setup();
    render(<Message {...props} />);

    await user.click(screen.getByTitle(/copy message link/i));

    expect(window.alert).toHaveBeenCalledExactlyOnceWith(
      "Message link copied to clipboard",
    );

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(
      "http://localhost:3000/chats/c_f82cmzua?message=m_1k8sbyxp",
    );
  });

  describe("when message has replies", () => {
    beforeEach(() => {
      const replyProps = {
        ...props,
        replies: [
          {
            pub_id: "m_r5bysazi7",
            value: "First reply",
            parent_id: "m_1k8sbyxp",
            deleted: false,
            created: "about 2 days ago",
            updated: "about 2 days ago",
            user: content.currentUser,
          },
          {
            pub_id: "m_r5bysazi9",
            value: "Second reply",
            parent_id: "m_1k8sbyxp",
            deleted: false,
            created: "about 11 hours ago",
            updated: "about 11 hours ago",
            user: content.currentUser,
          },
        ],
      };
      render(<Message {...replyProps} />);
    });

    test("should render message replies", () => {
      expect(screen.getByText(/2 replies/i)).toBeInTheDocument();
      expect(screen.getByText(/first reply/i)).toBeInTheDocument();
      expect(screen.getByText(/second reply/i)).toBeInTheDocument();
    });
  });

  describe("when user is signed in", () => {
    test("should allow user to reply to message", async () => {
      const user = userEvent.setup();
      render(<Message {...props} />);

      await user.click(screen.getByTitle(/reply to message/i));

      expect(screen.getByLabelText(/add reply/i)).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /add reply/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
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
      render(<Message {...props} />);
    });

    test("should not render reply message button", () => {
      expect(screen.queryByTitle(/reply to message/i)).not.toBeInTheDocument();
    });
  });

  describe("when user is admin", () => {
    test("should render admin badge", () => {
      render(<Message {...props} />);

      const badge = screen.getByText(/admin/i);
      expect(badge).toBeInTheDocument();
      expect(badge.classList.value).toBe(styles.adminBadge);
    });
  });

  describe("when user is message author", () => {
    test("should allow user to delete message", async () => {
      const user = userEvent.setup();
      render(<Message {...props} />);

      await user.click(screen.getByTitle(/delete message/i));

      expect(window.confirm).toHaveBeenCalledExactlyOnceWith(
        "You are about to delete this message. Are you sure?",
      );
    });

    test("should allow user to edit message", async () => {
      const user = userEvent.setup();
      render(<Message {...props} />);

      await user.click(screen.getByTitle(/edit message/i));

      expect(screen.getByLabelText(/edit message/i)).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /edit message/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /update message/i }),
      ).toBeInTheDocument();
    });

    describe("when message is deleted", () => {
      beforeEach(() => {
        const propsDeletedMessage = {
          ...props,
          message: {
            ...props.message,
            value: "Message deleted by User",
            updated: "2 minutes ago",
            deleted: true,
          },
        };
        render(<Message {...propsDeletedMessage} />);
      });

      test("should not render delete message button", () => {
        expect(screen.queryByTitle(/delete message/i)).not.toBeInTheDocument();
      });

      test("should not render edit message button", () => {
        expect(screen.queryByTitle(/edit message/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("when message is deleted", () => {
    beforeEach(() => {
      const propsDeletedMessage = {
        ...props,
        message: {
          ...props.message,
          value: "Message deleted by User",
          updated: "2 minutes ago",
          deleted: true,
        },
      };
      render(<Message {...propsDeletedMessage} />);
    });

    test("should render deletion message", () => {
      expect(
        screen.getByText(/message deleted by user 2 minutes ago/i),
      ).toBeInTheDocument();
    });
  });

  describe("when message is a reply", () => {
    beforeEach(() => {
      const propsReply = {
        ...props,
        message: { ...props.message, parent_id: "m_2iyxpwjz" },
      };
      render(<Message {...propsReply} />);
    });

    test("should not render reply message button", () => {
      expect(screen.queryByTitle(/reply to message/i)).not.toBeInTheDocument();
    });
  });

  describe("when message query param is provided", () => {
    beforeEach(async () => {
      const superglue = await import("@thoughtbot/superglue");
      vi.spyOn(superglue, "useContent").mockReturnValueOnce({
        ...content,
        messageQuery: "m_1k8sbyxp",
      });
      render(<Message {...props} />);
    });

    test("should add queriedMessage class to message wrapper", () => {
      const message = document.getElementById("m_1k8sbyxp");
      expect(message.classList).toContain(styles.queriedMessage);
    });

    test("should scroll to message", async () => {
      const message = document.getElementById("m_1k8sbyxp");
      const originalGetBoundingClientRect = message.getBoundingClientRect;
      message.getBoundingClientRect = vi.fn(() => ({ top: 100, height: 40 }));

      await waitFor(() =>
        expect(window.scroll).toHaveBeenCalledExactlyOnceWith({
          top: 100 - 40,
          behavior: "smooth",
        }),
      );

      message.getBoundingClientRect = originalGetBoundingClientRect;
    });
  });

  describe("when parent query param is provided", () => {
    beforeEach(async () => {
      const superglue = await import("@thoughtbot/superglue");
      const parentProps = {
        ...props,
        message: { ...props.message, pub_id: "m_p5c9szywm" },
        replies: [
          {
            pub_id: "m_r5bysazi7",
            value: "First reply",
            parent_id: "m_1k8sbyxp",
            deleted: false,
            created: "about 2 days ago",
            updated: "about 2 days ago",
            user: content.currentUser,
          },
        ],
      };
      vi.spyOn(superglue, "useContent").mockReturnValueOnce({
        ...content,
        parentQuery: "m_p5c9szywm",
        messageQuery: "m_r5bysazi7",
      });
      render(<Message {...parentProps} />);
    });

    test("should open replies details", () => {
      const details = screen.getByTitle(/replies/i);
      expect(details.open).toBeTruthy();
    });
  });
});
