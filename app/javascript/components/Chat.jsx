import React, { useRef, useState } from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import ImageViewer, { openImageViewer } from "./ImageViewer";
import Message from "./Message";
import {
  AddMessageForm,
  ChatRequestForm,
  DeleteChatForm,
  JoinChatForm,
  LeaveChatForm,
} from "@javascript/components/Forms";
import Pagination from "./Pagination";

export function Chat({ chat }) {
  const {
    currentUser,
    userIsMember,
    messages,
    messageReplies,
    chatRequestForm,
    addMessageForm,
    joinChatForm,
    deleteChatForm,
    leaveChatForm,
    pages,
  } = useContent();
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

  return (
    <>
      <div className={styles.chatContainer}>
        {pages.count > 1 && <Pagination pages={pages} />}
        {chat.private && currentUser.pub_id === chat.admin.pub_id && (
          <>
            <button
              onClick={toggleInviteForm}
              className={
                invitingUser ? styles.closeFormButton : styles.inviteFormToggle
              }
            >
              {invitingUser ? "Close Form" : "Invite User"}
            </button>
            {invitingUser && <ChatRequestForm form={chatRequestForm} />}
          </>
        )}
        {!chat.private && !userIsMember && <JoinChatForm form={joinChatForm} />}
        {userIsMember && <LeaveChatForm form={leaveChatForm} />}
        {chat.admin_id === currentUser.pub_id && (
          <DeleteChatForm form={deleteChatForm} />
        )}
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
      </div>
      {userIsMember && <AddMessageForm form={addMessageForm} />}
      <ImageViewer ref={imageViewerRef} />
    </>
  );
}
