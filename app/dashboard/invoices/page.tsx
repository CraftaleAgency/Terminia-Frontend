import { fetchInvoices, fetchCounterparts, fetchContracts, getCompanyId } from '@/lib/actions/data'
import { InvoicesList } from '@/components/dashboard/invoices-list'
export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const [invoices, counterparts, contracts, companyId] = await Promise.all([
    fetchInvoices(),
    fetchCounterparts(),
    fetchContracts(),
    getCompanyId(),
  ])

  const unpaid = invoices.filter(i => i.payment_status === 'unpaid')
  const paid = invoices.filter(i => i.payment_status === 'paid')
  const overdue = invoices.filter(i => i.payment_status === 'overdue')

  const initialKpis = {
    unpaid: unpaid.length,
    paid: paid.length,
    overdue: overdue.length,
    toCollect: unpaid.reduce((sum, i) => sum + (i.amount_gross ?? 0), 0),
    collected: paid.reduce((sum, i) => sum + (i.amount_gross ?? 0), 0),
    overdueAmount: overdue.reduce((sum, i) => sum + (i.amount_gross ?? 0), 0),
  }

  return (
    <InvoicesList
      initialInvoices={invoices}
      counterparts={counterparts}
      contracts={contracts}
      companyId={companyId ?? ''}
      initialKpis={initialKpis}
    />
  )
}
