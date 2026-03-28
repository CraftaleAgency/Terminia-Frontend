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
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"

type ContractStatus = "draft" | "negotiating" | "active" | "expiring" | "renewed" | "terminated"

interface Contract {
  id: string
  title: string
  contract_type: string
  counterpart_id?: string
  counterpart_name?: string
  employee_id?: string
  employee_name?: string
  status: ContractStatus
  value: number
  value_type: "total" | "annual" | "monthly"
  start_date: string
  end_date: string
  auto_renewal: boolean
  renewal_notice_days?: number
  risk_score: number
  reference_number?: string
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr))
}

const daysUntil = (dateStr: string): number => {
  const target = new Date(dateStr)
  const today = new Date()
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getStatusLabel = (status: ContractStatus): string => {
  const labels: Record<ContractStatus, string> = {
    draft: "Bozza",
    negotiating: "In Negoziazione",
    active: "Attivo",
    expiring: "In Scadenza",
    renewed: "Rinnovato",
    terminated: "Terminato",
  }
  return labels[status] || status
}

const getStatusColor = (status: ContractStatus): string => {
  switch (status) {
    case "active": return "text-primary"
    case "expiring": return "text-amber-400"
    case "draft": return "text-muted-foreground"
    case "negotiating": return "text-blue-400"
    case "terminated": return "text-destructive"
    case "renewed": return "text-emerald-400"
    default: return "text-muted-foreground"
  }
}

const getRiskColor = (score: number): string => {
  if (score < 30) return "text-emerald-400"
  if (score < 60) return "text-amber-400"
  return "text-red-400"
}

export default function ContractsPage() {
  const { user } = useUser()
  const supabase = createClient()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "commercial" | "hr">("all")

  useEffect(() => {
    if (!user) return

    const fetchContracts = async () => {
      try {
        setError(null)
        
        // Get user's company_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (userError) {
          console.error('Error fetching user data:', userError)
          setError('Errore nel recupero del profilo utente. Prova a ricaricare la pagina.')
          setLoading(false)
          return
        }

        if (!userData?.company_id) {
          console.log('No company_id found for user')
          setError('Profilo azienda non trovato. Completa l\'onboarding per continuare.')
          setLoading(false)
          return
        }

        // Fetch contracts with optional relations
        const { data, error: contractsError } = await supabase
          .from('contracts')
          .select(`
            *,
            counterparts!contracts_counterpart_id_fkey(name),
            employees!contracts_employee_id_fkey(full_name)
          `)
          .eq('company_id', userData.company_id)
          .order('created_at', { ascending: false })

        if (contractsError) {
          console.error('Error fetching contracts:', contractsError)
          setError(`Errore nel caricamento dei contratti: ${contractsError.message}`)
          setLoading(false)
          return
        }

        const formattedContracts = data?.map(c => ({
          ...c,
          counterpart_name: c.counterparts?.name,
          employee_name: c.employees?.full_name,
        })) || []

        setContracts(formattedContracts)
      } catch (error) {
        console.error('Error in fetchContracts:', error)
        setError('Si è verificato un errore imprevisto.')
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [user, supabase])

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
        {loading ? (
          <div className="divide-y divide-border/10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <AlertTriangle className="size-12 text-amber-400 mx-auto mb-4" />
            <div className="text-foreground font-medium">Errore</div>
            <div className="text-sm text-muted-foreground mt-1">
              {error}
            </div>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <div className="text-foreground font-medium">Nessun contratto trovato</div>
            <div className="text-sm text-muted-foreground mt-1">
              Prova a modificare i filtri o crea un nuovo contratto
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {filteredContracts.map((contract) => {
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
                      {contract.counterpart_name || contract.employee_name} · {contract.reference_number || 'N/A'}
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
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
