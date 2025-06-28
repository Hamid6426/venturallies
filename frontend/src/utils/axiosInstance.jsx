// src/utils/axiosInstance.js
import axios from "axios";

// Set base URL depending on environment
const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // to support cookies/session
});

export default axiosInstance;
