"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  FileDown,
  MoreVertical,
  AlertTriangle,
  Calendar,
  Euro,
  Clock,
  Building2,
  Users,
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Upload,
  Download,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileSignature,
  History,
  Lock,
  ExternalLink,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { reanalyzeContractAction } from "@/lib/actions/contracts"

// Types
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
  signing_date?: string
  auto_renewal: boolean
  renewal_notice_days?: number
  risk_score: number
  reference_number?: string
  ai_summary?: string
}

interface Counterpart {
  id: string
  name: string
  type: string
  reliability_score: number
  reliability_label: string
  has_anac_annotations: boolean
}

interface Employee {
  id: string
  full_name: string
  role: string
  department: string
  employee_type: string
}

interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  amount_gross: number
  payment_status: string
  counterpart_name: string
  contract_id: string
}

interface Clause {
  id: string
  contract_id: string
  clause_type: string
  original_text: string
  simplified_text?: string
  page_number?: number
  risk_level?: "low" | "medium" | "high" | "critical"
  risk_explanation?: string
  ai_flag?: string
  ai_suggestion?: string
  benchmark_comparison?: string
  created_at?: string
}

interface Obligation {
  id: string
  contract_id: string
  party: "mine" | "theirs"
  description: string
  obligation_type?: string
  due_date?: string
  recurrence?: "monthly" | "quarterly" | "annual"
  recurrence_end_date?: string
  status: "pending" | "completed" | "overdue" | "waived"
  completed_at?: string
  completion_note?: string
  created_at?: string
}

interface Milestone {
  id: string
  contract_id: string
  title: string
  description?: string
  due_date?: string
  status: "upcoming" | "in_progress" | "delivered" | "approved" | "invoiceable" | "invoiced"
  amount?: number
  requires_approval?: boolean
  approval_contact?: string
  delivery_date?: string
  approval_date?: string
  invoice_id?: string
  created_at?: string
}

// Utility functions
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

// Empty arrays for clauses, obligations, milestones (will be fetched from Supabase later)
const mockClauses: Clause[] = []
const mockObligations: Obligation[] = []
const mockMilestones: Milestone[] = []

const mockNegotiationHistory = [
  {
    id: "nh1",
    contract_id: "c1",
    event_type: "Bozza iniziale",
    description: "Prima bozza del contratto inviata per revisione",
    initiated_by: "mine",
    version_number: 1,
    created_at: "2024-01-05T10:00:00Z",
  },
  {
    id: "nh2",
    contract_id: "c1",
    event_type: "Controproposta",
    description: "Richiesta modifica clausola penali e responsabilita",
    initiated_by: "theirs",
    version_number: 2,
    created_at: "2024-01-08T14:30:00Z",
  },
  {
    id: "nh3",
    contract_id: "c1",
    event_type: "Accordo",
    description: "Accordo raggiunto sulle modifiche proposte",
    initiated_by: "mine",
    version_number: 3,
    created_at: "2024-01-10T16:00:00Z",
  },
  {
    id: "nh4",
    contract_id: "c1",
    event_type: "Firma",
    description: "Contratto firmato da entrambe le parti",
    initiated_by: "theirs",
    version_number: 3,
    created_at: "2024-01-15T09:00:00Z",
  },
]

const mockDocuments = [
  {
    id: "d1",
    contract_id: "c1",
    file_name: "Contratto_Fornitura_Servizi_IT_v3.pdf",
    document_type: "signed",
    version: 3,
    is_current: true,
    signature_status: "signed",
    signed_at: "2024-01-15T09:00:00Z",
    created_at: "2024-01-15T09:00:00Z",
  },
  {
    id: "d2",
    contract_id: "c1",
    file_name: "Contratto_Fornitura_Servizi_IT_v2.pdf",
    document_type: "original",
    version: 2,
    is_current: false,
    signature_status: null,
    created_at: "2024-01-10T16:00:00Z",
  },
  {
    id: "d3",
    contract_id: "c1",
    file_name: "Allegato_A_Specifiche_Tecniche.pdf",
    document_type: "attachment",
    version: 1,
    is_current: true,
    signature_status: null,
    created_at: "2024-01-15T09:00:00Z",
  },
]

type TabId = "riepilogo" | "clausole" | "obblighi" | "milestone" | "documenti" | "fatture" | "storico" | "gdpr"

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "riepilogo", label: "Riepilogo AI", icon: <Sparkles className="size-4" /> },
  { id: "clausole", label: "Clausole", icon: <FileText className="size-4" /> },
  { id: "obblighi", label: "Obblighi", icon: <CheckCircle2 className="size-4" /> },
  { id: "milestone", label: "Milestone", icon: <Calendar className="size-4" /> },
  { id: "documenti", label: "Documenti", icon: <FileDown className="size-4" /> },
  { id: "fatture", label: "Fatture", icon: <Euro className="size-4" /> },
  { id: "storico", label: "Storico", icon: <History className="size-4" /> },
  { id: "gdpr", label: "GDPR", icon: <Lock className="size-4" /> },
]

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()
  const [contract, setContract] = useState<Contract | null>(null)
  const [counterpart, setCounterpart] = useState<Counterpart | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [relatedInvoices, setRelatedInvoices] = useState<Invoice[]>([])
  const [clauses, setClauses] = useState<Clause[]>([])
  const [obligations, setObligations] = useState<Obligation[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("riepilogo")
  const [riskFilter, setRiskFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")
  const [obligationParty, setObligationParty] = useState<"mine" | "theirs">("mine")
  const [expandedClauses, setExpandedClauses] = useState<Set<string>>(new Set())
  const [isReanalyzing, setIsReanalyzing] = useState(false)

  const handleReanalyze = async () => {
    const contractId = params.id as string
    if (!contractId) return
    setIsReanalyzing(true)
    try {
      const result = await reanalyzeContractAction(contractId)
      if (result.success) {
        toast.success("Analisi AI rigenerata con successo")
        router.refresh()
        window.location.reload()
      } else {
        toast.error(result.error || "Errore durante la ri-analisi del contratto")
      }
    } catch {
      toast.error("Errore imprevisto durante la ri-analisi")
    } finally {
      setIsReanalyzing(false)
    }
  }

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Get user's company_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (userError) {
          console.error('Error fetching user data:', userError)
          setLoading(false)
          return
        }

        if (!userData?.company_id) {
          console.log('No company_id found for user')
          setLoading(false)
          return
        }

        // Fetch contract with counterpart and employee info
        const { data: contractData, error: contractError } = await supabase
          .from('contracts')
          .select(`
            *,
            counterparts!contracts_counterpart_id_fkey(name, type, reliability_score, reliability_label, has_anac_annotations),
            employees!contracts_employee_id_fkey(full_name, role, department, employee_type)
          `)
          .eq('id', params.id as string)
          .eq('company_id', userData.company_id)
          .single()

        if (contractError) {
          console.error('Error fetching contract:', contractError)
          throw contractError
        }

        if (contractData) {
          const formattedContract: Contract = {
            ...contractData,
            counterpart_name: contractData.counterparts?.name,
            employee_name: contractData.employees?.full_name,
          }
          setContract(formattedContract)

          // Set counterpart data
          if (contractData.counterparts) {
            setCounterpart({
              id: contractData.counterpart_id,
              name: contractData.counterparts.name,
              type: contractData.counterparts.type,
              reliability_score: contractData.counterparts.reliability_score || 0,
              reliability_label: contractData.counterparts.reliability_label || 'unverified',
              has_anac_annotations: contractData.counterparts.has_anac_annotations || false,
            })
          }

          // Set employee data
          if (contractData.employees) {
            setEmployee({
              id: contractData.employee_id,
              full_name: contractData.employees.full_name,
              role: contractData.employees.role,
              department: contractData.employees.department,
              employee_type: contractData.employees.employee_type,
            })
          }

          // Fetch related invoices
          const { data: invoicesData } = await supabase
            .from('invoices')
            .select('*')
            .eq('contract_id', contractData.id)
            .order('invoice_date', { ascending: false })

          if (invoicesData) {
            setRelatedInvoices(invoicesData as Invoice[])
          }

          // Fetch clauses
          const { data: clausesData, error: clausesError } = await supabase
            .from('clauses')
            .select('*')
            .eq('contract_id', contractData.id)
            .order('page_number', { ascending: true, nullsFirst: false })

          if (clausesError) {
            console.error('Error fetching clauses:', clausesError)
          } else if (clausesData) {
            setClauses(clausesData as Clause[])
          }

          // Fetch obligations
          const { data: obligationsData, error: obligationsError } = await supabase
            .from('obligations')
            .select('*')
            .eq('contract_id', contractData.id)
            .order('due_date', { ascending: true, nullsFirst: false })

          if (obligationsError) {
            console.error('Error fetching obligations:', obligationsError)
          } else if (obligationsData) {
            setObligations(obligationsData as Obligation[])
          }

          // Fetch milestones
          const { data: milestonesData, error: milestonesError } = await supabase
            .from('milestones')
            .select('*')
            .eq('contract_id', contractData.id)
            .order('due_date', { ascending: true, nullsFirst: false })

          if (milestonesError) {
            console.error('Error fetching milestones:', milestonesError)
          } else if (milestonesData) {
            setMilestones(milestonesData as Milestone[])
          }
        }
      } catch (error) {
        console.error('Error fetching contract data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, supabase, params.id])

  if (loading || !contract) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento contratto...</p>
        </div>
      </div>
    )
  }

  const days = daysUntil(contract.end_date)
  const isHR = ["permanent", "fixed_term", "cococo", "apprenticeship", "internship", "collaboration"].includes(contract.contract_type)

  // Filter clauses by risk
  const filteredClauses = clauses.filter(c => {
    if (riskFilter === "all") return true
    return c.risk_level === riskFilter
  })

  // Filter obligations by party
  const filteredObligations = obligations.filter(o => o.party === obligationParty)

  // Calculate invoice totals
  const totalInvoiced = relatedInvoices.reduce((sum, i) => sum + i.amount_gross, 0)
  const totalPaid = relatedInvoices.filter(i => i.payment_status === "paid").reduce((sum, i) => sum + i.amount_gross, 0)

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
            href="/dashboard/contracts"
            className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-foreground">{contract.title}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                contract.status === "active" ? "border-primary/30 text-primary bg-primary/10" :
                contract.status === "expiring" ? "border-amber-400/30 text-amber-400 bg-amber-400/10" :
                contract.status === "terminated" ? "border-red-400/30 text-red-400 bg-red-400/10" :
                "border-muted-foreground/30 text-muted-foreground bg-muted/20"
              }`}>
                {getStatusLabel(contract.status)}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                contract.risk_score < 30 ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10" :
                contract.risk_score < 60 ? "border-amber-400/30 text-amber-400 bg-amber-400/10" :
                "border-red-400/30 text-red-400 bg-red-400/10"
              }`}>
                Risk: {contract.risk_score}/100
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              {contract.reference_number && <span>{contract.reference_number}</span>}
              {days > 0 ? (
                <span className={`flex items-center gap-1 ${days <= 30 ? "text-amber-400" : ""}`}>
                  <Clock className="size-3.5" />
                  Scade tra {days} giorni
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  Scaduto
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`size-4 ${isReanalyzing ? "animate-spin" : ""}`} />
            {isReanalyzing ? "Analisi in corso..." : "🔄 Rigenera Analisi"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
            <Edit className="size-4" />
            Modifica
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
            <FileDown className="size-4" />
            Genera documento
            <ChevronDown className="size-3.5" />
          </button>
          <button className="p-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border/20 overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-border/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Tab 1: Riepilogo AI */}
                {activeTab === "riepilogo" && (
                  <motion.div
                    key="riepilogo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* AI Summary */}
                    {contract.ai_summary && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Sparkles className="size-4" />
                          <span className="text-sm font-medium">Riepilogo AI</span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">
                          {contract.ai_summary}
                        </p>
                      </div>
                    )}

                    {/* Dati Economici */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">Dati Economici</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Valore</div>
                          <div className="text-lg font-semibold text-foreground">
                            {formatCurrency(contract.value)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contract.value_type === "monthly" ? "Mensile" : contract.value_type === "annual" ? "Annuale" : "Totale"}
                          </div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Termini Pagamento</div>
                          <div className="text-lg font-semibold text-foreground">30 gg</div>
                          <div className="text-xs text-muted-foreground">Data fattura</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Regime IVA</div>
                          <div className="text-lg font-semibold text-foreground">22%</div>
                          <div className="text-xs text-muted-foreground">Ordinario</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Ritenuta d'Acconto</div>
                          <div className="text-lg font-semibold text-foreground">No</div>
                        </div>
                      </div>
                    </div>

                    {/* Date Critiche */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">Date Critiche</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Data Firma</div>
                          <div className="text-sm font-medium text-foreground">
                            {contract.signing_date ? formatDate(contract.signing_date) : "-"}
                          </div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Data Inizio</div>
                          <div className="text-sm font-medium text-foreground">
                            {formatDate(contract.start_date)}
                          </div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Data Fine</div>
                          <div className={`text-sm font-medium ${days <= 30 ? "text-amber-400" : "text-foreground"}`}>
                            {formatDate(contract.end_date)}
                          </div>
                        </div>
                        {contract.auto_renewal && (
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                            <div className="text-xs text-amber-400 mb-1">Disdetta entro</div>
                            <div className="text-sm font-medium text-amber-400">
                              {contract.renewal_notice_days} giorni prima
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rinnovo Automatico */}
                    {contract.auto_renewal && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <RefreshCw className="size-4" />
                          <span className="text-sm font-medium">Rinnovo Automatico</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Durata rinnovo:</span>
                            <span className="text-foreground ml-2">12 mesi</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Preavviso:</span>
                            <span className="text-foreground ml-2">{contract.renewal_notice_days} giorni</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Tab 2: Clausole */}
                {activeTab === "clausole" && (
                  <motion.div
                    key="clausole"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Risk Filter */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filtro rischio:</span>
                        <div className="flex gap-2">
                          {(["all", "critical", "high", "medium", "low"] as const).map((filter) => {
                            const count = filter === "all" 
                              ? clauses.length 
                              : clauses.filter(c => c.risk_level === filter).length
                            
                            return (
                              <button
                                key={filter}
                                onClick={() => setRiskFilter(filter as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  riskFilter === filter
                                    ? filter === "critical" ? "bg-red-600/20 text-red-400 border border-red-600/30" :
                                      filter === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                      filter === "medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                      filter === "low" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                      "bg-primary/20 text-primary border border-primary/30"
                                    : "bg-muted/30 text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {filter === "all" ? "Tutte" : 
                                 filter === "critical" ? "Critico" :
                                 filter === "high" ? "Alto" : 
                                 filter === "medium" ? "Medio" : 
                                 "Basso"}
                                <span className="ml-1.5 opacity-60">({count})</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {clauses.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Trovate {filteredClauses.length} di {clauses.length} clausole
                        </div>
                      )}
                    </div>

                    {/* Clauses List */}
                    {filteredClauses.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Nessuna clausola disponibile</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredClauses.map((clause) => (
                          <div
                            key={clause.id}
                            className="bg-muted/20 rounded-xl border border-border/20 overflow-hidden"
                          >
                            <div
                              className="flex items-center justify-between p-4 cursor-pointer"
                              onClick={() => {
                                const newExpanded = new Set(expandedClauses)
                                if (newExpanded.has(clause.id)) {
                                  newExpanded.delete(clause.id)
                                } else {
                                  newExpanded.add(clause.id)
                                }
                                setExpandedClauses(newExpanded)
                              }}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  clause.risk_level === "critical" ? "bg-red-600" :
                                  clause.risk_level === "high" ? "bg-red-400" :
                                  clause.risk_level === "medium" ? "bg-amber-400" :
                                  "bg-emerald-400"
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground capitalize">
                                      {clause.clause_type.replace(/_/g, ' ')}
                                    </span>
                                    {clause.page_number && (
                                      <span className="text-xs text-muted-foreground">
                                        (pag. {clause.page_number})
                                      </span>
                                    )}
                                  </div>
                                  {clause.simplified_text && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {clause.simplified_text}
                                    </p>
                                  )}
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                  clause.risk_level === "critical" ? "bg-red-600/10 text-red-400" :
                                  clause.risk_level === "high" ? "bg-red-500/10 text-red-400" :
                                  clause.risk_level === "medium" ? "bg-amber-500/10 text-amber-400" :
                                  "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {clause.risk_level === "critical" ? "Critico" :
                                   clause.risk_level === "high" ? "Alto" :
                                   clause.risk_level === "medium" ? "Medio" :
                                   "Basso"}
                                </span>
                              </div>
                              <ChevronDown className={`size-4 text-muted-foreground transition-transform ${
                                expandedClauses.has(clause.id) ? "rotate-180" : ""
                              }`} />
                            </div>

                            {expandedClauses.has(clause.id) && (
                              <div className="px-4 pb-4 space-y-3">
                                {clause.simplified_text && (
                                  <div className="bg-muted/30 rounded-lg p-3">
                                    <div className="text-xs text-muted-foreground mb-1.5 font-medium">
                                      📝 Testo semplificato
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">
                                      {clause.simplified_text}
                                    </p>
                                  </div>
                                )}
                                <div className="bg-muted/30 rounded-lg p-3">
                                  <div className="text-xs text-muted-foreground mb-1.5 font-medium">
                                    📄 Testo originale
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {clause.original_text}
                                  </p>
                                </div>
                                {clause.risk_explanation && (
                                  <div className={`rounded-lg p-3 border ${
                                    clause.risk_level === "critical" || clause.risk_level === "high"
                                      ? "bg-red-500/5 border-red-500/20"
                                      : clause.risk_level === "medium"
                                      ? "bg-amber-500/5 border-amber-500/20"
                                      : "bg-emerald-500/5 border-emerald-500/20"
                                  }`}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Shield className="size-3.5" />
                                      <span className="text-xs font-medium text-foreground">
                                        Spiegazione del rischio
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {clause.risk_explanation}
                                    </p>
                                  </div>
                                )}
                                {clause.ai_flag && (
                                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                                      <AlertTriangle className="size-3.5" />
                                      <span className="text-xs font-medium capitalize">
                                        {clause.ai_flag.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                    {clause.ai_suggestion && (
                                      <p className="text-xs text-amber-400/80 leading-relaxed">
                                        {clause.ai_suggestion}
                                      </p>
                                    )}
                                  </div>
                                )}
                                {clause.benchmark_comparison && (
                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-blue-400 mb-1.5">
                                      <Sparkles className="size-3.5" />
                                      <span className="text-xs font-medium">Benchmark di mercato</span>
                                    </div>
                                    <p className="text-xs text-blue-400/80 leading-relaxed">
                                      {clause.benchmark_comparison}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Tab 3: Obblighi */}
                {activeTab === "obblighi" && (
                  <motion.div
                    key="obblighi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Party Toggle */}
                    <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-1 w-fit">
                      <button
                        onClick={() => setObligationParty("mine")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          obligationParty === "mine"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Miei obblighi
                      </button>
                      <button
                        onClick={() => setObligationParty("theirs")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          obligationParty === "theirs"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Obblighi loro
                      </button>
                    </div>

                    {/* Obligations List */}
                    {filteredObligations.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Nessun obbligo per {obligationParty === "mine" ? "la tua parte" : "l'altra parte"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredObligations.map((obligation) => {
                          const daysToDue = obligation.due_date ? daysUntil(obligation.due_date) : null
                          return (
                            <div
                              key={obligation.id}
                              className={`bg-muted/20 rounded-xl border p-4 ${
                                obligation.status === "completed" ? "border-emerald-500/20" :
                                obligation.status === "overdue" ? "border-red-500/20" :
                                "border-border/20"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`text-sm font-medium ${
                                      obligation.status === "completed" ? "text-emerald-400 line-through" : 
                                      obligation.status === "waived" ? "text-muted-foreground line-through" :
                                      "text-foreground"
                                    }`}>
                                      {obligation.description}
                                    </span>
                                    {obligation.obligation_type && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground capitalize">
                                        {obligation.obligation_type.replace(/_/g, ' ')}
                                      </span>
                                    )}
                                    {obligation.recurrence && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        {obligation.recurrence === "monthly" ? "🔄 Mensile" :
                                         obligation.recurrence === "quarterly" ? "🔄 Trimestrale" : 
                                         "🔄 Annuale"}
                                      </span>
                                    )}
                                  </div>
                                  {obligation.due_date && (
                                    <div className={`text-xs flex items-center gap-1.5 ${
                                      obligation.status === "overdue" ? "text-red-400" :
                                      daysToDue !== null && daysToDue <= 7 ? "text-amber-400" :
                                      daysToDue !== null && daysToDue <= 30 ? "text-amber-400/70" :
                                      "text-muted-foreground"
                                    }`}>
                                      <Calendar className="size-3" />
                                      Scadenza: {formatDate(obligation.due_date)}
                                      {daysToDue !== null && daysToDue > 0 && ` (tra ${daysToDue} giorni)`}
                                      {daysToDue !== null && daysToDue <= 0 && daysToDue > -30 && ` (scaduto da ${Math.abs(daysToDue)} giorni)`}
                                    </div>
                                  )}
                                  {obligation.recurrence_end_date && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Ricorrenza fino al: {formatDate(obligation.recurrence_end_date)}
                                    </div>
                                  )}
                                  {obligation.completion_note && (
                                    <div className="text-xs text-emerald-400/80 mt-2 bg-emerald-500/10 rounded p-2 border border-emerald-500/20">
                                      ✓ {obligation.completion_note}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                    obligation.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                    obligation.status === "waived" ? "bg-muted/30 text-muted-foreground" :
                                    obligation.status === "overdue" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                    daysToDue !== null && daysToDue <= 7 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                    "bg-muted/30 text-muted-foreground"
                                  }`}>
                                    {obligation.status === "completed" ? "✓ Completato" :
                                     obligation.status === "waived" ? "Annullato" :
                                     obligation.status === "overdue" ? "⚠ Scaduto" :
                                     daysToDue !== null && daysToDue <= 7 ? "⏰ Urgente" : "📋 In programma"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-sm w-full justify-center">
                      <Plus className="size-4" />
                      Aggiungi obbligo manuale
                    </button>
                  </motion.div>
                )}

                {/* Tab 4: Milestone */}
                {activeTab === "milestone" && (
                  <motion.div
                    key="milestone"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {milestones.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Nessuna milestone disponibile</p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/30" />

                        {/* Milestones */}
                        <div className="space-y-4">
                          {milestones.map((milestone, index) => {
                            const daysToDue = milestone.due_date ? daysUntil(milestone.due_date) : null
                            return (
                              <div key={milestone.id} className="relative flex gap-4">
                                {/* Dot */}
                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                  milestone.status === "approved" || milestone.status === "invoiced" ? "bg-emerald-500" :
                                  milestone.status === "delivered" ? "bg-blue-500" :
                                  milestone.status === "in_progress" ? "bg-amber-500" :
                                  milestone.status === "invoiceable" ? "bg-purple-500" :
                                  "bg-muted"
                                }`}>
                                  {milestone.status === "approved" || milestone.status === "invoiced" ? (
                                    <CheckCircle2 className="size-4 text-white" />
                                  ) : milestone.status === "delivered" ? (
                                    <FileText className="size-4 text-white" />
                                  ) : milestone.status === "in_progress" ? (
                                    <Clock className="size-4 text-white" />
                                  ) : milestone.status === "invoiceable" ? (
                                    <Euro className="size-4 text-white" />
                                  ) : (
                                    <Calendar className="size-4 text-muted-foreground" />
                                  )}
                                </div>

                                {/* Content */}
                                <div className={`flex-1 bg-muted/20 rounded-xl border p-4 ${
                                  milestone.status === "approved" || milestone.status === "invoiced" ? "border-emerald-500/20" :
                                  milestone.status === "invoiceable" ? "border-purple-500/20" :
                                  "border-border/20"
                                }`}>
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-medium text-foreground">{milestone.title}</h4>
                                        {milestone.requires_approval && (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            ✓ Richiede approvazione
                                          </span>
                                        )}
                                      </div>
                                      {milestone.description && (
                                        <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                                      )}
                                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                                        {milestone.due_date && (
                                          <span className={`text-xs flex items-center gap-1 ${
                                            daysToDue !== null && daysToDue <= 7 && milestone.status === "upcoming" ? "text-amber-400" : 
                                            "text-muted-foreground"
                                          }`}>
                                            <Calendar className="size-3" />
                                            Scadenza: {formatDate(milestone.due_date)}
                                            {daysToDue !== null && daysToDue > 0 && milestone.status === "upcoming" && ` (tra ${daysToDue}gg)`}
                                          </span>
                                        )}
                                        {milestone.delivery_date && (
                                          <span className="text-xs text-blue-400 flex items-center gap-1">
                                            <FileText className="size-3" />
                                            Consegnato: {formatDate(milestone.delivery_date)}
                                          </span>
                                        )}
                                        {milestone.approval_date && (
                                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 className="size-3" />
                                            Approvato: {formatDate(milestone.approval_date)}
                                          </span>
                                        )}
                                        {milestone.amount && (
                                          <span className="text-xs font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded">
                                            {formatCurrency(milestone.amount)}
                                          </span>
                                        )}
                                      </div>
                                      {milestone.approval_contact && (
                                        <div className="text-xs text-muted-foreground mt-2">
                                          Referente approvazione: {milestone.approval_contact}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        milestone.status === "invoiced" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                        milestone.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                        milestone.status === "invoiceable" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                        milestone.status === "delivered" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                        milestone.status === "in_progress" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                        "bg-muted/30 text-muted-foreground"
                                      }`}>
                                        {milestone.status === "invoiced" ? "✓ Fatturato" :
                                         milestone.status === "approved" ? "✓ Approvato" :
                                         milestone.status === "invoiceable" ? "💰 Da fatturare" :
                                         milestone.status === "delivered" ? "📦 Consegnato" :
                                         milestone.status === "in_progress" ? "⚡ In corso" :
                                         "📅 Pianificato"}
                                      </span>
                                      {milestone.status === "invoiceable" && !milestone.invoice_id && (
                                        <button className="text-xs px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                                          Genera fattura
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Tab 5: Documenti */}
                {activeTab === "documenti" && (
                  <motion.div
                    key="documenti"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Trascina i documenti qui o clicca per selezionare
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        PDF, DOCX (max 50MB)
                      </p>
                    </div>

                    {/* Documents List */}
                    <div className="space-y-2">
                      {mockDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              doc.document_type === "signed" ? "bg-emerald-500/10 text-emerald-400" :
                              doc.document_type === "attachment" ? "bg-blue-500/10 text-blue-400" :
                              "bg-muted/30 text-muted-foreground"
                            }`}>
                              <FileText className="size-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{doc.file_name}</span>
                                {doc.is_current && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                    Corrente
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>v{doc.version}</span>
                                <span>-</span>
                                <span className="capitalize">{doc.document_type}</span>
                                {doc.signature_status === "signed" && (
                                  <>
                                    <span>-</span>
                                    <span className="text-emerald-400">Firmato</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-muted/30 transition-colors">
                              <Download className="size-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted/30 transition-colors">
                              <MoreVertical className="size-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tab 6: Fatture */}
                {activeTab === "fatture" && (
                  <motion.div
                    key="fatture"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* KPI */}
                    <div className="bg-muted/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Totale fatturato</span>
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(totalPaid)} / {formatCurrency(totalInvoiced)}
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0}% del contratto
                      </div>
                    </div>

                    {/* Invoices List */}
                    {relatedInvoices.length === 0 ? (
                      <div className="text-center py-8">
                        <Euro className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Nessuna fattura collegata</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {relatedInvoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border/20"
                          >
                            <div>
                              <div className="text-sm font-medium text-foreground">{invoice.invoice_number}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(invoice.invoice_date)} - {invoice.counterpart_name}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-foreground">
                                {formatCurrency(invoice.amount_gross)}
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                invoice.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-400" :
                                invoice.payment_status === "overdue" ? "bg-red-500/10 text-red-400" :
                                "bg-muted/30 text-muted-foreground"
                              }`}>
                                {invoice.payment_status === "paid" ? "Pagata" :
                                 invoice.payment_status === "overdue" ? "Scaduta" : "In attesa"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                      <Plus className="size-4" />
                      Nuova fattura
                    </button>
                  </motion.div>
                )}

                {/* Tab 7: Storico Negoziazione */}
                {activeTab === "storico" && (
                  <motion.div
                    key="storico"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/30" />

                      {/* Events */}
                      <div className="space-y-4">
                        {mockNegotiationHistory.map((event) => (
                          <div key={event.id} className="relative flex gap-4">
                            {/* Dot */}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                              event.initiated_by === "mine" ? "bg-primary" : "bg-blue-500"
                            }`}>
                              {event.event_type === "Firma" ? (
                                <FileSignature className="size-4 text-white" />
                              ) : (
                                <History className="size-4 text-white" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-muted/20 rounded-xl border border-border/20 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-foreground">{event.event_type}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    event.initiated_by === "mine"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-blue-500/10 text-blue-400"
                                  }`}>
                                    {event.initiated_by === "mine" ? "Noi" : "Controparte"}
                                  </span>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {formatDate(event.created_at)}
                                    {event.version_number && ` - v${event.version_number}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-sm w-full justify-center">
                      <Plus className="size-4" />
                      Aggiungi evento
                    </button>
                  </motion.div>
                )}

                {/* Tab 8: GDPR */}
                {activeTab === "gdpr" && (
                  <motion.div
                    key="gdpr"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* DPA Status */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="size-4" />
                        <span className="text-sm font-medium">DPA Firmato il 15/01/2024</span>
                      </div>
                    </div>

                    {/* Data Categories */}
                    <div className="bg-muted/20 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Categorie Dati Trattati</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Dati anagrafici", "Dati di contatto", "Dati di navigazione", "Dati di fatturazione"].map((category) => (
                          <span
                            key={category}
                            className="text-xs px-2.5 py-1 rounded-lg bg-muted/30 text-foreground"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Data Purposes */}
                    <div className="bg-muted/20 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Finalita del Trattamento</h4>
                      <p className="text-sm text-muted-foreground">
                        Esecuzione del contratto di fornitura servizi IT, adempimento di obblighi legali,
                        comunicazione commerciale con consenso.
                      </p>
                    </div>

                    {/* Retention Period */}
                    <div className="bg-muted/20 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Periodo di Conservazione</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">10 anni dalla cessazione del rapporto</span>
                      </div>
                    </div>

                    {/* Sub-processors */}
                    <div className="bg-muted/20 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Sub-Processor</h4>
                      <div className="space-y-2">
                        {[
                          { name: "AWS Europe", location: "Irlanda" },
                          { name: "Google Workspace", location: "UE" },
                        ].map((sp) => (
                          <div key={sp.name} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{sp.name}</span>
                            <span className="text-muted-foreground">{sp.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                      <FileDown className="size-4" />
                      Scarica DPA
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Counterpart/Employee Card */}
          {counterpart && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl border border-border/20 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{counterpart.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{counterpart.type}</div>
                </div>
              </div>

              {/* Reliability Score */}
              <div className="bg-muted/20 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Reliability Score</span>
                  <span className={`text-sm font-semibold ${
                    counterpart.reliability_score >= 80 ? "text-emerald-400" :
                    counterpart.reliability_score >= 60 ? "text-primary" :
                    counterpart.reliability_score >= 40 ? "text-amber-400" :
                    "text-red-400"
                  }`}>
                    {counterpart.reliability_score}/100
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      counterpart.reliability_score >= 80 ? "bg-emerald-400" :
                      counterpart.reliability_score >= 60 ? "bg-primary" :
                      counterpart.reliability_score >= 40 ? "bg-amber-400" :
                      "bg-red-400"
                    }`}
                    style={{ width: `${counterpart.reliability_score}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {counterpart.reliability_label === "excellent" ? "Eccellente" :
                   counterpart.reliability_label === "good" ? "Buono" :
                   counterpart.reliability_label === "warning" ? "Attenzione" :
                   counterpart.reliability_label === "risk" ? "Rischio" : "Non verificato"}
                </div>
              </div>

              {counterpart.has_anac_annotations && (
                <div className="flex items-center gap-2 text-amber-400 text-xs mb-3">
                  <AlertTriangle className="size-3.5" />
                  Annotazioni ANAC rilevate
                </div>
              )}

              <Link
                href={`/dashboard/counterparts/${counterpart.id}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Vedi scheda completa
                <ChevronRight className="size-3" />
              </Link>
            </motion.div>
          )}

          {employee && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl border border-border/20 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="size-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{employee.full_name}</div>
                  <div className="text-xs text-muted-foreground">{employee.role}</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-3">
                {employee.department} - {employee.employee_type === "employee" ? "Dipendente" : "Collaboratore"}
              </div>

              <Link
                href={`/dashboard/employees/${employee.id}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Vedi scheda completa
                <ChevronRight className="size-3" />
              </Link>
            </motion.div>
          )}

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Alert Attivi</h3>
            {contract.auto_renewal && days <= 45 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                  <AlertTriangle className="size-3.5" />
                  Rinnovo Automatico
                </div>
                <p className="text-xs text-amber-400/80">
                  Scade tra {days} giorni. Disdetta entro {contract.renewal_notice_days}gg.
                </p>
              </div>
            )}
            {days <= 30 && days > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2 text-red-400 text-xs font-medium mb-1">
                  <AlertCircle className="size-3.5" />
                  Contratto in Scadenza
                </div>
                <p className="text-xs text-red-400/80">
                  Scade il {formatDate(contract.end_date)}
                </p>
              </div>
            )}
          </motion.div>

          {/* Related Contracts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Contratti Correlati</h3>
            <div className="text-xs text-muted-foreground">
              Nessun contratto correlato trovato
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
