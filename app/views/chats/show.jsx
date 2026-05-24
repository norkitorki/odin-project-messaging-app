import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { Chat } from "@javascript/components/Chat";

export default function ChatsShow() {
  const { chat } = useContent();

  return (
    <Layout>
      <Chat chat={chat} />
    </Layout>
  );
}
