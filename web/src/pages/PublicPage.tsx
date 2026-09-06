import { useState } from 'react'
import { Box, Chip, Container, Stack, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import PetsIcon from '@mui/icons-material/Pets'
import { useAnimals } from '../hooks/useAnimals'
import type { Animal, Especie } from '../types/api'
import { AnimalCard } from '../components/AnimalCard'
import { AnimalCardSkeleton } from '../components/AnimalCardSkeleton'
import { AdoptionFormModal } from '../components/AdoptionFormModal'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { ESPECIE_FILTROS } from '../constants/labels'
import { tokens } from '../theme/theme'

function HeroImage({ src, position = 'center' }: { src: string; position?: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        backgroundColor: tokens.paperDark,
        borderRadius: 2,
        border: '3px solid rgba(255,255,255,0.25)',
      }}
    >
      {failed ? (
        <PetsIcon sx={{ fontSize: 64, color: tokens.moss }} />
      ) : (
        <Box
          component="img"
          src={src}
          alt=""
          onError={() => setFailed(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position }}
        />
      )}
    </Box>
  )
}

export function PublicPage() {
  const [filtro, setFiltro] = useState<Especie | 'todos'>('todos')
  const [selecionado, setSelecionado] = useState<Animal | null>(null)
  const { animais, isLoading, isError } = useAnimals(filtro)

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      
      <Box
        sx={{
          backgroundColor: tokens.moss,
          color: '#FFFFFF',
          borderBottom: `1.5px solid ${tokens.mossDark}`,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.12,
            backgroundImage: 'linear-gradient(135deg, transparent 0 49%, rgba(255,255,255,0.22) 50% 51%, transparent 52%)',
            backgroundSize: '34px 34px',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
              py: { xs: 6, md: 9 },
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ color: tokens.mustard, fontWeight: 700, letterSpacing: '0.12em' }}
              >
                Adoção responsável
              </Typography>
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: '2.1rem', md: '3rem' }, lineHeight: 1.15 }}
              >
                Cada ficha aqui é um começo de história diferente.
              </Typography>
              <Typography variant="body1" sx={{ mt: 2.5, maxWidth: 480, opacity: 0.92 }}>
                Somos a Patinhas em Casa, uma ONG que cuida de cães e gatos resgatados até
                encontrarem uma família. Escolha um animal abaixo e peça para conhecê-lo de
                perto — sem burocracia, com todo cuidado.
              </Typography>

              {!isLoading && !isError && (
                <Chip
                  label={
                    animais.length > 0
                      ? `${animais.length} ${animais.length === 1 ? 'animal esperando' : 'animais esperando'} por uma família agora`
                      : 'Nenhum animal disponível nessa categoria no momento'
                  }
                  sx={{
                    mt: 3.5,
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    py: 2.2,
                  }}
                />
              )}

              <Typography
                component="button"
                onClick={() => document.getElementById('animais')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mt: 3,
                  p: 0,
                  border: 0,
                  background: 'none',
                  color: '#FFFFFF',
                  font: 'inherit',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: 0.9,
                  '&:hover': { color: tokens.mustard },
                }}
              >
                Conheça os animais <ArrowDownwardIcon fontSize="small" />
              </Typography>
            </Box>

            
            <Box
              sx={{
                display: { xs: 'none', md: 'grid' },
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                height: 320,
              }}
            >
              
              <HeroImage src="https://qualanimal.com.br/wp-content/uploads/2022/12/cachorros-mais-bonitos-do-mundo04.jpg" />
              
              
              <Box sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 2, height: '100%' }}>
                <HeroImage
                  src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80"
                  position="center 32%"
                />
                <HeroImage src="https://curtamais.com.br/goiania/wp-content/uploads/sites/2/2024/10/elena-mozhvilo-Yi5q0fmrbY-unsplash.jpg" />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      
      <Container maxWidth="lg" id="animais" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, mb: 2.5, gap: 1 }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: tokens.mustardDark, fontWeight: 700 }}>
              Encontre seu companheiro
            </Typography>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '1.9rem' } }}>
              Animais disponíveis
            </Typography>
          </Box>
          {!isLoading && !isError && (
            <Typography variant="body2" color="text.secondary">
              {animais.length} {animais.length === 1 ? 'perfil' : 'perfis'} para conhecer
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap sx={{ mb: { xs: 3, md: 4 }, flexWrap: 'wrap' }}>
          {ESPECIE_FILTROS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              onClick={() => setFiltro(f.value)}
              color={filtro === f.value ? 'primary' : undefined}
              variant={filtro === f.value ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>

        {isLoading && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            {[1, 2, 3].map((n) => (
              <AnimalCardSkeleton key={n} />
            ))}
          </Box>
        )}

        {!isLoading && isError && (
          <Box sx={{ border: `1.5px dashed ${tokens.border}`, borderRadius: 1, p: 5, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif' }}>
              Não conseguimos carregar os animais agora
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Verifique sua conexão e recarregue a página. Se o problema continuar, tente
              novamente em alguns minutos.
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && animais.length === 0 && (
          <Box sx={{ border: `1.5px dashed ${tokens.border}`, borderRadius: 1, p: 5, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif' }}>
              Nenhum animal disponível nessa categoria agora
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Todos os animais dessa categoria já encontraram uma família, ou ainda não
              cadastramos nenhum. Volte em breve — a lista muda toda semana.
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && animais.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
              alignItems: 'stretch', // Garante que os cards estiquem para a mesma altura no grid
            }}
          >
            {animais.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} onQuero={setSelecionado} />
            ))}
          </Box>
        )}
      </Container>

      <Footer />

      <AdoptionFormModal animal={selecionado} onClose={() => setSelecionado(null)} />
    </Box>
  )
}