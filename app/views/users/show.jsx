import React from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import {
  FriendRequestForm,
  RemoveContactForm,
} from "@javascript/components/Forms";

export default function UsersShow() {
  const {
    user,
    chatCount,
    messageCount,
    userIsContact,
    friendRequestForm,
    removeContactForm,
  } = useContent();

  return (
    <Layout>
      <div>{user.username}</div>
      <div className={styles.badgeContainer}>
        <div className={styles.badge}>{chatCount} Active Chats</div>
        <div className={styles.badge}>{messageCount} Messages posted</div>
        <div className={styles.badge}>
          Last Active {String(new Date(user.updated_at))}
        </div>
      </div>
      <FriendRequestForm form={friendRequestForm} userId={user.pub_id} />
      {userIsContact && (
        <RemoveContactForm form={removeContactForm} userId={user.pub_id} />
      )}
    </Layout>
  );
}
