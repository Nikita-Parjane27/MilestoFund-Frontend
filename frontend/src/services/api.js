// services/api.js  –  All API calls centralised here
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes("/login")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;

export const authService = {
  register:       (d) => api.post("/auth/register", d),
  login:          (d) => api.post("/auth/login", d),
  getMe:          ()  => api.get("/auth/me"),
  updateProfile:  (d) => api.put("/auth/profile", d),
  changePassword: (d) => api.put("/auth/change-password", d),
};

export const projectService = {
  getAll:          (p)       => api.get("/projects", { params: p }),
  getFeatured:     ()        => api.get("/projects/featured"),
  getRecommended:  ()        => api.get("/projects/recommendations"),
  getById:         (id)      => api.get(`/projects/${id}`),
  create:          (data)    => api.post("/projects", data),
  update:          (id, d)   => api.put(`/projects/${id}`, d),
  remove:          (id)      => api.delete(`/projects/${id}`),
  addComment:      (id, d)   => api.post(`/projects/${id}/comments`, d),
  deleteComment:   (id, cid) => api.delete(`/projects/${id}/comments/${cid}`),
  postUpdate:      (id, d)   => api.post(`/projects/${id}/updates`, d),
  publishImpact:   (id, d)   => api.post(`/projects/${id}/impact-report`, d),
  toggleSave:      (id)      => api.post(`/projects/${id}/save`),
  getContributors: (id)      => api.get(`/projects/${id}/contributors`),
};

export const paymentService = {
  createOrder:        (d)   => api.post("/payments/create-order", d),
  verify:             (d)   => api.post("/payments/verify", d),
  getContribution:    (pid) => api.get(`/payments/contribution/${pid}`),
  getMyContributions: ()    => api.get("/payments/my-contributions"),
};

export const userService = {
  getProfile:   (id) => api.get(`/users/${id}/profile`),
  getDashboard: ()   => api.get("/users/dashboard"),
  getSaved:     ()   => api.get("/users/saved"),
};

export const aiService = {
  generate: (tool, inputs) => api.post("/ai/generate", { tool, inputs }),
};
