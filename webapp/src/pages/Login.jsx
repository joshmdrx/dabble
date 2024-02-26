import React, { useState, useEffect } from "react";
import { useWebSocket } from "../contexts/WebSocketContext"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [name, setName] = useState("");
  const { connect, isConnected, error } = useWebSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate("/lobby"); // Redirect to the lobby page
    }
  }, [isConnected, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      connect(name);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "20px" }}
        />
        <button type="submit">Enter</button>
        {error && <p style={{ color: "white" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
