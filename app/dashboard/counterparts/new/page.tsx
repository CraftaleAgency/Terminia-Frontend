"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type CounterpartType = "supplier" | "client" | "partner"

export default function NewCounterpartPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "supplier" as CounterpartType,
    vat_number: "",
    fiscal_code: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Italia",
    pec: "",
    sdI_code: "",
    sector: "",
    referent_name: "",
    referent_email: "",
    referent_phone: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Il nome e obbligatorio"
    }

    if (!formData.vat_number.trim()) {
      newErrors.vat_number = "La partita IVA e obbligatoria"
    } else if (!/^IT[0-9]{11}$/.test(formData.vat_number) && !/^[0-9]{11}$/.test(formData.vat_number)) {
      newErrors.vat_number = "Formato partita IVA non valido (es. IT12345678901)"
    }

    if (formData.referent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referent_email)) {
      newErrors.referent_email = "Formato email non valido"
    }

    if (formData.pec && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.pec)) {
      newErrors.pec = "Formato PEC non valido"
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
    // For now, redirect to counterparts list
    router.push("/dashboard/counterparts")
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
          href="/dashboard/counterparts"
          className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Nuova Controparte</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aggiungi un nuovo fornitore, cliente o partner
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
        {/* Dati Generali */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Building2 className="size-4" />
            Dati Generali
          </h2>

          <div className="space-y-4">
            {/* Tipo */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Tipo *</label>
              <div className="flex gap-2">
                {[
                  { value: "supplier", label: "Fornitore" },
                  { value: "client", label: "Cliente" },
                  { value: "partner", label: "Partner" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("type", option.value)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      formData.type === option.value
                        ? option.value === "supplier"
                          ? "bg-primary text-primary-foreground"
                          : option.value === "client"
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500 text-white"
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
                Ragione Sociale *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Es. TechSupply Srl"
                className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                  errors.name ? "border-red-500/50" : "border-border/20"
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* P.IVA e Codice Fiscale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  Partita IVA *
                </label>
                <input
                  type="text"
                  value={formData.vat_number}
                  onChange={(e) => handleChange("vat_number", e.target.value.toUpperCase())}
                  placeholder="IT12345678901"
                  className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                    errors.vat_number ? "border-red-500/50" : "border-border/20"
                  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                />
                {errors.vat_number && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.vat_number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  Codice Fiscale
                </label>
                <input
                  type="text"
                  value={formData.fiscal_code}
                  onChange={(e) => handleChange("fiscal_code", e.target.value.toUpperCase())}
                  placeholder="Opzionale per societa"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Settore */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Settore
              </label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
                placeholder="Es. Informatica, Logistica, Consulenza"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Indirizzo */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <MapPin className="size-4" />
            Indirizzo
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Indirizzo
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Via/Piazza e numero civico"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-2">Citta</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Milano"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Provincia</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleChange("province", e.target.value.toUpperCase())}
                  placeholder="MI"
                  maxLength={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">CAP</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  placeholder="20100"
                  maxLength={5}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Mail className="size-4" />
            Contatti
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">PEC</label>
                <input
                  type="email"
                  value={formData.pec}
                  onChange={(e) => handleChange("pec", e.target.value)}
                  placeholder="azienda@pec.it"
                  className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                    errors.pec ? "border-red-500/50" : "border-border/20"
                  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                />
                {errors.pec && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.pec}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Codice SDI</label>
                <input
                  type="text"
                  value={formData.sdI_code}
                  onChange={(e) => handleChange("sdI_code", e.target.value.toUpperCase())}
                  placeholder="XXXXXXX"
                  maxLength={7}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Referente */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Phone className="size-4" />
            Referente
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Nome Referente</label>
              <input
                type="text"
                value={formData.referent_name}
                onChange={(e) => handleChange("referent_name", e.target.value)}
                placeholder="Mario Rossi"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Email Referente</label>
                <input
                  type="email"
                  value={formData.referent_email}
                  onChange={(e) => handleChange("referent_email", e.target.value)}
                  placeholder="mario.rossi@azienda.it"
                  className={`w-full px-4 py-2.5 rounded-xl bg-muted/30 border ${
                    errors.referent_email ? "border-red-500/50" : "border-border/20"
                  } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30`}
                />
                {errors.referent_email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.referent_email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Telefono Referente</label>
                <input
                  type="tel"
                  value={formData.referent_phone}
                  onChange={(e) => handleChange("referent_phone", e.target.value)}
                  placeholder="+39 02 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="glass-card rounded-2xl border border-border/20 p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Note</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Aggiungi note su questa controparte..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/dashboard/counterparts"
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
                Salva Controparte
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
