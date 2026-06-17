import React from "react";
import { Layout } from "@javascript/components";
import { useContent } from "@thoughtbot/superglue";
import { NewChatForm } from "@javascript/components/Forms";

export default function ChatsNew() {
  const { newChatForm } = useContent();

  return (
    <Layout>
      <h2>Create Chat</h2>
      <NewChatForm form={newChatForm} />
    </Layout>
  );
}
