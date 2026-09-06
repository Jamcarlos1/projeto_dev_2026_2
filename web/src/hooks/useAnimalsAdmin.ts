import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Animal } from '../types/api'

export interface AnimalFormData {
  titulo: string
  especie: Animal['especie']
  idade: string
  porte: Animal['porte']
  sexo: Animal['sexo']
  descricao: string
  fotoUrl: string
}

export function useAnimalsAdmin() {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false

    api
      .get<Animal[]>('/admin/animals')
      .then((res) => {
        if (cancelled) return
        setAnimais(res.data)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const create = useCallback(
    async (payload: AnimalFormData) => {
      await api.post('/admin/animals', payload)
      refetch()
    },
    [refetch]
  )

  const update = useCallback(
    async (id: number, payload: Partial<AnimalFormData & { ativa: boolean }>) => {
      await api.patch(`/admin/animals/${id}`, payload)
      refetch()
    },
    [refetch]
  )

  const remove = useCallback(
    async (id: number) => {
      await api.delete(`/admin/animals/${id}`)
      refetch()
    },
    [refetch]
  )

  return { animais, loading, create, update, remove, refetch }
}
