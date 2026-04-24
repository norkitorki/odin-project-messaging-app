import React, { useEffect, useRef } from "react";
import styles from "@stylesheets/ImageViewer.module.css";
import { CloseButton, ArrowLeft, ArrowRight } from "./Icons";

let images = [];
let index = 0;

export const openImageViewer = (photoViewer, messageImages, imageIndex) => {
  if (photoViewer) {
    const imageDisplay = photoViewer.querySelector(`.${styles.imageDisplay}`);
    const photoCounter = photoViewer.querySelector(`.${styles.photoCounter}`);

    images = messageImages;
    index = imageIndex;
    imageDisplay.src = images[index];
    photoCounter.textContent = `${index + 1} / ${images.length}`;
    photoViewer.classList.add(styles.viewerOpen);
  }
};

export default function ImageViewer({ ref }) {
  const photoCounter = useRef();
  const imageDisplay = useRef();

  useEffect(() => {
    window.addEventListener("keydown", keyboardNavigation);
    return () => window.removeEventListener("keydown", keyboardNavigation);
  }, []);

  const updateImage = (indexChange) => {
    if (images.length <= 1) return;

    index += indexChange;
    if (index < 0) index = images.length - 1;
    else if (index >= images.length) index = 0;

    imageDisplay.current.src = images[index];
    photoCounter.current.textContent = `${index + 1} / ${images.length}`;
  };

  const keyboardNavigation = (event) => {
    if (!ref.current.classList.contains(styles.viewerOpen)) return;

    if (event.key === "ArrowLeft") previousPhoto();
    else if (event.key === "ArrowRight") nextPhoto();
    else if (event.key === "Escape") closeViewer();
  };

  const previousPhoto = () => updateImage(-1);
  const nextPhoto = () => updateImage(1);
  const closeViewer = () => ref.current.classList.remove(styles.viewerOpen);

  const onClick = (event) => {
    if (event.target !== ref.current) return;

    if (event.clientX < innerWidth * 0.25) previousPhoto();
    else if (event.clientX >= innerWidth * 0.75) nextPhoto();
  };

  return (
    <div className={styles.photoViewer} ref={ref} onClick={onClick}>
      <div className={styles.photoCounter} ref={photoCounter}></div>
      <button className={styles.leftArrow} onClick={previousPhoto}>
        <ArrowLeft />
      </button>
      <button className={styles.rightArrow} onClick={nextPhoto}>
        <ArrowRight />
      </button>
      <button className={styles.closeButton} onClick={closeViewer}>
        <CloseButton />
      </button>
      <div className={styles.photoFrame}>
        <img className={styles.imageDisplay} ref={imageDisplay} />
      </div>
    </div>
  );
}
