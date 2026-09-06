import { useCallback, useEffect, useState } from 'react'
import { api, extractErrorMessage } from '../services/api'
import type { AdoptionRequest, AdoptionRequestSummary, PaginatedResponse, StatusPedido } from '../types/api'

interface UseAdoptionRequestsParams {
  status: StatusPedido | 'todos'
  search: string
  page: number
  perPage: number
}

export function useAdoptionRequests({ status, search, page, perPage }: UseAdoptionRequestsParams) {
  const [data, setData] = useState<AdoptionRequest[]>([])
  const [total, setTotal] = useState(0)
  const [summary, setSummary] = useState<AdoptionRequestSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false

    Promise.all([
      api.get<PaginatedResponse<AdoptionRequest>>('/admin/adoption-requests', {
        params: {
          page,
          perPage,
          status: status !== 'todos' ? status : undefined,
          search: search.trim() || undefined,
        },
      }),
      api.get<AdoptionRequestSummary>('/admin/adoption-requests/summary'),
    ])
      .then(([requestsRes, summaryRes]) => {
        if (cancelled) return
        setData(requestsRes.data.data)
        setTotal(requestsRes.data.meta.total)
        setSummary(summaryRes.data)
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(extractErrorMessage(err))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [status, search, page, perPage, refreshKey])

  const confirm = useCallback(
    async (id: number) => {
      await api.patch(`/admin/adoption-requests/${id}/confirm`)
      refetch()
    },
    [refetch]
  )

  const cancel = useCallback(
    async (id: number) => {
      await api.patch(`/admin/adoption-requests/${id}/cancel`)
      refetch()
    },
    [refetch]
  )

  const exportCsv = useCallback(async () => {
    const response = await api.get('/admin/adoption-requests/export', {
      params: {
        status: status !== 'todos' ? status : undefined,
        search: search.trim() || undefined,
      },
      responseType: 'blob',
    })
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pedidos-adocao.csv'
    link.click()
    URL.revokeObjectURL(url)
  }, [search, status])

  return { data, total, summary, loading, error, confirm, cancel, exportCsv, refetch }
}
