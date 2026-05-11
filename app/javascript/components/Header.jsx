import React from "react";
import styles from "@stylesheets/Header.module.css";
import { useContent } from "@thoughtbot/superglue";
import { AccountCircle } from "@components/Icons";
import { DeleteUserForm, SignOutForm } from "@javascript/components/Forms";

export default function Header() {
  const { currentUser, signOutForm, deleteUserForm } = useContent();
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
              <a href="/users" data-sg-visit>
                Users
              </a>
              <a href="/chats" data-sg-visit>
                Chats
              </a>
              <a href="/requests" data-sg-visit>
                Requests
              </a>
              <div>
                <p>Signed in as {currentUser.username} </p>
                <SignOutForm form={signOutForm} />
                <DeleteUserForm form={deleteUserForm} />
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
                <AccountCircle />
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}
