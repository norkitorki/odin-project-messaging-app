import React from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@javascript/components";

export default function ChatsIndex() {
  const { chats } = useContent();

  return (
    <Layout>
      <a href="/chats/new" data-sg-visit>
        Create Chat
      </a>
      <ul>
        {chats.map((chat) => (
          <li key={chat.pub_id}>
            {chat.name && <p>{chat.name}</p>}
            <p>Users: {chat.users.map((user) => user.username).join(", ")}</p>
            <p>Private: {chat.private ? "true" : "false"}</p>
            <a href={`/chats/${chat.pub_id}`} data-sg-visit>
              Show
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
