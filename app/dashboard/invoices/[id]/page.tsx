import { fetchInvoice } from '@/lib/actions/data'
import { InvoiceDetail } from '@/components/dashboard/invoice-detail'
import { notFound } from 'next/navigation'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchInvoice(id)
  if (!data) notFound()
  return <InvoiceDetail {...data} />
}
