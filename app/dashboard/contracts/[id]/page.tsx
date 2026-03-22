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
import {
  getContract,
  getCounterpart,
  getEmployee,
  getInvoices,
  formatCurrency,
  formatDate,
  daysUntil,
  getStatusLabel,
  getStatusColor,
  getRiskColor,
  type Contract,
  type Counterpart,
  type Employee,
  type Invoice,
  type Clause,
  type Obligation,
  type Milestone,
} from "@/lib/mock-data"

// Mock data for clauses, obligations, milestones - will be replaced with Supabase
const mockClauses: Clause[] = [
  {
    id: "cl1",
    contract_id: "c1",
    clause_type: "Riservatezza",
    original_text: "Le parti si impegnano a mantenere riservate le informazioni ricevute nel corso dell'esecuzione del presente contratto per un periodo di 5 anni dalla sua scadenza.",
    simplified_text: "Entrambe le parti devono mantenere segrete le informazioni scambiate per 5 anni dopo la fine del contratto.",
    risk_level: "low",
    risk_score: 15,
  },
  {
    id: "cl2",
    contract_id: "c1",
    clause_type: "Penali",
    original_text: "In caso di ritardo nella consegna dei servizi oltre i termini stabiliti, il Fornitore dovra corrispondere una penale pari al 5% del valore del contratto per ogni giorno di ritardo, fino a un massimo del 30% del valore complessivo.",
    simplified_text: "Se i servizi vengono consegnati in ritardo, il fornitore paga il 5% del valore del contratto per ogni giorno di ritardo (max 30%).",
    risk_level: "high",
    risk_score: 75,
    ai_flag: "Penale elevata",
    ai_suggestion: "Considerare una riduzione della penale al 2% giornaliero o un periodo di tolleranza di 5 giorni lavorativi.",
  },
  {
    id: "cl3",
    contract_id: "c1",
    clause_type: "Rinnovo Tacito",
    original_text: "Il presente contratto si intende rinnovato tacitamente per periodi uguali a quello iniziale, salvo disdetta comunicata da una delle parti con almeno 30 giorni di preavviso rispetto alla scadenza.",
    simplified_text: "Il contratto si rinnova automaticamente. Per disdirlo bisogna comunicarlo almeno 30 giorni prima della scadenza.",
    risk_level: "medium",
    risk_score: 45,
    ai_flag: "Rinnovo automatico",
    ai_suggestion: "Impostare un promemoria nel calendario 45 giorni prima della scadenza per valutare il rinnovo.",
  },
  {
    id: "cl4",
    contract_id: "c1",
    clause_type: "Foro Competente",
    original_text: "Per qualsiasi controversia derivante dal presente contratto sara competente in via esclusiva il Foro di Milano.",
    simplified_text: "In caso di controversie legali, il tribunale competente e quello di Milano.",
    risk_level: "low",
    risk_score: 10,
  },
  {
    id: "cl5",
    contract_id: "c1",
    clause_type: "Responsabilita",
    original_text: "La responsabilita del Fornitore e limitata all'importo effettivamente ricevuto a titolo di corrispettivo, esclusa qualsiasi responsabilita per danni indiretti, mancati guadagni o perdita di dati.",
    simplified_text: "La responsabilita del fornitore e limitata all'importo pagato. Non risponde di danni indiretti o perdita di dati.",
    risk_level: "medium",
    risk_score: 55,
    ai_flag: "Limite di responsabilita",
    ai_suggestion: "Verificare se il limite di responsabilita e adeguato rispetto al valore e alla criticita dei servizi.",
  },
]

const mockObligations: Obligation[] = [
  {
    id: "ob1",
    contract_id: "c1",
    party: "mine",
    description: "Pagamento fatture entro 30 giorni data emissione",
    due_date: "2025-04-15",
    status: "pending",
    recurrence: "monthly",
  },
  {
    id: "ob2",
    contract_id: "c1",
    party: "theirs",
    description: "Consegna report mensile attivita",
    due_date: "2025-03-31",
    status: "pending",
    recurrence: "monthly",
  },
  {
    id: "ob3",
    contract_id: "c1",
    party: "theirs",
    description: "Manutenzione ordinaria sistemi",
    due_date: "2025-04-01",
    status: "pending",
    recurrence: "quarterly",
  },
  {
    id: "ob4",
    contract_id: "c1",
    party: "mine",
    description: "Comunicazione requisiti aggiornati",
    due_date: "2025-04-30",
    status: "pending",
  },
  {
    id: "ob5",
    contract_id: "c1",
    party: "theirs",
    description: "Formazione personale su nuovi moduli",
    due_date: "2025-03-25",
    status: "completed",
  },
]

const mockMilestones: Milestone[] = [
  {
    id: "m1",
    contract_id: "c1",
    title: "Analisi preliminare",
    description: "Analisi dei requisiti e definizione architettura",
    due_date: "2024-02-15",
    amount: 5000,
    status: "completed",
  },
  {
    id: "m2",
    contract_id: "c1",
    title: "Sviluppo modulo base",
    description: "Implementazione funzionalita core del sistema",
    due_date: "2024-04-30",
    amount: 12000,
    status: "completed",
  },
  {
    id: "m3",
    contract_id: "c1",
    title: "Integrazione API",
    description: "Integrazione con sistemi esterni",
    due_date: "2025-03-31",
    amount: 8000,
    status: "in_progress",
  },
  {
    id: "m4",
    contract_id: "c1",
    title: "Testing e QA",
    description: "Test completi e fix bug",
    due_date: "2025-04-30",
    amount: 10000,
    status: "scheduled",
  },
  {
    id: "m5",
    contract_id: "c1",
    title: "Go-live e formazione",
    description: "Messa in produzione e formazione utenti",
    due_date: "2025-05-15",
    amount: 10000,
    status: "scheduled",
  },
]

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
  const [contract, setContract] = useState<Contract | null>(null)
  const [counterpart, setCounterpart] = useState<Counterpart | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [relatedInvoices, setRelatedInvoices] = useState<Invoice[]>([])
  const [activeTab, setActiveTab] = useState<TabId>("riepilogo")
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [obligationParty, setObligationParty] = useState<"mine" | "theirs">("mine")
  const [expandedClauses, setExpandedClauses] = useState<Set<string>>(new Set())

  useEffect(() => {
    const contractData = getContract(params.id as string)
    if (contractData) {
      setContract(contractData)
      if (contractData.counterpart_id) {
        setCounterpart(getCounterpart(contractData.counterpart_id))
      }
      if (contractData.employee_id) {
        setEmployee(getEmployee(contractData.employee_id))
      }
      // Get related invoices
      const invoices = getInvoices().filter(i => i.contract_id === contractData.id)
      setRelatedInvoices(invoices)
    }
  }, [params.id])

  if (!contract) {
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
  const filteredClauses = mockClauses.filter(c => {
    if (riskFilter === "all") return true
    return c.risk_level === riskFilter
  })

  // Filter obligations by party
  const filteredObligations = mockObligations.filter(o => o.party === obligationParty)

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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Filtro rischio:</span>
                      <div className="flex gap-2">
                        {(["all", "high", "medium", "low"] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setRiskFilter(filter)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              riskFilter === filter
                                ? filter === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                                  filter === "medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                  filter === "low" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                  "bg-primary/20 text-primary border border-primary/30"
                                : "bg-muted/30 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {filter === "all" ? "Tutte" : filter === "high" ? "Alto" : filter === "medium" ? "Medio" : "Basso"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clauses List */}
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
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${
                                clause.risk_level === "high" ? "bg-red-400" :
                                clause.risk_level === "medium" ? "bg-amber-400" :
                                "bg-emerald-400"
                              }`} />
                              <span className="text-sm font-medium text-foreground">{clause.clause_type}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                clause.risk_level === "high" ? "bg-red-500/10 text-red-400" :
                                clause.risk_level === "medium" ? "bg-amber-500/10 text-amber-400" :
                                "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {clause.risk_score}%
                              </span>
                            </div>
                            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${
                              expandedClauses.has(clause.id) ? "rotate-180" : ""
                            }`} />
                          </div>

                          {expandedClauses.has(clause.id) && (
                            <div className="px-4 pb-4 space-y-3">
                              <div className="bg-muted/30 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Testo semplificato</div>
                                <p className="text-sm text-foreground">{clause.simplified_text}</p>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-3">
                                <div className="text-xs text-muted-foreground mb-1">Testo originale</div>
                                <p className="text-xs text-muted-foreground italic">{clause.original_text}</p>
                              </div>
                              {clause.ai_flag && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                                    <AlertTriangle className="size-3.5" />
                                    <span className="text-xs font-medium">{clause.ai_flag}</span>
                                  </div>
                                  <p className="text-xs text-amber-400/80">{clause.ai_suggestion}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                    <div className="space-y-3">
                      {filteredObligations.map((obligation) => {
                        const daysToDue = obligation.due_date ? daysUntil(obligation.due_date) : null
                        return (
                          <div
                            key={obligation.id}
                            className="bg-muted/20 rounded-xl border border-border/20 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-sm font-medium ${
                                    obligation.status === "completed" ? "text-emerald-400" : "text-foreground"
                                  }`}>
                                    {obligation.description}
                                  </span>
                                  {obligation.recurrence && obligation.recurrence !== "none" && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                                      {obligation.recurrence === "monthly" ? "Mensile" :
                                       obligation.recurrence === "quarterly" ? "Trimestrale" : "Annuale"}
                                    </span>
                                  )}
                                </div>
                                {obligation.due_date && (
                                  <div className={`text-xs ${
                                    daysToDue !== null && daysToDue <= 7 ? "text-red-400" :
                                    daysToDue !== null && daysToDue <= 30 ? "text-amber-400" :
                                    "text-muted-foreground"
                                  }`}>
                                    Scadenza: {formatDate(obligation.due_date)}
                                    {daysToDue !== null && daysToDue > 0 && ` (${daysToDue} giorni)`}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  obligation.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                  obligation.status === "overdue" ? "bg-red-500/10 text-red-400" :
                                  daysToDue !== null && daysToDue <= 7 ? "bg-amber-500/10 text-amber-400" :
                                  "bg-muted/30 text-muted-foreground"
                                }`}>
                                  {obligation.status === "completed" ? "Completato" :
                                   obligation.status === "overdue" ? "Scaduto" :
                                   daysToDue !== null && daysToDue <= 7 ? "In scadenza" : "In programma"}
                                </span>
                                {obligation.status !== "completed" && (
                                  <button className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                    Completa
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

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
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/30" />

                      {/* Milestones */}
                      <div className="space-y-4">
                        {mockMilestones.map((milestone, index) => {
                          const daysToDue = milestone.due_date ? daysUntil(milestone.due_date) : null
                          return (
                            <div key={milestone.id} className="relative flex gap-4">
                              {/* Dot */}
                              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                                milestone.status === "completed" ? "bg-emerald-500" :
                                milestone.status === "in_progress" ? "bg-amber-500" :
                                "bg-muted"
                              }`}>
                                {milestone.status === "completed" ? (
                                  <CheckCircle2 className="size-4 text-white" />
                                ) : milestone.status === "in_progress" ? (
                                  <Clock className="size-4 text-white" />
                                ) : (
                                  <Calendar className="size-4 text-muted-foreground" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 bg-muted/20 rounded-xl border border-border/20 p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="text-sm font-medium text-foreground">{milestone.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      {milestone.due_date && (
                                        <span className={`text-xs ${
                                          daysToDue !== null && daysToDue <= 7 ? "text-amber-400" : "text-muted-foreground"
                                        }`}>
                                          {formatDate(milestone.due_date)}
                                        </span>
                                      )}
                                      {milestone.amount && (
                                        <span className="text-xs font-medium text-foreground">
                                          {formatCurrency(milestone.amount)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      milestone.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                                      milestone.status === "in_progress" ? "bg-amber-500/10 text-amber-400" :
                                      milestone.status === "billable" ? "bg-purple-500/10 text-purple-400" :
                                      "bg-muted/30 text-muted-foreground"
                                    }`}>
                                      {milestone.status === "completed" ? "Completato" :
                                       milestone.status === "in_progress" ? "In corso" :
                                       milestone.status === "billable" ? "Fatturabile" :
                                       "Programmato"}
                                    </span>
                                    {milestone.status === "billable" && (
                                      <button className="text-xs px-2 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
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
                {employee.department} · {employee.employee_type === "employee" ? "Dipendente" : "Collaboratore"}
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
