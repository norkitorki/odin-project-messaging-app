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
  const { deleteMessageForm } = useContent();

  return (
    <Form
      {...deleteMessageForm.form}
      extras={deleteMessageForm.extras}
      className={styles.messageDeleteForm}
      data-sg-visit
    >
      <input type="hidden" name="message_id" value={messageId} />
      <button type="submit" title="delete message">
        <Delete />
      </button>
    </Form>
  );
};

const EditMessageForm = ({ messageId, message, setEditingMessage }) => {
  const { editMessageForm } = useContent();
  const onSubmit = () => setEditingMessage(null);

  return (
    <Form
      {...editMessageForm.form}
      extras={editMessageForm.extras}
      onSubmit={onSubmit}
      data-sg-visit
    >
      <input type="hidden" name="message_id" value={messageId} />
      <textarea defaultValue={message} name="message" />
      <button type="submit">Update Message</button>
    </Form>
  );
};

export function Chat({ chat }) {
  const { currentUser, addMessageForm, leaveChatForm } = useContent();
  const [editingMessage, setEditingMessage] = useState();

  return (
    <>
      <div className={styles.chatContainer}>
        Members: {chat.users.map((user) => user.username).join(", ")}
        <ol className={styles.messages}>
          {chat.messages.map((message) => (
            <li key={message.pub_id}>
              <div className={styles.authorImage}>
                {message.user.image || <AccountCircle />}
              </div>
              <span className={styles.messageAuthor}>
                {message.user.username}
              </span>
              <span className={styles.messageCreationDate}>
                {message.created}
              </span>
              {message.user.pub_id === currentUser.pub_id && (
                <>
                  <DeleteMessageForm messageId={message.pub_id} />
                  <button
                    onClick={() =>
                      setEditingMessage(editingMessage ? null : message.pub_id)
                    }
                    title="edit message"
                    className={styles.messageEditButton}
                  >
                    <Edit />
                  </button>
                </>
              )}
              <span className={styles.messageValue}>
                <ArrowRightBottom />
                {editingMessage === message.pub_id ? (
                  <EditMessageForm
                    messageId={message.pub_id}
                    message={message.value}
                    setEditingMessage={setEditingMessage}
                  />
                ) : (
                  message.value
                )}
              </span>
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
