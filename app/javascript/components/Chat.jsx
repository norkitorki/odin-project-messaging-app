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

const Pagination = ({ pages }) => (
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
);

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
  } = useContent();
  const imageViewerRef = useRef();

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
        <Pagination pages={pages} />
        {chat.private && currentUser.pub_id === chat.admin.pub_id && (
          <ChatRequestForm form={chatRequestForm} />
        )}
        {!chat.private && <JoinChatForm form={joinChatForm} />}
        {chat.admin_id === currentUser.pub_id && (
          <DeleteChatForm form={deleteChatForm} />
        )}
        Private: {String(chat.private)}
        <ol className={styles.messages}>
          {messages.map((message) => (
            <li id={message.pub_id} key={message.pub_id}>
              <Message
                message={message}
                chat={chat}
                openImageInViewer={openImageInViewer}
              />
            </li>
          ))}
        </ol>
      </div>
      <AddMessageForm form={addMessageForm} />
      <LeaveChatForm form={leaveChatForm} />
      <ImageViewer ref={imageViewerRef} />
    </>
  );
}
