import { fetchBandi } from '@/lib/actions/data'
import { BandiList } from '@/components/dashboard/bandi-list'

export default async function BandiPage() {
  const bandi = await fetchBandi()
  return <BandiList initialBandi={bandi} />
}
