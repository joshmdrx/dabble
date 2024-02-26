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
    // Call the server to start the game
    ws.send(JSON.stringify({ type: "beginGame" }));
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
    }),
    [isConnected, error, ws, userName, players, updateReady, allReady]
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