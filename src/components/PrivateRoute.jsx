//D:\code software\HMS backup\templet\raghu sir project\project_X\X-frontend\vite-project\src\components\PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth(); // Get isAuthenticated and loading from context

  // While loading, don't make a decision yet
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  // If not authenticated, redirect to login (or unauthorized if you prefer)
  // Using /login here ensures they go through the login flow.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but user object is somehow missing or malformed
  // This is a safety check, ideally isAuthenticated implies user exists
  if (!user) {
    return <Navigate to="/login" replace />; // Force re-login
  }

  // If user is authenticated but their role is not allowed for this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page
  }

  // If all checks pass, render the children (the protected component)
  return children;
};

export default PrivateRoute;
