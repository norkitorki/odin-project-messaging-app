import React from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Form, SubmitButton, TextArea } from "@javascript/components";
import {
  AccountCircle,
  ArrowRightBottom,
  Delete,
} from "@javascript/components/Icons";

export function Chat({ chat }) {
  const { currentUser, addMessageForm, removeMessageForm, leaveChatForm } =
    useContent();

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
                {message.created_at}
              </span>
              {message.user.pub_id === currentUser.pub_id && (
                <Form
                  {...removeMessageForm.form}
                  extras={removeMessageForm.extras}
                  className={styles.messageDeleteForm}
                  data-sg-visit
                >
                  <input
                    type="hidden"
                    name="message_id"
                    value={message.pub_id}
                  />
                  <button type="submit" title="delete message">
                    <Delete />
                  </button>
                </Form>
              )}
              <span className={styles.messageValue}>
                <ArrowRightBottom />
                {message.value}
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
