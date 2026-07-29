import React from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import Avatar from "@javascript/components/Avatar";

export default function UsersIndex() {
  const { users } = useContent();

  return (
    <Layout>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.pub_id}>
            <a href={`/users/${user.pub_id}`} data-sg-visit>
              <div className={styles.userImage}>
                <Avatar avatar={user.avatar} width={45} />
              </div>
              {user.username}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
