import React, { useEffect, useState } from "react";
import styles from "@stylesheets/User.module.css";
import { Layout } from "@javascript/components";
import {
  AvatarForm,
  DeleteAvatarForm,
  DeleteUserForm,
  EditPasswordForm,
} from "@javascript/components/Forms";
import { useContent } from "@thoughtbot/superglue";
import Avatar from "@javascript/components/Avatar";
import Modal from "@javascript/components/Modal";

const ChatList = ({ chats }) => (
  <ul>
    {chats.map((chat) => (
      <li key={chat.pub_id}>
        <a href={`/chats/${chat.pub_id}`} data-sg-visit>
          {chat.name}
        </a>
      </li>
    ))}
  </ul>
);

export default function UsersEdit() {
  const { user, chats, privateChats, updated, forms } = useContent();
  const [modalStatus, setModalStatus] = useState(false);

  useEffect(() => {
    updated && setModalStatus(false);
  }, [updated]);

  const userAvatar = user.avatar;
  const openAvatarForm = () => setModalStatus("avatar");
  const openPasswordForm = () => setModalStatus("password");

  return (
    <Layout>
      <div className={styles.userContainer}>
        <h2>{user.username} Settings</h2>
        {userAvatar && <Avatar avatar={userAvatar} width={150} />}
        <div className={styles.userActions}>
          <button className={styles.avatarFormButton} onClick={openAvatarForm}>
            {userAvatar ? "Update" : "Upload"} Avatar
          </button>
          <button
            className={styles.passwordFormButton}
            onClick={openPasswordForm}
          >
            Update Password
          </button>
          {userAvatar && <DeleteAvatarForm form={forms.deleteAvatarForm} />}
          <DeleteUserForm form={forms.deleteUserForm} />
        </div>
      </div>
      <div className={styles.badgeContainer}>
        <div className={`${styles.userBadge} ${styles.chatList}`}>
          <h3>
            Public Chats{" "}
            <span className={styles.chatCount}>({chats.length})</span>
          </h3>
          <ChatList chats={chats} />
        </div>
        <div className={`${styles.userBadge} ${styles.chatList}`}>
          <h3>
            Private Chats{" "}
            <span className={styles.chatCount}>({chats.length})</span>
          </h3>
          <ChatList chats={privateChats} />
        </div>
      </div>
      {modalStatus && (
        <Modal setterFunc={setModalStatus}>
          {modalStatus === "avatar" && (
            <div className={styles.avatarForm}>
              {userAvatar && <Avatar avatar={userAvatar} width={150} />}
              <AvatarForm form={forms.avatarForm} />
            </div>
          )}
          {modalStatus === "password" && (
            <EditPasswordForm form={forms.editPasswordForm} />
          )}
        </Modal>
      )}
    </Layout>
  );
}
