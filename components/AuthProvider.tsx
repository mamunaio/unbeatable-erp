"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type RoleType = "OWNER" | "ADMIN" | "MANAGER" | "CASHIER" | "STOCK_KEEPER" | "ACCOUNTANT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  branchName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loginAs: (role: RoleType) => void;
  logout: () => void;
  hasPermission: (allowedRoles: RoleType[]) => boolean;
}

const defaultUser: AuthUser = {
  id: "u-owner",
  name: "Admin User",
  email: "admin@unbeatable.com",
  role: "OWNER",
  branchName: "Dhaka Main Branch",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  loginAs: () => {},
  logout: () => {},
  hasPermission: () => true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(defaultUser);

  // Load stored demo session
  useEffect(() => {
    const saved = localStorage.getItem("unbeatable_auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loginAs = (role: RoleType) => {
    let name = "Admin User";
    let email = "admin@unbeatable.com";

    if (role === "CASHIER") {
      name = "Kamal Cashier";
      email = "cashier01@unbeatable.com";
    } else if (role === "STOCK_KEEPER") {
      name = "Rafiq Stock Keeper";
      email = "inventory@unbeatable.com";
    } else if (role === "ACCOUNTANT") {
      name = "Shafiq Accountant";
      email = "accounts@unbeatable.com";
    } else if (role === "MANAGER") {
      name = "Tanvir Manager";
      email = "manager@unbeatable.com";
    }

    const newUser: AuthUser = {
      id: `u-${role.toLowerCase()}`,
      name,
      email,
      role,
      branchName: "Dhaka Main Branch",
    };

    setUser(newUser);
    localStorage.setItem("unbeatable_auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("unbeatable_auth_user");
  };

  const hasPermission = (allowedRoles: RoleType[]): boolean => {
    if (!user) return false;
    if (user.role === "OWNER" || user.role === "ADMIN") return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
