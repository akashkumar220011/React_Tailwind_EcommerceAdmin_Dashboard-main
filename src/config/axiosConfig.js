// src/axiosConfig.js
import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Set your base URL here
});

// Request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to every request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., token expired)
      // Optionally, redirect to the login page or show an error
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token"); // Clear the token
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
