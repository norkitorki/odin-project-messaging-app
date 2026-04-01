import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { Chat } from "@javascript/components/Chat";

export default function ChatsShow() {
  const { chat } = useContent();

  return (
    <Layout>
      <a href="/chats" data-sg-visit>
        Back To Chats
      </a>
      <Chat chat={chat} />
    </Layout>
  );
}
