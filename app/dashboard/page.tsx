import { fetchDashboardData } from '@/lib/actions/data'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const data = await fetchDashboardData()
  if (!data) {
    return <DashboardOverview contracts={[]} alerts={[]} loading={false} kpis={{ activeContracts: 0, expiringIn30Days: 0, totalPortfolioValue: 0, pendingAlerts: 0, highMatchBandi: 0, toCollect: 0, toPay: 0 }} contractTrendData={[]} riskDistribution={[]} expiryByMonth={[]} />
  }
  return <DashboardOverview {...data} />
}
