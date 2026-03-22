"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Loader2, User, Building2, MapPin, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { signup } from "../actions"
import { motion } from "framer-motion"

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

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    vatNumber: "",
    sector: "",
    size: "",
    city: "",
  })

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
    formData.companyName.length >= 2 &&
    isVatValid &&
    formData.sector &&
    formData.size &&
    formData.city.length >= 2

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
    formDataObj.append("fullName", formData.fullName)
    formDataObj.append("companyName", formData.companyName)
    formDataObj.append("vatNumber", formData.vatNumber)
    formDataObj.append("sector", formData.sector)
    formDataObj.append("size", formData.size)
    formDataObj.append("city", formData.city)

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
            La tua azienda
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
                Email aziendale
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mario@azienda.it"
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
              <h1 className="text-2xl font-semibold text-foreground mb-2">La tua azienda</h1>
              <p className="text-muted-foreground">Questi dati servono per BandoRadar</p>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium text-foreground">
                Ragione sociale
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

            {/* VAT Number */}
            <div className="space-y-2">
              <label htmlFor="vatNumber" className="text-sm font-medium text-foreground">
                Partita IVA
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

            {/* Sector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Settore</label>
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

            {/* Size */}
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

            {/* City */}
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-foreground">
                Citta
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
