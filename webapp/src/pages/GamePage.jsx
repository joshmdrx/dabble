import React, { useEffect, useState } from "react";
import Card from "../components/Card";

const GamePage = () => {
  const [myCardSymbol, setMyCardSymbol] = useState("");
  const [groupCardSymbol, setGroupCardSymbol] = useState("");

  const clickMyCard = (src) => {
    console.log(`You clicked on ${src}`);
    setMyCardSymbol(src);
    checkWinner();
  };
  const clickGroupCard = (src) => {
    console.log(`You clicked on ${src}`);
    setGroupCardSymbol(src);
    checkWinner();
  };

  useEffect(() => {
    console.log("myCardSymbol", myCardSymbol);
    console.log("groupCardSymbol", groupCardSymbol);
  }, [myCardSymbol, groupCardSymbol]);

  const checkWinner = () => {
    if (myCardSymbol === groupCardSymbol) {
      console.log("You win!");
    } else {
      console.log("You lose!");
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
      <div style={{ paddingBottom: "30px" }}>
        <Card srcs={[]} onClick={clickGroupCard} />
      </div>
      <Card srcs={[]} onClick={clickMyCard} />
    </div>
  );
};

export default GamePage;
