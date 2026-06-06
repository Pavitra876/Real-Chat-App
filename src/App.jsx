import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send_message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔥 Real Chat App</h1>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          padding: "10px",
          marginBottom: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;