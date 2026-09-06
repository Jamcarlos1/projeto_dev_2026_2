export type Especie = 'cachorro' | 'gato' | 'outro'
export type Porte = 'pequeno' | 'medio' | 'grande'
export type Sexo = 'macho' | 'femea'
export type StatusPedido = 'pendente' | 'confirmado' | 'cancelado'

export interface Animal {
  id: number
  titulo: string
  especie: Especie
  idade: string
  porte: Porte
  sexo: Sexo
  descricao: string | null
  fotoUrl: string | null
  ativa: boolean
  createdAt: string
  updatedAt: string
}

export interface AdoptionRequest {
  id: number
  animalId: number
  animal?: Animal
  nome: string
  email: string
  telefone: string
  dataVisita: string
  horarioVisita: string
  mensagem: string | null
  status: StatusPedido
  motivoCancelamento: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
  data: T[]
}

export interface AdoptionRequestSummary {
  pendentes: number
  confirmados: number
  cancelados: number
  animaisDisponiveis: number
}

export interface CreateAdoptionRequestPayload {
  animalId: number
  nome: string
  email: string
  telefone: string
  dataVisita: string
  horarioVisita: string
  mensagem?: string
}


export interface ApiValidationError {
  errors: Array<{ field?: string; message: string; rule?: string }>
}


export interface ApiBusinessError {
  error: string
}

export interface AdminUser {
  id: number
  fullName: string | null
  email: string
  initials: string
}

export interface LoginResponse {
  user: AdminUser
  token: string
}
