import React from "react";
import styles from "@stylesheets/Request.module.css";
import { Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";

export default function RequestsIndex() {
  const { requests } = useContent();

  return (
    <Layout>
      <h2>Requests</h2>
      <br />
      <div className={styles.requestContainer}>
        {requests.map((request) => (
          <a
            key={request.pub_id}
            href={`/requests/${request.pub_id}`}
            className={styles.request}
            data-sg-visit
          >
            <span className={styles.created}>{request.created}</span>{" "}
            <span className={styles.requestType}>{request.request_type}</span>{" "}
            request from {request.initiator.username}
          </a>
        ))}
      </div>
    </Layout>
  );
}
