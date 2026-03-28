"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Clock,
  Wallet,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Radar,
  Receipt,
} from "lucide-react"
import Link from "next/link"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import {
  getContracts,
  getAlerts,
  getDashboardKPIs,
  formatCurrency,
  formatDate,
  type Contract,
  type Alert,
} from "@/lib/mock-data"

// Chart data
const contractTrendData = [
  { month: "Gen", contratti: 32, valore: 850000 },
  { month: "Feb", contratti: 35, valore: 920000 },
  { month: "Mar", contratti: 38, valore: 980000 },
  { month: "Apr", contratti: 42, valore: 1050000 },
  { month: "Mag", contratti: 45, valore: 1150000 },
  { month: "Giu", contratti: 47, valore: 1200000 },
]

const riskDistribution = [
  { name: "Basso", value: 28, color: "#10b981" },
  { name: "Medio", value: 12, color: "#f59e0b" },
  { name: "Alto", value: 7, color: "#ef4444" },
]

const expiryByMonth = [
  { month: "Lug", count: 3 },
  { month: "Ago", count: 5 },
  { month: "Set", count: 2 },
  { month: "Ott", count: 8 },
  { month: "Nov", count: 4 },
  { month: "Dic", count: 6 },
]

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [kpis, setKpis] = useState({
    activeContracts: 0,
    expiringIn30Days: 0,
    totalPortfolioValue: 0,
    pendingAlerts: 0,
    highMatchBandi: 0,
    toCollect: 0,
    toPay: 0,
  })

  useEffect(() => {
    setContracts(getContracts())
    setAlerts(getAlerts())
    setKpis(getDashboardKPIs())
  }, [])

  const kpiCards = [
    {
      label: "Contratti Attivi",
      value: kpis.activeContracts.toString(),
      delta: "+3 questo mese",
      deltaType: "positive" as const,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "In Scadenza 30gg",
      value: kpis.expiringIn30Days.toString(),
      delta: "Richiede attenzione",
      deltaType: "warning" as const,
      icon: Clock,
      color: "text-amber-400",
    },
    {
      label: "Valore Portfolio",
      value: formatCurrency(kpis.totalPortfolioValue),
      delta: "+12% vs anno precedente",
      deltaType: "positive" as const,
      icon: Wallet,
      color: "text-emerald-400",
    },
    {
      label: "Alert Aperti",
      value: kpis.pendingAlerts.toString(),
      delta: "Da gestire",
      deltaType: "negative" as const,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "Bandi Match Alto",
      value: kpis.highMatchBandi.toString(),
      delta: "Opportunita",
      deltaType: "positive" as const,
      icon: Radar,
      color: "text-primary",
    },
  ]

  const financialCards = [
    {
      label: "Da Incassare",
      value: formatCurrency(kpis.toCollect),
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Da Pagare",
      value: formatCurrency(kpis.toPay),
      icon: Receipt,
      color: "text-amber-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Panoramica del tuo portfolio contrattuale
          </p>
        </div>
        <Link
          href="/dashboard/contracts/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all glow-teal-sm text-sm"
        >
          Nuovo Contratto
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-card rounded-2xl p-5 border border-border/20 group hover:glow-teal-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-center ${kpi.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-foreground mb-1">
                {kpi.value}
              </div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
              <div className={`text-xs mt-2 ${
                kpi.deltaType === "positive" ? "text-emerald-400" :
                kpi.deltaType === "warning" ? "text-amber-400" :
                "text-red-400"
              }`}>
                {kpi.delta}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Financial summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        {financialCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.05 }}
              className="glass-card rounded-2xl p-5 border border-border/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{card.label}</div>
                  <div className={`text-2xl font-semibold ${card.color}`}>{card.value}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-center ${card.color}`}>
                  <Icon className="size-6" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contracts trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Andamento Contratti</h3>
              <p className="text-sm text-muted-foreground">Ultimi 6 mesi</p>
            </div>
          </div>
          <ChartContainer
            config={{
              contratti: { label: "Contratti", color: "hsl(175, 60%, 50%)" },
              valore: { label: "Valore", color: "hsl(185, 60%, 40%)" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contractTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorContratti" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175, 60%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(175, 60%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="contratti"
                  stroke="hsl(175, 60%, 50%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorContratti)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Risk distribution pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Distribuzione Rischio</h3>
            <p className="text-sm text-muted-foreground">Per contratto</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Expiry chart + quick stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expiry by month bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card rounded-2xl border border-border/20 p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Scadenze per Mese</h3>
            <p className="text-sm text-muted-foreground">Prossimi 6 mesi</p>
          </div>
          <ChartContainer
            config={{
              count: { label: "Scadenze", color: "hsl(175, 60%, 50%)" },
            }}
            className="h-[180px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiryByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(175, 60%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

        {/* Contracts list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="lg:col-span-2 glass-card rounded-2xl border border-border/20 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Contratti Recenti</h2>
            <Link href="/dashboard/contracts" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Vedi tutti
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border/10">
            {contracts.slice(0, 4).map((contract) => (
              <Link
                key={contract.id}
                href={`/dashboard/contracts/${contract.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {contract.title} {contract.counterpart_name ? `- ${contract.counterpart_name}` : contract.employee_name ? `- ${contract.employee_name}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {contract.contract_type.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase())} - scade {formatDate(contract.end_date)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    contract.status === "active" ? "border-primary/30 text-primary bg-primary/10" :
                    contract.status === "expiring" ? "border-amber-400/30 text-amber-400 bg-amber-400/10" :
                    "border-muted-foreground/30 text-muted-foreground bg-muted/20"
                  }`}>
                    {contract.status === "active" ? "Attivo" : 
                     contract.status === "expiring" ? "In Scadenza" : 
                     contract.status.replace(/^\w/, c => c.toUpperCase())}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    contract.risk_score < 30 ? "text-emerald-400 bg-emerald-400/10" :
                    contract.risk_score < 60 ? "text-amber-400 bg-amber-400/10" :
                    "text-red-400 bg-red-400/10"
                  }`}>
                    {contract.risk_score < 30 ? "Basso" : contract.risk_score < 60 ? "Medio" : "Alto"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Alerts panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="glass-card rounded-2xl border border-border/20 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Alert Recenti</h2>
          <Link href="/dashboard/alerts" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            Gestisci
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {alerts.slice(0, 4).map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                alert.status === "handled" ? "bg-muted/10" : "bg-muted/25"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                alert.priority === "critical" ? "bg-red-400" :
                alert.priority === "high" ? "bg-amber-400" :
                alert.priority === "medium" ? "bg-primary" :
                "bg-emerald-400"
              }`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${alert.status === "handled" ? "text-muted-foreground" : "text-foreground"}`}>
                  {alert.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {alert.contract_name || alert.counterpart_name || alert.description}
                </div>
                {alert.trigger_date && (
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    Scadenza: {formatDate(alert.trigger_date)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
