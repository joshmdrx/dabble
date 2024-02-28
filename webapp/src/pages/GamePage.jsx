import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useWebSocket } from "../contexts/WebSocketContext";

const GamePage = () => {
  const [myCardSymbol, setMyCardSymbol] = useState("");
  const [groupCardSymbol, setGroupCardSymbol] = useState("");
  const { currentCard, currentGroupCard, sendMatch, gameData } = useWebSocket();

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
    if (myCardSymbol === groupCardSymbol) {
      sendMatch(myCardSymbol);
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: "white" }}>Dabble</h1>
      <h3 style={{ color: "white", paddingBottom: "30px" }}>
        {"a got that one"}
      </h3>
      <div style={{ paddingBottom: "30px" }}>
        <Card srcs={currentGroupCard} onClick={clickGroupCard} />
      </div>
      <Card srcs={currentCard} onClick={clickMyCard} />
    </div>
  );
};

export default GamePage;
