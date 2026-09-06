import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { Animal } from '../types/api'
import { api, extractErrorMessage } from '../services/api'
import { tokens } from '../theme/theme'

interface AdoptionFormModalProps {
  animal: Animal | null
  onClose: () => void
}

interface FormState {
  nome: string
  email: string
  telefone: string
  dataVisita: string
  horarioVisita: string
  mensagem: string
}

const emptyForm: FormState = {
  nome: '',
  email: '',
  telefone: '',
  dataVisita: '',
  horarioVisita: '',
  mensagem: '',
}

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {}

  if (form.nome.trim().length < 2) errors.nome = 'Digite seu nome completo.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Digite um e-mail válido.'
  if (form.telefone.trim().length < 8) errors.telefone = 'Digite um telefone com DDD.'
  if (!form.dataVisita) errors.dataVisita = 'Escolha uma data para a visita.'
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(form.horarioVisita)) {
    errors.horarioVisita = 'Escolha um horário válido.'
  }

  return errors
}

export function AdoptionFormModal({ animal, onClose }: AdoptionFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleClose = () => {
    setForm(emptyForm)
    setFieldErrors({})
    setSubmitError(null)
    setSuccess(false)
    onClose()
  }

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!animal) return

    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await api.post('/adoption-requests', {
        animalId: animal.id,
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        dataVisita: form.dataVisita,
        horarioVisita: form.horarioVisita,
        mensagem: form.mensagem.trim() || undefined,
      })
      setSuccess(true)
    } catch (error) {
      setSubmitError(extractErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={Boolean(animal)} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', pr: 6 }}>
        {success ? 'Pedido enviado' : `Pedido de adoção — ${animal?.titulo}`}
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Box sx={{ py: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Recebemos seu pedido para adotar {animal?.titulo}! Ele está com status <b>pendente</b>.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Nossa equipe vai entrar em contato pelo e-mail ou telefone informado para confirmar
              a visita. Obrigado por dar um lar!
            </Typography>
            <Button onClick={handleClose} variant="contained" sx={{ mt: 3 }} fullWidth>
              Fechar
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Preencha seus dados e escolha um horário para conhecer {animal?.titulo}{' '}
                pessoalmente. O pedido fica pendente até nossa equipe confirmar.
              </Typography>

              {submitError && <Alert severity="error">{submitError}</Alert>}

              <TextField
                label="Seu nome"
                value={form.nome}
                onChange={handleChange('nome')}
                error={Boolean(fieldErrors.nome)}
                helperText={fieldErrors.nome}
                fullWidth
              />
              <TextField
                label="E-mail"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                fullWidth
              />
              <TextField
                label="Telefone (com DDD)"
                value={form.telefone}
                onChange={handleChange('telefone')}
                error={Boolean(fieldErrors.telefone)}
                helperText={fieldErrors.telefone}
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Data desejada para visita"
                  type="date"
                  value={form.dataVisita}
                  onChange={handleChange('dataVisita')}
                  error={Boolean(fieldErrors.dataVisita)}
                  helperText={fieldErrors.dataVisita}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
                <TextField
                  label="Horário"
                  type="time"
                  value={form.horarioVisita}
                  onChange={handleChange('horarioVisita')}
                  error={Boolean(fieldErrors.horarioVisita)}
                  helperText={fieldErrors.horarioVisita}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Mensagem (opcional)"
                value={form.mensagem}
                onChange={handleChange('mensagem')}
                multiline
                minRows={2}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={submitting}
                sx={{ backgroundColor: tokens.mustard, '&:hover': { backgroundColor: tokens.mustardDark } }}
              >
                {submitting ? 'Enviando...' : 'Enviar pedido de adoção'}
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
