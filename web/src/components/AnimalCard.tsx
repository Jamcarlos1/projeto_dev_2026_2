import { useState } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'
import type { Animal } from '../types/api'
import { tokens } from '../theme/theme'
import { ESPECIE_LABEL, PORTE_LABEL, SEXO_LABEL } from '../constants/labels'

interface AnimalCardProps {
  animal: Animal
  onQuero: (animal: Animal) => void
}

export function AnimalCard({ animal, onQuero }: AnimalCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = animal.fotoUrl && !imageFailed

  return (
    <Box
      sx={{
        position: 'relative',
        border: `1.5px solid ${tokens.border}`,
        borderRadius: 1,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 3px 0 rgba(75, 99, 80, 0.08)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: tokens.moss,
          boxShadow: `0 10px 0 ${tokens.border}`,
        },
      }}
    >
      
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: tokens.paper,
          border: `1.5px solid ${tokens.border}`,
          zIndex: 2,
        }}
      />

      {showImage ? (
        <Box
          component="img"
          src={animal.fotoUrl ?? undefined}
          alt={animal.titulo}
          onError={() => setImageFailed(true)}
          sx={{
            width: '100%',
            aspectRatio: '4 / 3',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
            objectPosition:
              animal.especie === 'gato'
                ? 'center 40%'
                : animal.especie === 'cachorro'
                  ? 'center 35%'
                  : 'center center',
            borderBottom: `1.5px solid ${tokens.border}`,
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '4 / 3',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.paperDark,
            borderBottom: `1.5px solid ${tokens.border}`,
          }}
        >
          <PetsIcon sx={{ fontSize: 40, color: tokens.border }} />
        </Box>
      )}

      <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1.2, flexGrow: 1 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography variant="h5" component="h3" sx={{ fontSize: '1.4rem', minWidth: 0 }}>
            {animal.titulo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {animal.idade}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Chip size="small" label={ESPECIE_LABEL[animal.especie]} color="primary" variant="outlined" />
          <Chip size="small" label={PORTE_LABEL[animal.porte]} variant="outlined" />
          <Chip size="small" label={SEXO_LABEL[animal.sexo]} variant="outlined" />
        </Stack>

        {animal.descricao && (
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {animal.descricao}
          </Typography>
        )}

        <Box
          component="button"
          onClick={() => onQuero(animal)}
          sx={{
            mt: 1,
            border: 'none',
            backgroundColor: tokens.mustard,
            color: '#FFFFFF',
            fontWeight: 600,
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            borderRadius: 1,
            py: 1.1,
            cursor: 'pointer',
            transition: 'background-color 120ms ease',
            '&:hover': { backgroundColor: tokens.mustardDark },
          }}
        >
          Quero adotar {animal.titulo}
        </Box>
      </Box>
    </Box>
  )
}
