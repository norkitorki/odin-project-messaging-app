import React from "react";
import { Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";

export default function RequestsIndex() {
  const { received_requests } = useContent();

  return (
    <Layout>
      <h2>Requests</h2>
      <br />
      {received_requests.map((request) => (
        <a
          key={request.pub_id}
          href={`/requests/${request.pub_id}`}
          data-sg-visit
        >
          {request.request_type} request from {request.initiator.username}
        </a>
      ))}
    </Layout>
  );
}
