import React, { useEffect, useRef } from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import {
  Form,
  SubmitButton,
  TextArea,
  TextField,
} from "@javascript/components";
import ImageViewer, { openImageViewer } from "./ImageViewer";
import Message from "./Message";

export function Chat({ chat }) {
  const {
    currentUser,
    messages,
    chatRequestForm,
    addMessageForm,
    joinChatForm,
    deleteChatForm,
    leaveChatForm,
    pages,
    messageQuery,
  } = useContent();
  const imageViewerRef = useRef();

  console.log("Chat rendered");

  useEffect(() => {
    if (messageQuery) {
      const timeoutId = setTimeout(() =>
        document.getElementById(messageQuery)?.scrollIntoView(),
      );
      return () => clearTimeout(timeoutId);
    }
  }, [messageQuery]);

  const openImageInViewer = (event) => {
    const index = event.target.dataset.imageIndex;
    const messageId = event.target.parentElement.dataset.messageId;
    if (!index || !messageId) return;

    const images = chat.images[messageId].full;
    openImageViewer(imageViewerRef.current, images, Number(index));
  };

  return (
    <>
      <p>
        <a href={pages.paths[0]} data-sg-visit>
          First
        </a>
        {pages.paths.map((path, index) => (
          <a
            key={index}
            href={path}
            style={{ color: index + 1 === pages.current ? "green" : "" }}
            data-sg-visit
          >
            {index + 1}
          </a>
        ))}
        <a href={pages.paths[pages.count - 1]} data-sg-visit>
          Last
        </a>
      </p>
      <div className={styles.chatContainer}>
        {chat.private && currentUser.pub_id === chat.admin.pub_id && (
          <Form
            {...chatRequestForm.form}
            extras={chatRequestForm.extras}
            data-sg-visit
          >
            <input {...chatRequestForm.inputs.chatId} />
            <input {...chatRequestForm.inputs.requestType} />
            <TextField {...chatRequestForm.inputs.receiver} label="Username" />
            <SubmitButton {...chatRequestForm.inputs.submit} />
          </Form>
        )}
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
        Private: {String(chat.private)}
        <ol className={styles.messages}>
          {messages.map((message) => (
            <li
              id={message.pub_id}
              key={message.pub_id}
              className={`${message.deleted ? styles.deletedMessage : ""} ${messageQuery === message.pub_id ? styles.queriedMessage : ""}`}
            >
              <Message
                message={message}
                chat={chat}
                openImageInViewer={openImageInViewer}
              />
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
        <input type="file" {...addMessageForm.inputs.images} />
        <SubmitButton {...addMessageForm.inputs.submit} />
      </Form>
      <Form {...leaveChatForm.form} extras={leaveChatForm.extras} data-sg-visit>
        <input type="hidden" name="chat_id" value={chat.pub_id} />
        <SubmitButton {...leaveChatForm.inputs.submit} />
      </Form>
      <ImageViewer ref={imageViewerRef} />
    </>
  );
}
