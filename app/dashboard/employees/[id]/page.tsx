"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Euro,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  CreditCard,
  Building2,
  GraduationCap,
  Heart,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  formatCurrency,
  formatDate,
  daysUntil,
} from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type EmployeeRow = Database['public']['Tables']['employees']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']
import { useUser } from "@/lib/hooks/use-user"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()
  const [employee, setEmployee] = useState<EmployeeRow | null>(null)
  const [relatedContracts, setRelatedContracts] = useState<ContractRow[]>([])
  const [loading, setLoading] = useState(true)

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

        // Fetch employee
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('*')
          .eq('id', params.id as string)
          .eq('company_id', userData.company_id)
          .single()

        if (employeeError || !employeeData) {
          setLoading(false)
          return
        }

        setEmployee(employeeData)

        // Fetch related contracts
        const { data: contractsData } = await supabase
          .from('contracts')
          .select('*')
          .eq('employee_id', params.id as string)
          .eq('company_id', userData.company_id)

        setRelatedContracts(contractsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
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
          <p className="text-muted-foreground">Caricamento dipendente...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Dipendente non trovato</p>
        </div>
      </div>
    )
  }

  // Get initials for avatar
  const initials = employee.full_name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Calculate contract status
  const hasExpiringContract = employee.termination_date && daysUntil(employee.termination_date) <= 90

  // Employee type label
  const getEmployeeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      employee: "Dipendente",
      collaborator: "Collaboratore",
      consultant: "Consulente",
      intern: "Tirocinante",
    }
    return labels[type] || type
  }

  // Check for expiring dates
  const medicalExamExpiring = employee.medical_exam_date && daysUntil(employee.medical_exam_date) <= 30
  const safetyTrainingExpiring = employee.safety_training_date && daysUntil(employee.safety_training_date) <= 30

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
            href="/dashboard/employees"
            className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-purple-400">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold text-foreground">{employee.full_name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${
                  employee.employee_type === "employee" ? "border-purple-400/30 text-purple-400 bg-purple-400/10" :
                  employee.employee_type === "collaborator" ? "border-blue-400/30 text-blue-400 bg-blue-400/10" :
                  employee.employee_type === "consultant" ? "border-amber-400/30 text-amber-400 bg-amber-400/10" :
                  "border-muted-foreground/30 text-muted-foreground bg-muted/20"
                }`}>
                  {getEmployeeTypeLabel(employee.employee_type ?? '')}
                </span>
                {hasExpiringContract && (
                  <span className="text-xs px-2.5 py-1 rounded-full border border-amber-400/30 text-amber-400 bg-amber-400/10 flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    Contratto in scadenza
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {employee.role && <span>{employee.role}</span>}
                {employee.department && (
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3" />
                    {employee.department}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
            <Edit className="size-4" />
            Modifica
          </button>
          <button className="p-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
            <MoreVertical className="size-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <User className="size-4" />
              Informazioni Personali
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employee.fiscal_code && (
                <div className="flex items-start gap-3">
                  <Shield className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Codice Fiscale</div>
                    <div className="text-sm text-foreground font-mono">{employee.fiscal_code}</div>
                  </div>
                </div>
              )}

              {employee.email && (
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <a href={`mailto:${employee.email}`} className="text-sm text-primary hover:underline">
                      {employee.email}
                    </a>
                  </div>
                </div>
              )}

              {employee.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">Telefono</div>
                    <a href={`tel:${employee.phone}`} className="text-sm text-foreground">
                      {employee.phone}
                    </a>
                  </div>
                </div>
              )}

              {employee.iban && (
                <div className="flex items-start gap-3">
                  <CreditCard className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-xs text-muted-foreground">IBAN</div>
                    <div className="text-sm text-foreground font-mono">{employee.iban}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contract Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-4" />
              Contratto
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/20 rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">Data Assunzione</div>
                <div className="text-sm font-medium text-foreground">
                  {formatDate(employee.hire_date ?? '')}
                </div>
              </div>
              {employee.termination_date && (
                <div className="bg-muted/20 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">Fine Contratto</div>
                  <div className={`text-sm font-medium ${hasExpiringContract ? "text-amber-400" : "text-foreground"}`}>
                    {formatDate(employee.termination_date)}
                  </div>
                </div>
              )}
              {employee.ccnl && (
                <div className="bg-muted/20 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">CCNL</div>
                  <div className="text-sm font-medium text-foreground">{employee.ccnl}</div>
                </div>
              )}
              {employee.ccnl_level && (
                <div className="bg-muted/20 rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">Livello</div>
                  <div className="text-sm font-medium text-foreground">{employee.ccnl_level}</div>
                </div>
              )}
            </div>

            {/* Fixed Term Info */}
            {(employee.fixed_term_count ?? 0) > 0 && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-xs text-blue-400">
                  <strong>Contratti a tempo determinato:</strong> {employee.fixed_term_count} contratti per un totale di {employee.fixed_term_months} mesi
                </div>
              </div>
            )}

            {/* Probation */}
            {employee.probation_end_date && new Date(employee.probation_end_date) > new Date() && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <Clock className="size-3" />
                  <span>Periodo di prova fino al {formatDate(employee.probation_end_date)}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Economic Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Euro className="size-4" />
              Dati Economici
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-muted/20 rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-1">RAL</div>
                <div className="text-xl font-semibold text-foreground">
                  {formatCurrency(employee.ral ?? 0)}
                </div>
                <div className="text-xs text-muted-foreground">Lordo annuo</div>
              </div>
              <div className="bg-muted/20 rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-1">Costo Aziendale</div>
                <div className="text-xl font-semibold text-foreground">
                  {formatCurrency(employee.gross_cost ?? 0)}
                </div>
                <div className="text-xs text-muted-foreground">Lordo annuo</div>
              </div>
              <div className="bg-muted/20 rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-1">Costo Mensile</div>
                <div className="text-xl font-semibold text-foreground">
                  {formatCurrency(Math.round((employee.gross_cost ?? 0) / 12))}
                </div>
                <div className="text-xs text-muted-foreground">Stimato</div>
              </div>
            </div>
          </motion.div>

          {/* HR Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Heart className="size-4" />
              Scadenze HR
            </h2>
            <div className="space-y-3">
              {/* Medical Exam */}
              <div className={`flex items-center justify-between p-3 rounded-xl ${
                medicalExamExpiring ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/20"
              }`}>
                <div className="flex items-center gap-3">
                  {medicalExamExpiring ? (
                    <AlertTriangle className="size-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-foreground">Visita Medica</div>
                    {employee.medical_exam_date && (
                      <div className={`text-xs ${medicalExamExpiring ? "text-amber-400" : "text-muted-foreground"}`}>
                        Scadenza: {formatDate(employee.medical_exam_date)}
                      </div>
                    )}
                  </div>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
                  Prenota
                </button>
              </div>

              {/* Safety Training */}
              <div className={`flex items-center justify-between p-3 rounded-xl ${
                safetyTrainingExpiring ? "bg-amber-500/10 border border-amber-500/20" : "bg-muted/20"
              }`}>
                <div className="flex items-center gap-3">
                  {safetyTrainingExpiring ? (
                    <AlertTriangle className="size-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-foreground">Formazione Sicurezza</div>
                    {employee.safety_training_date && (
                      <div className={`text-xs ${safetyTrainingExpiring ? "text-amber-400" : "text-muted-foreground"}`}>
                        Ultimo: {formatDate(employee.safety_training_date)}
                      </div>
                    )}
                  </div>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
                  Pianifica
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* GDPR Consent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Shield className="size-4" />
              GDPR Consent
            </h3>
            <div className={`flex items-center gap-2 text-sm ${
              employee.osint_consent ? "text-emerald-400" : "text-muted-foreground"
            }`}>
              {employee.osint_consent ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <XCircle className="size-4" />
              )}
              <span>
                {employee.osint_consent
                  ? "Consenso OSINT concesso"
                  : "Nessun consenso OSINT"}
              </span>
            </div>
            {employee.osint_consent && employee.osint_consent_date && (
              <p className="text-xs text-muted-foreground mt-2">
                Concesso il {formatDate(employee.osint_consent_date)}
              </p>
            )}
            {!employee.osint_consent && (
              <p className="text-xs text-muted-foreground mt-2">
                Le verifiche OSINT estese non sono attive per questo dipendente (GDPR compliance)
              </p>
            )}
          </motion.div>

          {/* Related Contract */}
          {relatedContracts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl border border-border/20 p-4"
            >
              <h3 className="text-sm font-medium text-foreground mb-3">Contratto Attivo</h3>
              {relatedContracts.map((contract) => (
                <Link
                  key={contract.id}
                  href={`/dashboard/contracts/${contract.id}`}
                  className="block p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">{contract.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(contract.start_date ?? '')} - {contract.end_date ? formatDate(contract.end_date) : "Indeterminato"}
                  </div>
                  <div className="text-xs text-primary mt-1">
                    {formatCurrency(contract.value ?? 0)}/anno
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {/* Alerts */}
          {(hasExpiringContract || medicalExamExpiring || safetyTrainingExpiring) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"
            >
              <h3 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
                <AlertCircle className="size-4" />
                Alert
              </h3>
              <div className="space-y-2">
                {hasExpiringContract && (
                  <div className="text-xs text-amber-400/80">
                    Contratto in scadenza tra {daysUntil(employee.termination_date!)} giorni
                  </div>
                )}
                {medicalExamExpiring && (
                  <div className="text-xs text-amber-400/80">
                    Visita medica in scadenza
                  </div>
                )}
                {safetyTrainingExpiring && (
                  <div className="text-xs text-amber-400/80">
                    Formazione sicurezza da aggiornare
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl border border-border/20 p-4"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">Azioni Rapide</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
                <FileText className="size-4" />
                Genera contratto
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
                <Mail className="size-4" />
                Invia email
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
                <Calendar className="size-4" />
                Storico presenze
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
