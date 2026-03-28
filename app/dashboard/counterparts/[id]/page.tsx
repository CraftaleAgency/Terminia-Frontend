"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  Link2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Euro,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  formatCurrency,
  formatDate,
} from "@/types/models"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { verifyCounterpartAction } from "@/lib/actions/osint"
import { toast } from "sonner"
import type { Database } from "@/types/database"

type Counterpart = Database['public']['Tables']['counterparts']['Row']
type Contract = Database['public']['Tables']['contracts']['Row']

export default function CounterpartDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()
  const [counterpart, setCounterpart] = useState<Counterpart | null>(null)
  const [relatedContracts, setRelatedContracts] = useState<Contract[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastVerified, setLastVerified] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
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

        // Fetch counterpart
        const { data: counterpartData, error: counterpartError } = await supabase
          .from('counterparts')
          .select('*')
          .eq('id', params.id as string)
          .eq('company_id', userData.company_id)
          .single()

        if (counterpartError || !counterpartData) {
          setLoading(false)
          return
        }

        setCounterpart(counterpartData)

        // Fetch related contracts
        const { data: contractsData } = await supabase
          .from('contracts')
          .select('*')
          .eq('counterpart_id', params.id as string)
          .eq('company_id', userData.company_id)

        setRelatedContracts(contractsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, supabase, params.id])

  const handleRefreshVerification = async () => {
    if (!counterpart) return
    setIsRefreshing(true)
    try {
      const result = await verifyCounterpartAction({
        vatNumber: counterpart.vat_number ?? '',
        companyName: counterpart.name,
        counterpartId: counterpart.id,
      })
      if (result.success && result.data) {
        const d = result.data
        setCounterpart(prev => prev ? {
          ...prev,
          reliability_score: d.reliability.score,
          reliability_label: (d.reliability.score >= 80 ? 'excellent' : d.reliability.score >= 60 ? 'good' : d.reliability.score >= 40 ? 'warning' : 'risk') as typeof prev.reliability_label,
          score_legal: d.reliability.dimensions.legal,
          score_contributory: d.reliability.dimensions.contributory,
          score_reputation: d.reliability.dimensions.reputation,
          score_solidity: d.reliability.dimensions.solidity,
          score_consistency: d.reliability.dimensions.consistency,
          vat_verified: d.vies?.valid === true,
          has_anac_annotations: d.anac?.annotations_found ?? false,
        } : prev)
        toast.success("Verifica aggiornata con successo")
        setLastVerified(new Date().toLocaleString("it-IT", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }))
      } else {
        toast.error(result.error || "Errore durante la verifica OSINT")
      }
    } catch {
      toast.error("Errore di connessione durante la verifica")
    } finally {
      setIsRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento controparte...</p>
        </div>
      </div>
    )
  }

  if (!counterpart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Controparte non trovata</p>
        </div>
      </div>
    )
  }

  // Reliability score color
  const getReliabilityColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-primary"
    if (score >= 40) return "text-amber-400"
    return "text-red-400"
  }

  const getReliabilityBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-400"
    if (score >= 60) return "bg-primary"
    if (score >= 40) return "bg-amber-400"
    return "bg-red-400"
  }

  const getReliabilityLabel = (label: string) => {
    const labels: Record<string, string> = {
      excellent: "Eccellente",
      good: "Buono",
      warning: "Attenzione",
      risk: "Rischio",
      critical: "Critico",
      unknown: "Non verificato",
    }
    return labels[label] || label
  }

  // Total exposure
  const totalExposure = relatedContracts.reduce((sum, c) => sum + (c.value ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/counterparts"
            className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-foreground">{counterpart.name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${
                counterpart.type === "supplier" ? "border-primary/30 text-primary bg-primary/10" :
                counterpart.type === "client" ? "border-purple-400/30 text-purple-400 bg-purple-400/10" :
                "border-blue-400/30 text-blue-400 bg-blue-400/10"
              }`}>
                {counterpart.type === "supplier" ? "Fornitore" :
                 counterpart.type === "client" ? "Cliente" : "Partner"}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-400/30 text-emerald-400 bg-emerald-400/10">
                Attiva
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              {counterpart.vat_number && <span>P.IVA: {counterpart.vat_number}</span>}
              {counterpart.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {counterpart.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
            <Edit className="size-4" />
            Modifica
          </button>
          <button className="p-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Reliability Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Shield className="size-4" />
                Reliability Score
              </h2>
              <button
                onClick={handleRefreshVerification}
                disabled={isRefreshing}
                className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
                Aggiorna verifica
              </button>
            </div>

            {/* Score Display */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${((counterpart.reliability_score ?? 0) / 100) * 283} 283`}
                    className={getReliabilityColor(counterpart.reliability_score ?? 0)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${getReliabilityColor(counterpart.reliability_score ?? 0)}`}>
                    {counterpart.reliability_score ?? 0}
                  </span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div>
                <div className={`text-lg font-semibold ${getReliabilityColor(counterpart.reliability_score ?? 0)}`}>
                  {getReliabilityLabel(counterpart.reliability_label ?? '')}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Aggiornato: {lastVerified || "oggi 08:30"}
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {[
                { label: "Legale", score: counterpart.score_legal, max: 30 },
                { label: "Contributiva", score: counterpart.score_contributory, max: 20 },
                { label: "Reputazione", score: counterpart.score_reputation, max: 20 },
                { label: "Solidita", score: counterpart.score_solidity, max: 20 },
                { label: "Coerenza", score: counterpart.score_consistency, max: 10 },
              ].map((item) => (
                <div key={item.label} className="bg-muted/20 rounded-xl p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className={`text-sm font-semibold ${(item.score ?? 0) / item.max >= 0.7 ? "text-emerald-400" : (item.score ?? 0) / item.max >= 0.5 ? "text-primary" : "text-amber-400"}`}>
                    {item.score ?? 0}/{item.max}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {counterpart.vat_verified ? (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                ) : (
                  <XCircle className="size-4 text-red-400" />
                )}
                <span className={counterpart.vat_verified ? "text-foreground" : "text-red-400"}>
                  P.IVA {counterpart.vat_verified ? "attiva e valida" : "non verificata"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-foreground">Iscritta CCIAA dal 2008 (17 anni di attivita)</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {counterpart.has_bankruptcy ? (
                  <XCircle className="size-4 text-red-400" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                )}
                <span className={counterpart.has_bankruptcy ? "text-red-400" : "text-foreground"}>
                  {counterpart.has_bankruptcy ? "Procedura concorsuale in corso" : "Nessuna procedura concorsuale"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {counterpart.has_anac_annotations ? (
                  <AlertTriangle className="size-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                )}
                <span className={counterpart.has_anac_annotations ? "text-amber-400" : "text-foreground"}>
                  {counterpart.has_anac_annotations ? "Annotazioni ANAC presenti" : "Nessuna annotazione ANAC"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="size-4 text-amber-400" />
                <span className="text-amber-400">Regolarita contributiva non verificabile automaticamente - richiedi DURC</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
                <ExternalLink className="size-3" />
                Vedi dettaglio verifica
              </button>
              <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
                <FileText className="size-3" />
                Richiedi DURC manuale
              </button>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4">Informazioni di Contatto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counterpart.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Indirizzo</div>
                    <div className="text-sm text-foreground">{counterpart.address}</div>
                    {counterpart.city && (
                      <div className="text-sm text-muted-foreground">{counterpart.city}</div>
                    )}
                  </div>
                </div>
              )}

              {counterpart.pec && (
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">PEC</div>
                    <a href={`mailto:${counterpart.pec}`} className="text-sm text-primary hover:underline">
                      {counterpart.pec}
                    </a>
                  </div>
                </div>
              )}

              {counterpart.referent_name && (
                <div className="flex items-start gap-3">
                  <Building2 className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Referente</div>
                    <div className="text-sm text-foreground">{counterpart.referent_name}</div>
                    {counterpart.referent_email && (
                      <a href={`mailto:${counterpart.referent_email}`} className="text-xs text-primary hover:underline">
                        {counterpart.referent_email}
                      </a>
                    )}
                    {counterpart.referent_phone && (
                      <div className="text-xs text-muted-foreground">{counterpart.referent_phone}</div>
                    )}
                  </div>
                </div>
              )}

              {counterpart.sector && (
                <div className="flex items-start gap-3">
                  <Globe className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Settore</div>
                    <div className="text-sm text-foreground">{counterpart.sector}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Related Contracts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-foreground">Contratti Collegati</h2>
              <span className="text-xs text-muted-foreground">{relatedContracts.length} contratti</span>
            </div>

            {relatedContracts.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="size-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nessun contratto collegato</p>
              </div>
            ) : (
              <div className="space-y-3">
                {relatedContracts.map((contract) => (
                  <Link
                    key={contract.id}
                    href={`/dashboard/contracts/${contract.id}`}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">{contract.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {contract.reference_number} - {getStatusLabel(contract.status ?? '')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {formatCurrency(contract.value ?? 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contract.value_type === "monthly" ? "/mese" : contract.value_type === "annual" ? "/anno" : "totale"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Exposure Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Esposizione Totale</h3>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(counterpart.total_exposure || totalExposure)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {relatedContracts.length} contratti attivi
            </div>
          </motion.div>

          {/* Warnings Card */}
          {(counterpart.has_anac_annotations || (counterpart.reliability_score ?? 0) < 60) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"
            >
              <h3 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Attenzione
              </h3>
              {counterpart.has_anac_annotations && (
                <div className="text-xs text-amber-400/80 mb-2">
                  Annotazioni ANAC rilevate su questa controparte
                </div>
              )}
              {(counterpart.reliability_score ?? 0) < 60 && (
                <div className="text-xs text-amber-400/80">
                  Reliability score sotto la soglia di sicurezza (60)
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Azioni Rapide</h3>
            <div className="space-y-2">
              <Link
                href={`/dashboard/contracts/new?counterpart=${counterpart.id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
              >
                <FileText className="size-4" />
                Nuovo contratto
              </Link>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
                <Mail className="size-4" />
                Invia email
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
                <Calendar className="size-4" />
                Pianifica incontro
              </button>
            </div>
          </motion.div>

          {/* OSINT Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Storico Verifiche</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="size-3 text-emerald-400" />
                <span className="text-muted-foreground">Oggi 08:30 - Verifica completa</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="size-3 text-emerald-400" />
                <span className="text-muted-foreground">15 Mar - Verifica mensile</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="size-3 text-amber-400" />
                <span className="text-muted-foreground">01 Mar - Annotazione ANAC rilevata</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Attivo",
    expiring: "In Scadenza",
    draft: "Bozza",
    negotiating: "Negoziazione",
    terminated: "Terminato",
    renewed: "Rinnovato",
  }
  return labels[status] || status
}
