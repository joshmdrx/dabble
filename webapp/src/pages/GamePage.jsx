import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const [myCardSymbol, setMyCardSymbol] = useState("");
  const [groupCardSymbol, setGroupCardSymbol] = useState("");
  const {
    currentCard,
    currentGroupCard,
    sendMatch,
    gameData,
    gameStarted,
    gameScores,
  } = useWebSocket();
  const navigate = useNavigate();

  const clickMyCard = (src) => {
    setMyCardSymbol(src);
  };
  const clickGroupCard = (src) => {
    setGroupCardSymbol(src);
  };

  useEffect(() => {
    if (myCardSymbol && groupCardSymbol) {
      checkWinner();
    }
  }, [myCardSymbol, groupCardSymbol]);

  const checkWinner = () => {
    console.log(
      myCardSymbol,
      groupCardSymbol,
      myCardSymbol === groupCardSymbol
    );
    if (myCardSymbol === groupCardSymbol) {
      sendMatch(myCardSymbol);
    }
  };
  useEffect(() => {
    setMyCardSymbol("");
    setGroupCardSymbol("");
  }, [currentCard, currentGroupCard]);

  if (!gameStarted) {
    return (
      <div
        style={{
          backgroundColor: "black",
          height: "100vh",
          display: "flex",
          // justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: "white" }}>GAME OVER!</h1>
        <h2 style={{ color: "white" }}>{gameData}</h2>
        <h3 style={{ color: "white" }}>Scores:</h3>
        {/* A table for displaying the results*/}
        <table style={{ color: "white" }}>
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {gameScores.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate("/lobby")}>Return to lobby</button>
      </div>
    );
  }

  return (
    <div
      className="App"
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: "white" }}>Dabble</h1>
      <h3 style={{ color: "white", paddingBottom: "30px" }}>{gameData}</h3>
      <div style={{ paddingBottom: "30px" }}>
        <Card srcs={currentGroupCard} onClick={clickGroupCard} />
      </div>
      <Card srcs={currentCard} onClick={clickMyCard} />
    </div>
  );
};

export default GamePage;
