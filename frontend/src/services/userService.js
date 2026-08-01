import api from "./api.js";

export const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (payload) => api.patch("/users/me", payload),
  changePassword: (payload) => api.patch("/users/me/password", payload),
};
