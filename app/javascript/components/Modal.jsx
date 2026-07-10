import React, { useEffect } from "react";
import styles from "@stylesheets/Modal.module.css";

export default function Popup({ children, setterFunc }) {
  const closeModal = () => setterFunc(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.code === "Escape") closeModal();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <button className={styles.closeModalButton} onClick={closeModal}>
          Close
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
