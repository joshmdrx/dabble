import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import GamePage from "./pages/GamePage";
import LoginPage from "./pages/Login";
import LobbyPage from "./pages/Lobby";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lobby"
            element={
              <ProtectedRoute>
                <LobbyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};
export default App;
