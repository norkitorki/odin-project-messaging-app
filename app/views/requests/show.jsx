import React from "react";
import { Form, Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";

const RequestForm = ({ children }) => {
  const { requestForm } = useContent();

  return (
    <>
      <div>{children}</div>
      <Form {...requestForm.form} extras={requestForm.extras} data-sg-visit>
        <input {...requestForm.inputs.request} />
        <input {...requestForm.inputs.requestType} />
        <input {...requestForm.inputs.accept} />
        <button type="submit">Accept</button>
      </Form>
      <Form {...requestForm.form} extras={requestForm.extras} data-sg-visit>
        <input {...requestForm.inputs.request} />
        <input {...requestForm.inputs.requestType} />
        <button type="submit">Decline</button>
      </Form>
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
