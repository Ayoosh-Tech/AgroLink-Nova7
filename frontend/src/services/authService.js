import api from "./api.js";

export const authService = {
  register: (payload) => api.post("/auth/register", payload),
  login: (email, password) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
};
