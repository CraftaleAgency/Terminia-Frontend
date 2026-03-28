import { fetchCounterparts } from '@/lib/actions/data'
import { CounterpartsList } from '@/components/dashboard/counterparts-list'

export default async function CounterpartsPage() {
  const counterparts = await fetchCounterparts()
  return <CounterpartsList counterparts={counterparts} />
}
