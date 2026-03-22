"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  CreditCard,
  Save,
  Loader2,
  AlertCircle,
  Calendar,
  Euro,
  Building2,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type EmployeeType = "employee" | "collaborator" | "consultant" | "intern"

export default function NewEmployeePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    employee_type: "employee" as EmployeeType,
    fiscal_code: "",
    email: "",
    phone: "",
    iban: "",
    role: "",
    department: "",
    hire_date: "",
    termination_date: "",
    ccnl: "",
    ccnl_level: "",
    ral: "",
    probation_end_date: "",
    notes: "",
    osint_consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Italian fiscal code validation (simplified)
  const validateFiscalCode = (cf: string): boolean => {
    const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i
    return regex.test(cf)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Il nome e obbligatorio"
    }

    if (!formData.fiscal_code.trim()) {
      newErrors.fiscal_code = "Il codice fiscale e obbligatorio"
    } else if (!validateFiscalCode(formData.fiscal_code)) {
      newErrors.fiscal_code = "Formato codice fiscale non valido"
    }

    if (!formData.hire_date) {
      newErrors.hire_date = "La data di assunzione e obbligatoria"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato email non valido"
    }

    if (formData.ral && isNaN(Number(formData.ral))) {
      newErrors.ral = "Inserire un importo valido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500))

    // TODO: Save to Supabase
    router.push("/dashboard/employees")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/dashboard/employees"
          className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Nuovo Dipendente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aggiungi un nuovo membro del team
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Dati Anagrafici */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <User className="size-4" />
            Dati Anagrafici
          </h2>

          <div className="space-y-4">
            {/* Tipo */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Tipo Contratto *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: "employee", label: "Dipendente" },
                  { value: "collaborator", label: "Collaboratore" },
                  { value: "consultant", label: "Consulente" },
                  { value: "intern", label: "Tirocinante" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("employee_type", option.value)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      formData.employee_type === option.value
                        ? "bg-purple-500 text-white"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Mario Rossi"
                className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                  errors.full_name ? "border-red-500/50" : "border-border/20"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
              {errors.full_name && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Codice Fiscale */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Codice Fiscale *
              </label>
              <input
                type="text"
                value={formData.fiscal_code}
                onChange={(e) => handleChange("fiscal_code", e.target.value.toUpperCase())}
                placeholder="RSSMRA85M15F205X"
                maxLength={16}
                className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                  errors.fiscal_code ? "border-red-500/50" : "border-border/20"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono`}
              />
              {errors.fiscal_code && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.fiscal_code}
                </p>
              )}
            </div>

            {/* Contatti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="mario.rossi@azienda.it"
                  className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                    errors.email ? "border-red-500/50" : "border-border/20"
                  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Telefono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+39 333 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                IBAN (per pagamenti)
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => handleChange("iban", e.target.value.toUpperCase())}
                placeholder="IT00X0000000000000000000000"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Ruolo e Dipartimento */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Building2 className="size-4" />
            Ruolo e Dipartimento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Ruolo</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                placeholder="Es. Senior Developer"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Dipartimento</label>
              <select
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Seleziona dipartimento</option>
                <option value="IT">IT</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contratto */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Calendar className="size-4" />
            Contratto
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  Data Assunzione *
                </label>
                <input
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleChange("hire_date", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                    errors.hire_date ? "border-red-500/50" : "border-border/20"
                  } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                />
                {errors.hire_date && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.hire_date}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  Fine Contratto (se determinato)
                </label>
                <input
                  type="date"
                  value={formData.termination_date}
                  onChange={(e) => handleChange("termination_date", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">CCNL</label>
                <select
                  value={formData.ccnl}
                  onChange={(e) => handleChange("ccnl", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleziona CCNL</option>
                  <option value="CCNL Metalmeccanico">CCNL Metalmeccanico</option>
                  <option value="CCNL Commercio">CCNL Commercio</option>
                  <option value="CCNL Terziario">CCNL Terziario</option>
                  <option value="CCNL Grafico">CCNL Grafico</option>
                  <option value="CCNL Chimico">CCNL Chimico</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Livello</label>
                <input
                  type="text"
                  value={formData.ccnl_level}
                  onChange={(e) => handleChange("ccnl_level", e.target.value)}
                  placeholder="Es. C3, D1, Q2"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Fine Periodo di Prova
              </label>
              <input
                type="date"
                value={formData.probation_end_date}
                onChange={(e) => handleChange("probation_end_date", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Dati Economici */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Euro className="size-4" />
            Dati Economici
          </h2>

          <div>
            <label className="block text-xs text-muted-foreground mb-2">
              RAL (Retribuzione Annua Lorda)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">EUR</span>
              <input
                type="text"
                value={formData.ral}
                onChange={(e) => handleChange("ral", e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="42000"
                className={`w-full pl-14 pr-4 py-2.5 rounded-xl bg-muted/30 border ${
                  errors.ral ? "border-red-500/50" : "border-border/20"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
            </div>
            {errors.ral && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errors.ral}
              </p>
            )}
            {formData.ral && !isNaN(Number(formData.ral)) && (
              <p className="text-xs text-muted-foreground mt-2">
                Costo aziendale stimato: EUR {Math.round(Number(formData.ral) * 1.4).toLocaleString("it-IT")} (+40% contributi)
              </p>
            )}
          </div>
        </div>

        {/* GDPR Consent */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Shield className="size-4" />
            GDPR e Privacy
          </h2>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="osint_consent"
              checked={formData.osint_consent}
              onChange={(e) => handleChange("osint_consent", e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border/50 bg-muted/30 text-primary focus:ring-primary/30"
            />
            <label htmlFor="osint_consent" className="text-sm text-muted-foreground cursor-pointer">
              <strong className="text-foreground">Consenso OSINT esteso</strong>
              <br />
              Il dipendente acconsente a verifiche OSINT (Open Source Intelligence) su fonti pubbliche.
              Questo include ricerche su LinkedIn, web e notizie pubbliche.
              Il consenso e opzionale e puo essere revocato in qualsiasi momento.
            </label>
          </div>
        </div>

        {/* Note */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Note</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Aggiungi note su questo dipendente..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/dashboard/employees"
            className="px-5 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white hover:bg-purple-500/90 transition-colors text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Salva Dipendente
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
