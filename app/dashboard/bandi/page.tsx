import { fetchBandi } from '@/lib/actions/data'
import { BandiList } from '@/components/dashboard/bandi-list'
export const revalidate = 3600 // revalidate every hour

export default async function BandiPage() {
  const bandi = await fetchBandi()
  return <BandiList initialBandi={bandi} />
}
