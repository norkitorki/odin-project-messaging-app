import { useContent } from "@thoughtbot/superglue";
import React from "react";
import { Layout } from "@javascript/components";
import { Form, SubmitButton } from "@javascript/components";

export default function UsersIndex() {
  const { users, addContactForm, friendRequestForm, removeContactForm } =
    useContent();

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
