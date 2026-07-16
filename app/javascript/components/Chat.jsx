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
} from "@javascript/components/Forms";

export function Chat({ chat }) {
  const { currentUser, userIsMember, messages, messageReplies, pages, forms } =
    useContent();
  const imageViewerRef = useRef();
  const [invitingUser, setInvitingUser] = useState(false);

  const toggleInviteForm = () => setInvitingUser(!invitingUser);
  const openImageInViewer = (event) => {
    const index = event.target.dataset.imageIndex;
    const messageId = event.target.parentElement.dataset.messageId;
    if (!index || !messageId) return;

    const images = chat.images[messageId].full;
    openImageViewer(imageViewerRef.current, images, Number(index));
  };
  const messageCallback = (event) => setTimeout(() => event.target.reset());

  return (
    <>
      <div className={styles.chatContainer}>
        <div className={styles.chatActions}>
          {chat.private &&
            currentUser.pub_id === chat.admin.pub_id &&
            !invitingUser && (
              <button
                onClick={toggleInviteForm}
                className={styles.inviteFormToggle}
              >
                Invite User
              </button>
            )}
          {!chat.private && !userIsMember && (
            <JoinChatForm form={forms.joinChatForm} />
          )}
          {userIsMember &&
            (chat.admin.pub_id === currentUser.pub_id ? (
              <DeleteChatForm form={forms.deleteChatForm} />
            ) : (
              <LeaveChatForm form={forms.leaveChatForm} />
            ))}
        </div>
        {pages.count > 1 && <Pagination pages={pages} />}
        {messages.length > 0 && (
          <ol className={styles.messages}>
            {messages.map((message) => (
              <li key={message.pub_id}>
                <Message
                  message={message}
                  chat={chat}
                  replies={messageReplies[message.pub_id]}
                  openImageInViewer={openImageInViewer}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
      {userIsMember && (
        <AddMessageForm
          form={forms.addMessageForm}
          onSubmit={messageCallback}
        />
      )}
      <ImageViewer ref={imageViewerRef} />
      {invitingUser && (
        <Modal setterFunc={setInvitingUser}>
          <div className={styles.inviteForm}>
            <h3>Invite a User to your chat</h3>
            <ChatRequestForm form={forms.chatRequestForm} />
          </div>
        </Modal>
      )}
    </>
  );
}
