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
  const {
    signedIn,
    users,
    addContactForm,
    removeContactForm,
    signOutForm,
    signInForm,
  } = useContent();

  return (
    <Layout>
      <h1>Front Page</h1>

      {signedIn ? (
        <>
          <ul>
            {users.map((user) => (
              <li key={user.pub_id}>
                {user.username}{" "}
                <Form
                  {...addContactForm.form}
                  extras={addContactForm.extras}
                  data-sg-visit
                >
                  <input type="hidden" name="pub_id" value={user.pub_id} />
                  <SubmitButton {...addContactForm.inputs.submit} />
                </Form>
                <Form
                  {...removeContactForm.form}
                  extras={removeContactForm.extras}
                  data-sg-visit
                >
                  <input type="hidden" name="pub_id" value={user.pub_id} />
                  <SubmitButton {...removeContactForm.inputs.submit} />
                </Form>
              </li>
            ))}
          </ul>
          <Form {...signOutForm.form} extras={signOutForm.extras}>
            <SubmitButton {...signOutForm.inputs.submit} />
          </Form>
        </>
      ) : (
        <>
          <a href="/users/sign_up">Sign Up</a>
          <a href="/users/sign_in">Log In</a>
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
