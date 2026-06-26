import React from "react";
import styles from "@stylesheets/Request.module.css";
import { Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";
import { RequestResponseForm } from "@javascript/components/Forms";

const RequestForm = ({ children }) => {
  const { requestForm } = useContent();

  return (
    <>
      <div>{children}</div>
      <div className={styles.formContainer}>
        <RequestResponseForm form={requestForm} accept={true} />
        <RequestResponseForm form={requestForm} accept={false} />
      </div>
    </>
  );
};

export default function RequestsShow() {
  const { request, chat } = useContent();

  const InitiatorLink = () => (
    <a
      href={`/users/${request.initiator.pub_id}`}
      className={styles.initiator}
      data-sg-visit
    >
      {request.initiator.username}
    </a>
  );

  return (
    <Layout>
      {request?.request_type === "friend" && (
        <RequestForm>
          <div className={styles.requestDescription}>
            <div>
              <InitiatorLink /> would like to become your friend.
            </div>
          </div>
        </RequestForm>
      )}
      {request?.request_type === "chat" && (
        <RequestForm>
          <div className={styles.requestDescription}>
            <div>
              <InitiatorLink /> would like you to join a private chat.
            </div>
            <div>Chat: {chat.name}</div>
            <div>Member Count: {chat.users.length}</div>
          </div>
        </RequestForm>
      )}
    </Layout>
  );
}
