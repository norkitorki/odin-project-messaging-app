import React from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { AccountCircle } from "@javascript/components/Icons";

export default function UsersIndex() {
  const { users } = useContent();

  return (
    <Layout>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.pub_id}>
            <a href={`/users/${user.pub_id}`} data-sg-visit>
              <div className={styles.userImage}>
                <AccountCircle />
              </div>
              {user.username}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
