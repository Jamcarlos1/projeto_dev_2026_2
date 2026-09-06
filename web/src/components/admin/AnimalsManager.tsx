import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PetsIcon from '@mui/icons-material/Pets'
import { useAnimalsAdmin, type AnimalFormData } from '../../hooks/useAnimalsAdmin'
import { useToast } from '../../hooks/useToast'
import { extractErrorMessage } from '../../services/api'
import { ESPECIE_LABEL, PORTE_LABEL } from '../../constants/labels'
import type { Animal } from '../../types/api'
import { tokens } from '../../theme/theme'
import { AnimalFormDialog } from './AnimalFormDialog'

export function AnimalsManager() {
  const { animais, loading, create, update, remove } = useAnimalsAdmin()
  const { showSuccess, showError } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)

  const openCreateDialog = () => {
    setEditingAnimal(null)
    setDialogOpen(true)
  }

  const openEditDialog = (animal: Animal) => {
    setEditingAnimal(animal)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: AnimalFormData) => {
    try {
      if (editingAnimal) {
        await update(editingAnimal.id, data)
        showSuccess(`${data.titulo} atualizado com sucesso.`)
      } else {
        await create(data)
        showSuccess(`${data.titulo} cadastrado com sucesso.`)
      }
    } catch (err) {
      showError(extractErrorMessage(err))
      throw err // mantém o dialog aberto se der erro
    }
  }

  const handleToggleAtiva = async (animal: Animal) => {
    try {
      await update(animal.id, { ativa: !animal.ativa })
      showSuccess(
        animal.ativa
          ? `${animal.titulo} marcado como indisponível.`
          : `${animal.titulo} está disponível de novo.`
      )
    } catch (err) {
      showError(extractErrorMessage(err))
    }
  }

  const handleDelete = async (animal: Animal) => {
    const confirmed = window.confirm(
      `Excluir ${animal.titulo} permanentemente? Essa ação não pode ser desfeita.`
    )
    if (!confirmed) return

    try {
      await remove(animal.id)
      showSuccess(`${animal.titulo} removido.`)
    } catch (err) {
      showError(extractErrorMessage(err))
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Novo animal
        </Button>
      </Box>

      <TableContainer sx={{ border: `1.5px solid ${tokens.border}`, borderRadius: 1, overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 680 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: tokens.paperDark }}>
              <TableCell>Animal</TableCell>
              <TableCell>Espécie / Porte</TableCell>
              <TableCell align="center">Disponível na página pública</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} sx={{ color: tokens.moss }} />
                </TableCell>
              </TableRow>
            )}

            {!loading && animais.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    Nenhum animal cadastrado ainda. Clique em "Novo animal" para começar.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              animais.map((animal) => (
                <TableRow key={animal.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={animal.fotoUrl ?? undefined} sx={{ bgcolor: tokens.paperDark }}>
                        <PetsIcon sx={{ color: tokens.border }} />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {animal.titulo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={ESPECIE_LABEL[animal.especie]} sx={{ mr: 0.5 }} />
                    <Chip size="small" label={PORTE_LABEL[animal.porte]} variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={animal.ativa ? 'Clique para desativar' : 'Clique para reativar'}>
                      <Switch
                        checked={animal.ativa}
                        onChange={() => handleToggleAtiva(animal)}
                        color="primary"
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => openEditDialog(animal)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => handleDelete(animal)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AnimalFormDialog
        open={dialogOpen}
        animal={editingAnimal}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}
