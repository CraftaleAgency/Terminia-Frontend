import { fetchContracts } from '@/lib/actions/data'
import { ContractsList } from '@/components/dashboard/contracts-list'

export default async function ContractsPage() {
  const contracts = await fetchContracts()
  return <ContractsList contracts={contracts} />
}
