import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message";

export default function ChatWindow({ messages }) {
  return (
    <ScrollToBottom className="h-full p-4 space-y-3">
      {messages.map((msg, index) => (
        <Message
          key={index}
          text={msg.text}
          isUser={msg.isUser}
        />
      ))}
    </ScrollToBottom>
  );
}
