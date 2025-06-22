"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

// Create context without types
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const hasFetchedProfile = useRef(false);

  const loadUserProfile = async () => {
    setIsUserLoading(true);

    try {
      const res = await axiosInstance.get("/profile/get");
      setCurrentUser(res.data);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      setCurrentUser(null);
    } finally {
      setIsUserLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null); // Clear user data
      hasFetchedProfile.current = false; // Allow re-fetch if needed
    }
  };

  useEffect(() => {
    if (!hasFetchedProfile.current) {
      hasFetchedProfile.current = true;
      loadUserProfile();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loadUserProfile,
        logout,
        setIsUserLoading,
        isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
