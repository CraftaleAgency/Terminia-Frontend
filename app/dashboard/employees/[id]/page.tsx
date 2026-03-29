import { fetchEmployee } from '@/lib/actions/data'
import { EmployeeDetail } from '@/components/dashboard/employee-detail'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchEmployee(id)
  if (!data) notFound()
  return (
    <EmployeeDetail
      employee={data.employee}
      relatedContracts={data.contracts}
    />
  )
}
