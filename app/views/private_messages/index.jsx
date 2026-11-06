import react from "react";
import styles from "@stylesheets/User.module.css";
import { Layout } from "@components";
import { useContent } from "@thoughtbot/superglue";
import Pagination from "@components/Pagination";

export default function PrivateMessagesIndex() {
  const { messages, pages } = useContent();

  return (
    <Layout>
      <h2>Private Messages ({messages.length})</h2>
      <Pagination pages={pages} />
      <ol className={styles.privateMessages}>
        {messages.map((message) => (
          <li key={message.pub_id} className={styles.message}>
            {message.created} from{" "}
            <a href={`/users/${message.initiator.pub_id}`} data-sg-visit>
              {message.initiator.username}
            </a>
            <p>{message.value}</p>
          </li>
        ))}
      </ol>
    </Layout>
  );
}
