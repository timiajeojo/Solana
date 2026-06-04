
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserData {
  firstName: string;
  lastName:  string;
  email:     string;
  username:  string;
  bio:       string;
}

interface UserContextValue {
  user: UserData;
  updateUser: (patch: Partial<UserData>) => void;
}

// ─── Default "signed-up" user ─────────────────────────────────────────────────

const defaultUser: UserData = {
  firstName: "Alex",
  lastName:  "Johnson",
  email:     "alex@example.com",
  username:  "@alexj",
  bio:       "Product designer & developer.",
};

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);

  const updateUser = (patch: Partial<UserData>) =>
    setUser((prev) => ({ ...prev, ...patch }));

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
