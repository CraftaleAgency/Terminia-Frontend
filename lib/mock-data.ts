// Terminia Mock Data - Full schema matching database types, stored in localStorage

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

// Initialize all mock data
export function initializeMockData() {
  if (typeof window === "undefined") return
  if (localStorage.getItem("terminia_initialized")) return

  const contracts: Contract[] = [
    {
      id: "c1",
      title: "Contratto Fornitura Servizi IT",
      contract_type: "service_supply",
      counterpart_id: "cp1",
      counterpart_name: "TechSupply Srl",
      status: "active",
      value: 45000,
      value_type: "annual",
      start_date: "2024-01-15",
      end_date: "2025-05-31",
      auto_renewal: true,
      renewal_notice_days: 30,
      risk_score: 28,
      ai_summary: "Contratto di fornitura servizi IT con clausole standard. Rinnovo tacito con preavviso 30 giorni. Nessuna penale per risoluzione anticipata.",
      reference_number: "CTR-2024-001",
      created_at: "2024-01-10",
    },
    {
      id: "c2",
      title: "Accordo Quadro Consulenza",
      contract_type: "framework",
      counterpart_id: "cp2",
      counterpart_name: "Studio Rossi & Associati",
      status: "expiring",
      value: 32000,
      value_type: "total",
      start_date: "2023-06-01",
      end_date: "2025-04-15",
      auto_renewal: false,
      risk_score: 52,
      ai_summary: "Accordo quadro per servizi di consulenza legale. Include clausola di riservatezza e limite di responsabilita. Attenzione: clausola penale per ritardi.",
      reference_number: "CTR-2023-042",
      created_at: "2023-05-20",
    },
    {
      id: "c3",
      title: "Contratto Logistica e Trasporti",
      contract_type: "service_supply",
      counterpart_id: "cp3",
      counterpart_name: "Logistica Express SpA",
      status: "active",
      value: 180000,
      value_type: "annual",
      start_date: "2024-03-01",
      end_date: "2025-07-01",
      auto_renewal: true,
      renewal_notice_days: 60,
      risk_score: 71,
      ai_summary: "Contratto di alto valore con clausole penali significative. Rischio elevato per ritardi consegna (penale 5% per ogni giorno). Verifica SLA attentamente.",
      reference_number: "CTR-2024-015",
      created_at: "2024-02-15",
    },
    {
      id: "c4",
      title: "Servizio Cloud Hosting Premium",
      contract_type: "service_supply",
      counterpart_id: "cp4",
      counterpart_name: "CloudItalia Srl",
      status: "active",
      value: 1200,
      value_type: "monthly",
      start_date: "2024-06-01",
      end_date: "2025-06-01",
      auto_renewal: true,
      renewal_notice_days: 15,
      risk_score: 15,
      ai_summary: "Servizio hosting standard con SLA 99.9%. Clausole equilibrate, nessun vincolo particolare. Scalabilita inclusa.",
      reference_number: "CTR-2024-028",
      created_at: "2024-05-20",
    },
    {
      id: "c5",
      title: "Consulenza Strategica e Business Development",
      contract_type: "service_supply",
      counterpart_id: "cp5",
      counterpart_name: "Business Advisory Group",
      status: "active",
      value: 85000,
      value_type: "total",
      start_date: "2024-09-01",
      end_date: "2025-08-31",
      auto_renewal: false,
      risk_score: 22,
      ai_summary: "Contratto consulenza strategica con milestone trimestrali. Clausola di non concorrenza limitata. Pagamento a SAL.",
      reference_number: "CTR-2024-045",
      created_at: "2024-08-15",
    },
    {
      id: "c6",
      title: "NDA - Accordo di Riservatezza",
      contract_type: "nda",
      counterpart_id: "cp6",
      counterpart_name: "InnoTech Solutions",
      status: "active",
      value: 0,
      value_type: "total",
      start_date: "2024-11-01",
      end_date: "2026-11-01",
      auto_renewal: false,
      risk_score: 8,
      ai_summary: "NDA bilaterale standard con durata 2 anni. Clausole equilibrate senza penali eccessive.",
      reference_number: "NDA-2024-012",
      created_at: "2024-10-28",
    },
    {
      id: "c7",
      title: "Contratto Tempo Indeterminato",
      contract_type: "permanent",
      employee_id: "e1",
      employee_name: "Marco Bianchi",
      status: "active",
      value: 42000,
      value_type: "annual",
      start_date: "2022-03-01",
      end_date: "2099-12-31",
      auto_renewal: false,
      risk_score: 0,
      reference_number: "HR-2022-008",
      created_at: "2022-02-15",
    },
  ]

  const counterparts: Counterpart[] = [
    {
      id: "cp1",
      name: "TechSupply Srl",
      type: "supplier",
      vat_number: "IT12345678901",
      address: "Via dell'Innovazione 15",
      city: "Milano",
      sector: "Informatica",
      pec: "techsupply@pec.it",
      referent_name: "Giuseppe Verdi",
      referent_email: "g.verdi@techsupply.it",
      referent_phone: "+39 02 1234567",
      total_exposure: 45000,
      reliability_score: 85,
      reliability_label: "excellent",
      score_legal: 28,
      score_contributory: 18,
      score_reputation: 17,
      score_solidity: 17,
      score_consistency: 5,
      has_bankruptcy: false,
      has_anac_annotations: false,
      vat_verified: true,
      active_contracts: 1,
    },
    {
      id: "cp2",
      name: "Studio Rossi & Associati",
      type: "client",
      vat_number: "IT98765432101",
      address: "Corso Vittorio Emanuele 42",
      city: "Roma",
      sector: "Servizi Professionali",
      pec: "studiorossi@pec.it",
      referent_name: "Avv. Maria Rossi",
      referent_email: "m.rossi@studiorossi.it",
      total_exposure: 32000,
      reliability_score: 72,
      reliability_label: "good",
      score_legal: 25,
      score_contributory: 15,
      score_reputation: 15,
      score_solidity: 12,
      score_consistency: 5,
      has_bankruptcy: false,
      has_anac_annotations: false,
      vat_verified: true,
      active_contracts: 1,
    },
    {
      id: "cp3",
      name: "Logistica Express SpA",
      type: "supplier",
      vat_number: "IT11223344556",
      address: "Via dei Trasporti 100",
      city: "Piacenza",
      sector: "Logistica",
      pec: "logisticaexpress@pec.it",
      referent_name: "Dott. Franco Neri",
      referent_email: "f.neri@logisticaexpress.com",
      referent_phone: "+39 0523 987654",
      total_exposure: 180000,
      reliability_score: 58,
      reliability_label: "warning",
      score_legal: 20,
      score_contributory: 10,
      score_reputation: 12,
      score_solidity: 11,
      score_consistency: 5,
      has_bankruptcy: false,
      has_anac_annotations: true,
      vat_verified: true,
      active_contracts: 1,
    },
    {
      id: "cp4",
      name: "CloudItalia Srl",
      type: "supplier",
      vat_number: "IT55443322110",
      address: "Via del Cloud 8",
      city: "Torino",
      sector: "Cloud Computing",
      pec: "clouditalia@pec.it",
      referent_name: "Ing. Laura Gialli",
      referent_email: "l.gialli@clouditalia.it",
      total_exposure: 14400,
      reliability_score: 91,
      reliability_label: "excellent",
      score_legal: 30,
      score_contributory: 20,
      score_reputation: 18,
      score_solidity: 18,
      score_consistency: 5,
      has_bankruptcy: false,
      has_anac_annotations: false,
      vat_verified: true,
      active_contracts: 1,
    },
    {
      id: "cp5",
      name: "Business Advisory Group",
      type: "client",
      vat_number: "IT66778899001",
      address: "Piazza degli Affari 3",
      city: "Milano",
      sector: "Consulenza",
      pec: "bag@pec.it",
      referent_name: "Dott.ssa Elena Blu",
      referent_email: "e.blu@businessadvisory.it",
      total_exposure: 85000,
      reliability_score: 79,
      reliability_label: "good",
      score_legal: 27,
      score_contributory: 17,
      score_reputation: 15,
      score_solidity: 15,
      score_consistency: 5,
      has_bankruptcy: false,
      has_anac_annotations: false,
      vat_verified: true,
      active_contracts: 1,
    },
    {
      id: "cp6",
      name: "InnoTech Solutions",
      type: "partner",
      vat_number: "IT99887766554",
      address: "Via Startup 22",
      city: "Bologna",
      sector: "Tecnologia",
      pec: "innotech@pec.it",
      referent_name: "Marco Tech",
      referent_email: "m.tech@innotech.it",
      total_exposure: 0,
      reliability_score: 45,
      reliability_label: "warning",
      score_legal: 15,
      score_contributory: 10,
      score_reputation: 8,
      score_solidity: 7,
      score_consistency: 5,
      has_bankruptcy: false,
      has_anac_annotations: false,
      vat_verified: true,
      active_contracts: 1,
    },
  ]

  const employees: Employee[] = [
    {
      id: "e1",
      full_name: "Marco Bianchi",
      fiscal_code: "BNCMRC85M15F205X",
      email: "m.bianchi@azienda.it",
      phone: "+39 333 1234567",
      employee_type: "employee",
      role: "Senior Developer",
      department: "IT",
      hire_date: "2022-03-01",
      ccnl: "CCNL Metalmeccanico",
      ccnl_level: "C3",
      ral: 42000,
      gross_cost: 58800,
      medical_exam_date: "2024-06-15",
      safety_training_date: "2024-03-10",
      fixed_term_count: 0,
      fixed_term_months: 0,
    },
    {
      id: "e2",
      full_name: "Giulia Verdi",
      fiscal_code: "VRDGLI90A45H501Y",
      email: "g.verdi@azienda.it",
      phone: "+39 339 9876543",
      employee_type: "employee",
      role: "Project Manager",
      department: "Operations",
      hire_date: "2021-09-15",
      ccnl: "CCNL Commercio",
      ccnl_level: "Q2",
      ral: 48000,
      gross_cost: 67200,
      medical_exam_date: "2024-09-20",
      safety_training_date: "2024-02-28",
      fixed_term_count: 0,
      fixed_term_months: 0,
    },
    {
      id: "e3",
      full_name: "Luca Neri",
      fiscal_code: "NRILCU95T10L219K",
      email: "l.neri@azienda.it",
      employee_type: "employee",
      role: "Junior Developer",
      department: "IT",
      hire_date: "2024-01-10",
      termination_date: "2025-07-09",
      ccnl: "CCNL Metalmeccanico",
      ccnl_level: "D1",
      ral: 28000,
      gross_cost: 39200,
      probation_end_date: "2024-04-10",
      medical_exam_date: "2024-01-05",
      safety_training_date: "2024-01-15",
      fixed_term_count: 1,
      fixed_term_months: 18,
    },
    {
      id: "e4",
      full_name: "Sofia Russo",
      fiscal_code: "RSSSFO88D55F205Z",
      email: "s.russo@azienda.it",
      employee_type: "collaborator",
      role: "Marketing Consultant",
      department: "Marketing",
      hire_date: "2024-06-01",
      ccnl: "CCNL Commercio",
      ccnl_level: "3S",
      ral: 35000,
      gross_cost: 49000,
      fixed_term_count: 0,
      fixed_term_months: 0,
    },
  ]

  const alerts: Alert[] = [
    {
      id: "a1",
      alert_type: "auto_renewal",
      priority: "critical",
      status: "pending",
      title: "Rinnovo tacito in 25 giorni",
      description: "Il contratto con TechSupply Srl si rinnova automaticamente. Ultima data utile per disdetta: 1 maggio 2025.",
      trigger_date: "2025-05-01",
      contract_id: "c1",
      contract_name: "Contratto Fornitura Servizi IT",
      counterpart_name: "TechSupply Srl",
      created_at: "2025-03-22",
    },
    {
      id: "a2",
      alert_type: "contract_expiry",
      priority: "high",
      status: "pending",
      title: "Contratto in scadenza tra 24 giorni",
      description: "L'accordo quadro con Studio Rossi scade il 15 aprile. Valutare rinnovo o nuova negoziazione.",
      trigger_date: "2025-04-15",
      contract_id: "c2",
      contract_name: "Accordo Quadro Consulenza",
      counterpart_name: "Studio Rossi & Associati",
      created_at: "2025-03-22",
    },
    {
      id: "a3",
      alert_type: "new_bando_match",
      priority: "medium",
      status: "pending",
      title: "Nuovo bando compatibile: Digitalizzazione PMI",
      description: "Match score 87%. Scadenza 30 aprile 2025. Verifica requisiti e considera partecipazione.",
      trigger_date: "2025-03-22",
      bando_id: "b1",
      created_at: "2025-03-21",
    },
    {
      id: "a4",
      alert_type: "milestone_approaching",
      priority: "medium",
      status: "pending",
      title: "Milestone Q1 in scadenza",
      description: "La milestone trimestrale del contratto consulenza e in scadenza il 31 marzo.",
      trigger_date: "2025-03-31",
      contract_id: "c5",
      contract_name: "Consulenza Strategica",
      created_at: "2025-03-15",
    },
    {
      id: "a5",
      alert_type: "reliability_score_drop",
      priority: "high",
      status: "pending",
      title: "Calo affidabilita: Logistica Express",
      description: "Il reliability score e sceso da 72 a 58. Rilevata annotazione ANAC. Verifica immediatamente.",
      trigger_date: "2025-03-20",
      counterpart_id: "cp3",
      counterpart_name: "Logistica Express SpA",
      created_at: "2025-03-20",
    },
    {
      id: "a6",
      alert_type: "medical_exam_due",
      priority: "low",
      status: "pending",
      title: "Visita medica in scadenza",
      description: "La visita medica di Marco Bianchi scade il 15 giugno 2025.",
      trigger_date: "2025-06-15",
      employee_id: "e1",
      created_at: "2025-03-15",
    },
  ]

  const bandi: Bando[] = [
    {
      id: "b1",
      source: "invitalia",
      title: "Bando Digitalizzazione PMI - Misura 4.0",
      authority_name: "Invitalia",
      description: "Contributi a fondo perduto per la digitalizzazione delle PMI italiane. Acquisto software, hardware e servizi cloud.",
      base_value: 150000,
      deadline: "2025-04-30",
      match_score: 87,
      match_explanation: "Il tuo settore ICT corrisponde perfettamente al CPV 72.26. Fatturato e dimensione aziendale compatibili. Sede in Lombardia come richiesto.",
      score_sector: 32,
      score_size: 22,
      score_geo: 18,
      score_requirements: 12,
      score_feasibility: 3,
      participation_status: "saved",
      cpv_codes: ["72260000", "72263000"],
      requirements: ["P.IVA attiva da almeno 2 anni", "Fatturato minimo 100k", "Sede in Italia"],
      gap_satisfied: ["P.IVA attiva", "Fatturato sufficiente", "Sede in Lombardia"],
      gap_missing: ["Certificazione ISO 27001 (preferenziale)"],
    },
    {
      id: "b2",
      source: "anac",
      title: "Appalto Servizi Informatici - Comune di Milano",
      authority_name: "Comune di Milano",
      description: "Fornitura servizi di manutenzione e sviluppo software per i sistemi informativi comunali.",
      base_value: 85000,
      deadline: "2025-05-15",
      match_score: 74,
      match_explanation: "Settore compatibile ma richiesta esperienza PA pregressa. Valore contratto nel tuo range operativo.",
      score_sector: 30,
      score_size: 20,
      score_geo: 15,
      score_requirements: 6,
      score_feasibility: 3,
      participation_status: "evaluating",
      cpv_codes: ["72000000", "72200000"],
      requirements: ["Esperienza PA", "Certificazione ISO 9001", "Fatturato minimo 200k"],
      gap_satisfied: ["Sede in Lombardia"],
      gap_missing: ["Esperienza PA documentata", "ISO 9001"],
    },
    {
      id: "b3",
      source: "ted_europa",
      title: "Programma COSME - Internazionalizzazione PMI",
      authority_name: "Commissione Europea",
      description: "Supporto alla internazionalizzazione delle PMI europee. Focus su mercati extra-UE.",
      base_value: 230000,
      deadline: "2025-06-20",
      match_score: 61,
      match_explanation: "Requisiti di export non pienamente soddisfatti. Valutare partnership con azienda gia attiva all'estero.",
      score_sector: 25,
      score_size: 18,
      score_geo: 10,
      score_requirements: 5,
      score_feasibility: 3,
      participation_status: "new",
      cpv_codes: ["79000000"],
      requirements: ["Fatturato export > 20%", "Piano internazionalizzazione"],
      gap_satisfied: ["PMI attiva"],
      gap_missing: ["Fatturato export insufficiente", "Piano internazionalizzazione"],
    },
    {
      id: "b4",
      source: "mimit",
      title: "Voucher Innovazione - Industria 4.0",
      authority_name: "MIMIT",
      description: "Voucher per consulenza tecnologica e implementazione soluzioni Industria 4.0.",
      base_value: 40000,
      deadline: "2025-05-31",
      match_score: 82,
      match_explanation: "Ottimo match per servizi di consulenza tecnologica. Requisiti minimi soddisfatti.",
      score_sector: 30,
      score_size: 22,
      score_geo: 18,
      score_requirements: 9,
      score_feasibility: 3,
      participation_status: "new",
      cpv_codes: ["72200000", "73000000"],
      requirements: ["PMI", "Sede in Italia", "Progetto innovazione"],
      gap_satisfied: ["PMI", "Sede operativa", "Settore compatibile"],
      gap_missing: [],
    },
  ]

  const invoices: Invoice[] = [
    {
      id: "inv1",
      invoice_type: "active",
      invoice_number: "2025/001",
      counterpart_id: "cp5",
      counterpart_name: "Business Advisory Group",
      contract_id: "c5",
      contract_name: "Consulenza Strategica",
      invoice_date: "2025-01-15",
      due_date: "2025-02-14",
      amount_net: 21250,
      vat_rate: 22,
      amount_gross: 25925,
      payment_status: "paid",
      payment_date: "2025-02-10",
    },
    {
      id: "inv2",
      invoice_type: "passive",
      invoice_number: "FT-2025-0042",
      counterpart_id: "cp1",
      counterpart_name: "TechSupply Srl",
      contract_id: "c1",
      contract_name: "Contratto Fornitura IT",
      invoice_date: "2025-02-01",
      due_date: "2025-03-03",
      amount_net: 11250,
      vat_rate: 22,
      amount_gross: 13725,
      payment_status: "paid",
      payment_date: "2025-03-01",
    },
    {
      id: "inv3",
      invoice_type: "passive",
      invoice_number: "2025-LOG-089",
      counterpart_id: "cp3",
      counterpart_name: "Logistica Express SpA",
      contract_id: "c3",
      contract_name: "Contratto Logistica",
      invoice_date: "2025-03-01",
      due_date: "2025-03-31",
      amount_net: 15000,
      vat_rate: 22,
      amount_gross: 18300,
      payment_status: "unpaid",
    },
    {
      id: "inv4",
      invoice_type: "active",
      invoice_number: "2025/002",
      counterpart_id: "cp2",
      counterpart_name: "Studio Rossi & Associati",
      contract_id: "c2",
      contract_name: "Accordo Quadro Consulenza",
      invoice_date: "2025-03-10",
      due_date: "2025-04-09",
      amount_net: 8000,
      vat_rate: 22,
      amount_gross: 9760,
      payment_status: "unpaid",
    },
  ]

  // Save to localStorage
  localStorage.setItem("terminia_contracts", JSON.stringify(contracts))
  localStorage.setItem("terminia_counterparts", JSON.stringify(counterparts))
  localStorage.setItem("terminia_employees", JSON.stringify(employees))
  localStorage.setItem("terminia_alerts", JSON.stringify(alerts))
  localStorage.setItem("terminia_bandi", JSON.stringify(bandi))
  localStorage.setItem("terminia_invoices", JSON.stringify(invoices))
  localStorage.setItem("terminia_initialized", "true")
}

// Getters
export function getContracts(): Contract[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("terminia_contracts") || "[]")
}

export function getContract(id: string): Contract | undefined {
  return getContracts().find(c => c.id === id)
}

export function getCounterparts(): Counterpart[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("terminia_counterparts") || "[]")
}

export function getCounterpart(id: string): Counterpart | undefined {
  return getCounterparts().find(c => c.id === id)
}

export function getEmployees(): Employee[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("terminia_employees") || "[]")
}

export function getEmployee(id: string): Employee | undefined {
  return getEmployees().find(e => e.id === id)
}

export function getAlerts(): Alert[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("terminia_alerts") || "[]")
}

export function getBandi(): Bando[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("terminia_bandi") || "[]")
}

export function getBando(id: string): Bando | undefined {
  return getBandi().find(b => b.id === id)
}

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return []
  const invoices = JSON.parse(localStorage.getItem("terminia_invoices") || "[]")
  // Aggiorna automaticamente lo stato overdue
  return invoices.map((inv: Invoice) => {
    if (inv.payment_status !== "paid" && new Date(inv.due_date) < new Date()) {
      return { ...inv, payment_status: "overdue" as PaymentStatus }
    }
    return inv
  })
}

export function getInvoice(id: string): Invoice | undefined {
  return getInvoices().find(i => i.id === id)
}

export function getInvoicesByType(type: InvoiceType): Invoice[] {
  return getInvoices().filter(i => i.invoice_type === type)
}

export function saveInvoice(invoice: Omit<Invoice, "id"> & { id?: string }): Invoice {
  const invoices = getInvoices()
  const newInvoice: Invoice = {
    ...invoice,
    id: invoice.id || `inv${Date.now()}`,
  } as Invoice

  const existingIndex = invoices.findIndex(i => i.id === newInvoice.id)
  if (existingIndex >= 0) {
    invoices[existingIndex] = newInvoice
  } else {
    invoices.push(newInvoice)
  }

  localStorage.setItem("terminia_invoices", JSON.stringify(invoices))
  return newInvoice
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter(i => i.id !== id)
  localStorage.setItem("terminia_invoices", JSON.stringify(invoices))
}

export function markInvoiceAsPaid(id: string, paymentDate: string): Invoice | undefined {
  const invoice = getInvoice(id)
  if (!invoice) return undefined

  const updated = {
    ...invoice,
    payment_status: "paid" as PaymentStatus,
    payment_date: paymentDate,
  }

  return saveInvoice(updated)
}

export function calculateVAT(amountNet: number, vatRate: number): number {
  return (amountNet * vatRate) / 100
}

export function calculateGross(amountNet: number, vatRate: number): number {
  return amountNet + calculateVAT(amountNet, vatRate)
}

// KPIs
export function getDashboardKPIs() {
  const contracts = getContracts()
  const alerts = getAlerts()
  const bandi = getBandi()
  const invoices = getInvoices()

  const activeContracts = contracts.filter(c => c.status === "active" || c.status === "expiring").length
  const expiringIn30Days = contracts.filter(c => c.status === "expiring").length
  const totalPortfolioValue = contracts.reduce((sum, c) => {
    if (c.value_type === "monthly") return sum + c.value * 12
    if (c.value_type === "annual") return sum + c.value
    return sum + c.value
  }, 0)
  const pendingAlerts = alerts.filter(a => a.status === "pending").length
  const highMatchBandi = bandi.filter(b => b.match_score >= 80).length

  const toCollect = invoices
    .filter(i => i.invoice_type === "active" && i.payment_status !== "paid")
    .reduce((sum, i) => sum + i.amount_gross, 0)
  const toPay = invoices
    .filter(i => i.invoice_type === "passive" && i.payment_status !== "paid")
    .reduce((sum, i) => sum + i.amount_gross, 0)

  return {
    activeContracts,
    expiringIn30Days,
    totalPortfolioValue,
    pendingAlerts,
    highMatchBandi,
    toCollect,
    toPay,
  }
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

export function getInvoiceKPIs(invoiceType: InvoiceType) {
  const invoices = getInvoicesByType(invoiceType)

  const unpaid = invoices.filter(i => i.payment_status === "unpaid" || i.payment_status === "overdue")
  const paid = invoices.filter(i => i.payment_status === "paid")
  const overdue = invoices.filter(i => i.payment_status === "overdue")

  const toCollect = unpaid.reduce((sum, i) => sum + i.amount_gross, 0)
  const collected = paid.reduce((sum, i) => sum + i.amount_gross, 0)
  const overdueAmount = overdue.reduce((sum, i) => sum + i.amount_gross, 0)

  return {
    unpaid: unpaid.length,
    paid: paid.length,
    overdue: overdue.length,
    toCollect,
    collected,
    overdueAmount,
  }
}
