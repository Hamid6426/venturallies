"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const fetchBalance = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get("/balances/my-balance");
      setBalance(res.data);
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceHistory = async () => {
    try {
      const userId = currentUser.id;
      const res = await axiosInstance.get(
        `/balances/${userId}/history`
      );
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching balance history:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [currentUser]);

  return (
    <BalanceContext.Provider
      value={{ balance, history, fetchBalance, fetchBalanceHistory, loading }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance must be used inside BalanceProvider");
  return ctx;
};
