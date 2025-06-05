import React, { createContext, useState, useContext, useEffect } from "react";
import { register as registerAPI, login as loginAPI } from '../config/api'; // Import API functions
import { setAuthToken } from '../config/api'; // Import the function to set the auth token

type User = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: "user" | "advisor" | "manager";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, last_name: string, email: string, phone: string, address: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthToken(token); // Set the token for Axios requests
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await loginAPI(email, password);
      const { user: userData, token } = response.data; // Adjust according to your response structure
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", token);
      setAuthToken(token); // Set the token for Axios requests
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, last_name: string, email: string, phone: string, address: string, password: string, role: string) => {
    setLoading(true);
    try {
      const response = await registerAPI(name, last_name, email, phone, address, password, role);
      const { user: userData, token } = response.data; // Adjust according to your response structure
      if (role === "user") {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authToken", token);
        setAuthToken(token); // Set the token for Axios requests
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setAuthToken(null); // Clear the token for Axios requests
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
