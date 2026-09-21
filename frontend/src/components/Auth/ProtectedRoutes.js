// src/components/Auth/ProtectedRoutes.js
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoutes = ({ element }) => {
  const { user, setUser } = useContext(AuthContext); // Access user and setUser from context
  const [isLoading, setIsLoading] = useState(true); // Loading state to avoid premature rendering

  useEffect(() => {
    // Check if the user is already in localStorage if not in context
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Set the user in context from localStorage
      }
    }

    // Stop loading once we have user information or confirmed absence
    setIsLoading(false);
  }, [user, setUser]);

  // While loading (checking user in localStorage), don't render anything yet
  if (isLoading) {
    return null; // You could return a loading spinner here if needed
  }

  // If authenticated, return the protected component, otherwise redirect to login
  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
