import React from "react";
import { Navigate } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext"; // Adjust the path as necessary

const ProtectedRoute = ({ children }) => {
  const { userName } = useWebSocket();

  if (!userName) {
    // User is not logged in, redirect to /login
    return <Navigate to="/login" />;
  }

  return children; // User is logged in, render the children components
};

export default ProtectedRoute;
