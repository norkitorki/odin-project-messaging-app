import { useContent } from "@thoughtbot/superglue";
import React from "react";
import { Layout } from "@javascript/components";
import { Form, SubmitButton } from "@javascript/components";

export default function UsersIndex() {
  const {
    users,
    addContactForm,
    friendRequestForm,
    removeContactForm,
    openChatForm,
  } = useContent();

  return (
    <Layout>
      <ul>
        {users.map((user) => (
          <li key={user.pub_id}>
            {user.username}
            <Form
              {...friendRequestForm.form}
              extras={friendRequestForm.extras}
              data-sg-visit
            >
              <input {...friendRequestForm.inputs.requestType} />
              <input
                {...friendRequestForm.inputs.receiver}
                value={user.pub_id}
              />
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
            <Form
              {...openChatForm.form}
              extras={openChatForm.extras}
              data-sg-visit
            >
              <input type="hidden" name="user_ids[]" value={user.pub_id} />
              <SubmitButton {...openChatForm.inputs.submit} />
            </Form>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
