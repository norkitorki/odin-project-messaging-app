import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { SignInForm } from "@javascript/components/Forms";

export default function HomeIndex() {
  const { currentUser, signInForm } = useContent();

  return (
    <Layout>
      {currentUser ? null : (
        <>
          <a href="/sign_up" data-sg-visit>
            Sign Up
          </a>
          <SignInForm form={signInForm} />
        </>
      )}
    </Layout>
  );
}
