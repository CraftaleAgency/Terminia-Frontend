"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, Loader2, User, Building2, MapPin, Check, X, UserCircle2, Briefcase, Home, Smartphone, Shuffle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { signup } from "../actions"
import { motion } from "framer-motion"
import { analyzeContractAction } from '@/lib/actions/contracts'

const sectors = [
  "Informatica e Tecnologia",
  "Manifatturiero",
  "Servizi Professionali",
  "Commercio",
  "Edilizia e Costruzioni",
  "Trasporti e Logistica",
  "Alimentare",
  "Sanitario",
  "Altro",
]

const sizes = [
  { value: "micro", label: "Micro (1-9 dipendenti)" },
  { value: "small", label: "Piccola (10-49 dipendenti)" },
  { value: "medium", label: "Media (50-249 dipendenti)" },
  { value: "large", label: "Grande (250+ dipendenti)" },
]

const personalProfiles = [
  { value: "employee", label: "Lavoro dipendente", description: "Contratto con datore di lavoro", icon: Briefcase },
  { value: "freelancer", label: "Freelancer / P.IVA", description: "Contratti con clienti", icon: UserCircle2 },
  { value: "home", label: "Casa", description: "Locazione affitto / mutuo", icon: Home },
  { value: "services", label: "Servizi & Abbonamenti", description: "Telefono, assicurazione, banche", icon: Smartphone },
  { value: "mixed", label: "Misto", description: "Più categorie di contratti", icon: Shuffle },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    accountType: "company",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    vatNumber: "",
    fiscalCode: "",
    sector: "",
    size: "",
    city: "",
    personalContractProfile: "",
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeStatus, setAnalyzeStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const passwordRequirements = [
    { label: "Almeno 8 caratteri", met: formData.password.length >= 8 },
    { label: "Una lettera maiuscola", met: /[A-Z]/.test(formData.password) },
    { label: "Un numero", met: /\d/.test(formData.password) },
  ]

  const isStep1Valid =
    formData.fullName.length >= 2 &&
    formData.email.includes("@") &&
    passwordRequirements.every((r) => r.met) &&
    formData.password === formData.confirmPassword

  const isVatValid = /^\d{11}$/.test(formData.vatNumber.replace(/\s/g, ""))
  
  const isStep2Valid =
    formData.accountType === "company"
      ? formData.companyName.length >= 2 &&
        isVatValid &&
        formData.sector &&
        formData.size &&
        formData.city.length >= 2
      : formData.fiscalCode.length >= 16 &&
        formData.personalContractProfile.length > 0 &&
        formData.city.length >= 2

  const handleDocumentUpload = useCallback(async (file: File) => {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError("Il file non deve superare i 10MB")
      return
    }
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      setError("Formato non supportato. Carica un PDF o DOCX.")
      return
    }

    setIsAnalyzing(true)
    setAnalyzeStatus('idle')
    setError("")

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = () => reject(new Error('Errore nella lettura del file'))
        reader.readAsDataURL(file)
      })

      const result = await analyzeContractAction({
        documentBase64: base64,
        contentType: file.type,
      })

      if (result.success && result.data) {
        const filled = new Set<string>()
        const updates: Record<string, string> = {}

        const companyParty = result.data.classification.parties
        if (companyParty?.company) {
          updates.companyName = companyParty.company
          filled.add('companyName')
        }
        if (companyParty?.counterpart?.vat) {
          updates.vatNumber = companyParty.counterpart.vat.replace(/\D/g, '').slice(0, 11)
          filled.add('vatNumber')
        }

        const contractType = (result.data.classification.contract_type ?? '').toLowerCase()
        const sectorKeywords: [string, string][] = [
          ['informatica', 'Informatica e Tecnologia'],
          ['tecnologia', 'Informatica e Tecnologia'],
          ['software', 'Informatica e Tecnologia'],
          ['manifattura', 'Manifatturiero'],
          ['produzione', 'Manifatturiero'],
          ['consulenza', 'Servizi Professionali'],
          ['professionale', 'Servizi Professionali'],
          ['commercio', 'Commercio'],
          ['vendita', 'Commercio'],
          ['fornitura', 'Commercio'],
          ['edilizia', 'Edilizia e Costruzioni'],
          ['costruzione', 'Edilizia e Costruzioni'],
          ['appalto', 'Edilizia e Costruzioni'],
          ['trasporto', 'Trasporti e Logistica'],
          ['logistica', 'Trasporti e Logistica'],
          ['alimentare', 'Alimentare'],
          ['sanitario', 'Sanitario'],
          ['medico', 'Sanitario'],
        ]
        for (const [kw, sector] of sectorKeywords) {
          if (contractType.includes(kw)) {
            updates.sector = sector
            filled.add('sector')
            break
          }
        }

        setFormData(prev => ({ ...prev, ...updates }))
        setAutoFilledFields(filled)
        setAnalyzeStatus(filled.size > 0 ? 'success' : 'error')
      } else {
        setAnalyzeStatus('error')
      }
    } catch {
      setAnalyzeStatus('error')
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)

    const formDataObj = new FormData()
    formDataObj.append("email", formData.email)
    formDataObj.append("password", formData.password)
    formDataObj.append("accountType", formData.accountType)
    formDataObj.append("fullName", formData.fullName)
    formDataObj.append("companyName", formData.accountType === "company" ? formData.companyName : formData.fullName)
    formDataObj.append("vatNumber", formData.accountType === "company" ? formData.vatNumber : "")
    formDataObj.append("fiscalCode", formData.accountType === "person" ? formData.fiscalCode : "")
    formDataObj.append("sector", formData.accountType === "company" ? formData.sector : "Persona Fisica")
    formDataObj.append("size", formData.accountType === "company" ? formData.size : "micro")
    formDataObj.append("city", formData.city)
    formDataObj.append("personalContractProfile", formData.accountType === "person" ? formData.personalContractProfile : "")

    const result = await signup(formDataObj)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl p-8 border border-border/30">
      {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            {step > 1 ? <Check className="size-4" /> : "1"}
          </div>
          <span className={cn("text-sm", step >= 1 ? "text-foreground" : "text-muted-foreground")}>
            Il tuo account
          </span>
        </div>
        <div className={cn("flex-1 h-0.5 rounded", step >= 2 ? "bg-primary" : "bg-secondary")} />
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          )}>
            2
          </div>
          <span className={cn("text-sm", step >= 2 ? "text-foreground" : "text-muted-foreground")}>
            {formData.accountType === "company" ? "La tua azienda" : "Profilo personale"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {step === 1 ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Crea il tuo account</h1>
              <p className="text-muted-foreground">Inizia a proteggere i tuoi contratti</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo account</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: "company" })}
                  className={cn(
                    "h-12 rounded-xl border text-sm font-medium transition-colors inline-flex items-center justify-center gap-2",
                    formData.accountType === "company"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/40 bg-secondary/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Building2 className="size-4" />
                  <span>Azienda</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: "person" })}
                  className={cn(
                    "h-12 rounded-xl border text-sm font-medium transition-colors inline-flex items-center justify-center gap-2",
                    formData.accountType === "person"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/40 bg-secondary/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <UserCircle2 className="size-4" />
                  <span>Persona fisica</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Mario Rossi"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 h-12 bg-secondary/50 border-border/40"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {formData.accountType === "company" ? "Email aziendale" : "Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                  id="email"
                  type="email"
                    placeholder={formData.accountType === "company" ? "mario@azienda.it" : "mario@email.it"}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 bg-secondary/50 border-border/40"
                    required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una password sicura"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-secondary/50 border-border/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* Password requirements */}
              <div className="space-y-1.5 pt-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <Check className="size-3.5 text-primary" />
                    ) : (
                      <X className="size-3.5 text-muted-foreground" />
                    )}
                    <span className={req.met ? "text-primary" : "text-muted-foreground"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Conferma password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ripeti la password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 h-12 bg-secondary/50 border-border/40"
                  required
                />
                {formData.confirmPassword && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <Check className="size-4 text-primary" />
                    ) : (
                      <X className="size-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isStep1Valid}
              className="w-full h-12 text-base font-medium glow-teal-sm"
            >
              Continua
            </Button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {formData.accountType === "company" ? "La tua azienda" : "Profilo persona fisica"}
              </h1>
              <p className="text-muted-foreground">
                {formData.accountType === "company"
                  ? "Questi dati servono per BandoRadar"
                  : "Dati essenziali per personalizzare analisi e alert"}
              </p>
            </div>

            {formData.accountType === "company" ? (
              <>
                {/* Document upload area */}
                <div
                  className={cn(
                    "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                    isAnalyzing
                      ? "border-primary/50 bg-primary/5"
                      : analyzeStatus === 'success'
                      ? "border-green-500/50 bg-green-500/5"
                      : analyzeStatus === 'error'
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-border/50 bg-secondary/20 hover:border-primary/50 cursor-pointer"
                  )}
                  onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const file = e.dataTransfer.files[0]
                    if (file && !isAnalyzing) handleDocumentUpload(file)
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleDocumentUpload(file)
                      e.target.value = ''
                    }}
                  />

                  {isAnalyzing ? (
                    <>
                      <Loader2 className="size-8 text-primary mx-auto mb-3 animate-spin" />
                      <p className="text-sm font-medium text-foreground">Analisi in corso...</p>
                      <p className="text-xs text-muted-foreground mt-1">Estrazione dati dal documento</p>
                    </>
                  ) : analyzeStatus === 'success' ? (
                    <>
                      <Check className="size-8 text-green-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-green-400">✅ Dati estratti automaticamente</p>
                      <p className="text-xs text-muted-foreground mt-1">Puoi modificare i campi compilati</p>
                    </>
                  ) : analyzeStatus === 'error' ? (
                    <>
                      <FileText className="size-8 text-red-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-red-400">Non è stato possibile estrarre i dati</p>
                      <p className="text-xs text-muted-foreground mt-1">Compila manualmente i campi sottostanti</p>
                    </>
                  ) : (
                    <>
                      <FileText className="size-8 text-primary mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">
                        📄 Carica Visura Camerale o Atto Costitutivo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        per compilare automaticamente
                      </p>
                      <p className="text-xs text-primary/70 mt-3">
                        Trascina qui il PDF o clicca per selezionare
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        PDF, DOCX — max 10MB
                      </p>
                    </>
                  )}
                </div>
                {!isAnalyzing && (
                  <p className="text-xs text-muted-foreground text-center">
                    Oppure compila manualmente ↓
                  </p>
                )}

                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-foreground">
                    Ragione sociale
                    {autoFilledFields.has('companyName') && (
                      <span className="text-xs text-primary/70 ml-2">🤖 Auto</span>
                    )}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Azienda S.r.l."
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="pl-10 h-12 bg-secondary/50 border-border/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="vatNumber" className="text-sm font-medium text-foreground">
                    Partita IVA
                    {autoFilledFields.has('vatNumber') && (
                      <span className="text-xs text-primary/70 ml-2">🤖 Auto</span>
                    )}
                  </label>
                  <div className="relative">
                    <Input
                      id="vatNumber"
                      type="text"
                      placeholder="12345678901"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                      className="h-12 bg-secondary/50 border-border/40 pr-10"
                      required
                    />
                    {formData.vatNumber && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {isVatValid ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <X className="size-4 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.vatNumber && !isVatValid && (
                    <p className="text-xs text-destructive">La P.IVA deve essere di 11 cifre</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Settore
                    {autoFilledFields.has('sector') && (
                      <span className="text-xs text-primary/70 ml-2">🤖 Auto</span>
                    )}
                  </label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData({ ...formData, sector: value })}
                  >
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/40">
                      <SelectValue placeholder="Seleziona il settore" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Dimensione</label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                  >
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/40">
                      <SelectValue placeholder="Seleziona la dimensione" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="fiscalCode" className="text-sm font-medium text-foreground">
                    Codice Fiscale
                  </label>
                  <Input
                    id="fiscalCode"
                    type="text"
                    placeholder="RSSMRA80A01F205X"
                    value={formData.fiscalCode}
                    onChange={(e) => setFormData({ ...formData, fiscalCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16) })}
                    className="h-12 bg-secondary/50 border-border/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Che tipo di contratti hai principalmente?
                  </label>
                  <RadioGroup
                    value={formData.personalContractProfile}
                    onValueChange={(value) => setFormData({ ...formData, personalContractProfile: value })}
                    className="space-y-2"
                  >
                    {personalProfiles.map((profile) => {
                      const Icon = profile.icon
                      return (
                        <label
                          key={profile.value}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
                            formData.personalContractProfile === profile.value
                              ? "border-primary bg-primary/10"
                              : "border-border/40 bg-secondary/20 hover:bg-secondary/40"
                          )}
                        >
                          <RadioGroupItem value={profile.value} />
                          <Icon className="size-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{profile.label}</div>
                            <div className="text-xs text-muted-foreground">{profile.description}</div>
                          </div>
                        </label>
                      )
                    })}
                  </RadioGroup>
                </div>
              </>
            )}

            {/* City */}
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-foreground">
                Città di residenza
                {autoFilledFields.has('city') && (
                  <span className="text-xs text-primary/70 ml-2">🤖 Auto</span>
                )}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="city"
                  type="text"
                  placeholder="Milano"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="pl-10 h-12 bg-secondary/50 border-border/40"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12 text-base font-medium bg-secondary/30 border-border/40"
              >
                Indietro
              </Button>
              <Button
                type="submit"
                disabled={!isStep2Valid || isLoading}
                className="flex-1 h-12 text-base font-medium glow-teal-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Creazione...
                  </>
                ) : (
                  "Crea account"
                )}
              </Button>
            </div>
          </>
        )}
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Hai gia un account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          Accedi
        </Link>
      </p>
    </div>
  )
}
