import React from "react";
import styles from "@stylesheets/User.module.css";
import { Layout } from "@javascript/components";
import { DeleteUserForm, EditPasswordForm } from "@javascript/components/Forms";
import { useContent } from "@thoughtbot/superglue";

export default function UsersEdit() {
  const { forms, chats } = useContent();

  return (
    <Layout>
      <h2>User Settings</h2>
      <div className={styles.badgeContainer}>
        <div className={styles.userBadge}>
          <h3>Change Password</h3>
          <EditPasswordForm form={forms.editPasswordForm} />
        </div>
        <div className={`${styles.userBadge} ${styles.chatList}`}>
          <h3>Chats ({chats.length})</h3>
          <ul>
            {chats.map((chat) => (
              <li key={chat.pub_id}>
                <a href={`/chats/${chat.pub_id}`} data-sg-visit>
                  {chat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <DeleteUserForm form={forms.deleteUserForm} />
      </div>
    </Layout>
  );
}
