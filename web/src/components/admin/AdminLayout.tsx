import { useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { tokens } from '../../theme/theme'

interface AdminLayoutProps {
  activeTab: 'pedidos' | 'animais'
  onTabChange: (tab: 'pedidos' | 'animais') => void
  children: React.ReactNode
}

export function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: tokens.paper }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: tokens.mossDark,
          borderBottom: `1.5px solid ${tokens.border}`,
          backgroundImage: 'linear-gradient(125deg, rgba(255,255,255,0.06), transparent 45%)',
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Fraunces", serif', flexGrow: 1, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
          >
            Patinhas em Casa — Painel
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ opacity: 0.85, display: { xs: 'none', sm: 'block' } }}>
              {user.fullName ?? user.email}
            </Typography>
          )}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: '#FFFFFF' }}
            size="small"
          >
            Sair
          </Button>
        </Toolbar>

        <Tabs
          value={activeTab}
          onChange={(_, value) => onTabChange(value)}
          textColor="inherit"
          sx={{
            px: 2,
            overflowX: 'auto',
            '& .MuiTabs-flexContainer': { minWidth: 'max-content' },
            '& .MuiTabs-indicator': { backgroundColor: tokens.mustard, height: 3 },
          }}
        >
          <Tab label="Pedidos de adoção" value="pedidos" />
          <Tab label="Animais" value="animais" />
        </Tabs>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
          <Typography variant="overline" sx={{ color: tokens.mustardDark, fontWeight: 700, letterSpacing: '0.12em' }}>
            Gestão da ONG
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Tudo em um só lugar
          </Typography>
        </Box>
        {children}
      </Box>
    </Box>
  )
}
