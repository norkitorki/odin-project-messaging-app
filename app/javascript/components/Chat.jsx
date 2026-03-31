import React, { useState } from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Form, SubmitButton, TextArea } from "@javascript/components";
import {
  AccountCircle,
  ArrowRightBottom,
  Delete,
  Edit,
} from "@javascript/components/Icons";

const DeleteMessageForm = ({ messageId }) => {
  const { editMessageForm } = useContent();

  return (
    <Form
      {...editMessageForm.form}
      extras={editMessageForm.extras}
      className={styles.messageDeleteForm}
      data-sg-visit
    >
      <input type="hidden" name="message_id" value={messageId} />
      <input type="hidden" name="destroy" value={true} />
      <button
        type="submit"
        title="delete message"
        className={styles.messageDeleteButton}
      >
        <Delete />
      </button>
    </Form>
  );
};

const EditMessageForm = ({ messageId, message, setEditingMessage }) => {
  const { editMessageForm } = useContent();
  const reset = () => setEditingMessage(null);

  return (
    <>
      <Form
        {...editMessageForm.form}
        extras={editMessageForm.extras}
        onSubmit={reset}
        className={styles.messageEditForm}
        data-sg-visit
      >
        <input type="hidden" name="message_id" value={messageId} />
        <textarea defaultValue={message} name="message" />
        <button type="submit">Update Message</button>
      </Form>
      <button onClick={reset}>Cancel</button>
    </>
  );
};

export function Chat({ chat }) {
  const {
    currentUser,
    addMessageForm,
    joinChatForm,
    deleteChatForm,
    leaveChatForm,
  } = useContent();
  const [editingMessage, setEditingMessage] = useState();

  return (
    <>
      <div className={styles.chatContainer}>
        {!chat.private && (
          <Form
            {...joinChatForm.form}
            extras={joinChatForm.extras}
            data-sg-visit
          >
            <input type="hidden" name="chat_id" value={chat.pub_id} />
            <SubmitButton {...joinChatForm.inputs.submit} />
          </Form>
        )}
        {chat.admin_id === currentUser.pub_id && (
          <Form
            {...deleteChatForm.form}
            extras={deleteChatForm.extras}
            data-sg-visit
          >
            <input type="hidden" name="chat_id" value={chat.pub_id} />
            <SubmitButton {...deleteChatForm.inputs.submit} />
          </Form>
        )}
        Members: {chat.users.map((user) => user.username).join(", ")}
        <br />
        Private Chat: {String(chat.private)}
        <ol className={styles.messages}>
          {chat.messages.map((message) => (
            <li
              key={message.pub_id}
              className={message.deleted ? styles.deletedMessage : ""}
            >
              <div className={styles.authorDetails}>
                <div className={styles.authorImage}>
                  {message.user.image || <AccountCircle />}
                </div>
                <span className={styles.authorBadge}>
                  {message.user.username}
                </span>
                {chat.admin_id === message.user.pub_id && (
                  <span className={styles.adminBadge}>Admin</span>
                )}
                <span className={styles.messageCreationDate}>
                  {message.created}{" "}
                  {message.created !== message.updated &&
                    `(updated ${message.updated})`}
                </span>
                {!message.deleted &&
                  (message.user.pub_id === currentUser.pub_id ||
                    currentUser.pub_id === chat.admin_id) && (
                    <DeleteMessageForm messageId={message.pub_id} />
                  )}
                {!message.deleted &&
                  message.user.pub_id === currentUser.pub_id && (
                    <button
                      onClick={() =>
                        setEditingMessage(
                          editingMessage ? null : message.pub_id,
                        )
                      }
                      title="edit message"
                      className={styles.messageEditButton}
                    >
                      <Edit />
                    </button>
                  )}
              </div>

              {editingMessage === message.pub_id ? (
                <EditMessageForm
                  messageId={message.pub_id}
                  message={message.value}
                  setEditingMessage={setEditingMessage}
                />
              ) : (
                <p className={styles.message}>
                  <ArrowRightBottom />
                  <span>{message.value}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
      <Form
        {...addMessageForm.form}
        extras={addMessageForm.extras}
        data-sg-visit
      >
        <input type="hidden" name="chat_id" value={chat.pub_id} />
        <TextArea {...addMessageForm.inputs.message} />
        <SubmitButton {...addMessageForm.inputs.submit} />
      </Form>
      <Form />
      <Form {...leaveChatForm.form} extras={leaveChatForm.extras} data-sg-visit>
        <input type="hidden" name="chat_id" value={chat.pub_id} />
        <SubmitButton {...leaveChatForm.inputs.submit} />
      </Form>
    </>
  );
}
