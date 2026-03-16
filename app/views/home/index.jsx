import React from "react";
import {
  Checkbox,
  Form,
  Layout,
  PasswordField,
  SubmitButton,
  TextField,
} from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";

export default function HomeIndex() {
  const { users, currentUser, addUsersToChatForm, signInForm } = useContent();

  return (
    <Layout>
      {currentUser ? (
        <>
          <Form
            {...addUsersToChatForm.form}
            extras={addUsersToChatForm.extras}
            data-sg-visit
          >
            {users.map((user) => (
              <label key={user.pub_id} style={{ display: "block" }}>
                {user.username}
                <input type="checkbox" name="user_ids[]" value={user.pub_id} />
              </label>
            ))}
            <SubmitButton {...addUsersToChatForm.inputs.submit} />
          </Form>
        </>
      ) : (
        <>
          <a href="/users/sign_up">Sign Up</a>
          <Form {...signInForm.form} extras={signInForm.extras}>
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
            <div className="field">
              <Checkbox
                {...signInForm.inputs.remember_me}
                label={<p>Remember</p>}
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
