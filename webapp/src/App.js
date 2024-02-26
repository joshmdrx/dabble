import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

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
          <Route path="/" element={<Navigate replace to="/lobby" />} />
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
          <Route path="*" element={<Navigate replace to="/lobby" />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};
export default App;
