import { Box, Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { tokens } from '../theme/theme'

export function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: tokens.mossDark, color: '#FFFFFF', mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1.5 }}
        >
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Patinhas em Casa — ONG de adoção responsável.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.75, sm: 3 }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              contato@patinhasemcasa.org
            </Typography>
            <Typography
              component={Link}
              to="/admin/login"
              variant="body2"
              sx={{ color: '#FFFFFF', opacity: 0.7, textDecoration: 'underline' }}
            >
              Painel Administrativo
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
