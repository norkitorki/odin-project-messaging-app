import React from "react";
import styles from "@stylesheets/Header.module.css";
import Avatar from "./Avatar";
import { useContent } from "@thoughtbot/superglue";
import { SignOutForm } from "@javascript/components/Forms";
import { Cog } from "./Icons";

export default function Header() {
  const { currentUser, signOutForm } = useContent();
  const contacts = currentUser?.contacts || [];

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.heading}>
          <a href="/" data-sg-visit>
            Messaging App
          </a>
        </h1>
        <nav>
          {currentUser ? (
            <>
              <a href="/chats" data-sg-visit>
                Chats
              </a>
              <a href="/requests" data-sg-visit>
                Requests
              </a>
              <div className={styles.userDetails}>
                <p>Welcome back {currentUser.username}</p>
                <a href="/user/settings" data-sg-visit>
                  <Cog />
                </a>
                <SignOutForm form={signOutForm} />
              </div>
            </>
          ) : (
            <p>Not signed in</p>
          )}
        </nav>
        <div className={styles.sideBar}>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.pub_id}>
                <a href={`/users/${contact.pub_id}`} data-sg-visit>
                  <Avatar avatar={contact.avatar} width={30} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}
