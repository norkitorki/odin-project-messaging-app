import React, { useEffect, useRef } from "react";
import styles from "@stylesheets/Layout.module.css";
import { useSelector } from "react-redux";

export default function Flash() {
  const flash = useSelector((state) => state.flash);
  const flashRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (Object.keys(flash).length > 0) {
      flashRef.current.classList.remove(styles.flashHidden);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => flashRef.current?.classList.add(styles.flashHidden),
        5000,
      );
      return () => clearTimeout(timeoutRef.current);
    }
  }, [flash]);

  return (
    <div className={styles.flash} ref={flashRef}>
      {flash.success && <p className={styles.flashSuccess}>{flash.success}</p>}
      {flash.notice && <p className={styles.flashNotice}>{flash.notice}</p>}
      {flash.alert && <p className={styles.flashAlert}>{flash.alert}</p>}
    </div>
  );
}
