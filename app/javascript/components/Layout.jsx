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
        <div className={styles.flash}>
          {flash.success && (
            <p className={styles.flashSuccess}>{flash.success}</p>
          )}
          {flash.notice && <p className={styles.flashNotice}>{flash.notice}</p>}
          {flash.alert && <p className={styles.flashAlert}>{flash.alert}</p>}
        </div>
        {children}
      </main>
    </div>
  );
};
