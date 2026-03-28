"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"

// Helper to get month labels
const getMonthLabels = (months: number = 12) => {
  const labels = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(d.toLocaleDateString('it-IT', { month: 'short' }))
  }
  return labels
}

const getFutureMonthLabels = (months: number = 6) => {
  const labels = []
  const now = new Date()
  for (let i = 1; i <= months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    labels.push(d.toLocaleDateString('it-IT', { month: 'short' }))
  }
  return labels
}

export default function AnalyticsPage() {
  const { user } = useUser()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState({
    totalValue: 0,
    totalContracts: 0,
    renewalRate: 0,
    upcomingExpiries: 0,
  })
  const [monthlyContractValue, setMonthlyContractValue] = useState<{month: string, valore: number, contratti: number}[]>([])
  const [contractsByType, setContractsByType] = useState<{name: string, value: number, color: string}[]>([])
  const [riskTrend, setRiskTrend] = useState<{month: string, basso: number, medio: number, alto: number}[]>([])
  const [counterpartDistribution, setCounterpartDistribution] = useState<{name: string, value: number, color: string}[]>([])
  const [renewalForecast, setRenewalForecast] = useState<{month: string, rinnovi: number, nuovi: number}[]>([])
  const [alertsByPriority, setAlertsByPriority] = useState<{name: string, value: number, color: string}[]>([])

  useEffect(() => {
    if (!user) return

    const fetchAnalyticsData = async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (!userData?.company_id) {
          setLoading(false)
          return
        }

        const companyId = userData.company_id

        // Fetch contracts for analytics
        const { data: contracts } = await supabase
          .from('contracts')
          .select('*')
          .eq('company_id', companyId)

        // Fetch counterparts
        const { data: counterparts } = await supabase
          .from('counterparts')
          .select('*')
          .eq('company_id', companyId)

        // Fetch alerts
        const { data: alerts } = await supabase
          .from('alerts')
          .select('*')
          .eq('company_id', companyId)

        // Calculate KPIs
        const activeContracts = contracts?.filter(c => c.status === 'active') || []
        const totalValue = activeContracts.reduce((sum, c) => sum + (c.value || 0), 0)
        const totalContracts = activeContracts.length

        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        const upcomingExpiries = activeContracts.filter(c =>
          new Date(c.end_date ?? '') <= thirtyDaysFromNow
        ).length

        setKpis({
          totalValue,
          totalContracts,
          renewalRate: 0, // Would need historical data
          upcomingExpiries,
        })

        // Monthly contract value (empty for now - would need historical data)
        const monthLabels = getMonthLabels(12)
        setMonthlyContractValue(monthLabels.map(month => ({
          month,
          valore: 0,
          contratti: 0,
        })))

        // Contracts by type
        const typeCount: Record<string, number> = {}
        activeContracts.forEach(c => {
          const type = c.contract_type || 'other'
          typeCount[type] = (typeCount[type] || 0) + 1
        })
        const typeColors: Record<string, string> = {
          'service_supply': '#3dc1c3',
          'goods_supply': '#0d6f7f',
          'framework': '#10b981',
          'nda': '#f59e0b',
          'other': '#8b5cf6',
        }
        setContractsByType(Object.entries(typeCount).map(([name, value]) => ({
          name: name.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
          value,
          color: typeColors[name] || typeColors['other'],
        })))

        // Risk distribution (empty for now - would need risk_score data)
        const riskLabels = getMonthLabels(6)
        setRiskTrend(riskLabels.map(month => ({
          month,
          basso: 0,
          medio: 0,
          alto: 0,
        })))

        // Counterpart distribution
        const counterpartTypes: Record<string, number> = {}
        counterparts?.forEach(c => {
          const type = c.type || 'other'
          counterpartTypes[type] = (counterpartTypes[type] || 0) + 1
        })
        const counterpartColors: Record<string, string> = {
          'supplier': '#3dc1c3',
          'client': '#0d6f7f',
          'partner': '#10b981',
          'other': '#f59e0b',
        }
        setCounterpartDistribution(Object.entries(counterpartTypes).map(([name, value]) => ({
          name: name.replace(/^\w/, c => c.toUpperCase()),
          value,
          color: counterpartColors[name] || counterpartColors['other'],
        })))

        // Renewal forecast (empty for now)
        const futureMonths = getFutureMonthLabels(6)
        setRenewalForecast(futureMonths.map(month => ({
          month,
          rinnovi: 0,
          nuovi: 0,
        })))

        // Alerts by priority
        const priorityCount: Record<string, number> = {}
        alerts?.forEach(a => {
          const priority = a.priority || 'low'
          priorityCount[priority] = (priorityCount[priority] || 0) + 1
        })
        const priorityColors: Record<string, string> = {
          'critical': '#ef4444',
          'high': '#f59e0b',
          'medium': '#3dc1c3',
          'low': '#10b981',
        }
        const priorityLabels: Record<string, string> = {
          'critical': 'Critico',
          'high': 'Alto',
          'medium': 'Medio',
          'low': 'Basso',
        }
        setAlertsByPriority(Object.entries(priorityCount).map(([key, value]) => ({
          name: priorityLabels[key] || key,
          value,
          color: priorityColors[key] || priorityColors['low'],
        })))

      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [user, supabase])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  const kpiCards = [
    {
      label: "Valore Totale Portfolio",
      value: formatCurrency(kpis.totalValue),
      change: "-",
      changeType: "neutral",
      icon: TrendingUp,
    },
    {
      label: "Contratti Gestiti",
      value: kpis.totalContracts.toString(),
      change: "-",
      changeType: "neutral",
      icon: BarChart3,
    },
    {
      label: "Tasso Rinnovo",
      value: "-",
      change: "-",
      changeType: "neutral",
      icon: Activity,
    },
    {
      label: "Scadenze Prossime",
      value: kpis.upcomingExpiries.toString(),
      change: "entro 30gg",
      changeType: kpis.upcomingExpiries > 0 ? "warning" : "neutral",
      icon: Calendar,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Analisi dettagliata del tuo portfolio contrattuale
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-card rounded-2xl p-5 border border-border/20 hover:glow-teal-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Icon className="size-5" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  kpi.changeType === "positive" ? "bg-emerald-400/10 text-emerald-400" :
                  kpi.changeType === "warning" ? "bg-amber-400/10 text-amber-400" :
                  "bg-muted/30 text-muted-foreground"
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-foreground">{kpi.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contract Value Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Andamento Valore Portfolio</h3>
              <p className="text-sm text-muted-foreground">Ultimi 12 mesi</p>
            </div>
          </div>
          <ChartContainer
            config={{
              valore: { label: "Valore", color: "hsl(175, 60%, 50%)" },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyContractValue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175, 60%, 50%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(175, 60%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Area
                  type="monotone"
                  dataKey="valore"
                  stroke="hsl(175, 60%, 50%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Contracts by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Contratti per Tipologia</h3>
            <p className="text-sm text-muted-foreground">Distribuzione attuale</p>
          </div>
          {contractsByType.length > 0 ? (
            <>
              <ChartContainer
                config={{
                  value: { label: "Contratti" },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contractsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {contractsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {contractsByType.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Nessun dato disponibile
            </div>
          )}
        </motion.div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Risk Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Trend Rischio Contrattuale</h3>
            <p className="text-sm text-muted-foreground">Ultimi 6 mesi</p>
          </div>
          <ChartContainer
            config={{
              basso: { label: "Basso", color: "#10b981" },
              medio: { label: "Medio", color: "#f59e0b" },
              alto: { label: "Alto", color: "#ef4444" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="basso" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medio" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="alto" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Basso</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Medio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">Alto</span>
            </div>
          </div>
        </motion.div>

        {/* Renewal Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Previsione Rinnovi</h3>
            <p className="text-sm text-muted-foreground">Prossimi 6 mesi</p>
          </div>
          <ChartContainer
            config={{
              rinnovi: { label: "Rinnovi", color: "hsl(175, 60%, 50%)" },
              nuovi: { label: "Nuovi", color: "hsl(185, 60%, 35%)" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={renewalForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="rinnovi" stroke="hsl(175, 60%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="nuovi" stroke="hsl(185, 60%, 35%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(175, 60%, 50%)" }} />
              <span className="text-xs text-muted-foreground">Rinnovi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(185, 60%, 35%)" }} />
              <span className="text-xs text-muted-foreground">Nuovi</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Third Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Counterpart Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Controparti</h3>
            <p className="text-sm text-muted-foreground">Per categoria</p>
          </div>
          {counterpartDistribution.length > 0 ? (
            <>
              <ChartContainer
                config={{
                  value: { label: "Controparti" },
                }}
                className="h-[180px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={counterpartDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {counterpartDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {counterpartDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              Nessun dato disponibile
            </div>
          )}
        </motion.div>

        {/* Alerts by Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Alert per Priorita</h3>
            <p className="text-sm text-muted-foreground">Distribuzione attuale</p>
          </div>
          {alertsByPriority.length > 0 ? (
            <ChartContainer
              config={{
                value: { label: "Alert" },
              }}
              className="h-[180px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsByPriority} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {alertsByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              Nessun alert
            </div>
          )}
        </motion.div>

        {/* Contract Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Crescita Contratti</h3>
            <p className="text-sm text-muted-foreground">Ultimi 12 mesi</p>
          </div>
          <ChartContainer
            config={{
              contratti: { label: "Contratti", color: "hsl(175, 60%, 50%)" },
            }}
            className="h-[180px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyContractValue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="contratti" stroke="hsl(175, 60%, 50%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>
      </div>
    </div>
  )
}
