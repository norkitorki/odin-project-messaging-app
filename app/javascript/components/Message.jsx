import React, { useState } from "react";
import styles from "@stylesheets/Message.module.css";
import { ArrowRightBottom, AccountCircle, Delete, Edit, Link } from "./Icons";
import { useContent } from "@thoughtbot/superglue";
import { Form } from "@javascript/components";

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

export default function Message({ message, chat, openImageInViewer }) {
  const { currentUser } = useContent();
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
              <DeleteMessageForm messageId={message.pub_id} />
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
        <EditMessageForm
          message={message}
          imagePreviews={chat.images[message.pub_id]?.previews}
          setEditingMessage={setEditingMessage}
        />
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
