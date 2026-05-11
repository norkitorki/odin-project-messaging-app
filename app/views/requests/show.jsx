import React from "react";
import { Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";
import { RequestResponseForm } from "@javascript/components/Forms";

const RequestForm = ({ children }) => {
  const { requestForm } = useContent();

  return (
    <>
      <div>{children}</div>
      <RequestResponseForm form={requestForm} accept={true} />
      <RequestResponseForm form={requestForm} accept={false} />
    </>
  );
};

export default function RequestsShow() {
  const { request, chat } = useContent();

  return (
    <Layout>
      {request?.request_type === "friend" && (
        <RequestForm>
          <>{request.initiator.username} would like to become your friend.</>
        </RequestForm>
      )}
      {request?.request_type === "chat" && (
        <RequestForm>
          <>
            <p>
              {request.initiator.username} would like you to join a private chat
            </p>
            <p>Chat Name: {chat.name}</p>
            <p>Members: {chat.users.map((u) => u.username).join(",")}</p>
          </>
        </RequestForm>
      )}
    </Layout>
  );
}
