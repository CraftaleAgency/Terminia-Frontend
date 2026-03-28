"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ArrowUpRight,
  FileText,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  LayoutGrid,
  Sparkles,
  Star,
  Euro,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/types/models"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import type { Database } from "@/types/database"

type Bando = Database['public']['Tables']['bandi']['Row']

// Status configuration
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "Nuovo", color: "bg-muted/30 text-muted-foreground" },
  saved: { label: "Salvato", color: "bg-blue-500/10 text-blue-400" },
  evaluating: { label: "In valutazione", color: "bg-yellow-500/10 text-yellow-400" },
  participating: { label: "Partecipando", color: "bg-purple-500/10 text-purple-400" },
  submitted: { label: "Inviato", color: "bg-primary/10 text-primary" },
  won: { label: "Vinto", color: "bg-emerald-500/10 text-emerald-400" },
  lost: { label: "Perso", color: "bg-red-500/10 text-red-400" },
  withdrawn: { label: "Ritirato", color: "bg-muted/30 text-muted-foreground" },
}

const SOURCES = ["anac", "ted_europa", "invitalia", "mimit", "regione"]
const CATEGORIES = ["Servizi", "Beni", "Lavori", "Misto"]

const getSourceLabel = (source: string) => {
  const labels: Record<string, string> = {
    anac: "ANAC",
    ted_europa: "TED Europa",
    invitalia: "Invitalia",
    mimit: "MIMIT",
    regione_lombardia: "Regione",
    regione: "Regione",
  }
  return labels[source] || source
}

const getSourceColor = (source: string) => {
  const colors: Record<string, string> = {
    anac: "bg-blue-500/10 text-blue-400",
    ted_europa: "bg-purple-500/10 text-purple-400",
    invitalia: "bg-emerald-500/10 text-emerald-400",
    mimit: "bg-amber-500/10 text-amber-400",
    regione_lombardia: "bg-pink-500/10 text-pink-400",
    regione: "bg-pink-500/10 text-pink-400",
  }
  return colors[source] || "bg-muted/30 text-muted-foreground"
}

const getMatchColor = (score: number) => {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-primary"
  if (score >= 40) return "text-amber-400"
  return "text-muted-foreground"
}

const getMatchBgColor = (score: number) => {
  if (score >= 80) return "bg-emerald-400"
  if (score >= 60) return "bg-primary"
  if (score >= 40) return "bg-amber-400"
  return "bg-muted-foreground"
}

const getDeadlineColor = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  const days = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (days <= 7) return "bg-red-500/10 text-red-400 border-red-500/20"
  if (days <= 30) return "bg-amber-500/10 text-amber-400 border-amber-500/20"
  return "bg-muted/20 text-muted-foreground border-border/20"
}

const getDeadlineHeaderColor = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  const days = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (days <= 7) return "bg-red-500"
  if (days <= 30) return "bg-amber-500"
  return "bg-muted/50"
}

const daysUntilDeadline = (deadline: string) => {
  const date = new Date(deadline)
  const now = new Date()
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function BandiPage() {
  const { user } = useUser()
  const supabase = createClient()

  const [bandi, setBandi] = useState<Bando[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [matchFilter, setMatchFilter] = useState(0)
  const [sourceFilter, setSourceFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchBandi = async () => {
      try {
        // Get user's company
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
          .from('bandi')
          .select('*')
          .eq('company_id', userData.company_id)
          .order('deadline', { ascending: true })

        if (error) throw error
        setBandi(data || [])
      } catch (error) {
        console.error('Error fetching bandi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBandi()
  }, [user, supabase])

  const filteredBandi = bandi.filter(bando => {
    const matchesSearch =
      bando.title.toLowerCase().includes(search.toLowerCase()) ||
      bando.authority_name.toLowerCase().includes(search.toLowerCase())
    const matchesMatch = (bando.match_score ?? 0) >= matchFilter
    const matchesSource = sourceFilter.length === 0 || sourceFilter.includes(bando.source)
    const matchesCategory = categoryFilter === "all" || bando.contract_category === categoryFilter
    const matchesStatus = statusFilter === "all" || bando.participation_status === statusFilter

    return matchesSearch && matchesMatch && matchesSource && matchesCategory && matchesStatus
  })

  const stats = {
    foundToday: bandi.filter(b => {
      return true // Mock: assume some found today
    }).length,
    highMatch: bandi.filter(b => (b.match_score ?? 0) >= 80).length,
    expiringSoon: bandi.filter(b => daysUntilDeadline(b.deadline) <= 7 && daysUntilDeadline(b.deadline) > 0).length,
    participating: bandi.filter(b => b.participation_status != null && ["participating", "submitted"].includes(b.participation_status)).length,
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const toggleSource = (source: string) => {
    setSourceFilter(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">BandoRadar</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Trova bandi di gara e opportunita commerciali
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm disabled:opacity-50"
          >
            {isRefreshing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Aggiorna ora
          </button>
        </div>
      </div>

      {/* KPI Bar - 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Sparkles className="size-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Bandi trovati oggi</div>
              <div className="text-2xl font-semibold text-foreground">{stats.foundToday}</div>
              {stats.foundToday > 0 && (
                <div className="text-xs text-blue-400">+{stats.foundToday} oggi</div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <CheckCircle className="size-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Match &gt;80%</div>
              <div className="text-2xl font-semibold text-emerald-400">{stats.highMatch}</div>
              {stats.highMatch > 0 && (
                <div className="text-xs text-emerald-400">{stats.highMatch} nuovi</div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10">
              <AlertTriangle className="size-4 text-red-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Scadono in 7gg</div>
              <div className="text-2xl font-semibold text-red-400">{stats.expiringSoon}</div>
              {stats.expiringSoon > 0 && (
                <div className="text-xs text-red-400">Attenzione!</div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <TrendingUp className="size-4 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Sto partecipando</div>
              <div className="text-2xl font-semibold text-purple-400">{stats.participating}</div>
              <div className="text-xs text-purple-400">1 in corso</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters Bar */}
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
              placeholder="Cerca bando o ente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Match Score Slider */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Match min: {matchFilter}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={matchFilter}
              onChange={(e) => setMatchFilter(Number(e.target.value))}
              className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Source Multi-Select */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Fonte:</span>
            {SOURCES.map(source => (
              <button
                key={source}
                onClick={() => toggleSource(source)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                  sourceFilter.includes(source)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                )}
              >
                {getSourceLabel(source)}
              </button>
            ))}
          </div>

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Tutte le categorie</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Tutti gli stati</option>
            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
              <option key={value} value={value}>{config.label}</option>
            ))}
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch("")
              setMatchFilter(0)
              setSourceFilter([])
              setCategoryFilter("all")
              setStatusFilter("all")
            }}
            className="text-xs text-primary hover:underline"
          >
            Azzera filtri
          </button>
        </div>
      </motion.div>

      {/* View Toggle */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/20">
          <button
            onClick={() => setViewMode("card")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
              viewMode === "card" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="size-4" />
            Card
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
              viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="size-4" />
            Tabella
          </button>
        </div>
      </div>

      {/* Bandi List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl border border-border/20 overflow-hidden">
                <Skeleton className="h-2 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : viewMode === "card" ? (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredBandi.map((bando, index) => {
              const days = daysUntilDeadline(bando.deadline)
              return (
                <motion.div
                  key={bando.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl border border-border/20 overflow-hidden"
                >
                  {/* Urgency Header */}
                  <div className={cn("h-2", getDeadlineHeaderColor(bando.deadline))} />

                  <div className="p-5">
                    {/* Title and Authority */}
                    <h3 className="font-semibold text-foreground text-base mb-2 line-clamp-2">
                      {bando.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-muted-foreground">{bando.authority_name}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full",
                        getSourceColor(bando.source)
                      )}>
                        {getSourceLabel(bando.source)}
                      </span>
                    </div>

                    {/* Value and Category */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Euro className="size-3.5" />
                        <span className="font-medium text-foreground">
                          {formatCurrency(bando.base_value ?? 0)}
                        </span>
                      </div>
                      <span>-</span>
                      <span>{bando.contract_category || "Servizi"}</span>
                    </div>

                    {/* Match Score Box */}
                    <div className="bg-muted/20 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Match Score</span>
                        <span className={cn("text-lg font-bold", getMatchColor(bando.match_score ?? 0))}>
                          {bando.match_score ?? 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", getMatchBgColor(bando.match_score ?? 0))}
                          style={{ width: `${bando.match_score ?? 0}%` }}
                        />
                      </div>
                      {/* Score Breakdown */}
                      <div className="grid grid-cols-5 gap-1 mt-2 text-[10px]">
                        <div className="text-center">
                          <div className="text-muted-foreground">Sett</div>
                          <div className="text-foreground">{bando.score_sector}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Dim</div>
                          <div className="text-foreground">{bando.score_size}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Geo</div>
                          <div className="text-foreground">{bando.score_geo}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Req</div>
                          <div className="text-foreground">{bando.score_requirements}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Fat</div>
                          <div className="text-foreground">{bando.score_feasibility}</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/10">
                      <Link
                        href={`/dashboard/bandi/${bando.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        Valuta
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
                        <Star className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl border border-border/20 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/10">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Scadenza</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Titolo</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Ente</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Fonte</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Base d'asta</th>
                    <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Match</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredBandi.map((bando) => {
                    const days = daysUntilDeadline(bando.deadline)
                    const statusConfig = STATUS_CONFIG[bando.participation_status ?? 'new'] || STATUS_CONFIG.new
                    return (
                      <tr key={bando.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full border",
                            getDeadlineColor(bando.deadline)
                          )}>
                            {days <= 0 ? "Scaduto" : `${days}gg`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/bandi/${bando.id}`}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {bando.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {bando.authority_name}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            getSourceColor(bando.source)
                          )}>
                            {getSourceLabel(bando.source)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                          {formatCurrency(bando.base_value ?? 0)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn("text-sm font-medium", getMatchColor(bando.match_score ?? 0))}>
                            {bando.match_score ?? 0}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            statusConfig.color
                          )}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                            •••
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredBandi.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 border border-border/20 text-center"
        >
          <FileText className="size-12 text-muted-foreground/50 mx-auto mb-4" />
          <div className="text-foreground font-medium">Nessun bando trovato</div>
          <div className="text-sm text-muted-foreground mt-1 mb-4">
            Prova a modificare i filtri
          </div>
          <button
            onClick={() => {
              setSearch("")
              setMatchFilter(0)
              setSourceFilter([])
              setCategoryFilter("all")
              setStatusFilter("all")
            }}
            className="text-sm text-primary hover:underline"
          >
            Azzera filtri
          </button>
        </motion.div>
      )}
    </div>
  )
}
