import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { tokens } from '../theme/theme'

export function Header() {
  const scrollToAnimais = () => {
    document.getElementById('animais')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      component="header"
      sx={{
        borderBottom: `1.5px solid ${tokens.border}`,
        backgroundColor: 'rgba(246,241,231,0.94)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', py: { xs: 1.25, sm: 1.75 } }}
        >
          <Stack sx={{ lineHeight: 1 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, color: tokens.ink, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Patinhas em Casa
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: tokens.inkSoft, letterSpacing: '0.02em', display: { xs: 'none', sm: 'block' } }}
            >
              ONG de adoção responsável
            </Typography>
          </Stack>

          <Button
            onClick={scrollToAnimais}
            variant="outlined"
            sx={{
              borderColor: tokens.moss,
              color: tokens.moss,
              flexShrink: 0,
              '&:hover': { borderColor: tokens.mossDark, backgroundColor: 'rgba(75,99,80,0.06)' },
            }}
          >
            Ver animais
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
