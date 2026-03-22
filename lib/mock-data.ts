// Terminia Data Types
// This file contains only type definitions and helper functions
// All data is now fetched from Supabase

// Types matching database schema
export type ContractStatus = "draft" | "negotiating" | "active" | "expiring" | "renewed" | "terminated"
export type ContractType = "service_supply" | "goods_supply" | "framework" | "nda" | "agency" | "partnership" | "permanent" | "fixed_term" | "cococo"
export type RiskLevel = "low" | "medium" | "high" | "critical"
export type CounterpartType = "supplier" | "client" | "partner"
export type ReliabilityLabel = "excellent" | "good" | "warning" | "risk" | "unknown"
export type AlertPriority = "critical" | "high" | "medium" | "low"
export type AlertStatus = "pending" | "handled" | "snoozed" | "dismissed"
export type AlertType = "auto_renewal" | "contract_expiry" | "obligation_due" | "payment_expected" | "new_bando_match" | "reliability_score_drop" | "medical_exam_due" | "milestone_approaching"
export type EmployeeType = "employee" | "collaborator" | "consultant" | "intern"
export type BandoSource = "anac" | "ted_europa" | "invitalia" | "mimit" | "regione_lombardia"
export type ParticipationStatus = "new" | "saved" | "evaluating" | "participating" | "submitted" | "won" | "lost"
export type InvoiceType = "active" | "passive"
export type PaymentStatus = "unpaid" | "partial" | "paid" | "overdue"

export interface Contract {
  id: string
  title: string
  contract_type: ContractType
  counterpart_id?: string
  counterpart_name?: string
  employee_id?: string
  employee_name?: string
  status: ContractStatus
  value: number
  value_type: "total" | "annual" | "monthly"
  start_date: string
  end_date: string
  auto_renewal: boolean
  renewal_notice_days?: number
  risk_score: number
  ai_summary?: string
  reference_number?: string
  created_at: string
}

export interface Counterpart {
  id: string
  name: string
  type: CounterpartType
  vat_number: string
  fiscal_code?: string
  address?: string
  city?: string
  sector?: string
  pec?: string
  referent_name?: string
  referent_email?: string
  referent_phone?: string
  total_exposure: number
  reliability_score: number
  reliability_label: ReliabilityLabel
  score_legal: number
  score_contributory: number
  score_reputation: number
  score_solidity: number
  score_consistency: number
  has_bankruptcy: boolean
  has_anac_annotations: boolean
  vat_verified: boolean
  active_contracts: number
}

export interface Employee {
  id: string
  full_name: string
  fiscal_code?: string
  email?: string
  phone?: string
  employee_type: EmployeeType
  role?: string
  department?: string
  hire_date: string
  termination_date?: string
  ccnl?: string
  ccnl_level?: string
  ral: number
  gross_cost: number
  probation_end_date?: string
  medical_exam_date?: string
  safety_training_date?: string
  fixed_term_count: number
  fixed_term_months: number
}

export interface Alert {
  id: string
  alert_type: AlertType
  priority: AlertPriority
  status: AlertStatus
  title: string
  description?: string
  trigger_date: string
  contract_id?: string
  contract_name?: string
  counterpart_id?: string
  counterpart_name?: string
  employee_id?: string
  bando_id?: string
  created_at: string
}

export interface Bando {
  id: string
  source: BandoSource
  title: string
  authority_name: string
  description?: string
  base_value: number
  deadline: string
  match_score: number
  match_explanation?: string
  score_sector: number
  score_size: number
  score_geo: number
  score_requirements: number
  score_feasibility: number
  participation_status: ParticipationStatus
  cpv_codes: string[]
  requirements: string[]
  gap_satisfied: string[]
  gap_missing: string[]
}

export interface Invoice {
  id: string
  invoice_type: InvoiceType
  invoice_number: string
  counterpart_id?: string
  counterpart_name?: string
  contract_id?: string
  contract_name?: string
  invoice_date: string
  due_date: string
  amount_net: number
  vat_rate: number
  amount_gross: number
  payment_status: PaymentStatus
  payment_date?: string
  notes?: string
}

export interface Clause {
  id: string
  contract_id: string
  clause_type: string
  original_text: string
  simplified_text?: string
  risk_level: RiskLevel
  ai_flag?: string
  ai_suggestion?: string
}

export interface Obligation {
  id: string
  contract_id: string
  party: "mine" | "theirs"
  description: string
  due_date: string
  status: "pending" | "completed" | "overdue"
  recurrence?: "monthly" | "quarterly" | "annual"
}

// Formatters
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr))
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status: ContractStatus): string {
  switch (status) {
    case "active": return "text-primary"
    case "expiring": return "text-amber-400"
    case "draft": return "text-muted-foreground"
    case "negotiating": return "text-blue-400"
    case "terminated": return "text-destructive"
    case "renewed": return "text-emerald-400"
    default: return "text-muted-foreground"
  }
}

export function getStatusLabel(status: ContractStatus): string {
  const labels: Record<ContractStatus, string> = {
    draft: "Bozza",
    negotiating: "In Negoziazione",
    active: "Attivo",
    expiring: "In Scadenza",
    renewed: "Rinnovato",
    terminated: "Terminato",
  }
  return labels[status] || status
}

export function getRiskColor(score: number): string {
  if (score < 30) return "text-emerald-400"
  if (score < 60) return "text-amber-400"
  return "text-red-400"
}

export function getReliabilityColor(label: ReliabilityLabel): string {
  switch (label) {
    case "excellent": return "text-emerald-400"
    case "good": return "text-primary"
    case "warning": return "text-amber-400"
    case "risk": return "text-red-400"
    default: return "text-muted-foreground"
  }
}

export function getPriorityColor(priority: AlertPriority): string {
  switch (priority) {
    case "critical": return "text-red-400 bg-red-400/10 border-red-400/30"
    case "high": return "text-amber-400 bg-amber-400/10 border-amber-400/30"
    case "medium": return "text-primary bg-primary/10 border-primary/30"
    case "low": return "text-muted-foreground bg-secondary border-border"
    default: return "text-muted-foreground bg-secondary border-border"
  }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "paid": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    case "overdue": return "text-red-400 bg-red-400/10 border-red-400/30"
    case "partial": return "text-amber-400 bg-amber-400/10 border-amber-400/30"
    case "unpaid": return "text-muted-foreground bg-secondary border-border"
    default: return "text-muted-foreground bg-secondary border-border"
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    paid: "Pagata",
    unpaid: "In attesa",
    overdue: "Scaduta",
    partial: "Parziale",
  }
  return labels[status] || status
}

export function getInvoiceTypeLabel(type: InvoiceType): string {
  return type === "active" ? "Emessa" : "Ricevuta"
}
