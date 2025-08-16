import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
