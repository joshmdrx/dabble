// WebSocketContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  // Add a new state to WebSocketContext.js
  const [userName, setUserName] = useState(null);
  const [players, setPlayers] = useState([]); // State to store the players list
  const [allReady, setAllReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const defaultCard = [0, 0, 0, 0, 0, 0, 0, 0];
  const [currentCard, setCurrentCard] = useState(defaultCard);
  const [currentGroupCard, setCurrentGroupCard] = useState(defaultCard);
  const [gameData, setGameData] = useState("");

  useEffect(() => {
    // Initialize WebSocket connection
    createConnection();
  }, []);

  const createConnection = () => {
    const websocket = new WebSocket("ws://localhost:8123");

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      switch (response.type) {
        case "connected":
          setIsConnected(true);
          setPlayers(response.players); // Update the players list when 'connected' message is received
          break;
        case "error":
          setError(response.message);
          break;
        case "updatePlayers": // Assuming the server sends an 'updatePlayers' message type for players updates
          setPlayers(response.players);
          break;
        case "allReady":
          setAllReady(response.allReady);
          break;
        case "gameStarted":
          setGameStarted(true);
          setGameData("Get ready to play!");
          setCurrentCard([0, 0, 0, 0, 0, 0, 0, 0]);
          setCurrentGroupCard([0, 0, 0, 0, 0, 0, 0, 0]);
          break;
        case "cards":
          if (response.card) {
            setCurrentCard(response.card);
          }
          if (response.groupCard) {
            setCurrentGroupCard(response.groupCard);
          }
          if (response.gameData) {
            setGameData(parseGameData(response.gameData));
          }
          break;
        case "gameData":
          setGameData(parseGameData(response.data));
          break;
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  };

  const connect = (name) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log("Creating new connection");
      createConnection();
    }
    console.log("Connecting with name:", name);
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("sending message");
      ws.send(JSON.stringify({ type: "connect", name }));
      setUserName(name); // Set the userName when the user attempts to connect
    } else {
      setError("WebSocket is not connected");
    }
  };

  const updateReady = (ready) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "updateReady", ready }));
    } else {
      setError("WebSocket is not connected");
    }
  };

  const beginGame = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "beginGame" }));
    } else {
      setError("WebSocket is not connected");
    }
  };

  const sendMatch = (number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "match", number }));
    } else {
      setError("WebSocket is not connected");
    }
  };

  const parseGameData = (data) => {
    const checkString = `${userName} got that one!`;
    console.log(data, checkString, data === checkString);
    if (data === checkString) {
      return "You got that one!";
    }
    return data;
  };

  const value = useMemo(
    () => ({
      connect,
      isConnected,
      error,
      userName,
      players,
      updateReady,
      allReady,
      beginGame,
      gameStarted,
      currentCard,
      currentGroupCard,
      sendMatch,
      gameData,
    }),
    [
      isConnected,
      error,
      ws,
      userName,
      players,
      updateReady,
      allReady,
      currentCard,
      currentGroupCard,
      gameStarted,
      sendMatch,
      gameData,
    ]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
