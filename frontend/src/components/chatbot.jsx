import { useState } from "react";

const Chatbot = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "Error connecting to bot.", sender: "bot" }]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "350px",
      height: "500px",
      backgroundColor: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{
        padding: "15px",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "var(--primary-color)",
        color: "white",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <span>Smart Estate Assistant</span>
        <button onClick={() => setIsOpen(false)} style={{ padding: "0 5px", background: "transparent", border: "none" }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.sender === "user" ? "var(--primary-color)" : "#edf2f7",
            color: msg.sender === "user" ? "white" : "black",
            padding: "8px 12px",
            borderRadius: "12px",
            maxWidth: "80%"
          }}>
            {msg.text}
          </div>
        ))}
      </div>

      <div style={{ padding: "15px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ marginBottom: 0 }}
        />
        <button onClick={sendMessage} style={{ padding: "10px" }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;