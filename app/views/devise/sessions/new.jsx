import { Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";
import React from "react";

export default function UsersNew() {
  const { user } = useContent();

  console.log(user);

  return (
    <Layout>
      <h2>Sign In</h2>
    </Layout>
  );
}
