import api from "./api.js";

export const orderService = {
  checkout: (payload) => api.post("/orders", payload),
  myOrders: () => api.get("/orders/mine"),
  farmerOrders: () => api.get("/orders/farmer"),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};
