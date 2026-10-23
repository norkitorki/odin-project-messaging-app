import React, { useEffect } from "react";
import styles from "@stylesheets/Modal.module.css";
import { CloseButton } from "@components/Icons";

export default function Modal({ children, setterFunc }) {
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
          <CloseButton title={"close modal"} />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
