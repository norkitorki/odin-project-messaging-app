import React from "react";
import { Form, Layout, SubmitButton, TextField } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";

export default function ChatsNew() {
  const { newChatForm, formErrors } = useContent();

  console.log(formErrors);

  return (
    <Layout>
      <h2>New Chat</h2>
      <Form {...newChatForm.form} extras={newChatForm.extras} data-sg-visit>
        <TextField {...newChatForm.inputs.name} label="Name" />
        <label htmlFor="private">Private Chat?</label>
        <input type="checkbox" name="private" id="private" value="1" />
        <SubmitButton {...newChatForm.inputs.submit} />
      </Form>
    </Layout>
  );
}
