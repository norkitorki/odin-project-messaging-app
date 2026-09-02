import React from "react";
import Sidebar from "@components/Sidebar";
import Flash from "@components/Flash";
import styles from "@stylesheets/Layout.module.css";
import { useContent } from "@thoughtbot/superglue";

export const Layout = ({ children }) => {
  const { currentUser } = useContent();
  const pathName = window.location.pathname;

  return (
    <div>
      <Sidebar />
      <Flash />
      <main className={styles.mainContent}>
        {!currentUser &&
          pathName !== "/signup" &&
          pathName !== "/signin" &&
          pathName !== "/" && (
            <p className={styles.accountWarning}>
              You need a user account to utilize the chat functionality of this
              application.Please{" "}
              <a href="/signin" data-sg-visit>
                sign in
              </a>{" "}
              or{" "}
              <a href="/signup" data-sg-visit>
                create
              </a>{" "}
              an account.
            </p>
          )}
        {children}
      </main>
    </div>
  );
};
