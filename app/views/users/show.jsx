import React from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import {
  FriendRequestForm,
  RemoveContactForm,
} from "@javascript/components/Forms";
import Avatar from "@javascript/components/Avatar";

export default function UsersShow() {
  const {
    currentUser,
    user,
    chatCount,
    messageCount,
    userIsContact,
    friendRequestForm,
    removeContactForm,
  } = useContent();

  return (
    <Layout>
      <div className={styles.userContainer}>
        <h2>{user.username}</h2>
        {user.avatar && <Avatar avatar={user.avatar} width={150} />}
        {currentUser && (
          <div className={styles.userActions}>
            {userIsContact ? (
              <RemoveContactForm
                form={removeContactForm}
                userId={user.pub_id}
              />
            ) : (
              <FriendRequestForm
                form={friendRequestForm}
                userId={user.pub_id}
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.badgeContainer}>
        <div className={styles.badge}>{chatCount} Active Chats</div>
        <div className={styles.badge}>{messageCount} Messages posted</div>
        <div className={styles.badge}>
          Last Active {String(new Date(user.updated_at))}
        </div>
      </div>
    </Layout>
  );
}
