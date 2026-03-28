import { fetchCounterpart } from '@/lib/actions/data'
import { CounterpartDetail } from '@/components/dashboard/counterpart-detail'
import { notFound } from 'next/navigation'

export default async function CounterpartPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchCounterpart(id)
  if (!data) notFound()
  return (
    <CounterpartDetail
      counterpart={data.counterpart}
      relatedContracts={data.contracts}
    />
  )
}
