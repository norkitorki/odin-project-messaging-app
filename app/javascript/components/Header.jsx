import React from "react";
import styles from "@stylesheets/Header.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Form, SubmitButton } from "@components/Inputs";
import { AccountCircle } from "@components/Icons";

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
              <a href="/users" data-sg-visit>
                Users
              </a>
              <a href="/chats" data-sg-visit>
                Chats
              </a>
              <div>
                <p>Signed in as {currentUser.username} </p>
                <Form {...signOutForm.form} extras={signOutForm.extras}>
                  <SubmitButton {...signOutForm.inputs.submit} />
                </Form>
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
