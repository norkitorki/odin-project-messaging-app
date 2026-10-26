import React from "react";
import styles from "@stylesheets/Sidebar.module.css";
import Avatar from "@components/Avatar";
import { useContent } from "@thoughtbot/superglue";
import { SignOutForm } from "@components/Forms";
import { Chat, Cog, Home } from "@components/Icons";

export default function Sidebar() {
  const { currentUser, contacts, requestCount, signOutForm } = useContent();
  const settingsTitle = `user settings${requestCount > 0 ? ` (${requestCount} pending requests)` : ""}`;

  return (
    <aside className={styles.sideBar}>
      <a href="/" title="home" data-sg-visit>
        <Home />
      </a>
      <a href="/chats" title="chats" data-sg-visit>
        <Chat />
      </a>
      {currentUser && (
        <>
          <hr width="100%" color="#089ac7" />
          <a
            href={`/users/${currentUser.pub_id}`}
            title={`${currentUser.username} user home`}
            data-sg-visit
          >
            <Avatar avatar={currentUser.avatar} width={30} />
          </a>
          <a
            href="/user/settings#requests"
            className={styles.userSettings}
            title={settingsTitle}
            data-sg-visit
          >
            {requestCount > 0 && (
              <div>{requestCount > 20 ? "20+" : requestCount}</div>
            )}
            <Cog title={settingsTitle} />
          </a>
          <SignOutForm form={signOutForm} />
          <hr width="100%" color="#089ac7" />
          <ul className={styles.contacts}>
            {contacts.map((contact) => (
              <li key={contact.pub_id}>
                <a
                  href={`/users/${contact.pub_id}`}
                  title={contact.username}
                  data-sg-visit
                >
                  <Avatar avatar={contact.avatar} width={30} />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
