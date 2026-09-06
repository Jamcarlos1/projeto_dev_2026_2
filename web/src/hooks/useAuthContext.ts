import { useContext } from 'react'
import { AuthContext } from '../contexts/auth-context'

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext deve ser usado dentro de <AuthProvider>')
  }
  return ctx
}
