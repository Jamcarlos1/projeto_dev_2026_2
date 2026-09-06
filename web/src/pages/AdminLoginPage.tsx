import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuthContext } from '../hooks/useAuthContext'
import { tokens } from '../theme/theme'

export function AdminLoginPage() {
  const { login, loading, isAuthenticated } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setEmail('')
    setPassword('')
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = await login(email, password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.moss,
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', mb: 0.5 }}>
          Painel administrativo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Patinhas em Casa — acesso restrito à equipe.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} autoComplete="new-password">
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              name="login-field-email"
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              name="login-field-password"
            />
            <Button type="submit" variant="contained" disabled={loading} fullWidth size="large">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
