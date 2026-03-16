import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";
import { Chat } from "@javascript/components/Chat";

export default function ChatsIndex() {
  const { chats } = useContent();

  return (
    <Layout>
      <h2>Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.pub_id}>
            <Chat chat={chat} />
          </li>
        ))}
      </ul>
    </Layout>
  );
}
