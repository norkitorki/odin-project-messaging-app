import React from "react";
import Header from "@components/Header";
import styles from "@stylesheets/Layout.module.css";
import { useSelector } from "react-redux";

export const Layout = ({ children }) => {
  const flash = useSelector((state) => state.flash);

  return (
    <div>
      <Header />
      <main className={styles.mainContent}>
        {flash.success && <p>{flash.success}</p>}
        {flash.notice && <p>{flash.notice}</p>}
        {flash.error && <p>{flash.error}</p>}
        {children}
      </main>
    </div>
  );
};
