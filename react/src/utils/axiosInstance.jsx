// src/utils/axiosInstance.js
import axios from "axios";

// Check Vite's mode
const isProduction = import.meta.env.MODE === "production";

// Set base URL depending on environment
const baseURL = isProduction
  ? "/api" // relative path (same domain in production)
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // to support cookies/session
});

export default axiosInstance;
