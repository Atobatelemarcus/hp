"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // 🔹 Manual Registration
  const register = async (data) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      return res.data;
    } catch (err) {
      return err.response?.data || { error: "Network error" };
    }
  };

  // 🔹 Manual Login
  const login = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      const result = res.data;
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setToken(result.token);
      }
      return result;
    } catch (err) {
      return err.response?.data || { error: "Network error" };
    }
  };

  // 🔹 Google Login
  const googleLogin = async (token) => {
    try {
      const res = await axios.post("/api/auth/google", { token });
      const result = res.data;
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setToken(result.token);
      }
      return result;
    } catch (err) {
      return err.response?.data || { error: "Network error" };
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
