import React from "react";
import { Form, Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";

export default function RequestsShow() {
  const { request, requestForm } = useContent();

  return (
    <Layout>
      {request?.request_type === "friend" && (
        <>
          <p>{request.initiator.username} would like to be your friend.</p>
          <Form {...requestForm.form} extras={requestForm.extras} data-sg-visit>
            <input {...requestForm.inputs.request} />
            <input
              {...requestForm.inputs.requestType}
              value={request.request_type}
            />
            <input
              type="hidden"
              autoComplete="off"
              name="accept"
              value="true"
            />
            <button type="submit">Accept</button>
          </Form>
          <Form {...requestForm.form} extras={requestForm.extras} data-sg-visit>
            <input {...requestForm.inputs.request} />
            <input
              {...requestForm.inputs.requestType}
              value={request.request_type}
            />
            <button type="submit">Decline</button>
          </Form>
        </>
      )}
    </Layout>
  );
}
