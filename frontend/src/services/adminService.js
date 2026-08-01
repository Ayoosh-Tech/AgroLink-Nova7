import api from "./api.js";

export const adminService = {
  dashboard: () => api.get("/admin/dashboard"),
  listUsers: () => api.get("/admin/users"),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  listProducts: () => api.get("/admin/products"),
  removeProduct: (id) => api.delete(`/admin/products/${id}`),
  listOrders: () => api.get("/admin/orders"),
};
