import React, { useEffect, useState } from "react";
import styles from "@stylesheets/User.module.css";
import { Layout } from "@components";
import {
  AvatarForm,
  DeleteAvatarForm,
  DeletePrivateMessageForm,
  DeleteUserForm,
  EditPasswordForm,
} from "@components/Forms";
import { useContent } from "@thoughtbot/superglue";
import Pagination from "@components/Pagination";
import Avatar from "@components/Avatar";
import Modal from "@components/Modal";

const ChatList = ({ chats }) => (
  <ul>
    {chats.map((chat) => (
      <li key={chat.pub_id}>
        <a href={`/chats/${chat.pub_id}`} className={styles.chat} data-sg-visit>
          {chat.name}
        </a>
      </li>
    ))}
  </ul>
);

export default function UsersEdit() {
  const { user, updated, chats, requests, messages, forms } = useContent();
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
          <button className={styles.modalToggleInfo} onClick={openAvatarForm}>
            {userAvatar ? "Update" : "Upload"} Avatar
          </button>
          <button className={styles.modalToggleInfo} onClick={openPasswordForm}>
            Update Password
          </button>
          {userAvatar && <DeleteAvatarForm form={forms.deleteAvatarForm} />}
          <DeleteUserForm form={forms.deleteUserForm} />
        </div>
      </div>
      <div className={`${styles.userContent}`}>
        {chats.public.pages.totalCount > 0 && (
          <div className={styles.chatList}>
            <h3>
              Public Chats{" "}
              <span className={styles.highlighted}>
                ({chats.public.pages.totalCount})
              </span>
            </h3>
            <div className={styles.contentPagination}>
              <Pagination pages={chats.public.pages} />
            </div>
            <ChatList chats={chats.public.data} />
          </div>
        )}
        {chats.private.pages.totalCount > 0 && (
          <div className={styles.chatList}>
            <h3>
              Private Chats{" "}
              <span className={styles.highlighted}>
                ({chats.private.pages.totalCount})
              </span>
            </h3>
            <div className={styles.contentPagination}>
              <Pagination pages={chats.private.pages} />
            </div>
            <ChatList chats={chats.private.data} />
          </div>
        )}
      </div>
      <div className={styles.userContent}>
        {requests.pages.totalCount > 0 && (
          <div className={styles.requests}>
            <h3>
              Requests{" "}
              <span className={styles.highlighted}>
                ({requests.pages.totalCount})
              </span>
            </h3>
            <div className={styles.contentPagination}>
              <Pagination pages={requests.pages} />
            </div>
            <div className={styles.requests}>
              {requests.data.map((request) => (
                <a
                  key={request.pub_id}
                  href={`/requests/${request.pub_id}`}
                  className={styles.request}
                  data-sg-visit
                >
                  <span className={styles.created}>{request.created}</span>{" "}
                  <span className={styles.requestType}>
                    {request.request_type}
                  </span>{" "}
                  request from {request.initiator.username}
                </a>
              ))}
            </div>
          </div>
        )}
        {messages.pages.totalCount > 0 && (
          <div className={styles.privateMessages}>
            <h3>
              Private Messages{" "}
              <span className={styles.highlighted}>
                ({messages.pages.totalCount})
              </span>
            </h3>
            <div className={styles.contentPagination}>
              <Pagination pages={messages.pages} />
            </div>
            <div className={styles.privateMessages}>
              {messages.data.map((message) => (
                <div key={message.pub_id} className={styles.message}>
                  {message.created} from{" "}
                  <a href={`/users/${message.initiator.pub_id}`} data-sg-visit>
                    {message.initiator.username}
                  </a>
                  <DeletePrivateMessageForm
                    form={forms.deletePrivateMessageForm}
                    messageId={message.pub_id}
                  />
                  <p>{message.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
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
