"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Building2, Users, Upload, ArrowRight, Loader2, Plus, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { analyzeContractAction } from "@/lib/actions/contracts"
import type { AnalyzeContractResult } from "@/lib/actions/contracts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
export const dynamic = 'force-dynamic'

const steps = [
  { id: 1, title: "Profilo aziendale", icon: Building2, description: "Completa i dati aziendali" },
  { id: 2, title: "Profilo operativo", icon: Building2, description: "Per BandoRadar" },
  { id: 3, title: "Invita il team", icon: Users, description: "Aggiungi collaboratori" },
  { id: 4, title: "Primo contratto", icon: Upload, description: "Opzionale" },
]

const certifications = [
  "ISO 9001",
  "ISO 14001",
  "ISO 27001",
  "ISO 45001",
  "SOA",
  "EMAS",
]

const regions = [
  "Lombardia", "Lazio", "Piemonte", "Veneto", "Emilia-Romagna",
  "Toscana", "Campania", "Sicilia", "Puglia", "Liguria",
  "Trentino-Alto Adige", "Friuli-Venezia Giulia", "Marche", "Abruzzo",
  "Sardegna", "Umbria", "Calabria", "Basilicata", "Molise", "Valle d'Aosta"
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Step 1 data
  const [atecoCode, setAtecoCode] = useState("")
  const [pec, setPec] = useState("")
  const [sdiCode, setSdiCode] = useState("")
  const [address, setAddress] = useState("")

  // Step 2 data
  const [revenue, setRevenue] = useState("")
  const [employeeCount, setEmployeeCount] = useState("")
  const [selectedCerts, setSelectedCerts] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [hasPaExperience, setHasPaExperience] = useState(false)
  const [paContractValue, setPaContractValue] = useState("")

  // Step 3 data
  const [teamMembers, setTeamMembers] = useState([{ email: "", role: "viewer" }])

  // Step 4 data
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalyzeContractResult | null>(null)

  const handleNext = () => {
    if (currentStep < 4) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      finishOnboarding()
    }
  }

  const finishOnboarding = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Get company_id from users table
        const { data: userData } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (userData?.company_id) {
          await supabase
            .from('companies')
            .update({
              ateco_code: atecoCode || undefined,
              pec: pec || undefined,
              sdi_code: sdiCode || undefined,
              address: address || undefined,
              annual_revenue: revenue ? Number(revenue) : undefined,
              employee_count: employeeCount ? Number(employeeCount) : undefined,
              certifications: selectedCerts.length > 0 ? selectedCerts : undefined,
              geographic_operations: selectedRegions.length > 0 ? selectedRegions : undefined,
              past_pa_contracts: hasPaExperience,
              past_pa_contracts_value: paContractValue ? Number(paContractValue) : undefined,
            })
            .eq('id', userData.company_id)
        }
      }
    } catch (err) {
      console.error('Errore salvataggio onboarding:', err)
    }

    // Keep localStorage as fallback
    const existingUser = JSON.parse(localStorage.getItem("terminia_user") || "{}")
    localStorage.setItem("terminia_user", JSON.stringify({
      ...existingUser,
      atecoCode,
      pec,
      sdiCode,
      address,
      revenue,
      employeeCount,
      certifications: selectedCerts,
      regions: selectedRegions,
      hasPaExperience,
      paContractValue,
      onboardingComplete: true,
    }))
    
    router.push("/dashboard")
  }

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) return // 10MB limit
    setUploadedFile(file)
    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      const contentType = file.type || 'application/pdf'

      const result = await analyzeContractAction({
        documentBase64: base64,
        contentType,
      })
      setAnalysisResult(result)
    } catch {
      setAnalysisResult({ success: false, error: 'Errore durante l\'analisi' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const addTeamMember = () => {
    if (teamMembers.length < 5) {
      setTeamMembers([...teamMembers, { email: "", role: "viewer" }])
    }
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col p-8 border-r border-border/20 bg-card/50">
        <div className="flex items-center gap-2.5 mb-12">
          <Image
            src="/images/terminia-logo.png"
            alt="Terminia"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-foreground font-semibold text-lg">Terminia</span>
        </div>

        <nav className="space-y-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === step.id
            const Icon = step.icon

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (isCompleted || step.id <= currentStep) {
                    setCurrentStep(step.id)
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                  isCurrent && "bg-primary/10 border border-primary/30",
                  !isCurrent && "hover:bg-secondary/50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && !isCompleted && "bg-primary/20 text-primary border border-primary/40",
                  !isCurrent && !isCompleted && "bg-secondary text-muted-foreground"
                )}>
                  {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden p-4 border-b border-border/20">
          <div className="flex items-center gap-2.5 mb-4">
            <Image
              src="/images/terminia-logo.png"
              alt="Terminia"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-foreground font-semibold">Terminia</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex-1 h-1.5 rounded-full",
                  step.id <= currentStep ? "bg-primary" : "bg-secondary"
                )}
              />
            ))}
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl">
            {/* Skip button */}
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Salta per ora
              </Button>
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">Profilo aziendale completo</h1>
                  <p className="text-muted-foreground">Questi dati migliorano l'analisi AI dei tuoi contratti</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Codice ATECO</label>
                    <Input
                      placeholder="62.01 - Produzione di software"
                      value={atecoCode}
                      onChange={(e) => setAtecoCode(e.target.value)}
                      className="h-12 bg-secondary/50 border-border/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">PEC</label>
                    <Input
                      placeholder="azienda@pec.it"
                      value={pec}
                      onChange={(e) => setPec(e.target.value)}
                      className="h-12 bg-secondary/50 border-border/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Codice SDI</label>
                    <Input
                      placeholder="ABC1234"
                      value={sdiCode}
                      onChange={(e) => setSdiCode(e.target.value.toUpperCase().slice(0, 7))}
                      className="h-12 bg-secondary/50 border-border/40"
                      maxLength={7}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Indirizzo completo</label>
                    <Input
                      placeholder="Via Roma 1, 20100 Milano MI"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-12 bg-secondary/50 border-border/40"
                    />
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full h-12 text-base font-medium glow-teal-sm">
                  Continua
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">Profilo operativo</h1>
                  <p className="text-muted-foreground">Questi dati abilitano BandoRadar e migliorano il match score</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Fatturato annuo</label>
                      <Input
                        placeholder="280000"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value.replace(/\D/g, ""))}
                        className="h-12 bg-secondary/50 border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">N. dipendenti</label>
                      <Input
                        placeholder="8"
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(e.target.value.replace(/\D/g, ""))}
                        className="h-12 bg-secondary/50 border-border/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Certificazioni possedute</label>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert) => (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => {
                            setSelectedCerts(
                              selectedCerts.includes(cert)
                                ? selectedCerts.filter((c) => c !== cert)
                                : [...selectedCerts, cert]
                            )
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm transition-colors",
                            selectedCerts.includes(cert)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {cert}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Regioni di operativita</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-lg bg-secondary/30">
                      {regions.map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => {
                            setSelectedRegions(
                              selectedRegions.includes(region)
                                ? selectedRegions.filter((r) => r !== region)
                                : [...selectedRegions, region]
                            )
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded text-xs transition-colors",
                            selectedRegions.includes(region)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 p-4 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="paExperience"
                        checked={hasPaExperience}
                        onCheckedChange={(checked) => setHasPaExperience(checked === true)}
                      />
                      <label htmlFor="paExperience" className="text-sm text-foreground cursor-pointer">
                        Ho esperienza con contratti PA
                      </label>
                    </div>
                    {hasPaExperience && (
                      <div className="space-y-2 pl-7">
                        <label className="text-sm text-muted-foreground">Valore contratti PA gestiti</label>
                        <Input
                          placeholder="100000"
                          value={paContractValue}
                          onChange={(e) => setPaContractValue(e.target.value.replace(/\D/g, ""))}
                          className="h-10 bg-secondary/50 border-border/40"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full h-12 text-base font-medium glow-teal-sm">
                  Continua
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">Invita il tuo team</h1>
                  <p className="text-muted-foreground">Aggiungi fino a 5 membri nel piano MVP</p>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder="email@azienda.it"
                        value={member.email}
                        onChange={(e) => {
                          const updated = [...teamMembers]
                          updated[index].email = e.target.value
                          setTeamMembers(updated)
                        }}
                        className="flex-1 h-12 bg-secondary/50 border-border/40"
                      />
                      <Select
                        value={member.role}
                        onValueChange={(value) => {
                          const updated = [...teamMembers]
                          updated[index].role = value
                          setTeamMembers(updated)
                        }}
                      >
                        <SelectTrigger className="w-32 h-12 bg-secondary/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {teamMembers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTeamMember(index)}
                          className="h-12 w-12 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {teamMembers.length < 5 && (
                    <Button
                      variant="outline"
                      onClick={addTeamMember}
                      className="w-full h-12 bg-secondary/30 border-border/40 border-dashed"
                    >
                      <Plus className="size-4 mr-2" />
                      Aggiungi membro
                    </Button>
                  )}
                </div>

                <Button onClick={handleNext} className="w-full h-12 text-base font-medium glow-teal-sm">
                  Continua
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">Carica il primo contratto</h1>
                  <p className="text-muted-foreground">Vedi Terminia in azione. Questo step è opzionale.</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />

                {!uploadedFile && !isAnalyzing && (
                  <div
                    className="border-2 border-dashed border-border/40 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="size-8 text-primary" />
                    </div>
                    <p className="text-foreground font-medium mb-1">Trascina un PDF qui</p>
                    <p className="text-sm text-muted-foreground mb-4">oppure clicca per selezionare</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX fino a 10MB</p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="border border-border/40 rounded-2xl p-12 text-center">
                    <Loader2 className="size-10 mx-auto mb-4 text-primary animate-spin" />
                    <p className="text-foreground font-medium mb-1">Analisi del contratto in corso...</p>
                    <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                  </div>
                )}

                {!isAnalyzing && analysisResult?.success && analysisResult.data && (
                  <div className="border border-primary/30 rounded-2xl p-6 space-y-4 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-6 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-foreground font-medium">Contratto analizzato</p>
                        <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-muted-foreground text-xs mb-1">Tipo contratto</p>
                        <p className="text-foreground font-medium">{analysisResult.data.classification.contract_type}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-muted-foreground text-xs mb-1">Rischio</p>
                        <p className="text-foreground font-medium">
                          {analysisResult.data.risk.risk_label} ({analysisResult.data.risk.risk_score}/100)
                        </p>
                      </div>
                    </div>
                    {analysisResult.data.classification.parties && (
                      <div className="p-3 rounded-lg bg-background/50 text-sm">
                        <p className="text-muted-foreground text-xs mb-1">Parti</p>
                        {analysisResult.data.classification.parties.company && (
                          <p className="text-foreground">
                            <span className="font-medium">{analysisResult.data.classification.parties.company}</span>
                            <span className="text-muted-foreground"> — committente</span>
                          </p>
                        )}
                        {analysisResult.data.classification.parties.counterpart?.name && (
                          <p className="text-foreground">
                            <span className="font-medium">{analysisResult.data.classification.parties.counterpart.name}</span>
                            <span className="text-muted-foreground"> — {analysisResult.data.classification.parties.counterpart.role || "controparte"}</span>
                          </p>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setUploadedFile(null)
                        setAnalysisResult(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Carica un altro contratto
                    </button>
                  </div>
                )}

                {!isAnalyzing && analysisResult && !analysisResult.success && (
                  <div className="border border-yellow-500/30 rounded-2xl p-6 space-y-3 bg-yellow-500/5">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="size-6 text-yellow-500 flex-shrink-0" />
                      <div>
                        <p className="text-foreground font-medium">Il contratto verrà analizzato in seguito</p>
                        <p className="text-sm text-muted-foreground">{uploadedFile?.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.error || 'Si è verificato un errore. Potrai riprovare dalla dashboard.'}
                    </p>
                    <button
                      onClick={() => {
                        setUploadedFile(null)
                        setAnalysisResult(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Riprova con un altro file
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={finishOnboarding}
                    disabled={isLoading || isAnalyzing}
                    className="flex-1 h-12 text-base font-medium bg-secondary/30 border-border/40"
                  >
                    Salta e vai alla dashboard
                  </Button>
                  <Button
                    onClick={finishOnboarding}
                    disabled={isLoading || isAnalyzing}
                    className="flex-1 h-12 text-base font-medium glow-teal-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Salvataggio...
                      </>
                    ) : (
                      <>
                        Vai alla dashboard
                        <ArrowRight className="size-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
