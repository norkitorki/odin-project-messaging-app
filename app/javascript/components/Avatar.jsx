import React from "react";
import styles from "@stylesheets/User.module.css";
import { AccountCircle } from "@components/Icons";

export default function Avatar({ avatar, width = 45 }) {
  return (
    <div className={styles.avatar}>
      {avatar ? (
        <img
          width={width}
          height={width}
          src={avatar.url}
          alt={avatar.filename}
        />
      ) : (
        <AccountCircle width={width} />
      )}
    </div>
  );
}
