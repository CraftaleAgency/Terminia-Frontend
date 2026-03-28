import { fetchCounterparts, fetchEmployees } from '@/lib/actions/data'
import { ContractNewForm } from '@/components/dashboard/contract-new-form'

export default async function NewContractPage() {
  const [counterparts, employees] = await Promise.all([
    fetchCounterparts(),
    fetchEmployees(),
  ])

  return <ContractNewForm counterparts={counterparts} employees={employees} />
}
