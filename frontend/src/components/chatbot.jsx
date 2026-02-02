import { useState } from "react";
import api from "../services/api";

export default function Chatbot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const res = await api.post("/chatbot/query", { message: msg });
    setChat([...chat, { u: msg, b: res.data.reply }]);
    setMsg("");
  };

  return (
    <div>
      <h3>AI Estate Assistant</h3>
      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
      {chat.map((c, i) => (
        <p key={i}><b>You:</b> {c.u}<br /><b>Bot:</b> {c.b}</p>
      ))}
    </div>
  );
}