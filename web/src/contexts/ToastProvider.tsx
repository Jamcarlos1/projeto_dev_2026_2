import { useCallback, useState, type ReactNode } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { ToastContext } from './toast-context'

interface ToastState {
  message: string
  severity: 'success' | 'error'
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showSuccess = useCallback(
    (message: string) => setToast({ message, severity: 'success' }),
    []
  )
  const showError = useCallback((message: string) => setToast({ message, severity: 'error' }), [])

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)} sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  )
}
