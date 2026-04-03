// src/lib/api.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }).then((r) => r.data),
  register: (data) =>
    api.post('/api/auth/register', data).then((r) => r.data),
  me: () =>
    api.get('/api/auth/me').then((r) => r.data),
}

// ─── Branches ─────────────────────────────────────────────────────────────
export const branchApi = {
  getAll: () => api.get('/api/branches').then((r) => r.data),
  getById: (id) => api.get(`/api/branches/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/branches', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/branches/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/branches/${id}`),
}

// ─── Users / Staff ────────────────────────────────────────────────────────
export const userApi = {
  getAll: () => api.get('/api/users').then((r) => r.data),
  getunmanagers: () => api.get('/api/users/un-managers').then((r)=> r.data),
  getsorted: (name) => api.get('/api/users/sorted-users',{params:{name}}).then((r)=> r.data),
  getByBranch: (branchId) =>
    api.get(`/api/users/branch/${branchId}`).then((r) => r.data),
  create: (data) => api.post('/api/users', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/users/${id}`, data).then((r) => r.data),
  suspend: (id) => api.put(`/api/users/${id}/suspend`),
  restore: (id) => api.put(`/api/users/${id}/restore`),
  delete: (id) => api.delete(`/api/users/${id}`),
}

// ─── Products ─────────────────────────────────────────────────────────────
export const productApi = {
  getAll: () => api.get('/api/products').then((r) => r.data),
  getById: (id) => api.get(`/api/products/${id}`).then((r) => r.data),
  getByCategory: (cat) =>
    api.get('/api/products/category', { params: { category: cat } }).then((r) => r.data),

  create: (data) => {
    const formData = new FormData()
    const { imageFile, ...productData } = data

    formData.append(
      'data',
      new Blob([JSON.stringify(productData)], { type: 'application/json' })
    )

    if (imageFile) {
      formData.append('image', imageFile)
    }

    return api.post('/api/products', formData, {
      headers: { 'Content-Type': undefined },
    })
  },

 update: (id, data) => {
    const formData = new FormData()

    const { imageFile, ...productData } = data

    formData.append(
      "data",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    )

    if (imageFile) {
      formData.append("image", imageFile)
    }

    return api.put(`/api/products/${id}`, formData, {
      headers: { "Content-Type": undefined }
    }).then((r) => r.data)
  },

  delete: (id) => api.delete(`/api/products/${id}`),
}

// ─── Inventory ────────────────────────────────────────────────────────────
export const inventoryApi = {
  getByBranch: (branchId) =>
    api.get(`/api/inventory/branch/${branchId}`).then((r) => r.data),
  update: (data) => api.put('/api/inventory/update', data).then((r) => r.data),
}

// ─── Orders / POS ─────────────────────────────────────────────────────────
export const orderApi = {
  create: (data) => api.post('/api/orders', data).then((r) => r.data),
  getRecentByBranch: (branchId) =>
    api.get(`/api/orders/branch/${branchId}/recent`).then((r) => r.data),
}

// ─── Alerts ───────────────────────────────────────────────────────────────
export const alertApi = {
  getAll: (status) =>
    api.get('/api/alerts', status ? { params: { status } } : {}).then((r) => r.data),
  getByBranch: (branchId) =>
    api.get(`/api/alerts/branch/${branchId}`).then((r) => r.data),
  resolve: (id) => api.put(`/api/alerts/${id}/resolve`),
}

// ─── Analytics ────────────────────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: (period) =>
    api.get(`/api/analytics/dashboard?period=${period}`).then(r => r.data),
  getBranchRanking: () => api.get('/api/analytics/branch-ranking').then((r) => r.data),
  getTopProducts: () => api.get('/api/analytics/top-products').then((r) => r.data),
  getWeeklyBranchRevenue: () =>
    api.get('/api/analytics/weekly-branch-revenue').then((r) => r.data),
  exportAnalytics: (period) =>
    api.get(`/api/analytics/export?period=${period}`, {
      responseType: "blob"
    }),
  getBranchAOV: () => api.get('/api/analytics/branch-aov').then((r) => r.data),
  getMonthlyRevenue: () =>
    api.get('/api/analytics/revenue/monthly').then(r => r.data),
  getBranchRevenueGrowth: () =>
    api.get("/api/analytics/branch-revenue-growth").then(r => r.data),
  getUnderperformingBranches: () =>
    api.get("/api/analytics/underperforming").then(res => res.data),
  getRevenue: ()=> api.get('/api/analytics/total-revenue-30days').then((r)=> r.data),
  getBranchInsight: (branchId) => {
    if (!branchId) return Promise.resolve(null)
    return api.get(`/api/analytics/branch-insight/${branchId}`).then(res => res.data)
  },
}

// ─── AI Insights ──────────────────────────────────────────────────────────
export const insightApi = {
  getAll: () => api.get('/api/insights').then((r) => r.data),
  getByBranch: (branchId) =>
    api.get(`/api/insights/branch/${branchId}`).then((r) => r.data),
  generate: () => api.post('/api/insights/generate').then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/api/insights/${id}/status`, { status }).then((r) => r.data),
  deleteAll: () => api.delete("/api/insights/delete-all"),
  recommendation: (context,data) =>
    api.post("/api/insights/recommendation",{context,data})
}

// ─── Settings ─────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get('/api/settings').then((r) => r.data),
  update: (data) => api.put('/api/settings', data).then((r) => r.data),
}

export default api
