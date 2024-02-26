import React from "react";
import Card from "./components/Card";
import "./App.css"; // Assuming you have an App.css file for global styles

const App = () => {
  return (
    <div
      className="App"
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card />
    </div>
  );
};

export default App;
