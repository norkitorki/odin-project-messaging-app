import React, { useEffect, useRef, useState } from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import {
  Form,
  SubmitButton,
  TextArea,
  TextField,
} from "@javascript/components";
import {
  AccountCircle,
  ArrowRightBottom,
  Delete,
  Edit,
  Link,
} from "@javascript/components/Icons";
import ImageViewer, { openImageViewer } from "./ImageViewer";

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

const EditMessageForm = ({ message, imagePreviews, setEditingMessage }) => {
  const { editMessageForm } = useContent();
  const cancelForm = () => setEditingMessage(null);

  return (
    <>
      <Form
        {...editMessageForm.form}
        extras={editMessageForm.extras}
        onSubmit={cancelForm}
        className={styles.messageEditForm}
        data-sg-visit
      >
        <input {...editMessageForm.inputs.messageId} value={message.pub_id} />
        <textarea
          {...editMessageForm.inputs.message}
          defaultValue={message.value}
        />
        {imagePreviews?.length > 0 && (
          <fieldset>
            <legend>Delete Images</legend>
            {imagePreviews.map((preview) => (
              <label key={preview.key}>
                <img src={preview.url} alt={preview.filename} />
                <input {...editMessageForm.inputs.images} value={preview.key} />
              </label>
            ))}
          </fieldset>
        )}
        <button type="submit">Update Message</button>
      </Form>
      <button onClick={cancelForm}>Cancel</button>
    </>
  );
};

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
  const [editingMessage, setEditingMessage] = useState();
  const photoViewerRef = useRef();

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
    openImageViewer(photoViewerRef.current, images, Number(index));
  };

  const copyMessageLink = async (messageId) => {
    const url = `${location.origin}/chats/${chat.pub_id}?message=${messageId}`;
    await navigator.clipboard.writeText(url);
    alert("Message link copied to clipboard");
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
              <div className={styles.messageDetails}>
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
                {!message.deleted && (
                  <button
                    title="copy message link"
                    className={styles.messageLinkButton}
                    onClick={() => copyMessageLink(message.pub_id)}
                  >
                    <Link />
                  </button>
                )}
              </div>

              {editingMessage === message.pub_id ? (
                <EditMessageForm
                  message={message}
                  imagePreviews={chat.images[message.pub_id]?.previews}
                  setEditingMessage={setEditingMessage}
                />
              ) : (
                <>
                  <p className={styles.message}>
                    <ArrowRightBottom />
                    <span>{message.value}</span>
                  </p>
                  {chat.images[message.pub_id] && (
                    <div
                      onClick={openImageInViewer}
                      data-message-id={message.pub_id}
                    >
                      {chat.images[message.pub_id].previews.map(
                        (preview, index) => (
                          <img
                            key={index}
                            src={preview.url}
                            alt={preview.filename}
                            data-image-index={index}
                          />
                        ),
                      )}
                    </div>
                  )}
                </>
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
        <input type="file" {...addMessageForm.inputs.images} />
        <SubmitButton {...addMessageForm.inputs.submit} />
      </Form>
      <Form {...leaveChatForm.form} extras={leaveChatForm.extras} data-sg-visit>
        <input type="hidden" name="chat_id" value={chat.pub_id} />
        <SubmitButton {...leaveChatForm.inputs.submit} />
      </Form>
      <ImageViewer ref={photoViewerRef} />
    </>
  );
}
