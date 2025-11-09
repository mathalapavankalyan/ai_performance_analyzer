import React, { useState } from "react";
import "../styles/PerformanceBot.css";

export const PerformanceBot = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about the app’s performance." },
  ]);

  const handleSend = async () => {
    if (!query.trim()) return;
    setMessages([...messages, { from: "user", text: query }]);
    setQuery("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8001/chat?query=${encodeURIComponent(query)}`,
        { method: "POST" }
      );
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.response || "No response from analyzer." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error contacting analyzer." },
      ]);
    }
  };

  return (
    <>
      <div
        className="bot-icon"
        onClick={() => setOpen(!open)}
        title="Performance Chat"
      >
        💬
      </div>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Performance Assistant</span>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-body">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-msg ${m.from === "user" ? "user" : "bot"}`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about performance..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};
