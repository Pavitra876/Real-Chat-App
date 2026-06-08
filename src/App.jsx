import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const joinChat = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room);
      socket.emit("user_joined", username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);

    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, []);

  if (!joined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="bg-slate-900/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-96 border border-cyan-500/20">
          <h1 className="text-4xl font-bold text-cyan-400 mb-3 text-center">
            Campus Connect with AI
          </h1>

          <p className="text-slate-400 text-center mb-8">
            Smart Student Collaboration Platform
          </p>

          <input
            type="text"
            placeholder="Enter Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none border border-slate-700 mb-4"
          />

          <input
            type="text"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none border border-slate-700 mb-4"
          />

          <button
            onClick={joinChat}
            className="w-full bg-cyan-500 hover:bg-cyan-400 p-3 rounded-xl font-semibold transition"
          >
            Join Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex">
      
      {/* Sidebar */}
      <div className="w-72 border-r border-cyan-500/20 bg-slate-900/40 backdrop-blur-xl p-5">

        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
          🚀 CampusConnect AI
        </h1>

        <p className="text-slate-400 text-sm mb-4">
          Smart Student Collaboration Platform
        </p>

        <div className="bg-slate-800/50 p-3 rounded-xl mb-6">
          <p className="text-cyan-300 font-semibold">
            Room: {room}
          </p>
        </div>

        <h2 className="text-cyan-300 mb-4 font-semibold">
          Online Users ({onlineUsers.length})
        </h2>

        <div className="space-y-3">

          {onlineUsers.map((user, index) => (
            <div
              key={index}
              className="bg-slate-800/50 p-3 rounded-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div>
                <p>{user.username}</p>
                <p className="text-xs text-green-400">
                  Online
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        <div className="border-b border-cyan-500/20 p-5 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold">
            Discussion Room
          </h2>

          <p className="text-slate-400">
            Collaborate, Discuss, Innovate
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`max-w-md p-4 rounded-2xl shadow-lg ${
                msg.author === username
                  ? "ml-auto bg-cyan-600"
                  : "bg-slate-800"
              }`}
            >
              <p className="font-semibold text-cyan-200">
                {msg.author}
              </p>

              <p>{msg.message}</p>

              <p className="text-xs opacity-70 mt-2">
                {msg.time}
              </p>
            </div>

          ))}

        </div>

        {/* Input */}
        <div className="p-5 border-t border-cyan-500/20">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-slate-800 rounded-xl px-4 py-3 outline-none border border-slate-700 focus:border-cyan-400"
            />

            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition"
            >
              Send
            </button>

            <button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition"
            >
              AI Summary
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;