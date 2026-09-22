import React from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { Lock } from "@javascript/components/Icons";
import Pagination from "@javascript/components/Pagination";

export default function ChatsIndex() {
  const { currentUser, chats } = useContent();

  return (
    <Layout>
      {currentUser && (
        <a href="/chats/new" className={styles.createChatLink} data-sg-visit>
          Create Chat
        </a>
      )}
      <div className={styles.pagination}>
        <Pagination pages={chats.pages} />
      </div>
      <ul className={styles.chatList}>
        {chats.data.map((chat) => (
          <li key={chat.pub_id}>
            <h2>
              {chat.name}{" "}
              <span className={styles.userCountBadge}>
                {chat.userCount} Users
              </span>{" "}
              {chat.private && <Lock />}
            </h2>
            <a
              href={`/chats/${chat.pub_id}`}
              className={styles.enterChatLink}
              title={`Ènter${chat.private ? " private" : ""} chat`}
              data-sg-visit
            >
              Enter
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
