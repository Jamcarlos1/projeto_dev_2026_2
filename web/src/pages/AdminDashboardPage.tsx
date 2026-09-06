import { useState } from 'react'
import { AdminLayout } from '../components/admin/AdminLayout'
import { RequestsTable } from '../components/admin/RequestsTable'
import { AnimalsManager } from '../components/admin/AnimalsManager'

export function AdminDashboardPage() {
  const [tab, setTab] = useState<'pedidos' | 'animais'>('pedidos')

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      {tab === 'pedidos' ? <RequestsTable /> : <AnimalsManager />}
    </AdminLayout>
  )
}
