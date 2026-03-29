import { fetchBando } from '@/lib/actions/data'
import { BandoDetail } from '@/components/dashboard/bando-detail'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function BandoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchBando(id)
  if (!data) notFound()
  return <BandoDetail bando={data} />
}
