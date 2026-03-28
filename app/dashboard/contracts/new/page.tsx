"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Upload,
  FileText,
  Building2,
  Users,
  Euro,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Save,
  RefreshCw,
  Shield,
  Clock,
  Percent,
  FileSignature,
  Plus,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCurrency } from "@/lib/mock-data"
import type { Database } from '@/types/database'

type CounterpartRow = Database['public']['Tables']['counterparts']['Row']
type EmployeeRow = Database['public']['Tables']['employees']['Row']
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { analyzeContractAction } from "@/lib/actions/contracts"
import { verifyCounterpartAction } from "@/lib/actions/osint"
import type { AnalyzeContractResponse, VerifyOSINTResponse } from "@/types/terminia"
import { toast } from "sonner"

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  service_supply: "Fornitura Servizi",
  goods_supply: "Fornitura Beni",
  framework: "Accordo Quadro",
  nda: "NDA / Riservatezza",
  agency: "Agenzia",
  partnership: "Partnership",
  permanent: "Tempo Indeterminato",
  fixed_term: "Tempo Determinato",
  cococo: "Co.Co.Co.",
  apprenticeship: "Apprendistato",
  internship: "Stage / Tirocinio",
  collaboration: "Collaborazione",
}

function mapContractType(aiType: string): ContractType {
  const map: Record<string, ContractType> = {
    service_supply: "service_supply",
    goods_supply: "goods_supply",
    framework: "framework",
    nda: "nda",
    agency: "agency",
    partnership: "partnership",
    permanent: "permanent",
    fixed_term: "fixed_term",
    cococo: "cococo",
    apprenticeship: "apprenticeship",
    internship: "internship",
    collaboration: "collaboration",
    // Italian variants the model might return
    fornitura_servizi: "service_supply",
    fornitura_beni: "goods_supply",
    accordo_quadro: "framework",
    tempo_indeterminato: "permanent",
    tempo_determinato: "fixed_term",
    apprendistato: "apprenticeship",
    stage: "internship",
    collaborazione: "collaboration",
  }
  return map[aiType.toLowerCase().replace(/\s+/g, "_")] || "service_supply"
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g. "data:application/pdf;base64,")
      const base64 = result.includes(",") ? result.split(",")[1] : result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

type CreationMode = "upload" | "manual"
type ContractType = "service_supply" | "goods_supply" | "framework" | "nda" | "agency" | "partnership" | "permanent" | "fixed_term" | "cococo" | "apprenticeship" | "internship" | "collaboration"
type ActorType = "counterpart" | "employee"
type UploadStep = "upload" | "analyzing" | "classified" | "questions" | "osint" | "preview"

interface AIQuestion {
  id: string
  question: string
  options: { label: string; value: string }[]
}

function NewContractContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCounterpart = searchParams.get("counterpart")
  const { user } = useUser()
  const supabase = createClient()

  const [mode, setMode] = useState<CreationMode>("upload")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Upload state
  const [uploadStep, setUploadStep] = useState<UploadStep>("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [aiConfidence, setAiConfidence] = useState<number | null>(null)
  const [aiQuestions, setAiQuestions] = useState<AIQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [osintProgress, setOsintProgress] = useState(0)
  const [reliabilityScore, setReliabilityScore] = useState<number | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalyzeContractResponse | null>(null)
  const [osintResult, setOsintResult] = useState<VerifyOSINTResponse | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    contract_type: "service_supply" as ContractType,
    actor_type: "counterpart" as ActorType,
    counterpart_id: preselectedCounterpart || "",
    employee_id: "",
    status: "draft" as "draft" | "negotiating" | "active",
    reference_number: "",
    value: "",
    value_type: "total" as "total" | "annual" | "monthly" | "hourly",
    payment_terms_days: "30",
    payment_frequency: "monthly" as "monthly" | "quarterly" | "milestone" | "one_time" | "annual",
    vat_regime: "ordinary" as "ordinary" | "reverse_charge" | "exempt" | "out_of_scope" | "split_payment",
    vat_rate: "22",
    withholding_tax_enabled: false,
    withholding_tax_rate: "20",
    istat_index_enabled: false,
    signing_date: "",
    start_date: "",
    end_date: "",
    effectiveness_date: "",
    auto_renewal: false,
    renewal_notice_days: "30",
    renewal_duration_months: "12",
    notes: "",
    tags: [] as string[],
  })

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["general"]))
  const [counterparts, setCounterparts] = useState<CounterpartRow[]>([])
  const [employees, setEmployees] = useState<EmployeeRow[]>([])

  // Load data
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

        if (!userData?.company_id) return

        // Fetch counterparts
        const { data: counterpartData } = await supabase
          .from('counterparts')
          .select('*')
          .eq('company_id', userData.company_id)

        setCounterparts(counterpartData || [])

        // Fetch employees
        const { data: employeeData } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', userData.company_id)

        setEmployees(employeeData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user, supabase])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadedFile(file)
    setUploadStep("analyzing")
    setUploadProgress(0)
    setAnalysisResult(null)
    setOsintResult(null)

    // Animate progress while waiting for the API
    const interval = setInterval(() => {
      setUploadProgress(prev => (prev >= 90 ? 90 : prev + 10))
    }, 120)

    try {
      const base64 = await fileToBase64(file)

      const result = await analyzeContractAction({
        documentBase64: base64,
        contentType: file.type,
      })

      clearInterval(interval)
      setUploadProgress(100)

      if (!result.success || !result.data) {
        toast.error(
          result.error || "Servizio AI temporaneamente non disponibile. Puoi inserire i dati manualmente.",
        )
        setUploadStep("preview")
        return
      }

      const analysis = result.data
      setAnalysisResult(analysis)

      const confidence = Math.round(
        (analysis.classification.confidence >= 1
          ? analysis.classification.confidence
          : analysis.classification.confidence * 100),
      )
      setAiConfidence(confidence)

      // Map extracted data to form fields
      const counterparty = analysis.classification.parties?.counterpart
      const contractType = mapContractType(analysis.classification.contract_type)
      const isEmployee = analysis.classification.counterpart_type === "employee"

      setFormData(prev => ({
        ...prev,
        title: counterparty?.name
          ? `${CONTRACT_TYPE_LABELS[contractType] || analysis.classification.contract_type} – ${counterparty.name}`
          : CONTRACT_TYPE_LABELS[contractType] || analysis.classification.contract_type,
        contract_type: contractType,
        actor_type: isEmployee ? "employee" as ActorType : "counterpart" as ActorType,
        value: analysis.extraction.value?.total_value?.toString() || "",
        value_type: "total" as const,
        start_date: analysis.extraction.dates?.start_date || "",
        end_date: analysis.extraction.dates?.end_date || "",
        auto_renewal: analysis.extraction.renewal?.auto_renewal || false,
      }))

      if (confidence >= 85) {
        // High confidence — show classified step, then preview
        setUploadStep("classified")
      } else {
        // Low confidence — ask user to confirm uncertain fields
        setAiQuestions([
          {
            id: "q1",
            question: "Questo contratto riguarda un fornitore o un dipendente?",
            options: [
              { label: "Fornitore", value: "counterpart" },
              { label: "Dipendente", value: "employee" },
            ],
          },
          {
            id: "q2",
            question: "Quale categoria contrattuale meglio descrive il documento?",
            options: [
              { label: "Fornitura Servizi", value: "service_supply" },
              { label: "Fornitura Beni", value: "goods_supply" },
              { label: "Accordo Quadro", value: "framework" },
            ],
          },
          {
            id: "q3",
            question: "Il contratto prevede rinnovo automatico?",
            options: [
              { label: "Si", value: "yes" },
              { label: "No", value: "no" },
            ],
          },
        ])
        setCurrentQuestionIndex(0)
        setUploadStep("questions")
      }
    } catch {
      clearInterval(interval)
      toast.error("Errore di rete. Riprova più tardi.", {
        action: { label: "Riprova", onClick: () => handleFileUpload(file) },
      })
      setUploadStep("upload")
      setUploadProgress(0)
    }
  }, [])

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    // Process answer
    if (questionId === "q1") {
      setFormData(prev => ({ ...prev, actor_type: answer as ActorType }))
    } else if (questionId === "q2") {
      setFormData(prev => ({ ...prev, contract_type: answer as ContractType }))
    } else if (questionId === "q3") {
      setFormData(prev => ({ ...prev, auto_renewal: answer === "yes" }))
    }

    // Move to next question or OSINT verification
    if (currentQuestionIndex < aiQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Questions complete — start OSINT verification for counterpart
      if (formData.actor_type === "counterpart") {
        setUploadStep("osint")
        runOSINTVerification()
      } else {
        setUploadStep("preview")
      }
    }
  }

  const runOSINTVerification = async () => {
    setOsintProgress(0)
    setOsintResult(null)

    // Animate progress while waiting for the API
    const interval = setInterval(() => {
      setOsintProgress(prev => (prev >= 90 ? 90 : prev + 5))
    }, 150)

    try {
      const counterparty = analysisResult?.classification.parties?.counterpart

      const result = await verifyCounterpartAction({
        vatNumber: counterparty?.vat,
        companyName: counterparty?.name,
      })

      clearInterval(interval)
      setOsintProgress(100)

      if (result.success && result.data) {
        setOsintResult(result.data)
        setReliabilityScore(result.data.reliability.score)
      } else {
        toast.error(result.error || "Verifica OSINT non disponibile")
        setReliabilityScore(null)
      }

      setTimeout(() => setUploadStep("preview"), 1200)
    } catch {
      clearInterval(interval)
      setOsintProgress(100)
      toast.error("Errore di rete nella verifica controparte")
      setTimeout(() => setUploadStep("preview"), 800)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500))

    // TODO: Save to Supabase
    router.push("/dashboard/contracts")
  }

  const isHRContract = ["permanent", "fixed_term", "cococo", "apprenticeship", "internship", "collaboration"].includes(formData.contract_type)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/dashboard/contracts"
          className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Nuovo Contratto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Carica un documento PDF o crea manualmente
          </p>
        </div>
      </motion.div>

      {/* Mode Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <button
          onClick={() => setMode("upload")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="size-4" />
          Carica PDF
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === "manual"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-4" />
          Crea Manuale
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Upload Mode */}
        {mode === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            {uploadStep === "upload" && (
              <div
                className="glass-card rounded-2xl border-2 border-dashed border-border/50 p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".pdf,.docx"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Trascina il contratto qui o clicca per selezionare
                </h3>
                <p className="text-sm text-muted-foreground">
                  Formati accettati: PDF, DOCX (massimo 50MB)
                </p>
                <button className="mt-4 text-xs text-primary hover:underline">
                  Oppure crea manualmente
                </button>
              </div>
            )}

            {/* Analyzing */}
            {uploadStep === "analyzing" && (
              <div className="glass-card rounded-2xl border border-border/20 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {uploadProgress < 100 ? (
                    <Upload className="size-8 text-primary animate-pulse" />
                  ) : (
                    <Sparkles className="size-8 text-primary animate-pulse" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {uploadProgress < 100 ? "Caricamento in corso..." : "Analisi AI in corso..."}
                </h3>
                <div className="w-full max-w-xs mx-auto bg-muted/30 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 100 ? `${uploadProgress}%` : "Estrazione dati dal documento..."}
                </p>
              </div>
            )}

            {/* Classified - High Confidence */}
            {uploadStep === "classified" && aiConfidence && aiConfidence >= 85 && (
              <div className="glass-card rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="size-6 text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      Contratto identificato con sicurezza
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Confidenza AI: {aiConfidence}%
                    </p>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-xl p-4 mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Tipo rilevato</div>
                  <div className="text-foreground font-medium">
                    {CONTRACT_TYPE_LABELS[formData.contract_type] || formData.contract_type}
                  </div>
                  {analysisResult?.classification.parties && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Parti: {[analysisResult.classification.parties.company, analysisResult.classification.parties.counterpart?.name].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setUploadStep("preview")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Conferma e continua
                </button>
              </div>
            )}

            {/* Questions - Low Confidence */}
            {uploadStep === "questions" && aiQuestions.length > 0 && (
              <div className="glass-card rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="size-6 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      Contratto non classificato con certezza
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Confidenza AI: {aiConfidence}% — Conferma i dati estratti
                    </p>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    DOMANDA {currentQuestionIndex + 1} di {aiQuestions.length}
                  </div>
                  <h4 className="text-foreground font-medium mb-4">
                    {aiQuestions[currentQuestionIndex].question}
                  </h4>
                  <div className="flex gap-2">
                    {aiQuestions[currentQuestionIndex].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleQuestionAnswer(aiQuestions[currentQuestionIndex].id, option.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-muted/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OSINT Verification */}
            {uploadStep === "osint" && (
              <div className="glass-card rounded-2xl border border-border/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="size-6 text-primary animate-pulse" />
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      Verifica Controparte in Corso...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sto verificando su Registro Imprese, ANAC, fonti pubbliche...
                    </p>
                  </div>
                </div>

                <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${osintProgress}%` }}
                  />
                </div>

                {osintProgress === 100 && reliabilityScore && (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Reliability Score</div>
                          <div className={`text-2xl font-bold ${
                            reliabilityScore >= 80 ? "text-emerald-400" :
                            reliabilityScore >= 60 ? "text-primary" :
                            "text-amber-400"
                          }`}>
                            {reliabilityScore}/100
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {osintResult?.reliability?.score
                              ? (osintResult.reliability.score >= 80 ? "Eccellente" :
                                 osintResult.reliability.score >= 60 ? "Buono" : "Attenzione")
                              : (reliabilityScore && reliabilityScore >= 80 ? "Eccellente" :
                               reliabilityScore && reliabilityScore >= 60 ? "Buono" : "Attenzione")}
                          </div>
                        </div>
                        <CheckCircle2 className={`size-10 ${
                          reliabilityScore >= 80 ? "text-emerald-400" :
                          reliabilityScore >= 60 ? "text-primary" :
                          "text-amber-400"
                        }`} />
                      </div>
                    </div>

                    {/* Verification status */}
                    {osintResult && (
                      <div className="bg-muted/20 rounded-xl p-4 space-y-2 text-sm">
                        {osintResult.vies?.valid !== null && (
                          <div className="flex items-center gap-2">
                            <span>{osintResult.vies?.valid ? "✅" : "❌"}</span>
                            <span>{osintResult.vies?.valid ? "P.IVA valida" : "P.IVA non valida"}</span>
                            {osintResult.vies?.name && (
                              <span className="text-muted-foreground">— {osintResult.vies.name}</span>
                            )}
                          </div>
                        )}
                        {osintResult.anac?.checked && (
                          <div className="flex items-center gap-2">
                            <span>{osintResult.anac.annotations_found ? "⚠️" : "✅"}</span>
                            <span>
                              {osintResult.anac.annotations_found
                                ? `Annotazione ANAC: ${osintResult.anac.annotations?.[0]?.description || "presente"}`
                                : "Nessuna annotazione ANAC"}
                            </span>
                          </div>
                        )}
                        {osintResult.fiscal_code && (
                          <div className="flex items-center gap-2">
                            <span>{osintResult.fiscal_code.valid ? "✅" : "❌"}</span>
                            <span>
                              Codice Fiscale {osintResult.fiscal_code.valid ? "valido" : "non valido"}
                              {osintResult.fiscal_code.checksum_ok ? "" : " (checksum errato)"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dimension breakdown */}
                    {osintResult?.reliability?.dimensions && (
                      <div className="bg-muted/20 rounded-xl p-4">
                        <div className="text-xs text-muted-foreground mb-3">DETTAGLIO DIMENSIONI</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          {Object.entries(osintResult.reliability.dimensions).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-muted-foreground capitalize">{key}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      value >= 80 ? "bg-emerald-400" :
                                      value >= 60 ? "bg-primary" :
                                      "bg-amber-400"
                                    }`}
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium w-6 text-right">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {uploadStep === "preview" && (
              <div className="glass-card rounded-2xl border border-border/20 p-6">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <FileText className="size-4" />
                  Riepilogo Dati Estratti
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Ogni campo e editabile - clicca per modificare
                </p>

                {/* Quick edit form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Titolo contratto</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Tipo</label>
                    <select
                      value={formData.contract_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, contract_type: e.target.value as ContractType }))}
                      className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="service_supply">Fornitura Servizi</option>
                      <option value="goods_supply">Fornitura Beni</option>
                      <option value="framework">Accordo Quadro</option>
                      <option value="nda">NDA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Controparte rilevata</label>
                    <select
                      value={formData.counterpart_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, counterpart_id: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Seleziona controparte</option>
                      {counterparts.map(cp => (
                        <option key={cp.id} value={cp.id}>{cp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Valore</label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="EUR"
                      className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Data inizio</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Data fine</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setMode("manual")}
                    className="px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm"
                  >
                    Modifica completa
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Salvataggio...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Salva e analizza clausole
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dati Generali */}
              <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("general")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileText className="size-4" />
                    Dati Generali
                  </span>
                  {expandedSections.has("general") ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </button>

                {expandedSections.has("general") && (
                  <div className="p-4 pt-0 space-y-4">
                    {/* Tipo Contratto */}
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Tipo Contratto</label>
                      <select
                        value={formData.contract_type}
                        onChange={(e) => {
                          const type = e.target.value as ContractType
                          const isHR = ["permanent", "fixed_term", "cococo", "apprenticeship", "internship", "collaboration"].includes(type)
                          setFormData(prev => ({
                            ...prev,
                            contract_type: type,
                            actor_type: isHR ? "employee" : "counterpart"
                          }))
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <optgroup label="Commerciali">
                          <option value="service_supply">Fornitura Servizi</option>
                          <option value="goods_supply">Fornitura Beni</option>
                          <option value="framework">Accordo Quadro</option>
                          <option value="nda">NDA</option>
                          <option value="agency">Agenzia</option>
                          <option value="partnership">Partnership</option>
                        </optgroup>
                        <optgroup label="HR / Lavoro">
                          <option value="permanent">Tempo Indeterminato</option>
                          <option value="fixed_term">Tempo Determinato</option>
                          <option value="cococo">Co.co.co</option>
                          <option value="apprenticeship">Apprendistato</option>
                          <option value="internship">Tirocinio</option>
                          <option value="collaboration">Collaborazione</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Attore Principale */}
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Attore Principale</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, actor_type: "counterpart" }))}
                          className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.actor_type === "counterpart"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Building2 className="size-4" />
                          Controparte
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, actor_type: "employee" }))}
                          className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            formData.actor_type === "employee"
                              ? "bg-purple-500 text-white"
                              : "bg-muted/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Users className="size-4" />
                          Dipendente
                        </button>
                      </div>
                    </div>

                    {/* Controparte/Dipendente */}
                    {formData.actor_type === "counterpart" ? (
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Controparte</label>
                        <div className="flex gap-2">
                          <select
                            value={formData.counterpart_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, counterpart_id: e.target.value }))}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            <option value="">Seleziona controparte</option>
                            {counterparts.map(cp => (
                              <option key={cp.id} value={cp.id}>{cp.name}</option>
                            ))}
                          </select>
                          <Link
                            href="/dashboard/counterparts/new"
                            className="px-3 py-2.5 rounded-xl bg-muted/30 text-muted-foreground hover:text-foreground transition-colors text-xs"
                          >
                            + Nuova
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Dipendente</label>
                        <div className="flex gap-2">
                          <select
                            value={formData.employee_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            <option value="">Seleziona dipendente</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                            ))}
                          </select>
                          <Link
                            href="/dashboard/employees/new"
                            className="px-3 py-2.5 rounded-xl bg-muted/30 text-muted-foreground hover:text-foreground transition-colors text-xs"
                          >
                            + Nuovo
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Titolo e Riferimento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Titolo Contratto *</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Es. Contratto Fornitura Servizi IT"
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Numero Riferimento</label>
                        <input
                          type="text"
                          value={formData.reference_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                          placeholder="Es. CTR-2024-001"
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>

                    {/* Stato Iniziale */}
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Stato Iniziale</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "draft" | "negotiating" | "active" }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="draft">Bozza</option>
                        <option value="negotiating">Negoziazione</option>
                        <option value="active">Attivo</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Dati Economici */}
              <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("economic")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Euro className="size-4" />
                    Dati Economici
                  </span>
                  {expandedSections.has("economic") ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </button>

                {expandedSections.has("economic") && (
                  <div className="p-4 pt-0 space-y-4">
                    {/* Valore */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Valore</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">EUR</span>
                          <input
                            type="text"
                            value={formData.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="0"
                            className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Tipo Valore</label>
                        <select
                          value={formData.value_type}
                          onChange={(e) => setFormData(prev => ({ ...prev, value_type: e.target.value as "total" | "annual" | "monthly" | "hourly" }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="total">Totale</option>
                          <option value="annual">Annuale</option>
                          <option value="monthly">Mensile</option>
                          <option value="hourly">Orario</option>
                        </select>
                      </div>
                    </div>

                    {/* Termini di Pagamento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Termini di Pagamento</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.payment_terms_days}
                            onChange={(e) => setFormData(prev => ({ ...prev, payment_terms_days: e.target.value }))}
                            className="w-20 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <span className="text-sm text-muted-foreground">giorni data fattura</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Frequenza Pagamento</label>
                        <select
                          value={formData.payment_frequency}
                          onChange={(e) => setFormData(prev => ({ ...prev, payment_frequency: e.target.value as "monthly" | "quarterly" | "milestone" | "one_time" | "annual" }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="monthly">Mensile</option>
                          <option value="quarterly">Trimestrale</option>
                          <option value="milestone">Milestone</option>
                          <option value="one_time">Una Tantum</option>
                          <option value="annual">Annuale</option>
                        </select>
                      </div>
                    </div>

                    {/* IVA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Regime IVA</label>
                        <select
                          value={formData.vat_regime}
                          onChange={(e) => setFormData(prev => ({ ...prev, vat_regime: e.target.value as "ordinary" | "reverse_charge" | "exempt" | "out_of_scope" | "split_payment" }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="ordinary">Ordinario</option>
                          <option value="reverse_charge">Reverse Charge</option>
                          <option value="exempt">Esente</option>
                          <option value="out_of_scope">Fuori Campo</option>
                          <option value="split_payment">Split Payment</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Aliquota IVA</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.vat_rate}
                            onChange={(e) => setFormData(prev => ({ ...prev, vat_rate: e.target.value }))}
                            className="w-20 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                          <div className="flex gap-1">
                            {[0, 4, 5, 10, 22].map(rate => (
                              <button
                                key={rate}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, vat_rate: String(rate) }))}
                                className="px-2 py-1 text-xs rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {rate}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ritenuta d'Acconto */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={formData.withholding_tax_enabled}
                          onChange={(e) => setFormData(prev => ({ ...prev, withholding_tax_enabled: e.target.checked }))}
                          className="w-4 h-4 rounded border-border/50 bg-muted/30 text-primary focus:ring-primary/30"
                        />
                        Ritenuta d'Acconto
                      </label>
                      {formData.withholding_tax_enabled && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.withholding_tax_rate}
                            onChange={(e) => setFormData(prev => ({ ...prev, withholding_tax_rate: e.target.value }))}
                            className="w-16 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      )}
                    </div>

                    {/* Indice ISTAT */}
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.istat_index_enabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, istat_index_enabled: e.target.checked }))}
                        className="w-4 h-4 rounded border-border/50 bg-muted/30 text-primary focus:ring-primary/30"
                      />
                      Indicizzazione ISTAT
                    </label>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("dates")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="size-4" />
                    Date
                  </span>
                  {expandedSections.has("dates") ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </button>

                {expandedSections.has("dates") && (
                  <div className="p-4 pt-0 space-y-4">
                    {/* Date Chiave */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Data Firma</label>
                        <input
                          type="date"
                          value={formData.signing_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, signing_date: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Data Inizio *</label>
                        <input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Data Fine</label>
                        <input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-2">Data Efficacia</label>
                        <input
                          type="date"
                          value={formData.effectiveness_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, effectiveness_date: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>

                    {/* Rinnovo Automatico */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                      <label className="flex items-center gap-2 text-sm text-foreground mb-3">
                        <RefreshCw className="size-4 text-blue-400" />
                        <span className="font-medium">Rinnovo Automatico</span>
                        <input
                          type="checkbox"
                          checked={formData.auto_renewal}
                          onChange={(e) => setFormData(prev => ({ ...prev, auto_renewal: e.target.checked }))}
                          className="ml-auto w-4 h-4 rounded border-border/50 bg-muted/30 text-primary focus:ring-primary/30"
                        />
                      </label>
                      {formData.auto_renewal && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-2">Giorni Preavviso</label>
                            <input
                              type="number"
                              value={formData.renewal_notice_days}
                              onChange={(e) => setFormData(prev => ({ ...prev, renewal_notice_days: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-2">Durata Rinnovo (mesi)</label>
                            <input
                              type="number"
                              value={formData.renewal_duration_months}
                              onChange={(e) => setFormData(prev => ({ ...prev, renewal_duration_months: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Note e Tag */}
              <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("notes")}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <FileSignature className="size-4" />
                    Note e Tag
                  </span>
                  {expandedSections.has("notes") ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </button>

                {expandedSections.has("notes") && (
                  <div className="p-4 pt-0 space-y-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-2">Note</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Aggiungi note sul contratto..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/dashboard/contracts"
                  className="px-5 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm"
                >
                  Annulla
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Salva Contratto
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function NewContractPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    }>
      <NewContractContent />
    </Suspense>
  )
}
