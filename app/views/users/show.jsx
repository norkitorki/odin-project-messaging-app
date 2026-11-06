import React, { useState } from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { FriendRequestForm, RemoveContactForm } from "@components/Forms";
import Avatar from "@components/Avatar";
import Pagination from "@components/Pagination";
import Modal from "@components/Modal";
import { AddPrivateMessageForm } from "@javascript/components/Forms";

export default function UsersShow() {
  const {
    currentUser,
    user,
    timestamps,
    chats,
    messages,
    userIsContact,
    forms,
  } = useContent();

  const [modalStatus, setModalStatus] = useState(false);

  const openMessageForm = () => setModalStatus("message");
  const closeModal = () => setModalStatus(false);

  return (
    <Layout>
      <div className={styles.userContainer}>
        <h2>{user.username}</h2>
        {user.avatar && <Avatar avatar={user.avatar} width={150} />}
        {currentUser && (
          <div className={styles.userActions}>
            {userIsContact ? (
              <>
                <RemoveContactForm
                  form={forms.removeContactForm}
                  userId={user.pub_id}
                />
                <button
                  className={styles.modalToggleInfo}
                  onClick={openMessageForm}
                >
                  Send Message
                </button>
              </>
            ) : (
              user.pub_id !== currentUser.pub_id && (
                <FriendRequestForm
                  form={forms.friendRequestForm}
                  userId={user.pub_id}
                />
              )
            )}
          </div>
        )}
      </div>
      <div className={styles.badgeContainer}>
        <div className={styles.badge}>
          Joined{" "}
          <span className={styles.highlighted}>{timestamps.created}</span>
        </div>
        <div className={styles.badge}>
          Last Activity{" "}
          <span className={styles.highlighted}>{timestamps.updated}</span>
        </div>
      </div>
      <div className={styles.userContent}>
        <div className={styles.chatList}>
          <h3>
            Chats{" "}
            <span className={styles.highlighted}>
              ({chats.pages.totalCount})
            </span>
          </h3>
          {chats.pages.totalCount > chats.pages.perPage && (
            <div className={styles.contentPagination}>
              <Pagination pages={chats.pages} />
            </div>
          )}
          <ul>
            {chats.data.map((chat) => (
              <li key={chat.pub_id}>
                <a
                  href={`/chats/${chat.pub_id}`}
                  className={styles.chat}
                  data-sg-visit
                >
                  {chat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>
            Messages{" "}
            <span className={styles.highlighted}>
              ({messages.pages.totalCount})
            </span>
          </h3>
          {messages.pages.totalCount > messages.pages.perPage && (
            <div className={styles.contentPagination}>
              <Pagination pages={messages.pages} />
            </div>
          )}
          {messages.data.map((message) => (
            <a
              key={message.pub_id}
              href={`/chats/${message.chat.pub_id}?message=${message.pub_id}`}
              className={styles.message}
              data-sg-visit
            >
              <div>
                <span className={styles.created}>
                  {message.created} in {message.chat.name}
                </span>
                <span>{message.value}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
      {modalStatus === "message" && (
        <Modal setterFunc={setModalStatus}>
          <div className={styles.privateMessageForm}>
            <h3>Send a private message to {user.username}</h3>
            <AddPrivateMessageForm
              form={forms.addMessageForm}
              onSubmit={closeModal}
            />
          </div>
        </Modal>
      )}
    </Layout>
  );
}
