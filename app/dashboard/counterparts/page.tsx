"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  ArrowUpRight,
  Building2,
  MoreHorizontal,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import type { Database } from "@/types/database"

type Counterpart = Database['public']['Tables']['counterparts']['Row']

const getReliabilityColor = (score: number) => {
  if (score >= 80) return "text-green-400"
  if (score >= 60) return "text-emerald-400"
  if (score >= 40) return "text-yellow-400"
  if (score >= 20) return "text-orange-400"
  return "text-red-400"
}

const getReliabilityBgColor = (score: number) => {
  if (score >= 80) return "bg-green-500/10 border-green-500/20"
  if (score >= 60) return "bg-emerald-500/10 border-emerald-500/20"
  if (score >= 40) return "bg-yellow-500/10 border-yellow-500/20"
  if (score >= 20) return "bg-orange-500/10 border-orange-500/20"
  return "bg-red-500/10 border-red-500/20"
}

const getReliabilityLabel = (score: number) => {
  if (score >= 80) return "Eccellente"
  if (score >= 60) return "Buono"
  if (score >= 40) return "Discreto"
  if (score >= 20) return "Attenzione"
  return "Critico"
}

export default function CounterpartsPage() {
  const { user } = useUser()
  const supabase = createClient()
  const [counterparts, setCounterparts] = useState<Counterpart[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [sectorFilter, setSectorFilter] = useState("all")

  useEffect(() => {
    if (!user) return

    const fetchCounterparts = async () => {
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

        const { data, error } = await supabase
          .from('counterparts')
          .select('*')
          .eq('company_id', userData.company_id)
          .order('name')

        if (error) throw error
        setCounterparts(data || [])
      } catch (error) {
        console.error('Error fetching counterparts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCounterparts()
  }, [user, supabase])

  const filteredCounterparts = counterparts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.vat_number?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (c.city?.toLowerCase().includes(search.toLowerCase()) ?? false)

    const matchesStatus = statusFilter === "all" || statusFilter === "active"
    const matchesSector = sectorFilter === "all" || c.sector === sectorFilter

    return matchesSearch && matchesStatus && matchesSector
  })

  const stats = {
    total: counterparts.length,
    active: counterparts.length,
    excellent: counterparts.filter(c => (c.reliability_score ?? 0) >= 80).length,
    attention: counterparts.filter(c => (c.reliability_score ?? 0) < 60).length,
  }

  const sectors = [...new Set(counterparts.map(c => c.sector).filter((s): s is string => Boolean(s)))]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Controparti</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestisci fornitori, clienti e partner
          </p>
        </div>
        <Link
          href="/dashboard/counterparts/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all glow-teal-sm text-sm"
        >
          <Plus className="size-4" />
          Nuova Controparte
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
          <div className="text-sm text-muted-foreground">Totale Controparti</div>
          <div className="text-2xl font-semibold text-foreground mt-1">{stats.total}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Attive</div>
          <div className="text-2xl font-semibold text-primary mt-1">{stats.active}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Affidabilità Alta</div>
          <div className="text-2xl font-semibold text-green-400 mt-1">{stats.excellent}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Richiedono Attenzione
            {stats.attention > 0 && <AlertTriangle className="size-3.5 text-amber-400" />}
          </div>
          <div className="text-2xl font-semibold text-amber-400 mt-1">{stats.attention}</div>
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
              placeholder="Cerca per nome, P.IVA o città..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tutti gli stati</option>
              <option value="active">Attive</option>
              <option value="inactive">Inattive</option>
            </select>
          </div>

          {/* Sector filter */}
          <div className="flex items-center gap-2">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tutti i settori</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Counterparts list */}
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
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        ) : filteredCounterparts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <div className="text-foreground font-medium">Nessuna controparte trovata</div>
            <div className="text-sm text-muted-foreground mt-1">
              Prova a modificare i filtri o aggiungi una nuova controparte
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {filteredCounterparts.map((counterpart) => (
              <Link
                key={counterpart.id}
                href={`/dashboard/counterparts/${counterpart.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
              >
                {/* Icon & Name */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="size-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {counterpart.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {counterpart.vat_number || 'N/A'} · {counterpart.city || 'N/A'}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  {/* Contracts count */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">0</div>
                    <div className="text-xs text-muted-foreground">Contratti</div>
                  </div>

                  {/* Total value */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(counterpart.total_exposure || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Valore totale</div>
                  </div>
                </div>

                {/* Reliability Score */}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                  getReliabilityBgColor(counterpart.reliability_score || 0)
                )}>
                  <ShieldCheck className="size-4" />
                  <div>
                    <div className={cn("text-sm font-semibold", getReliabilityColor(counterpart.reliability_score || 0))}>
                      {counterpart.reliability_score || 0}/100
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getReliabilityLabel(counterpart.reliability_score || 0)}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <span className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/10">
                  Attiva
                </span>

                <MoreHorizontal className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
