// src/utils/axiosInstance.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";

// Use relative base URL in production
const baseURL = isProduction
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
