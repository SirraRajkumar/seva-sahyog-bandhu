
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "../types";
import { findUserByIdentifier, saveUser } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (identifier: string) => User | null; // now identifier (phone or id)
  register: (userData: Omit<User, "id" | "role">) => User;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        console.log("User loaded from localStorage:", user);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = (identifier: string): User | null => {
    const user = findUserByIdentifier(identifier);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      console.log("User logged in:", user);
      return user;
    }
    return null;
  };

  const register = (userData: Omit<User, "id" | "role">): User => {
    const newUser = saveUser(userData);
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    console.log("New user registered:", newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    console.log("User logged out");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
