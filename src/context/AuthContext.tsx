
import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../types";
import { findUserByPhone, saveUser } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  login: (phone: string) => User | null;
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

  const login = (phone: string): User | null => {
    const user = findUserByPhone(phone);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }
    return null;
  };

  const register = (userData: Omit<User, "id" | "role">): User => {
    const newUser = saveUser(userData);
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // Check if user was previously logged in
  React.useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
