import { fetchContract } from '@/lib/actions/data'
import { ContractDetail, type ContractDetailProps } from '@/components/dashboard/contract-detail'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchContract(id)
  if (!data) notFound()
  // DB rows use `| null` where the component uses optional — structurally compatible at runtime
  return <ContractDetail {...(data as unknown as ContractDetailProps)} />
}
