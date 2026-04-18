import React, { useState } from "react";
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

const EditMessageForm = ({ message, setEditingMessage }) => {
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
        <input type="hidden" name="message_id" value={message.pub_id} />
        <textarea defaultValue={message.value} name="message" />
        <fieldset>
          <legend>Delete Images</legend>
          {message.images.previews.map((preview) => (
            <label key={preview.key}>
              <img src={preview.url} alt={preview.filename} />
              <input type="checkbox" name="images[]" value={preview.key} />
            </label>
          ))}
        </fieldset>
        <button type="submit">Update Message</button>
      </Form>
      <button onClick={cancelForm}>Cancel</button>
    </>
  );
};

export function Chat({ chat }) {
  const {
    currentUser,
    chatRequestForm,
    addMessageForm,
    joinChatForm,
    deleteChatForm,
    leaveChatForm,
  } = useContent();
  const [editingMessage, setEditingMessage] = useState();
  const [imageIndex, setImageIndex] = useState();

  const openImageInViewer = (event) => {
    const index = event.target.dataset.imageIndex;
    if (!index) return;

    setImageIndex(Number(index));
    openImageViewer(event.target);
  };

  return (
    <>
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
                  message={message}
                  setEditingMessage={setEditingMessage}
                />
              ) : (
                <>
                  <p className={styles.message}>
                    <ArrowRightBottom />
                    <span>{message.value}</span>
                  </p>
                  {message.images.previews.length > 0 && (
                    <div onClick={openImageInViewer}>
                      {message.images.previews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview.url}
                          alt={preview.filename}
                          data-image-index={index}
                        />
                      ))}
                      <ImageViewer
                        images={message.images.full}
                        defaultIndex={imageIndex}
                      />
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
    </>
  );
}
