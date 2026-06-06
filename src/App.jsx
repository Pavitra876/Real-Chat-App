import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinChat = () => {
    if (username.trim() !== "") {
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      author: username,
      message: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  if (!joined) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🔥 Real Chat App</h1>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <button onClick={joinChat}>Join Chat</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔥 Real Chat App</h1>

      <h3>Welcome, {username}</h3>

      <div
        style={{
          border: "1px solid gray",
          height: "350px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "8px",
              background: "#f2f2f2",
              borderRadius: "10px",
            }}
          >
            <strong>{msg.author}</strong>
            <br />
            {msg.message}
            <br />
            <small>{msg.time}</small>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;