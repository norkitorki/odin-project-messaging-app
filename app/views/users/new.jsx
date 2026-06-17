import React from "react";
import styles from "@stylesheets/Home.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { NewUserForm } from "@javascript/components/Forms";

export default function UsersNew() {
  const { newUserForm } = useContent();

  return (
    <Layout>
      <a href="/" className={styles.link} data-sg-visit>
        Sign In
      </a>
      <h2>Sign Up</h2>
      <NewUserForm form={newUserForm} />
    </Layout>
  );
}
