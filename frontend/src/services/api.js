import axios from "axios";

const TOKEN_KEY = "agrolink.token";

const api = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" }
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors so every service/component can just read `err.message`.
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response) {
      const message = err.response.data?.message || "Something went wrong. Please try again.";
      const normalized = new Error(message);
      normalized.status = err.response.status;
      normalized.errors = err.response.data?.errors;
      return Promise.reject(normalized);
    }
    return Promise.reject(new Error("Could not reach the AgroLink API. Is the backend running?"));
  }
);

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

console.log("Axios base URL:", api.defaults.baseURL);
export default api;
