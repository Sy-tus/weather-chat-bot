import { useState } from "react";

export default function MessageInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex mt-2">
      <input
        className="flex-1 p-2 border rounded-l-lg"
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <button
        className="bg-blue-500 text-white px-4 rounded-r-lg"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
