import { useState, useRef, useEffect } from "react";
import { Send, Square, Trash2 } from "lucide-react";
import { sendToWeatherAgent } from "../api/weatherAgent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function WeatherChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", content: "Hi! Ask me about the weather 🌤️" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const abortRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // 🔑 Build conversation memory (FRONTEND ONLY)
  const buildPromptWithHistory = (newMessage) => {
    const history = messages
      .map((m) =>
        m.type === "user"
          ? `User: ${m.content}`
          : `Assistant: ${m.content}`
      )
      .join("\n");

    return `
You are a weather assistant.
Use conversation context to answer follow-up questions.

${history}
User: ${newMessage}
Assistant:
`;
  };

  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const userText = input;
    setInput("");

    setMessages((m) => [
      ...m,
      { id: Date.now(), type: "user", content: userText },
    ]);

    setTyping(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const fullPrompt = buildPromptWithHistory(userText);
      const reply = await sendToWeatherAgent(fullPrompt, controller.signal);

      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, type: "bot", content: reply },
      ]);
    } catch (err) {
      if (err.name !== "CanceledError") {
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, type: "bot", content: "⚠️ Error getting response" },
        ]);
      }
    } finally {
      setTyping(false);
      abortRef.current = null;
    }
  };

  const stopAI = () => {
    abortRef.current?.abort();
    setTyping(false);
  };

  const clearChat = () => {
    setMessages([
      { id: Date.now(), type: "bot", content: "Chat cleared. Ask again 🌤️" },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Weather AI Agent</h1>
        <p>Ask me about the weather</p>
      </div>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.type}`}>
            <div className="message-bubble markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {typing && <div className="typing">Agent is typing…</div>}
        <div ref={endRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about weather in any city..."
          disabled={typing}
        />

        {typing ? (
          <button onClick={stopAI}>
            <Square size={18} />
          </button>
        ) : (
          <button onClick={sendMessage} disabled={!input.trim()}>
            <Send size={18} />
          </button>
        )}

        <button onClick={clearChat}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
