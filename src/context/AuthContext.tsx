
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "advisor" | "manager";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage or session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // In a real app, this would make an API call to your backend
    try {
      // Simulate API call with mock data
      if (email === "manager@fidelem.com" && password === "password") {
        const userData = {
          id: "1",
          name: "Financial Manager",
          email: "manager@fidelem.com",
          role: "manager" as const
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (email === "advisor@fidelem.com" && password === "password") {
        const userData = {
          id: "2",
          name: "Financial Advisor",
          email: "advisor@fidelem.com",
          role: "advisor" as const
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (email === "user@fidelem.com" && password === "password") {
        const userData = {
          id: "3",
          name: "Regular User",
          email: "user@fidelem.com",
          role: "user" as const
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    // In a real app, this would make an API call to your backend
    try {
      // Simulate API call with mock data
      console.log(`Registered: ${name}, ${email}, ${role}`);
      // For demo purposes, we'll auto-login as a user after registration
      if (role === "user") {
        const userData = {
          id: Math.random().toString(36).substring(7),
          name,
          email,
          role: "user" as const
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
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
