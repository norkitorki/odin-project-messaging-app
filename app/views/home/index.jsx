import React from "react";
import { useContent } from "@thoughtbot/superglue";
import {
  Form,
  Layout,
  PasswordField,
  SubmitButton,
  TextField,
} from "@javascript/components";

export default function HomeIndex() {
  const { currentUser, signInForm } = useContent();

  return (
    <Layout>
      {currentUser ? null : (
        <>
          <a href="/sign_up" data-sg-visit>
            Sign Up
          </a>
          <Form {...signInForm.form} extras={signInForm.extras} data-sg-visit>
            <div className="field">
              <TextField
                {...signInForm.inputs.username}
                label={<p>Username</p>}
              />
            </div>
            <div className="field">
              <PasswordField
                {...signInForm.inputs.password}
                label={<p>Password</p>}
              />
            </div>
            <div className="actions">
              <SubmitButton {...signInForm.inputs.submit} />
            </div>
          </Form>
        </>
      )}
    </Layout>
  );
}
