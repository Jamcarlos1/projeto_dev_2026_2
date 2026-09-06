import { useCallback, useState } from 'react'
import { api, clearToken, extractErrorMessage, getToken, saveToken } from '../services/api'
import type { AdminUser, LoginResponse } from '../types/api'

const USER_KEY = 'patinhas_admin_user'

type LoginApiResponse = LoginResponse | { data: LoginResponse }

function loadStoredUser(): AdminUser | null {
  const raw = sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(loadStoredUser)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getToken()))

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await api.post<LoginApiResponse>('/auth/login', { email, password })
      const payload = 'data' in res.data ? res.data.data : res.data

      saveToken(payload.token)
      sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      setUser(payload.user)
      setIsAuthenticated(true)
      return { success: true as const }
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/account/logout')
    } catch {
      
      
    } finally {
      clearToken()
      sessionStorage.removeItem(USER_KEY)
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  return { user, isAuthenticated, loading, login, logout }
}
