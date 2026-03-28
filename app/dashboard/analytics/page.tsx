import { fetchAnalytics } from '@/lib/actions/data'
import { AnalyticsView } from '@/components/dashboard/analytics-view'

export default async function AnalyticsPage() {
  const data = await fetchAnalytics()
  if (!data) {
    return <AnalyticsView kpis={{ totalValue: 0, totalContracts: 0, renewalRate: 0, upcomingExpiries: 0 }} monthlyContractValue={[]} contractsByType={[]} riskTrend={[]} counterpartDistribution={[]} renewalForecast={[]} alertsByPriority={[]} />
  }
  return <AnalyticsView {...data} />
}
