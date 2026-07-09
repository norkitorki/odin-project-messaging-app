import React from "react";
import Header from "@components/Header";
import Flash from "@components/Flash";
import styles from "@stylesheets/Layout.module.css";

export const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Flash />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};
