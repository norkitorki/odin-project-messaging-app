import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Form, Layout, SubmitButton } from "@javascript/components";

export default function UsersShow() {
  const { user, friendRequestForm, addContactForm, removeContactForm } =
    useContent();

  console.log(user);

  return (
    <Layout>
      <p>{user.username}</p>
      <Form
        {...friendRequestForm.form}
        extras={friendRequestForm.extras}
        data-sg-visit
      >
        <input {...friendRequestForm.inputs.requestType} />
        <input {...friendRequestForm.inputs.receiver} value={user.pub_id} />
        <SubmitButton {...friendRequestForm.inputs.submit} />
      </Form>
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
    </Layout>
  );
}
