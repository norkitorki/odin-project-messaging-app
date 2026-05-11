import React, { useState } from "react";
import styles from "@stylesheets/Message.module.css";
import { useContent } from "@thoughtbot/superglue";
import { ArrowRightBottom, AccountCircle, Edit, Link } from "./Icons";
import {
  DeleteMessageForm,
  EditMessageForm,
} from "@javascript/components/Forms";

export default function Message({ message, chat, openImageInViewer }) {
  const { currentUser, deleteMessageForm, editMessageForm } = useContent();
  const [editingMessage, setEditingMessage] = useState();
  const replies = message.replies;

  const copyMessageLink = async (messageId) => {
    const url = `${location.origin}/chats/${chat.pub_id}?message=${messageId}`;
    await navigator.clipboard.writeText(url);
    alert("Message link copied to clipboard");
  };

  return (
    <details className={styles.messageContainer} open>
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
              onClick={() =>
                setEditingMessage(editingMessage ? null : message.pub_id)
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
            {replies.length > 0 && (
              <div className={styles.replies}>
                <details>
                  <summary>{replies.length} Replies</summary>
                  <ol className={styles.replies}>
                    {message.replies.map((message) => (
                      <li
                        id={message.pub_id}
                        key={message.pub_id}
                        className={`${message.deleted ? styles.deletedMessage : ""}`}
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
