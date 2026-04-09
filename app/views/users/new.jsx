import React from "react";
import { useContent } from "@thoughtbot/superglue";
import {
  Form,
  Layout,
  PasswordField,
  SubmitButton,
  TextField,
} from "@javascript/components";

const ErrorMessages = ({ property }) => {
  const { formErrors } = useContent();

  if (!formErrors || !formErrors[property]) return null;

  return (
    <div>
      {formErrors[property].map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};

export default function UsersNew() {
  const { newUserForm } = useContent();

  return (
    <Layout>
      <h2>Sign Up</h2>
      <Form {...newUserForm.form} extras={newUserForm.extras} data-sg-visit>
        <TextField {...newUserForm.inputs.username} label={<p>Username</p>} />
        <ErrorMessages property={"username"} />
        <PasswordField
          {...newUserForm.inputs.password}
          label={<p>Password</p>}
        />
        <ErrorMessages property={"password"} />
        <PasswordField
          {...newUserForm.inputs.passwordConfirmation}
          label={<p>Password Confirmation</p>}
        />
        <ErrorMessages property={"password_confirmation"} />
        <SubmitButton {...newUserForm.inputs.submit} />
      </Form>
    </Layout>
  );
}
