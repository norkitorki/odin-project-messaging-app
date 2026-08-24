import React from "react";
import styles from "@stylesheets/Chat.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { Lock } from "@javascript/components/Icons";
import Pagination from "@javascript/components/Pagination";

export default function ChatsIndex() {
  const { chats, pages } = useContent();

  return (
    <Layout>
      <a href="/chats/new" className={styles.createChatLink} data-sg-visit>
        Create Chat
      </a>
      <div className={styles.pagination}>
        <Pagination pages={pages} />
      </div>
      <ul className={styles.chatList}>
        {chats.map((chat) => (
          <li key={chat.pub_id}>
            <h2>
              {chat.name}{" "}
              <span className={styles.userCountBadge}>
                {chat.users.length} Users
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
