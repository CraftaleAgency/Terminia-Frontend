"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  formatCurrency,
  formatDate
  daysUntil
  type Bando
  type ParticipationStatus
} from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"

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

// Mock data for checklist - will be replaced with Supabase
const mockChecklist = [
  { id: "ck1", document_name: "Certificato di Iscrizione CCIAA", description: "Certificato camerale in corso di validita (6 mesi)", how_to_obtain: "Richiedi online sul portale InfoCamere", estimated_time: "2-3 giorni", is_long_process: false, is_ready: true },
  { id: "ck2", document_name: "DURC in corso di validita", description: "Documento Unico di Regolarita Contributiva", how_to_obtain: "Richiedi sul portale INPS  attraverso intermediario", estimated_time: "15-30 giorni", is_long_process: true, is_ready: false },
  { id: "ck3", document_name: "Certificazione ISO 9001", description: "Certificato del sistema di gestione qualita", how_to_obtain: "Ente di certificazione accreditato", estimated_time: "6-12 mesi", is_long_process: true, is_ready: false },
  { id: "ck4", document_name: "Bilanci ultimi 3 esercizi", description: "Bilanci depositati presso il Registro Imprese", how_to_obtain: "Estrai dal tuo software contabile o dal Registro Imprese", estimated_time: "1 giorno", is_long_process: false, is_ready: true },
  { id: "ck5", document_name: "Attestazione SOA", description: "Attestazione del sistema di qualificazione", how_to_obtain: "Ente SOA autorizzato", estimated_time: "3-6 mesi", is_long_process: true, is_ready: false },
  { id: "ck6", document_name: "Polizza RC Professionale", description: "Assicurazione responsabilita civile professionale", how_to_obtain: "Compagnia assicurativa  broker", estimated_time: "5-10 giorni", is_long_process: false, is_ready: true },
  { id: "ck7", document_name: "Dichiarazione antimafia", description: "Dichiarazione sostitutiva antimafia", how_to_obtain: "Prefettura  Camera di Commercio", estimated_time: "15-30 giorni", is_long_process: true, is_ready: false },
  { id: "ck8", document_name: "Curriculum aziendale", description: "CV con esperienze egresse simili", how_to_obtain: "Redigi internamente", estimated_time: "1-2 giorni", is_long_process: false, is_ready: false },
]

// Mock data for lotti
const mockLotti = [
  { id: "l1", lot_number: 1, title: "Lotto 1 - Servizi di sviluppo software", description: "Sviluppo e manutenzione applicativi web mobile", value: 85000 },
  { id: "l2", lot_number: 2, title: "Lotto 2 - Servizi di infrastruttura", description: "Gestione infrastruttura cloud e sicurezza", value: 45000 },
  { id: "l3", lot_number: 3, title: "Lotto 3 - Supporto e helpdesk", description: "Servizi di supporto tecnico agli utenti", value: 20000 },
]

// Mock data for competitor
const mockCompetitors = [
  { id: "comp1", year: 2023, authority: "Comune di Milano", winner: "ICT Solutions SpA", value: 78000, discount_percent: 12.5 },
  { id: "comp2", year: 2023, authority: "Regione Lombardia", winner: "Digital Services Srl", value: 92000, discount_percent: 6.3 },
  { id: "comp3", year: 2022, authority: "Comune di Roma", winner: "TechCorp Italia", value: 105000, discount_percent: 15.2 },
  { id: "comp4", year: 2022, authority: "Provincia di Milano", winner: "Sistemi Informativi Srl", value: 68000, discount_percent: 10.1 },
]

export default function BandoDetailPage() {
  const params = useParams()
    const router = useRouter()
    const { user } = useUser()
    const supabase = createClient()
    const [bando, setBando] = useState<Bando | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<BandoTabId>("dettaglio")

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

                // Fetch bando
                const { data: bandoData, error: bandoError } = await supabase
                    .from('bandi')
                    .select('*')
                    .eq('id', params.id)
                    .eq('company_id', userData.company_id)
                    .single()

                if (error || !bandoData) {
                    setLoading(false)
                    return
                }

                setBando(bandoData)
            } catch (error) {
                console.error('Error fetching bando:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, supabase, params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Caricamento bando...</p>
                </div>
            </div>
        )
    }

    if (!bando) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-muted-foreground">Bando non trovato</p>
                </div>
            </div>
        )

    const days = daysUntil(bando.deadline)
    const isExpired = days <= 0
    const deadlineColor = "text-red-400"
    const deadlineLabel = "Scaduto"
    : days <= 7
        ? "text-amber-400"
        : "text-muted-foreground"

    const deadlineBadge = isExpired ? (
        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Scaduto
        </span>
    ) : days <= 7 ? (
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Tra {days}gg
        </span>
    ) : (
        <span className="px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground border border-border/20">
            {days}gg
        </span>
    )

    const getSourceLabel = (source: string) => {
        const labels: Record<string, string> = {
            anac: "ANAC",
            ted_europa: "TED Europa",
            invitalia: "Invitalia",
            mimit: "MIMIT",
            regione_lombardia: "Regione Lombardia",
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

    const getMatchLabel = (score: number) => {
        if (score >= 80) return "Eccellente"
        if (score >= 60) return "Buono"
        if (score >= 40) return "Discreetazione"
        return "Basso"
    }

    const statusConfig = participationStatuses.find(s => s.value === bando.participation_status)
    const statusColor = statusConfig?.color || statusConfig.label

    const tabs = bandoTabs.map((tab) => (
        <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            <tab.icon}
            {tab.label}
        </button>
    ))

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <Link
                    href="/dashboard/bandi"
                    className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                    <ArrowLeft className="size-5 text-muted-foreground" />
                </Link>

                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-foreground">{bando.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{bando.authority_name}</span>
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full",
                            getSourceColor(bando.source)
                        )}>
                            {getSourceLabel(bando.source)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full border",
                        deadlineColor
                    )}>
                        {deadlineBadge}
                    </span>
                    <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full",
                        statusColor
                    )}>
                        {statusConfig?.label}
                    </span>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="glass-card rounded-2xl border border-border/20 p-1.5 inline-flex">
                {tabs}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "dettaglio" && (
                    <motion.div
                        key="dettaglio"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                                <div className="text-xs text-muted-foreground mb-1">Base d'Asta</div>
                                <div className="text-lg font-semibold text-foreground">
                                    {formatCurrency(bando.base_value)}
                                </div>
                            </div>
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                                <div className="text-xs text-muted-foreground mb-1">Scadenza</div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-red-400" />
                                    <span className="text-lg font-semibold text-foreground">
                                        {formatDate(bando.deadline)}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                                <div className="text-xs text-muted-foreground mb-1">Match Score</div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-2xl font-bold",
                                        getMatchColor(bando.match_score)
                                    )}>
                                        {bando.match_score}%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                                <div className="text-xs text-muted-foreground mb-1">CPV Codes</div>
                                <div className="text-sm text-foreground">
                                    {bando.cpv_codes?.join(", ") || "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* Match Score Breakdown */}
                        <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                            <div className="text-xs text-muted-foreground mb-3">Dettaglio Match Score</div>
                            <div className="grid grid-cols-5 gap-4">
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Settore</div>
                                    <div className={cn("text-lg font-semibold", getMatchColor(bando.score_sector))}>
                                        {bando.score_sector}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Dimensione</div>
                                    <div className={cn("text-lg font-semibold", getMatchColor(bando.score_size))}>
                                        {bando.score_size}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Geografia</div>
                                    <div className={cn("text-lg font-semibold", getMatchColor(bando.score_geo))}>
                                        {bando.score_geo}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Requisiti</div>
                                    <div className={cn("text-lg font-semibold", getMatchColor(bando.score_requirements))}>
                                        {bando.score_requirements}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Fattibilita</div>
                                    <div className={cn("text-lg font-semibold", getMatchColor(bando.score_feasibility))}>
                                        {bando.score_feasibility}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all", getMatchBgColor(bando.match_score))}
                                        style={{ width: `${bando.match_score}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {bando.description && (
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                                <div className="text-xs text-muted-foreground mb-2">Descrizione</div>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {bando.description}
                                </p>
                            </div>
                        )}

                        {/* Requirements */}
                        {bando.requirements && bando.requirements.length > 0 && (
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                                <div className="text-xs text-muted-foreground mb-2">Requisiti</div>
                                <ul className="space-y-2">
                                    {bando.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                            <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === "match" && (
                    <motion.div
                        key="match"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card rounded-2xl border border-border/20 p-6"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Analisi Match Score</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Il punteggio comp calcolato in base a 5 dimensioni: settore, dimensione aziendale, geografia, requisiti e fattibilita.
                        </p>

                        <div className="space-y-4">
                            {["Settore", bando.score_sector, "Aderenza al mercato target"],
                            ["Dimensione", bando.score_size, "Adatta alle dimensione della tua azienda per bandi rilevanti"],
                            ["Geografia", bando.score_geo, "Capacita operativa nelle regioni target del bando"],
                            ["Requisiti", bando.score_requirements, "Soddisfazione dei requisiti minimi richiesti"],
                            ["Fattibilita", bando.score_feasibility, "Valuta complessita e tempi e costi di partecipazione"]].map(([label, score, desc]) => (
                                <div key={label} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                                    <span className="text-sm font-medium text-foreground">{label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-lg font-bold", getMatchColor(score))}>
                                            {score}
                                        </span>
                                        <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full", getMatchBgColor(score))}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {bando.match_explanation && (
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                                <div className="flex items-start gap-2">
                                    <Sparkles className="size-4 text-primary mt-1" />
                                    <p className="text-sm text-foreground">{bando.match_explanation}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === "gap" && (
                    <motion.div
                        key="gap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Gap Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                                <div className="text-xs text-emerald-400 mb-1">Punti di forza</div>
                                <ul className="mt-2 space-y-1">
                                    {bando.gap_satisfied.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-emerald-400">
                                            <CheckCircle2 className="size-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                                <div className="text-xs text-red-400 mb-1">Gap da colmareire</div>
                                <ul className="mt-2 space-y-1">
                                    {bando.gap_missing.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-red-400">
                                            <XCircle className="size-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "checklist" && (
                    <motion.div
                        key="checklist"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Checklist Documenti</h3>
                        <div className="space-y-3">
                            {mockChecklist.map((item) => (
                                <div key={item.id} className="glass-card rounded-xl border border-border/20 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {item.is_ready ? (
                                                    <CheckCircle2 className="size-4 text-emerald-400" />
                                                ) : (
                                                    <Clock className="size-4 text-amber-400" />
                                                )}
                                                <span className="text-sm font-medium text-foreground">
                                                    {item.document_name}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {item.description}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs px-2 py-0.5 rounded-full",
                                                item.is_long_process ? "bg-amber-500/10 text-amber-400" : "bg-muted/30 text-muted-foreground"
                                            )}>
                                                {item.estimated_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "lotti" && (
                    <motion.div
                        key="lotti"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Lotti Disponibili</h3>
                        <div className="space-y-3">
                            {mockLotti.map((lot) => (
                                <div key={lot.id} className="glass-card rounded-xl border border-border/20 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-foreground">
                                                Lotto {lot.lot_number} - {lot.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {lot.description}
                                            </div>
                                        </div>
                                        <div className="text-lg font-semibold text-foreground">
                                            {formatCurrency(lot.value)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "competitor" && (
                    <motion.div
                        key="competitor"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">Storico Competitor</h3>
                        <div className="space-y-3">
                            {mockCompetitors.map((comp) => (
                                <div key={comp.id} className="glass-card rounded-xl border border-border/20 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-medium text-foreground">
                                                {comp.authority}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {comp.year}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-foreground">
                                                {formatCurrency(comp.value)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Scontato: {comp.discount_percent}%
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {comp.winner}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
