import React from "react";

type Props = {
  onMenuToggle: () => void; // used only on small screens
  chat: string;
};

// show when a chat is selected, placeholder instead
const Chat: React.FC<Props> = () => {
  // fetch messages from the chat, after detect if username of group uuid
  return <>chat works!</>;
};

export default Chat;
