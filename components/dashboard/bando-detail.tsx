"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Calendar,
  Euro,
  Building2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  HelpCircle,
  Target,
  FileText,
  Users,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  Plus,
  Download,
  Save,
  Sparkles,
  MapPin,
  Tag,
  Link2,
  Bot,
  Loader2,
  Copy,
  Check,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  formatCurrency,
  formatDate,
  daysUntil,
} from "@/types/models"
import { sendChatMessageAction } from "@/lib/actions/chat"
import type { Database } from "@/types/database"

type BandoRow = Database['public']['Tables']['bandi']['Row']
type ParticipationStatus = "new" | "saved" | "evaluating" | "participating" | "submitted" | "won" | "lost" | "withdrawn"

type Bando = Omit<BandoRow, 'match_score' | 'base_value' | 'score_sector' | 'score_size' | 'score_geo' | 'score_requirements' | 'score_feasibility'> & {
  match_score: number
  base_value: number
  score_sector: number
  score_size: number
  score_geo: number
  score_requirements: number
  score_feasibility: number
  requirements: string[]
  gap_satisfied: string[]
  gap_missing: string[]
}

type BandoTabId = "dettaglio" | "match" | "gap" | "checklist" | "lotti" | "competitor"

const bandoTabs: { id: BandoTabId; label: string; icon: React.ReactNode }[] = [
  { id: "dettaglio", label: "Dettaglio", icon: <FileText className="size-4" /> },
  { id: "match", label: "Analisi Match", icon: <Target className="size-4" /> },
  { id: "gap", label: "Gap Analysis", icon: <AlertTriangle className="size-4" /> },
  { id: "checklist", label: "Checklist", icon: <CheckCircle2 className="size-4" /> },
  { id: "lotti", label: "Lotti", icon: <Users className="size-4" /> },
  { id: "competitor", label: "Competitor", icon: <TrendingUp className="size-4" /> },
]

const participationStatuses: { value: ParticipationStatus; label: string; color: string }[] = [
  { value: "new", label: "Nuovo", color: "bg-muted/30 text-muted-foreground" },
  { value: "saved", label: "Salvato", color: "bg-blue-500/10 text-blue-400" },
  { value: "evaluating", label: "In valutazione", color: "bg-amber-500/10 text-amber-400" },
  { value: "participating", label: "Partecipando", color: "bg-purple-500/10 text-purple-400" },
  { value: "submitted", label: "Inviato", color: "bg-primary/10 text-primary" },
  { value: "won", label: "Vinto", color: "bg-emerald-500/10 text-emerald-400" },
  { value: "lost", label: "Perso", color: "bg-red-500/10 text-red-400" },
  { value: "withdrawn", label: "Ritirato", color: "bg-muted/30 text-muted-foreground" },
]

const sourceLabels: Record<string, string> = {
  anac: "ANAC",
  ted_europa: "TED Europa",
  invitalia: "Invitalia",
  mimit: "MIMIT",
  regione_lombardia: "Regione Lombardia",
  regione: "Regione",
}

// Mock data for checklist
const mockChecklist = [
  { id: "ck1", document_name: "Certificato di Iscrizione CCIAA", description: "Certificato camerale in corso di validita (6 mesi)", how_to_obtain: "Richiedi online sul portale InfoCamere", estimated_time: "2-3 giorni", is_long_process: false, is_ready: true },
  { id: "ck2", document_name: "DURC in corso di validita", description: "Documento Unico di Regolarita Contributiva", how_to_obtain: "Richiedi sul portale INPS o attraverso intermediario", estimated_time: "15-30 giorni", is_long_process: true, is_ready: false },
  { id: "ck3", document_name: "Certificazione ISO 9001", description: "Certificato del sistema di gestione qualita", how_to_obtain: "Ente di certificazione accreditato", estimated_time: "6-12 mesi", is_long_process: true, is_ready: false },
  { id: "ck4", document_name: "Bilanci ultimi 3 esercizi", description: "Bilanci depositati presso il Registro Imprese", how_to_obtain: "Estrai dal tuo software contabile o dal Registro Imprese", estimated_time: "1 giorno", is_long_process: false, is_ready: true },
  { id: "ck5", document_name: "Attestazione SOA", description: "Attestazione del sistema di qualificazione", how_to_obtain: "Ente SOA autorizzato", estimated_time: "3-6 mesi", is_long_process: true, is_ready: false },
  { id: "ck6", document_name: "Polizza RC Professionale", description: "Assicurazione responsabilita civile professionale", how_to_obtain: "Compagnia assicurativa o broker", estimated_time: "5-10 giorni", is_long_process: false, is_ready: true },
  { id: "ck7", document_name: "Dichiarazione antimafia", description: "Dichiarazione sostitutiva antimafia", how_to_obtain: "Prefettura o Camera di Commercio", estimated_time: "15-30 giorni", is_long_process: true, is_ready: false },
  { id: "ck8", document_name: "Curriculum aziendale", description: "CV con esperienze pregresse simili", how_to_obtain: "Redigi internamente", estimated_time: "1-2 giorni", is_long_process: false, is_ready: false },
]

const mockLotti = [
  { id: "l1", lot_number: 1, title: "Lotto 1 - Servizi di sviluppo software", description: "Sviluppo e manutenzione applicativi web e mobile", value: 85000 },
  { id: "l2", lot_number: 2, title: "Lotto 2 - Servizi di infrastruttura", description: "Gestione infrastruttura cloud e sicurezza", value: 45000 },
  { id: "l3", lot_number: 3, title: "Lotto 3 - Supporto e helpdesk", description: "Servizi di supporto tecnico agli utenti", value: 20000 },
]

const mockCompetitors = [
  { id: "comp1", year: 2023, authority: "Comune di Milano", winner: "ICT Solutions SpA", value: 78000, discount_percent: 12.5 },
  { id: "comp2", year: 2023, authority: "Regione Lombardia", winner: "Digital Services Srl", value: 92000, discount_percent: 8.3 },
  { id: "comp3", year: 2022, authority: "Comune di Roma", winner: "TechCorp Italia", value: 105000, discount_percent: 15.2 },
  { id: "comp4", year: 2022, authority: "Provincia di Milano", winner: "Sistemi Informativi Srl", value: 68000, discount_percent: 10.1 },
]

export interface BandoDetailProps {
  bando: Bando
}

export function BandoDetail({ bando }: BandoDetailProps) {
  const [activeTab, setActiveTab] = useState<BandoTabId>("dettaglio")
  const [participationStatus, setParticipationStatus] = useState<ParticipationStatus>(
    (bando.participation_status ?? 'new') as ParticipationStatus
  )
  const [internalNotes, setInternalNotes] = useState(bando.internal_notes || "")
  const [aiExplanation, setAiExplanation] = useState<string | null>(null)
  const [aiExplanationLoading, setAiExplanationLoading] = useState(false)
  const [aiExplanationError, setAiExplanationError] = useState<string | null>(null)
  const [aiCopied, setAiCopied] = useState(false)

  const handleExplainMatch = async () => {
    if (aiExplanationLoading) return
    setAiExplanationLoading(true)
    setAiExplanationError(null)
    setAiExplanation(null)

    const cpvList = bando.cpv_codes?.join(", ") ?? "N/A"
    const prompt = `Spiega perché questo bando ha un match score del ${bando.match_score}% per la nostra azienda. Il bando è: "${bando.title}", ente appaltante: ${bando.authority_name}, CPV: ${cpvList}, valore base: ${formatCurrency(bando.base_value)}, scadenza: ${formatDate(bando.deadline)}. Punteggi: settore ${bando.score_sector}/40, dimensione ${bando.score_size}/30, geografia ${bando.score_geo}/25, requisiti ${bando.score_requirements}/20, fattibilità ${bando.score_feasibility}/20. Spiega in modo chiaro e sintetico quali sono i punti di forza e le aree di miglioramento.`

    const result = await sendChatMessageAction([{ role: "user", content: prompt }])

    if (result.success && result.response) {
      setAiExplanation(result.response)
    } else {
      setAiExplanationError(result.error ?? "Errore nella generazione della spiegazione")
    }
    setAiExplanationLoading(false)
  }

  const handleCopyExplanation = async () => {
    if (!aiExplanation) return
    await navigator.clipboard.writeText(aiExplanation)
    setAiCopied(true)
    setTimeout(() => setAiCopied(false), 2000)
  }

  const handleStatusChange = (status: ParticipationStatus) => {
    setParticipationStatus(status)
  }

  const handleNotesChange = (notes: string) => {
    setInternalNotes(notes)
  }

  const days = daysUntil(bando.deadline)

  const checklistReady = mockChecklist.filter(i => i.is_ready).length
  const checklistTotal = mockChecklist.length
  const checklistProgress = Math.round((checklistReady / checklistTotal) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/bandi"
            className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-foreground">{bando.title}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">{bando.authority_name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    bando.source === "anac" ? "bg-blue-500/10 text-blue-400" :
                    bando.source === "ted_europa" ? "bg-purple-500/10 text-purple-400" :
                    bando.source === "invitalia" ? "bg-emerald-500/10 text-emerald-400" :
                    bando.source === "mimit" ? "bg-amber-500/10 text-amber-400" :
                    "bg-muted/30 text-muted-foreground"
                  }`}>
                    {bando.source_label || sourceLabels[bando.source] || bando.source}
                  </span>
                  {days > 0 ? (
                    <span className={`flex items-center gap-1 text-xs ${
                      days <= 7 ? "text-red-400" : days <= 30 ? "text-amber-400" : "text-muted-foreground"
                    }`}>
                      <Calendar className="size-3" />
                      Scade tra {days} giorni ({formatDate(bando.deadline)})
                    </span>
                  ) : (
                    <span className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      Scaduto
                    </span>
                  )}
                </div>
              </div>
              <a
                href={bando.source_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Vai alla fonte
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Match Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl border border-border/20 p-6"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Score Circle */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                <circle
                  cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none"
                  strokeDasharray={`${(bando.match_score / 100) * 283} 283`}
                  className={
                    bando.match_score >= 80 ? "text-emerald-400" :
                    bando.match_score >= 60 ? "text-primary" :
                    bando.match_score >= 40 ? "text-amber-400" :
                    "text-muted-foreground"
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${
                  bando.match_score >= 80 ? "text-emerald-400" :
                  bando.match_score >= 60 ? "text-primary" :
                  bando.match_score >= 40 ? "text-amber-400" :
                  "text-muted-foreground"
                }`}>
                  {bando.match_score}
                </span>
                <span className="text-xs text-muted-foreground">Match Score</span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Settore", score: bando.score_sector, max: 40 },
                { label: "Dimensione", score: bando.score_size, max: 30 },
                { label: "Geo", score: bando.score_geo, max: 25 },
                { label: "Requisiti", score: bando.score_requirements, max: 20 },
                { label: "Fattibilita", score: bando.score_feasibility, max: 20 },
              ].map((item) => (
                <div key={item.label} className="bg-muted/20 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-sm font-medium text-foreground">
                    {item.score}/{item.max}
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full ${
                        item.score / item.max >= 0.7 ? "bg-emerald-400" :
                        item.score / item.max >= 0.5 ? "bg-primary" :
                        item.score / item.max >= 0.3 ? "bg-amber-400" :
                        "bg-red-400"
                      }`}
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Status Selector */}
            <div className="flex-shrink-0">
              <select
                value={participationStatus}
                onChange={(e) => handleStatusChange(e.target.value as ParticipationStatus)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  participationStatuses.find(s => s.value === participationStatus)?.color || ""
                } border-border/30 bg-transparent`}
              >
                {participationStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Match Explanation */}
            <div className="mt-4 border-t border-border/20 pt-4">
              {!aiExplanation && !aiExplanationLoading && (
                <button
                  onClick={handleExplainMatch}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <Bot className="size-4" />
                  🤖 Spiega Match
                </button>
              )}

              {aiExplanationLoading && (
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <Loader2 className="size-4 text-primary animate-spin" />
                  <span className="text-sm text-primary">Analisi in corso con NemoClaw AI...</span>
                </div>
              )}

              {aiExplanationError && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle className="size-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-400">{aiExplanationError}</p>
                    <button onClick={handleExplainMatch} className="mt-2 text-xs text-red-400 underline hover:no-underline">
                      Riprova
                    </button>
                  </div>
                </div>
              )}

              {aiExplanation && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Bot className="size-4" />
                      <span className="text-sm font-medium">Spiegazione AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyExplanation}
                        className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
                      >
                        {aiCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                        {aiCopied ? "Copiato" : "Copia"}
                      </button>
                      <button onClick={handleExplainMatch} className="text-xs text-primary/70 hover:text-primary transition-colors">
                        Rigenera
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {aiExplanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border/20 overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-border/20">
              {bandoTabs.map((tab) => (
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
                {activeTab === "dettaglio" && (
                  <motion.div key="dettaglio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    {bando.description && (
                      <div className="bg-muted/20 rounded-xl p-4">
                        <p className="text-sm text-foreground/90 leading-relaxed">{bando.description}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">Dati Tecnici</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Base d&apos;Asta</div>
                          <div className="text-lg font-semibold text-foreground">{formatCurrency(bando.base_value)}</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Categoria</div>
                          <div className="text-sm font-medium text-foreground capitalize">{bando.contract_category || "Servizi"}</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Procedura</div>
                          <div className="text-sm font-medium text-foreground">Aperta</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">Date Chiave</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Pubblicazione</div>
                          <div className="text-sm font-medium text-foreground">{bando.publication_date ? formatDate(bando.publication_date) : "-"}</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Scadenza</div>
                          <div className={`text-sm font-medium ${days <= 30 ? "text-amber-400" : "text-foreground"}`}>{formatDate(bando.deadline)}</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Chiarimenti</div>
                          <div className="text-sm font-medium text-foreground">-</div>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Aggiudicazione</div>
                          <div className="text-sm font-medium text-foreground">-</div>
                        </div>
                      </div>
                    </div>
                    {bando.cpv_codes && bando.cpv_codes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Codici CPV</h3>
                        <div className="flex flex-wrap gap-2">
                          {bando.cpv_codes.map((cpv) => (
                            <span key={cpv} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-muted/30 text-foreground">
                              <Tag className="size-3" />
                              {cpv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="bg-muted/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Area Geografica</span>
                      </div>
                      <span className="text-xs text-muted-foreground">NUTS: ITC4C - Milano</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "match" && (
                  <motion.div key="match" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    {bando.match_explanation && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Sparkles className="size-4" />
                          <span className="text-sm font-medium">Analisi AI</span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{bando.match_explanation}</p>
                      </div>
                    )}
                    <div className="bg-muted/20 rounded-xl p-6">
                      <h4 className="text-sm font-medium text-foreground mb-4">Distribuzione Score</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                          { label: "Settore", score: bando.score_sector, max: 40, desc: "Il tuo settore ICT corrisponde al CPV principale" },
                          { label: "Dimensione", score: bando.score_size, max: 30, desc: "Fatturato e dipendenti nel range richiesto" },
                          { label: "Geografia", score: bando.score_geo, max: 25, desc: "Sede operativa in Lombardia" },
                          { label: "Requisiti", score: bando.score_requirements, max: 20, desc: "Certificazioni e requisiti tecnici" },
                          { label: "Fattibilita", score: bando.score_feasibility, max: 20, desc: "Complessita e tempi di realizzazione" },
                        ].map((item) => (
                          <div key={item.label} className="bg-muted/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-muted-foreground">{item.label}</span>
                              <span className={`text-sm font-semibold ${
                                item.score / item.max >= 0.7 ? "text-emerald-400" :
                                item.score / item.max >= 0.5 ? "text-primary" :
                                "text-amber-400"
                              }`}>
                                {item.score}/{item.max}
                              </span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 mb-3">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  item.score / item.max >= 0.7 ? "bg-emerald-400" :
                                  item.score / item.max >= 0.5 ? "bg-primary" :
                                  "bg-amber-400"
                                }`}
                                style={{ width: `${(item.score / item.max) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "gap" && (
                  <motion.div key="gap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">Analisi Requisiti</h3>
                      <div className="space-y-3">
                        {bando.gap_satisfied?.map((req, i) => (
                          <div key={`sat-${i}`} className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                            <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-foreground">{req}</div>
                              <div className="text-xs text-emerald-400 mt-0.5">Requisito soddisfatto</div>
                            </div>
                          </div>
                        ))}
                        {bando.gap_missing?.map((req, i) => (
                          <div key={`miss-${i}`} className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                            <XCircle className="size-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm text-foreground">{req}</div>
                              <div className="text-xs text-red-400 mt-0.5">Requisito mancante</div>
                              <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground">
                                  <strong>Suggerimento AI:</strong> Valuta se questo requisito e obbligatorio o preferenziale. Se preferenziale, puoi comunque partecipare con un punteggio ridotto.
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {bando.requirements?.filter(r =>
                          !bando.gap_satisfied?.includes(r) && !bando.gap_missing?.includes(r)
                        ).map((req, i) => (
                          <div key={`ver-${i}`} className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                            <HelpCircle className="size-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-foreground">{req}</div>
                              <div className="text-xs text-amber-400 mt-0.5">Da verificare</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <Link2 className="size-4" />
                          <span className="text-sm font-medium">Subappalto</span>
                        </div>
                        <p className="text-xs text-blue-400/80">Subappalto consentito fino al 30%. Puoi coprire i gap requisiti con subappaltatori qualificati.</p>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                          <Users className="size-4" />
                          <span className="text-sm font-medium">RTI</span>
                        </div>
                        <p className="text-xs text-purple-400/80">RTI consentito. Valuta partnership con aziende che hanno i requisiti mancanti.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "checklist" && (
                  <motion.div key="checklist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="bg-muted/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Documenti pronti</span>
                        <span className="text-sm font-medium text-foreground">{checklistReady}/{checklistTotal} ({checklistProgress}%)</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${checklistProgress >= 80 ? "bg-emerald-400" : checklistProgress >= 50 ? "bg-primary" : "bg-amber-400"}`} style={{ width: `${checklistProgress}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {mockChecklist.map((item) => (
                        <div key={item.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${item.is_ready ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/20 border-border/20"}`}>
                          <button className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 mt-0.5 ${item.is_ready ? "bg-emerald-500 border-emerald-500" : "border-border/50 hover:border-primary/50"}`}>
                            {item.is_ready && <CheckCircle2 className="size-3 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${item.is_ready ? "text-foreground" : "text-foreground/80"}`}>{item.document_name}</span>
                              {item.is_long_process && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Lungo</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Tempo: {item.estimated_time}</span>
                              <span className="hidden md:inline">|</span>
                              <span className="hidden md:inline">{item.how_to_obtain}</span>
                            </div>
                          </div>
                          {!item.is_ready && <button className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Segna pronto</button>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "lotti" && (
                  <motion.div key="lotti" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    {mockLotti.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Bando senza lotti</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {mockLotti.map((lotto) => (
                          <div key={lotto.id} className="bg-muted/20 rounded-xl border border-border/20 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">Lotto {lotto.lot_number}</span>
                                  <span className="text-sm font-medium text-foreground">{lotto.title}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{lotto.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-foreground">{formatCurrency(lotto.value)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "competitor" && (
                  <motion.div key="competitor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Sparkles className="size-4" />
                        <span className="text-sm font-medium">Insight AI</span>
                      </div>
                      <p className="text-sm text-foreground/90">
                        Il ribasso medio in questo CPV (72.26) e del <strong>11.5%</strong>. Considera una strategia di offerta intorno al 10-12% per essere competitivo.
                      </p>
                    </div>
                    <h3 className="text-sm font-medium text-foreground">Storico Aggiudicazioni Simili</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/20">
                            <th className="text-left text-xs text-muted-foreground font-medium py-2 px-3">Ente</th>
                            <th className="text-left text-xs text-muted-foreground font-medium py-2 px-3">Anno</th>
                            <th className="text-left text-xs text-muted-foreground font-medium py-2 px-3">Aggiudicatario</th>
                            <th className="text-right text-xs text-muted-foreground font-medium py-2 px-3">Valore</th>
                            <th className="text-right text-xs text-muted-foreground font-medium py-2 px-3">Ribasso</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                          {mockCompetitors.map((comp) => (
                            <tr key={comp.id} className="hover:bg-muted/10">
                              <td className="py-3 px-3 text-foreground">{comp.authority}</td>
                              <td className="py-3 px-3 text-muted-foreground">{comp.year}</td>
                              <td className="py-3 px-3 text-foreground">{comp.winner}</td>
                              <td className="py-3 px-3 text-right text-foreground">{formatCurrency(comp.value)}</td>
                              <td className="py-3 px-3 text-right">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  comp.discount_percent > 15 ? "bg-red-500/10 text-red-400" :
                                  comp.discount_percent > 10 ? "bg-amber-500/10 text-amber-400" :
                                  "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  -{comp.discount_percent}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl border border-border/20 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Azioni</h3>
            <div className="space-y-2">
              <select
                value={participationStatus}
                onChange={(e) => handleStatusChange(e.target.value as ParticipationStatus)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {participationStatuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              {participationStatus === "won" && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm">
                  Ho vinto - Genera contratto
                </button>
              )}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
                <Save className="size-4" />
                Salva
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl border border-border/20 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Note Interne</h3>
            <textarea
              value={internalNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Aggiungi note personali..."
              className="w-full h-32 px-3 py-2.5 rounded-xl text-sm bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">Salvataggio automatico</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl border border-border/20 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Alert Collegati</h3>
            {days <= 30 && days > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                  <AlertTriangle className="size-3.5" />
                  Scadenza Imminente
                </div>
                <p className="text-xs text-amber-400/80">Il bando scade tra {days} giorni</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
