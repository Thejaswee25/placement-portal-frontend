import axios from 'axios'
import { getToken, clearAuth } from '../utils/tokenUtils'

const axiosInstance = axios.create({
  baseURL: 'https://placement-portal-backend-cjgw.onrender.com', // ✅ FIXED
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach JWT (except auth routes) ────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()

    // 🚨 DO NOT attach token for login/register endpoints
    if (token && !config.url.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 (token expired/invalid) ────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
