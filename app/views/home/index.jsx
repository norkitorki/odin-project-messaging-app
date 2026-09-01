import React from "react";
import styles from "@stylesheets/User.module.css";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { SignInForm } from "@javascript/components/Forms";

export default function HomeIndex() {
  const { currentUser, signInForm } = useContent();

  return (
    <Layout>
      {!currentUser && (
        <>
          <h2>Sign In</h2>
          <SignInForm form={signInForm} />
          <p>
            Don't have an account?{" "}
            <a href="/signup" className={styles.formLink} data-sg-visit>
              Create One
            </a>
          </p>
        </>
      )}
    </Layout>
  );
}
