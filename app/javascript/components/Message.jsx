import React, { useEffect, useState } from "react";
import styles from "@stylesheets/Message.module.css";
import { useContent } from "@thoughtbot/superglue";
import { ArrowRightBottom, AccountCircle, Edit, Link, Reply } from "./Icons";
import {
  AddMessageForm,
  DeleteMessageForm,
  EditMessageForm,
} from "@javascript/components/Forms";

export default function Message({ message, chat, openImageInViewer }) {
  const {
    currentUser,
    deleteMessageForm,
    editMessageForm,
    addMessageForm,
    messageQuery,
    parentQuery,
  } = useContent();
  const [editingMessage, setEditingMessage] = useState();
  const [replying, setReplying] = useState(false);
  const replies = message.replies;

  useEffect(() => {
    const id = messageQuery || parentQuery;
    if (id) {
      const timeoutId = setTimeout(() =>
        document.getElementById(id)?.scrollIntoView(),
      );
      return () => clearTimeout(timeoutId);
    }
  }, [messageQuery, parentQuery]);

  const editMessage = () =>
    setEditingMessage(editingMessage ? null : message.pub_id);
  const replyToMessage = () => setReplying(!replying);
  const copyMessageLink = async (messageId, parentId) => {
    const url = `${location.origin}/chats/${chat.pub_id}?message=${messageId}&parent=${parentId}`;
    await navigator.clipboard.writeText(url);
    alert("Message link copied to clipboard");
  };

  return (
    <details
      className={`${styles.messageContainer} ${message.pub_id === messageQuery ? styles.queriedMessage : ""}`}
      open
    >
      <summary>
        <div className={styles.messageDetails}>
          <div className={styles.authorImage}>
            {message.user.image || <AccountCircle />}
          </div>
          <span className={styles.authorBadge}>{message.user.username}</span>
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
              <DeleteMessageForm
                form={deleteMessageForm}
                messageId={message.pub_id}
                styles={styles}
              />
            )}
          {!message.deleted && message.user.pub_id === currentUser.pub_id && (
            <button
              title="edit message"
              className={styles.messageEditButton}
              onClick={editMessage}
            >
              <Edit />
            </button>
          )}
          {!message.deleted && !message.parent_id && (
            <button
              title="reply to message"
              className={styles.messageReplyButton}
              onClick={replyToMessage}
            >
              <Reply />
            </button>
          )}
          {!message.deleted && (
            <button
              title="copy message link"
              className={styles.messageLinkButton}
              onClick={() => copyMessageLink(message.pub_id, message.parent_id)}
            >
              <Link />
            </button>
          )}
        </div>
      </summary>

      {editingMessage === message.pub_id ? (
        <>
          <EditMessageForm
            form={editMessageForm}
            message={message}
            imagePreviews={chat.images[message.pub_id]?.previews}
            styles={styles}
            setEditingMessage={setEditingMessage}
          />
        </>
      ) : (
        <>
          <div className={styles.message}>
            <ArrowRightBottom />
            <p>
              {message.value}
              {chat.images[message.pub_id] && (
                <span
                  onClick={openImageInViewer}
                  data-message-id={message.pub_id}
                  className={styles.messageImages}
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
                </span>
              )}
            </p>
            {!message.parent_id && replying && (
              <>
                <AddMessageForm
                  form={addMessageForm}
                  parentId={message.pub_id}
                />
                <button onClick={replyToMessage}>Hide Form</button>
              </>
            )}
            {replies.length > 0 && (
              <div className={styles.replies}>
                <details open={parentQuery === message.pub_id ? true : false}>
                  <summary>{replies.length} Replies</summary>
                  <ol>
                    {message.replies.map((message) => (
                      <li
                        id={message.pub_id}
                        key={message.pub_id}
                        className={message.deleted ? styles.deletedMessage : ""}
                      >
                        <Message
                          message={message}
                          chat={chat}
                          openImageInViewer={openImageInViewer}
                        />
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
            )}
          </div>
        </>
      )}
    </details>
  );
}
