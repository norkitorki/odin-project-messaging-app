import React, { useEffect, useState } from "react";
import styles from "@stylesheets/Message.module.css";
import { useContent } from "@thoughtbot/superglue";
import { ArrowRightBottom, AccountCircle, Edit, Link, Reply } from "./Icons";
import {
  AddMessageForm,
  DeleteMessageForm,
  EditMessageForm,
} from "@javascript/components/Forms";

export default function Message({ message, chat, replies, openImageInViewer }) {
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

  useEffect(() => {
    const id = messageQuery || parentQuery;
    if (id === message.pub_id) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          window.scroll({ top: rect.top - rect.height, behavior: "smooth" });
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [messageQuery, parentQuery]);

  const editMessage = () => {
    setReplying(false);
    setEditingMessage(editingMessage ? null : message.pub_id);
  };
  const replyToMessage = () => {
    setEditingMessage(null);
    setReplying(!replying);
  };
  const copyMessageLink = async (messageId, parentId) => {
    const url = `${location.origin}/chats/${chat.pub_id}?message=${messageId}${parentId ? `&parent=${parentId}` : ""}`;
    await navigator.clipboard.writeText(url);
    alert("Message link copied to clipboard");
  };

  const messageDeleted = message.deleted;
  const isSubMessage = message.parent_id !== null;
  const userIsAuthor = message.user.pub_id === currentUser.pub_id;
  const userIsAdmin = chat.admin_id === currentUser.pub_id;

  return (
    <details
      id={message.pub_id}
      className={`${styles.messageContainer} ${message.pub_id === messageQuery ? styles.queriedMessage : ""}`}
      open={!messageDeleted}
    >
      <summary>
        <div className={styles.messageDetails}>
          <div className={styles.authorImage}>
            {message.user.image || <AccountCircle />}
          </div>
          <span className={styles.authorBadge}>{message.user.username}</span>
          {chat.admin.pub_id === message.user.pub_id && (
            <span className={styles.adminBadge}>Admin</span>
          )}
          <span
            className={`${styles.messageCreationDate} ${messageDeleted ? styles.deletedMessage : ""}`}
          >
            {messageDeleted ? (
              `${message.value} ${message.updated}`
            ) : (
              <>
                {message.created}
                {message.created !== message.updated &&
                  ` (updated ${message.updated})`}
              </>
            )}
          </span>
          {!messageDeleted && (userIsAuthor || userIsAdmin) && (
            <DeleteMessageForm
              form={deleteMessageForm}
              messageId={message.pub_id}
            />
          )}
          {!messageDeleted && userIsAuthor && (
            <button
              title="edit message"
              className={styles.messageEditButton}
              onClick={editMessage}
            >
              <Edit />
            </button>
          )}
          {!messageDeleted && !isSubMessage && (
            <button
              title="reply to message"
              className={styles.messageReplyButton}
              onClick={replyToMessage}
            >
              <Reply />
            </button>
          )}
          {!messageDeleted && (
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
        <EditMessageForm
          form={editMessageForm}
          message={message}
          imagePreviews={chat.images[message.pub_id]?.previews}
          setEditingMessage={setEditingMessage}
        />
      ) : (
        !messageDeleted && (
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
            {!isSubMessage && replying && (
              <AddMessageForm form={addMessageForm} parentId={message.pub_id} />
            )}
            {replies?.length > 0 && (
              <div className={styles.replies}>
                <details open={parentQuery === message.pub_id ? true : false}>
                  <summary>{replies.length} Replies</summary>
                  <ol>
                    {replies.map((message) => (
                      <li
                        id={message.pub_id}
                        key={message.pub_id}
                        className={messageDeleted ? styles.deletedMessage : ""}
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
        )
      )}
    </details>
  );
}
