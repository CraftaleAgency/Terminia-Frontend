"use client"

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

export interface AnalyticsViewProps {
  kpis: {
    totalValue: number
    totalContracts: number
    renewalRate: number
    upcomingExpiries: number
  }
  monthlyContractValue: { month: string; valore: number; contratti: number }[]
  contractsByType: { name: string; value: number; color: string }[]
  riskTrend: { month: string; basso: number; medio: number; alto: number }[]
  counterpartDistribution: { name: string; value: number; color: string }[]
  renewalForecast: { month: string; rinnovi: number; nuovi: number }[]
  alertsByPriority: { name: string; value: number; color: string }[]
}

export function AnalyticsView({
  kpis,
  monthlyContractValue,
  contractsByType,
  riskTrend,
  counterpartDistribution,
  renewalForecast,
  alertsByPriority,
}: AnalyticsViewProps) {
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
          <ChartContainer config={{ valore: { label: "Valore", color: "hsl(175, 60%, 50%)" } }} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyContractValue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175, 60%, 50%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(175, 60%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Area type="monotone" dataKey="valore" stroke="hsl(175, 60%, 50%)" strokeWidth={2} fillOpacity={1} fill="url(#colorValore)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>

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
              <ChartContainer config={{ value: { label: "Contratti" } }} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contractsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" nameKey="name">
                      {contractsByType.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
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
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">Nessun dato disponibile</div>
          )}
        </motion.div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
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
          <ChartContainer config={{ basso: { label: "Basso", color: "#10b981" }, medio: { label: "Medio", color: "#f59e0b" }, alto: { label: "Alto", color: "#ef4444" } }} className="h-[250px] w-full">
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
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-muted-foreground">Basso</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-xs text-muted-foreground">Medio</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-xs text-muted-foreground">Alto</span></div>
          </div>
        </motion.div>

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
          <ChartContainer config={{ rinnovi: { label: "Rinnovi", color: "hsl(175, 60%, 50%)" }, nuovi: { label: "Nuovi", color: "hsl(185, 60%, 35%)" } }} className="h-[250px] w-full">
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
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(175, 60%, 50%)" }} /><span className="text-xs text-muted-foreground">Rinnovi</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(185, 60%, 35%)" }} /><span className="text-xs text-muted-foreground">Nuovi</span></div>
          </div>
        </motion.div>
      </div>

      {/* Third Row */}
      <div className="grid lg:grid-cols-3 gap-6">
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
              <ChartContainer config={{ value: { label: "Controparti" } }} className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={counterpartDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" nameKey="name">
                      {counterpartDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
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
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">Nessun dato disponibile</div>
          )}
        </motion.div>

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
            <ChartContainer config={{ value: { label: "Alert" } }} className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsByPriority} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {alertsByPriority.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">Nessun alert</div>
          )}
        </motion.div>

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
          <ChartContainer config={{ contratti: { label: "Contratti", color: "hsl(175, 60%, 50%)" } }} className="h-[180px] w-full">
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
