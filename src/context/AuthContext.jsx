import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginApi, registerApi } from '../api/authApi'
import { saveToken, saveUser, getToken, getUser, clearAuth } from '../utils/tokenUtils'
import { getDefaultRoute } from '../utils/roleUtils'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(getUser)
  const [token,   setToken]   = useState(getToken)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const navigate = useNavigate()

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await loginApi({ email, password })
      const userData = {
        id:    data.userId,
        name:  data.name,
        email: data.email,
        role:  data.role,
      }
      saveToken(data.token)
      saveUser(userData)
      setToken(data.token)
      setUser(userData)
      navigate(getDefaultRoute(data.role), { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Login failed. Check your credentials.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await registerApi({ name, email, password })
      const userData = {
        id:    data.userId,
        name:  data.name,
        email: data.email,
        role:  data.role,
      }
      saveToken(data.token)
      saveUser(userData)
      setToken(data.token)
      setUser(userData)
      navigate(getDefaultRoute(data.role), { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Registration failed. Try again.'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setToken(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const clearError = () => setError(null)

  const value = { user, token, loading, error, login, register, logout, clearError }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
