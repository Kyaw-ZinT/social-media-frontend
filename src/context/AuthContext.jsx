import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUer] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Register Function
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { username, email, password });
      setUer(res.data);
      setToken(res.data.token);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response ? err.response.data.message : err.message;
    }
  };

  //Login Function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUer(res.data);
      setToken(res.data.token);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response ? err.response.data.message : err.message;
    }
  };

  // Logout Function
  const logout = () => {
    setUer(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use AuthContext easily
export const useAuth = () => {
  return useContext(AuthContext);
};
