import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";

export default function UsersIndex() {
  const { users } = useContent();

  return (
    <Layout>
      {users.map((user) => (
        <p key={user.pub_id}>
          <a href={`/users/${user.pub_id}`} data-sg-visit>
            {user.username}
          </a>
        </p>
      ))}
    </Layout>
  );
}
