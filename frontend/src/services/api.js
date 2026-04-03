import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const apiService = {
  // Auth
  login: (email, password) => api.post("/auth/login", { email, password }),
  getCurrentUser: () => api.get("/auth/me"),

  // Products
  getProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),

  // Categories
  getCategories: () => api.get("/categories"),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),

  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadMultipleImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    return api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Orders
  createOrder: (data) => api.post("/orders", data),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getOrdersByEmail: (email) => api.get(`/orders/by-email?email=${email}`),
  getAllOrders: (params) => api.get("/orders", { params }),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),

  // Payment
  createPaymentOrder: (amount) => api.post("/payment/create-order", { amount }),
  verifyPayment: (data) => api.post("/payment/verify", data),

  // Coupons
  validateCoupon: (code, orderAmount) =>
    api.post("/coupons/validate", { code, order_amount: orderAmount }),

  // Admin stats
  getAdminStats: () => api.get("/admin/stats"),

  // Customer auth (uses separate customer_token)
  customerLogin: (email, password) =>
    api.post("/customers/login", { email, password }),
  customerRegister: (data) => api.post("/customers/register", data),
  getCustomerMe: () => {
    const token = localStorage.getItem("customer_token");
    return api.get("/customers/me", { headers: { Authorization: `Bearer ${token}` } });
  },
};

export default api;
