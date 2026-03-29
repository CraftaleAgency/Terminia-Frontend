import { fetchAlertsWithRelations, getCompanyId, getUserId } from '@/lib/actions/data'
import { AlertsList } from '@/components/dashboard/alerts-list'
export const dynamic = 'force-dynamic'

export default async function AlertsPage() {
  const [alerts, companyId, userId] = await Promise.all([
    fetchAlertsWithRelations(),
    getCompanyId(),
    getUserId(),
  ])

  return (
    <AlertsList
      initialAlerts={alerts}
      companyId={companyId ?? ''}
      userId={userId ?? ''}
    />
  )
}
