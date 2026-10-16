import React, { useRef, useState } from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import ImageViewer, { openImageViewer } from "@components/ImageViewer";
import Message from "@components/Message";
import Pagination from "@components/Pagination";
import Modal from "@components/Modal";
import {
  AddMessageForm,
  ChatRequestForm,
  DeleteChatForm,
  JoinChatForm,
  LeaveChatForm,
} from "@components/Forms";

export function Chat({ chat }) {
  const { currentUser, userIsMember, messages, forms } = useContent();
  const imageViewerRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);

  const openInviteForm = () => setModalStatus("invite");
  const openMessageForm = () => setModalStatus("add");
  const messageCallback = () => setModalStatus(false);
  const openImageInViewer = (event) => {
    const index = event.target.dataset.imageIndex;
    const messageId = event.target.parentElement.dataset.messageId;
    if (!index || !messageId) return;

    const images = chat.images[messageId].full;
    openImageViewer(imageViewerRef.current, images, Number(index));
  };

  return (
    <>
      {userIsMember && (
        <button className={styles.addMessageButton} onClick={openMessageForm}>
          Add Message
        </button>
      )}
      <div className={styles.chatContainer}>
        <div className={styles.chatInfo}>
          <h2>
            {chat.name}{" "}
            <p className={styles.badge}>
              <span>{chat.userCount}</span>{" "}
              <a href={`/chats/${chat.pub_id}/users`} data-sg-visit>
                users
              </a>
            </p>
            <p className={styles.badge}>
              <span>{messages.pages.totalCount}</span> messages
            </p>
          </h2>
          {currentUser && (
            <div className={styles.chatActions}>
              {chat.private &&
                currentUser.pub_id === chat.admin.pub_id &&
                modalStatus !== "invite" && (
                  <button
                    onClick={openInviteForm}
                    className={styles.inviteFormToggle}
                  >
                    Invite User
                  </button>
                )}
              {!chat.private && !userIsMember && forms.joinChatForm && (
                <JoinChatForm form={forms.joinChatForm} />
              )}
              {userIsMember &&
                (chat.admin.pub_id === currentUser.pub_id ? (
                  <DeleteChatForm form={forms.deleteChatForm} />
                ) : (
                  <LeaveChatForm form={forms.leaveChatForm} />
                ))}
            </div>
          )}
        </div>
        <div className={styles.pagination}>
          <Pagination pages={messages.pages} />
        </div>
        {messages.data.length > 0 && (
          <ol className={styles.messages}>
            {messages.data.map((message) => (
              <li key={message.pub_id}>
                <Message
                  message={message}
                  chat={chat}
                  replies={messages.replies[message.pub_id]}
                  openImageInViewer={openImageInViewer}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
      {modalStatus === "add" && (
        <Modal setterFunc={setModalStatus}>
          <AddMessageForm
            form={forms.addMessageForm}
            onSubmit={messageCallback}
          />
        </Modal>
      )}
      {modalStatus === "invite" && (
        <Modal setterFunc={setModalStatus}>
          <div className={styles.inviteForm}>
            <h3>Invite a User to your chat</h3>
            <ChatRequestForm form={forms.chatRequestForm} />
          </div>
        </Modal>
      )}
      <ImageViewer ref={imageViewerRef} />
    </>
  );
}
