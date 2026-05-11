import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { NewUserForm } from "@javascript/components/Forms";

export default function UsersNew() {
  const { newUserForm } = useContent();

  return (
    <Layout>
      <h2>Sign Up</h2>
      <NewUserForm form={newUserForm} />
    </Layout>
  );
}
