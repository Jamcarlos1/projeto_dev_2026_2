import type { Especie, Porte, Sexo, StatusPedido } from '../types/api'

export const ESPECIE_LABEL: Record<Especie, string> = {
  cachorro: 'Cachorro',
  gato: 'Gato',
  outro: 'Outro',
}

export const PORTE_LABEL: Record<Porte, string> = {
  pequeno: 'Pequeno porte',
  medio: 'Médio porte',
  grande: 'Grande porte',
}

export const SEXO_LABEL: Record<Sexo, string> = {
  macho: 'Macho',
  femea: 'Fêmea',
}

export const STATUS_LABEL: Record<StatusPedido, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
}

export const ESPECIE_FILTROS: { value: Especie | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'cachorro', label: 'Cachorros' },
  { value: 'gato', label: 'Gatos' },
  { value: 'outro', label: 'Outros' },
]
