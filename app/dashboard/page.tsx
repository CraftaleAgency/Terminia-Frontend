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
} from "lucide-react"
import Link from "next/link"
import {
  getContracts,
  getAlerts,
  getDashboardKPIs,
  formatCurrency,
  formatDate,
  type Contract,
  type Alert,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [kpis, setKpis] = useState({
    activeContracts: 0,
    expiringContracts: 0,
    totalValue: 0,
    unreadAlerts: 0,
    highRiskContracts: 0,
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
      value: kpis.expiringContracts.toString(),
      delta: "Richiede attenzione",
      deltaType: "warning" as const,
      icon: Clock,
      color: "text-amber-400",
    },
    {
      label: "Valore Portfolio",
      value: formatCurrency(kpis.totalValue),
      delta: "+12% vs anno precedente",
      deltaType: "positive" as const,
      icon: Wallet,
      color: "text-emerald-400",
    },
    {
      label: "Alert Aperti",
      value: kpis.unreadAlerts.toString(),
      delta: `${kpis.highRiskContracts} ad alto rischio`,
      deltaType: "negative" as const,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "Rischio Alto",
      value: kpis.highRiskContracts.toString(),
      delta: "Contratti da rivedere",
      deltaType: "warning" as const,
      icon: TrendingUp,
      color: "text-orange-400",
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
          className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all glow-blue-sm text-sm"
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
              className="glass-card rounded-2xl p-5 border border-border/20 group hover:glow-blue-sm transition-all duration-300"
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

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contracts list - takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
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
            {contracts.slice(0, 5).map((contract) => (
              <Link
                key={contract.id}
                href={`/dashboard/contracts/${contract.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {contract.name} — {contract.counterpart}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {contract.type.charAt(0).toUpperCase() + contract.type.slice(1)} · scade {formatDate(contract.endDate)}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    contract.status === "attivo" ? "border-primary/30 text-primary bg-primary/10" :
                    contract.status === "in_scadenza" ? "border-amber-400/30 text-amber-400 bg-amber-400/10" :
                    "border-muted-foreground/30 text-muted-foreground bg-muted/20"
                  }`}>
                    {contract.status === "attivo" ? "Attivo" : 
                     contract.status === "in_scadenza" ? "In Scadenza" : 
                     contract.status}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    contract.riskLevel === "basso" ? "text-emerald-400 bg-emerald-400/10" :
                    contract.riskLevel === "medio" ? "text-amber-400 bg-amber-400/10" :
                    "text-red-400 bg-red-400/10"
                  }`}>
                    {contract.riskLevel.charAt(0).toUpperCase() + contract.riskLevel.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Alerts panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card rounded-2xl border border-border/20 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Alert Recenti</h2>
            <Link href="/dashboard/alerts" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Gestisci
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  alert.read ? "bg-muted/10" : "bg-muted/25"
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.priority === "high" ? "bg-red-400" :
                  alert.priority === "medium" ? "bg-amber-400" :
                  alert.priority === "low" ? "bg-emerald-400" :
                  "bg-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${alert.read ? "text-muted-foreground" : "text-foreground"}`}>
                    {alert.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {alert.contractName || alert.description}
                  </div>
                  {alert.dueDate && (
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      Scadenza: {formatDate(alert.dueDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
