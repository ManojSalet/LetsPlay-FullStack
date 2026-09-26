// src/components/Auth/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Helper to safely decode and check token expiration
  const decodeAndValidateToken = (rawToken) => {
    if (!rawToken) return null;
    try {
      const decoded = jwtDecode(rawToken);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  };

  useEffect(() => {
    // 1. Check for tab-isolated Admin session in sessionStorage first
    const adminToken = sessionStorage.getItem("admin_token");
    if (adminToken) {
      const decodedAdmin = decodeAndValidateToken(adminToken);
      if (decodedAdmin && decodedAdmin.role === "admin") {
        setToken(adminToken);
        setUser(decodedAdmin);
        return;
      } else {
        sessionStorage.removeItem("admin_token");
      }
    }

    // 2. Check for persistent Customer session in localStorage
    const customerToken = localStorage.getItem("customer_token") || localStorage.getItem("token");
    if (customerToken) {
      const decodedCustomer = decodeAndValidateToken(customerToken);
      if (decodedCustomer) {
        setToken(customerToken);
        setUser(decodedCustomer);
        if (!localStorage.getItem("customer_token")) {
          localStorage.setItem("customer_token", customerToken);
        }
      } else {
        localStorage.removeItem("customer_token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (newToken) => {
    const decodedUser = decodeAndValidateToken(newToken);
    if (!decodedUser) return;

    setToken(newToken);
    setUser(decodedUser);

    if (decodedUser.role === "admin") {
      // Store elevated admin session strictly in this tab's sessionStorage
      sessionStorage.setItem("admin_token", newToken);
    } else {
      // Store customer session in persistent localStorage
      localStorage.setItem("customer_token", newToken);
      localStorage.setItem("token", newToken);
      // Clear any conflicting admin session from this tab
      sessionStorage.removeItem("admin_token");
    }
  };

  const logout = () => {
    if (user?.role === "admin" || sessionStorage.getItem("admin_token")) {
      sessionStorage.removeItem("admin_token");
    }
    if (user?.role !== "admin") {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("token");
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

