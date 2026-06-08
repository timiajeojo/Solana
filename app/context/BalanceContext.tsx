// context/BalanceContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BalanceContextValue {
  currentValue:  number;
  totalSolCoins: number;
  totalInvested: number;
  setBalance: (values: {
    currentValue:  number;
    totalSolCoins: number;
    totalInvested: number;
  }) => void;
}

const BalanceContext = createContext<BalanceContextValue | null>(null);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [currentValue,  setCurrentValue]  = useState(0);
  const [totalSolCoins, setTotalSolCoins] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  function setBalance(values: {
    currentValue:  number;
    totalSolCoins: number;
    totalInvested: number;
  }) {
    setCurrentValue(values.currentValue);
    setTotalSolCoins(values.totalSolCoins);
    setTotalInvested(values.totalInvested);
  }

  return (
    <BalanceContext.Provider value={{ currentValue, totalSolCoins, totalInvested, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance(): BalanceContextValue {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance must be used inside <BalanceProvider>");
  return ctx;
}
