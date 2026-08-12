import { createContext, useContext, useEffect, useState } from "react";
import api from "./apiinstance";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/user/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const register = async (email, password, fname, lname) => {
    try {
      const response = await api.post("/user/register", {
        email,
        password,
        fname,
        lname,
      });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data?.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || "Registration failed.";
      throw new Error(message);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await api.post("/user/login", { email, password });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data?.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || "Login failed.";
      throw new Error(message);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    signUp: register,
    signIn,
    signOut,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
