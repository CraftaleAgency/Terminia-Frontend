import { DocumentsView } from '@/components/dashboard/documents-view'
import { fetchContracts } from '@/lib/actions/data'
export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const contracts = await fetchContracts()
  const contractOptions = contracts.map(c => ({
    id: c.id,
    title: c.title ?? 'Contratto senza titolo',
    counterpart: c.counterpart_name ?? '—',
    expiresAt: c.end_date ?? '—',
  }))
  return <DocumentsView contracts={contractOptions} />
}
