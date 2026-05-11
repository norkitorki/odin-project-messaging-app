import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import {
  FriendRequestForm,
  RemoveContactForm,
} from "@javascript/components/Forms";

export default function UsersShow() {
  const { user, friendRequestForm, removeContactForm } = useContent();

  return (
    <Layout>
      <p>{user.username}</p>
      <FriendRequestForm form={friendRequestForm} userId={user.pub_id} />
      <RemoveContactForm form={removeContactForm} userId={user.pub_id} />
    </Layout>
  );
}
