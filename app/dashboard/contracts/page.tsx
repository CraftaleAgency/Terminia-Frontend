"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ArrowUpRight,
  FileText,
  Building2,
  Users,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import {
  getContracts,
  formatCurrency,
  formatDate,
  daysUntil,
  getStatusLabel,
  getStatusColor,
  getRiskColor,
  type Contract,
  type ContractStatus,
} from "@/lib/mock-data"

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "commercial" | "hr">("all")

  useEffect(() => {
    setContracts(getContracts())
  }, [])

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.counterpart_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.employee_name?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    
    const isHR = ["permanent", "fixed_term", "cococo"].includes(c.contract_type)
    const matchesType = 
      typeFilter === "all" ||
      (typeFilter === "hr" && isHR) ||
      (typeFilter === "commercial" && !isHR)

    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === "active").length,
    expiring: contracts.filter(c => c.status === "expiring").length,
    totalValue: contracts.reduce((sum, c) => {
      if (c.value_type === "monthly") return sum + c.value * 12
      if (c.value_type === "annual") return sum + c.value
      return sum + c.value
    }, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contratti</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestisci tutti i tuoi contratti commerciali e HR
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

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Totale Contratti</div>
          <div className="text-2xl font-semibold text-foreground mt-1">{stats.total}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Attivi</div>
          <div className="text-2xl font-semibold text-primary mt-1">{stats.active}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">In Scadenza</div>
          <div className="text-2xl font-semibold text-amber-400 mt-1">{stats.expiring}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Valore Totale</div>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">{formatCurrency(stats.totalValue)}</div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-4 border border-border/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca contratto, controparte o dipendente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "all")}
              className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tutti gli stati</option>
              <option value="active">Attivi</option>
              <option value="expiring">In Scadenza</option>
              <option value="draft">Bozza</option>
              <option value="negotiating">In Negoziazione</option>
              <option value="terminated">Terminati</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                typeFilter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              Tutti
            </button>
            <button
              onClick={() => setTypeFilter("commercial")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                typeFilter === "commercial" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="size-4" />
              Commerciali
            </button>
            <button
              onClick={() => setTypeFilter("hr")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                typeFilter === "hr" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-4" />
              Lavoro
            </button>
          </div>
        </div>
      </motion.div>

      {/* Contracts list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl border border-border/20 overflow-hidden"
      >
        <div className="divide-y divide-border/10">
          {filteredContracts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="size-12 text-muted-foreground/50 mx-auto mb-4" />
              <div className="text-foreground font-medium">Nessun contratto trovato</div>
              <div className="text-sm text-muted-foreground mt-1">
                Prova a modificare i filtri o crea un nuovo contratto
              </div>
            </div>
          ) : (
            filteredContracts.map((contract) => {
              const isHR = ["permanent", "fixed_term", "cococo"].includes(contract.contract_type)
              const days = daysUntil(contract.end_date)
              
              return (
                <Link
                  key={contract.id}
                  href={`/dashboard/contracts/${contract.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isHR ? "bg-purple-500/10 text-purple-400" : "bg-primary/10 text-primary"
                  }`}>
                    {isHR ? <Users className="size-5" /> : <Building2 className="size-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {contract.title}
                      </span>
                      {contract.auto_renewal && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Rinnovo Auto
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {contract.counterpart_name || contract.employee_name} · {contract.reference_number}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Value */}
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-foreground">
                        {formatCurrency(contract.value)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contract.value_type === "monthly" ? "/mese" : contract.value_type === "annual" ? "/anno" : "totale"}
                      </div>
                    </div>

                    {/* Risk */}
                    <div className="hidden md:flex items-center gap-1.5">
                      {contract.risk_score >= 60 && (
                        <AlertTriangle className="size-3.5 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${getRiskColor(contract.risk_score)}`}>
                        {contract.risk_score}%
                      </span>
                    </div>

                    {/* Expiry */}
                    <div className={`text-xs px-2.5 py-1 rounded-full ${
                      days <= 30 && days > 0 ? "bg-amber-400/10 text-amber-400" :
                      days <= 0 ? "bg-red-400/10 text-red-400" :
                      "bg-muted/30 text-muted-foreground"
                    }`}>
                      {days <= 0 ? "Scaduto" : `${days}gg`}
                    </div>

                    {/* Status */}
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      contract.status === "active" ? "border-primary/30 text-primary bg-primary/10" :
                      contract.status === "expiring" ? "border-amber-400/30 text-amber-400 bg-amber-400/10" :
                      contract.status === "terminated" ? "border-red-400/30 text-red-400 bg-red-400/10" :
                      "border-muted-foreground/30 text-muted-foreground bg-muted/20"
                    }`}>
                      {getStatusLabel(contract.status)}
                    </span>

                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}
