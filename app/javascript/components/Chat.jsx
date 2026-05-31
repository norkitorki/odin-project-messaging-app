import React, { useRef } from "react";
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

  const openImageInViewer = (event) => {
    const index = event.target.dataset.imageIndex;
    const messageId = event.target.parentElement.dataset.messageId;
    if (!index || !messageId) return;

    const images = chat.images[messageId].full;
    openImageViewer(imageViewerRef.current, images, Number(index));
  };

  const userIsMember = chat.users.some(
    (user) => user.pub_id === currentUser.pub_id,
  );

  return (
    <>
      <div className={styles.chatContainer}>
        {pages.count > 1 && <Pagination pages={pages} />}
        {chat.private && currentUser.pub_id === chat.admin.pub_id && (
          <ChatRequestForm form={chatRequestForm} />
        )}
        {!chat.private && userIsMember && <JoinChatForm form={joinChatForm} />}
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
