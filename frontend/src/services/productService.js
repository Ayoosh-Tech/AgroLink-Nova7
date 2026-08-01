import api from "./api.js";

export const productService = {
  list: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  mine: () => api.get("/products/mine/list"),
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.patch(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),

  uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    return api.post("/upload/products",
      formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  },
  
};
