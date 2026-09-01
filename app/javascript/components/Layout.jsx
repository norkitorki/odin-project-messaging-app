import React from "react";
import Sidebar from "@components/Sidebar";
import Flash from "@components/Flash";
import styles from "@stylesheets/Layout.module.css";

export const Layout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <Flash />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};
