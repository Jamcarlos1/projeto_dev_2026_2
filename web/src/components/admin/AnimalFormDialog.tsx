import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import type { Animal } from '../../types/api'
import type { AnimalFormData } from '../../hooks/useAnimalsAdmin'

interface AnimalFormDialogProps {
  open: boolean
  animal: Animal | null 
  onClose: () => void
  onSubmit: (data: AnimalFormData) => Promise<void>
}

const emptyForm: AnimalFormData = {
  titulo: '',
  especie: 'cachorro',
  idade: '',
  porte: 'medio',
  sexo: 'macho',
  descricao: '',
  fotoUrl: '',
}

function toFormData(animal: Animal): AnimalFormData {
  return {
    titulo: animal.titulo,
    especie: animal.especie,
    idade: animal.idade,
    porte: animal.porte,
    sexo: animal.sexo,
    descricao: animal.descricao ?? '',
    fotoUrl: animal.fotoUrl ?? '',
  }
}

export function AnimalFormDialog({ open, animal, onClose, onSubmit }: AnimalFormDialogProps) {
  const [form, setForm] = useState<AnimalFormData>(() => (animal ? toFormData(animal) : emptyForm))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    setForm(
      animal ? toFormData(animal) : { ...emptyForm }
    )
  }, [animal, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(form)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif' }}>
        {animal ? `Editar ${animal.titulo}` : 'Novo animal'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nome do animal"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Espécie"
                value={form.especie}
                onChange={(e) =>
                  setForm((f) => ({ ...f, especie: e.target.value as Animal['especie'] }))
                }
                fullWidth
              >
                <MenuItem value="cachorro">Cachorro</MenuItem>
                <MenuItem value="gato">Gato</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
              </TextField>
              <TextField
                label="Idade"
                placeholder="ex: 2 anos"
                value={form.idade}
                onChange={(e) => setForm((f) => ({ ...f, idade: e.target.value }))}
                required
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Porte"
                value={form.porte}
                onChange={(e) => setForm((f) => ({ ...f, porte: e.target.value as Animal['porte'] }))}
                fullWidth
              >
                <MenuItem value="pequeno">Pequeno</MenuItem>
                <MenuItem value="medio">Médio</MenuItem>
                <MenuItem value="grande">Grande</MenuItem>
              </TextField>
              <TextField
                select
                label="Sexo"
                value={form.sexo}
                onChange={(e) => setForm((f) => ({ ...f, sexo: e.target.value as Animal['sexo'] }))}
                fullWidth
              >
                <MenuItem value="macho">Macho</MenuItem>
                <MenuItem value="femea">Fêmea</MenuItem>
              </TextField>
            </Stack>
            <TextField
              label="URL da foto"
              placeholder="https://..."
              value={form.fotoUrl}
              onChange={(e) => setForm((f) => ({ ...f, fotoUrl: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Descrição"
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              multiline
              minRows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Salvando...' : animal ? 'Salvar alterações' : 'Cadastrar animal'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
