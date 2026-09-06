import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import DownloadIcon from '@mui/icons-material/Download'
import { useAdoptionRequests } from '../../hooks/useAdoptionRequests'
import { useToast } from '../../hooks/useToast'
import { extractErrorMessage } from '../../services/api'
import { STATUS_LABEL } from '../../constants/labels'
import type { StatusPedido } from '../../types/api'
import { tokens } from '../../theme/theme'

const statusChipColor: Record<StatusPedido, 'warning' | 'success' | 'default'> = {
  pendente: 'warning',
  confirmado: 'success',
  cancelado: 'default',
}


function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

export function RequestsTable() {
  const [status, setStatus] = useState<StatusPedido | 'todos'>('todos')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [actingOnId, setActingOnId] = useState<number | null>(null)

  const search = useDebouncedValue(searchInput, 400)
  const { showSuccess, showError } = useToast()
  const { data, total, summary, loading, error, confirm, cancel, exportCsv } = useAdoptionRequests({
    status,
    search,
    page,
    perPage,
  })

  const handleStatusChange = (value: StatusPedido | 'todos') => {
    setStatus(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const handleConfirm = async (id: number, nome: string) => {
    setActingOnId(id)
    try {
      await confirm(id)
      showSuccess(`Pedido de ${nome} confirmado. O animal foi marcado como indisponível.`)
    } catch (err) {
      showError(extractErrorMessage(err))
    } finally {
      setActingOnId(null)
    }
  }

  const handleCancel = async (id: number, nome: string) => {
    setActingOnId(id)
    try {
      await cancel(id)
      showSuccess(`Pedido de ${nome} cancelado.`)
    } catch (err) {
      showError(extractErrorMessage(err))
    } finally {
      setActingOnId(null)
    }
  }

  const handleExport = async () => {
    try {
      await exportCsv()
      showSuccess('CSV exportado com os filtros atuais.')
    } catch (err) {
      showError(extractErrorMessage(err))
    }
  }

  return (
    <Box>
      {summary && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1.5, mb: 2.5 }}>
          {[
            ['Pendentes', summary.pendentes, tokens.mustard],
            ['Confirmados', summary.confirmados, tokens.moss],
            ['Cancelados', summary.cancelados, tokens.rust],
            ['Animais disponíveis', summary.animaisDisponiveis, tokens.inkSoft],
          ].map(([label, value, color]) => (
            <Box key={label} sx={{ p: 1.5, border: `1.5px solid ${tokens.border}`, borderTop: `4px solid ${color}`, backgroundColor: '#FFFFFF' }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="h5" sx={{ lineHeight: 1.2 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as StatusPedido | 'todos')}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="pendente">Pendente</MenuItem>
          <MenuItem value="confirmado">Confirmado</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>

        <TextField
          label="Buscar por nome ou e-mail"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 240 }}
        />
        <Tooltip title="Baixar pedidos filtrados em CSV">
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Exportar CSV
          </Button>
        </Tooltip>
      </Box>

      <TableContainer sx={{ border: `1.5px solid ${tokens.border}`, borderRadius: 1, overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: tokens.paperDark }}>
              <TableCell>Solicitante</TableCell>
              <TableCell>Animal</TableCell>
              <TableCell>Visita desejada</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} sx={{ color: tokens.moss }} />
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    {status !== 'todos' || search
                      ? 'Nenhum pedido encontrado com esses filtros.'
                      : 'Nenhum pedido de adoção chegou ainda. Assim que alguém enviar um pelo site, ele aparece aqui.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              data.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {req.nome}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {req.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{req.animal?.titulo ?? `#${req.animalId}`}</TableCell>
                  <TableCell>
                    {new Date(`${req.dataVisita}T00:00:00`).toLocaleDateString('pt-BR')} às{' '}
                    {req.horarioVisita}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={STATUS_LABEL[req.status]}
                      color={statusChipColor[req.status]}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {req.status === 'pendente' ? (
                      <>
                        <Tooltip title="Confirmar adoção">
                          <span>
                            <IconButton
                              size="small"
                              color="success"
                              disabled={actingOnId === req.id}
                              onClick={() => handleConfirm(req.id, req.nome)}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Cancelar pedido">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={actingOnId === req.id}
                              onClick={() => handleCancel(req.id, req.nome)}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        rowsPerPage={perPage}
        onRowsPerPageChange={(e) => {
          setPerPage(Number(e.target.value))
          setPage(1)
        }}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Box>
  )
}
