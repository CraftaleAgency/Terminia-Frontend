import { fetchEmployees } from '@/lib/actions/data'
import { EmployeesList } from '@/components/dashboard/employees-list'

export default async function EmployeesPage() {
  const employees = await fetchEmployees()
  return <EmployeesList employees={employees} />
}
