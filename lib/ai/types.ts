// ─── Contract Classification ────────────────────────────────────────────────

export interface ContractClassification {
  /** e.g. "appalto", "concessione", "accordo_quadro" */
  type: string
  /** e.g. "lavori", "servizi", "forniture" */
  subtype: string
  /** ISO 639-1 language code of the document */
  language: string
  /** AI confidence 0–1 */
  confidence: number
  /** "PA" | "impresa" | "persona_fisica" */
  counterpart_type: 'PA' | 'impresa' | 'persona_fisica'
}

// ─── Contract Extraction ────────────────────────────────────────────────────

export interface Party {
  name: string
  role: 'stazione_appaltante' | 'operatore_economico' | 'subappaltatore' | 'altro'
  vat?: string
  cf?: string
  address?: string
}

export interface ContractDate {
  label: string
  date: string // ISO 8601
}

export interface ContractClause {
  id: string
  title: string
  summary: string
  risk_flag: boolean
}

export interface Obligation {
  party: string
  description: string
  deadline?: string
}

export interface Milestone {
  label: string
  date?: string
  description: string
}

export interface ScopeItem {
  description: string
  quantity?: number
  unit?: string
}

export interface ContractExtraction {
  parties: Party[]
  dates: ContractDate[]
  value: {
    amount: number
    currency: string
    vat_included: boolean
  } | null
  clauses: ContractClause[]
  obligations: Obligation[]
  milestones: Milestone[]
  scope_items: ScopeItem[]
}

// ─── Contract Risk Scoring ──────────────────────────────────────────────────

export interface RiskDimension {
  name: string
  score: number // 0–100
  weight: number
  details: string
}

export interface ContractRiskScore {
  /** Overall risk score 0–100 */
  score: number
  /** "basso" | "medio" | "alto" | "critico" */
  label: 'basso' | 'medio' | 'alto' | 'critico'
  dimensions: RiskDimension[]
  details: string
}

// ─── OSINT Result ───────────────────────────────────────────────────────────

export interface OSINTResult {
  vat_valid: boolean | null
  cf_valid: boolean | null
  anac_annotations: string[]
  reliability_score: number // 0–100
  company_status?: string
  registration_date?: string
  legal_form?: string
  ateco_codes?: string[]
  revenue_class?: string
  employees_class?: string
  negative_events: string[]
  sources: string[]
}
