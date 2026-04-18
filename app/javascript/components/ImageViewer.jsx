import React, { useEffect, useRef } from "react";
import styles from "@stylesheets/ImageViewer.module.css";
import { CloseButton, ArrowLeft, ArrowRight } from "./Icons";

export const openImageViewer = (target) => {
  const photoViewer = target.parentElement.querySelector(
    `.${styles.photoViewer}`,
  );
  photoViewer?.classList.add(styles.viewerOpen);
};

export default function ImageViewer({ images, defaultIndex }) {
  const photoViewer = useRef();
  const photoCounter = useRef();
  const imageDisplay = useRef();

  let index = defaultIndex || 0;

  useEffect(() => {
    updateImage(0);
    window.addEventListener("keydown", keyboardNavigation);
    return () => window.removeEventListener("keydown", keyboardNavigation);
  }, [defaultIndex]);

  const updateImage = (indexChange) => {
    index += indexChange;
    if (index < 0) index = images.length - 1;
    else if (index >= images.length) index = 0;

    imageDisplay.current.src = images[index];
    photoCounter.current.textContent = `${index + 1} / ${images.length}`;
  };

  const keyboardNavigation = (event) => {
    if (!photoViewer.current.classList.contains(styles.viewerOpen)) return;

    if (event.key === "ArrowLeft") previousPhoto();
    else if (event.key === "ArrowRight") nextPhoto();
    else if (event.key === "Escape") closeViewer();
  };

  const previousPhoto = () => updateImage(-1);
  const nextPhoto = () => updateImage(1);
  const closeViewer = () =>
    photoViewer.current.classList.remove(styles.viewerOpen);

  const onClick = (event) => {
    if (event.target !== photoViewer.current) return;

    if (event.clientX < innerWidth * 0.25) previousPhoto();
    else if (event.clientX >= innerWidth * 0.75) nextPhoto();
  };

  return (
    <div className={styles.photoViewer} ref={photoViewer} onClick={onClick}>
      <div className={styles.photoCounter} ref={photoCounter}></div>
      {images.length > 1 && (
        <>
          <button className={styles.leftArrow} onClick={previousPhoto}>
            <ArrowLeft />
          </button>
          <button className={styles.rightArrow} onClick={nextPhoto}>
            <ArrowRight />
          </button>
        </>
      )}

      <button className={styles.closeButton} onClick={closeViewer}>
        <CloseButton />
      </button>
      <div className={styles.photoFrame}>
        <img className={styles.imageDisplay} ref={imageDisplay} />
      </div>
    </div>
  );
}
