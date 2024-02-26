import React, { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useNavigate } from "react-router-dom";

const LobbyPage = ({}) => {
  const [ready, setReady] = useState(false);
  const { players, updateReady, allReady, beginGame, gameStarted } =
    useWebSocket();
  const navigate = useNavigate();

  const toggleReady = () => {
    updateReady(!ready);
    setReady(!ready);
  };

  useEffect(() => {
    if (gameStarted) {
      navigate("/game");
    }
  }, [gameStarted]);

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <table style={{ color: "white" }}>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginLeft: "100px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={toggleReady}
          style={{ marginTop: "20px", color: `${ready ? "green" : "red"}` }}
        >
          {ready ? "READY" : "NOT READY"}
        </button>
        <button
          style={{ marginTop: "10px" }}
          disabled={!allReady}
          onClick={beginGame}
        >
          Begin
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
