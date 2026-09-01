import React from "react";
import styles from "@stylesheets/Sidebar.module.css";
import Avatar from "./Avatar";
import { useContent } from "@thoughtbot/superglue";
import { SignOutForm } from "@javascript/components/Forms";
import { Chat, Cog, Home } from "./Icons";

export default function Header() {
  const { currentUser, signOutForm } = useContent();
  const contacts = currentUser?.contacts || [];

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
          <a href="/user/settings" data-sg-visit>
            <Cog />
          </a>
          <SignOutForm form={signOutForm} />
          <ul>
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
