import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Animal, Especie } from '../types/api'

type LoadState = 'loading' | 'error' | 'ready'


export function useAnimals(filtro: Especie | 'todos') {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let cancelled = false
    const params = filtro !== 'todos' ? { especie: filtro } : undefined

    api
      .get<Animal[]>('/animals', { params })
      .then((res) => {
        if (cancelled) return
        setAnimais(res.data)
        setState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setState('error')
      })

    return () => {
      cancelled = true
    }
  }, [filtro])

  return { animais, isLoading: state === 'loading', isError: state === 'error' }
}
