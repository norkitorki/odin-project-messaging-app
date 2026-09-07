import React from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import {
  FriendRequestForm,
  RemoveContactForm,
} from "@javascript/components/Forms";
import Avatar from "@javascript/components/Avatar";
import Pagination from "@javascript/components/Pagination";

export default function UsersShow() {
  const {
    currentUser,
    user,
    chatCount,
    messageCount,
    pages,
    chats,
    messages,
    userIsContact,
    friendRequestForm,
    removeContactForm,
  } = useContent();

  return (
    <Layout>
      <div className={styles.userContainer}>
        <h2>{user.username}</h2>
        {user.avatar && <Avatar avatar={user.avatar} width={150} />}
        {currentUser && (
          <div className={styles.userActions}>
            {userIsContact ? (
              <RemoveContactForm
                form={removeContactForm}
                userId={user.pub_id}
              />
            ) : (
              user.pub_id !== currentUser.pub_id && (
                <FriendRequestForm
                  form={friendRequestForm}
                  userId={user.pub_id}
                />
              )
            )}
          </div>
        )}
      </div>
      <div className={styles.badgeContainer}>
        <div className={styles.badge}>{chatCount} Active Chats</div>
        <div className={styles.badge}>{messageCount} Messages posted</div>
        <div className={styles.badge}>
          Last Active {String(new Date(user.updated_at))}
        </div>
      </div>
      <div className={styles.userContent}>
        <div className={styles.chatList}>
          <h3>
            Chats{" "}
            <span className={styles.collectionCount}>
              ({pages.chats.total_count})
            </span>
          </h3>
          <div className={styles.contentPagination}>
            <Pagination pages={pages.chats} />
          </div>
          <ul>
            {chats.map((chat) => (
              <li key={chat.pub_id}>
                <a href={`/chats/${chat.pub_id}`} data-sg-visit>
                  {chat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.messagesContainer}>
          <h3>
            Messages{" "}
            <span className={styles.collectionCount}>
              ({pages.messages.total_count})
            </span>
          </h3>
          <div className={styles.contentPagination}>
            <Pagination pages={pages.messages} />
          </div>
          {messages.map((message) => (
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
    </Layout>
  );
}
