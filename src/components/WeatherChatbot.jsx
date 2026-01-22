import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { sendToWeatherAgent } from "../api/weatherAgent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export function WeatherChatbot() {
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", content: "Hi! Ask me about the weather 🌤️" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((m) => [...m, { id: Date.now(), type: "user", content: userText }]);
    setInput("");
    setTyping(true);

    try {
      const reply = await sendToWeatherAgent(userText);
      setMessages((m) => [...m, { id: Date.now() + 1, type: "bot", content: reply }]);
    } catch {
      setMessages((m) => [...m, { id: Date.now() + 1, type: "bot", content: "⚠️ Error getting response" }]);
    } finally {
      setTyping(false);
    }
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
        />
        <button onClick={sendMessage} disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
