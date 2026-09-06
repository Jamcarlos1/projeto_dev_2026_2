import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
})

const TOKEN_KEY = 'patinhas_admin_token'

export function saveToken(token: string) {
  if (!token || token === 'undefined' || token === 'null') {
    return
  }

  sessionStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (!token || token === 'undefined' || token === 'null') {
    sessionStorage.removeItem(TOKEN_KEY)
    return null
  }

  return token
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearToken()
      sessionStorage.removeItem('patinhas_admin_user')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login')
      }
    }
    return Promise.reject(error)
  }
)

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.error) return data.error as string
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((e: { message: string }) => e.message).join(' ')
    }
    if (error.response?.status === 401) return 'Sessão expirada. Faça login novamente.'
  }
  return 'Algo deu errado. Tente novamente em instantes.'
}
