// Mock data for ContractOS dashboard - stored in localStorage for persistence

export interface Contract {
  id: string
  name: string
  counterpart: string
  type: "fornitore" | "cliente" | "dipendente" | "partner"
  status: "attivo" | "in_scadenza" | "scaduto" | "bozza"
  riskLevel: "basso" | "medio" | "alto"
  value: number
  startDate: string
  endDate: string
  renewalType: "tacito" | "esplicito" | "none"
  createdAt: string
}

export interface Alert {
  id: string
  title: string
  description: string
  contractId?: string
  contractName?: string
  priority: "high" | "medium" | "low" | "info"
  type: "scadenza" | "rinnovo" | "pagamento" | "bando" | "compliance"
  dueDate?: string
  read: boolean
  createdAt: string
}

export interface Counterpart {
  id: string
  name: string
  type: "fornitore" | "cliente" | "partner"
  piva: string
  email: string
  contractCount: number
  totalValue: number
}

export interface Employee {
  id: string
  name: string
  role: string
  ccnl: string
  contractType: "indeterminato" | "determinato" | "collaborazione"
  startDate: string
  endDate?: string
}

export interface Bando {
  id: string
  title: string
  source: "ANAC" | "TED Europa" | "Invitalia" | "MIMIT" | "Regionale"
  budget: number
  deadline: string
  matchScore: number
  saved: boolean
  requirements: string[]
}

// Initialize mock data in localStorage
export function initializeMockData() {
  if (typeof window === "undefined") return
  
  // Check if already initialized
  if (localStorage.getItem("contractos_initialized")) return
  
  // Contracts
  const contracts: Contract[] = [
    {
      id: "c1",
      name: "Contratto Fornitura IT",
      counterpart: "TechSupply Srl",
      type: "fornitore",
      status: "attivo",
      riskLevel: "basso",
      value: 45000,
      startDate: "2024-01-15",
      endDate: "2025-05-31",
      renewalType: "tacito",
      createdAt: "2024-01-10",
    },
    {
      id: "c2",
      name: "Accordo di Servizi",
      counterpart: "Studio Rossi & Associati",
      type: "cliente",
      status: "in_scadenza",
      riskLevel: "medio",
      value: 32000,
      startDate: "2023-06-01",
      endDate: "2025-04-15",
      renewalType: "esplicito",
      createdAt: "2023-05-20",
    },
    {
      id: "c3",
      name: "Contratto Quadro Logistica",
      counterpart: "Logistica Express SpA",
      type: "fornitore",
      status: "attivo",
      riskLevel: "alto",
      value: 180000,
      startDate: "2024-03-01",
      endDate: "2025-07-01",
      renewalType: "tacito",
      createdAt: "2024-02-15",
    },
    {
      id: "c4",
      name: "Servizio Cloud Hosting",
      counterpart: "CloudItalia Srl",
      type: "fornitore",
      status: "attivo",
      riskLevel: "basso",
      value: 12000,
      startDate: "2024-06-01",
      endDate: "2025-06-01",
      renewalType: "tacito",
      createdAt: "2024-05-20",
    },
    {
      id: "c5",
      name: "Consulenza Strategica",
      counterpart: "Business Advisory Group",
      type: "cliente",
      status: "attivo",
      riskLevel: "basso",
      value: 85000,
      startDate: "2024-09-01",
      endDate: "2025-08-31",
      renewalType: "esplicito",
      createdAt: "2024-08-15",
    },
  ]
  
  // Alerts
  const alerts: Alert[] = [
    {
      id: "a1",
      title: "Rinnovo tacito in 30 giorni",
      description: "Il contratto con TechSupply Srl si rinnova automaticamente tra 30 giorni.",
      contractId: "c1",
      contractName: "Contratto Fornitura IT",
      priority: "high",
      type: "rinnovo",
      dueDate: "2025-05-01",
      read: false,
      createdAt: "2025-03-22",
    },
    {
      id: "a2",
      title: "Contratto in scadenza",
      description: "L'accordo con Studio Rossi scade tra 24 giorni.",
      contractId: "c2",
      contractName: "Accordo di Servizi",
      priority: "medium",
      type: "scadenza",
      dueDate: "2025-04-15",
      read: false,
      createdAt: "2025-03-22",
    },
    {
      id: "a3",
      title: "Nuovo bando compatibile",
      description: "Bando Digitalizzazione PMI con match score 87%.",
      priority: "info",
      type: "bando",
      read: false,
      createdAt: "2025-03-21",
    },
    {
      id: "a4",
      title: "Pagamento milestone atteso",
      description: "Milestone Q1 del contratto consulenza in attesa.",
      contractId: "c5",
      contractName: "Consulenza Strategica",
      priority: "medium",
      type: "pagamento",
      dueDate: "2025-03-31",
      read: true,
      createdAt: "2025-03-15",
    },
    {
      id: "a5",
      title: "Clausola penale rilevata",
      description: "Contratto Logistica Express contiene penale per ritardi oltre 5 giorni.",
      contractId: "c3",
      contractName: "Contratto Quadro Logistica",
      priority: "high",
      type: "compliance",
      read: false,
      createdAt: "2025-03-20",
    },
  ]
  
  // Counterparts
  const counterparts: Counterpart[] = [
    { id: "cp1", name: "TechSupply Srl", type: "fornitore", piva: "IT12345678901", email: "info@techsupply.it", contractCount: 2, totalValue: 57000 },
    { id: "cp2", name: "Studio Rossi & Associati", type: "cliente", piva: "IT98765432101", email: "segreteria@studiorossi.it", contractCount: 1, totalValue: 32000 },
    { id: "cp3", name: "Logistica Express SpA", type: "fornitore", piva: "IT11223344556", email: "contratti@logisticaexpress.com", contractCount: 1, totalValue: 180000 },
    { id: "cp4", name: "CloudItalia Srl", type: "fornitore", piva: "IT55443322110", email: "sales@clouditalia.it", contractCount: 1, totalValue: 12000 },
    { id: "cp5", name: "Business Advisory Group", type: "cliente", piva: "IT66778899001", email: "contact@businessadvisory.it", contractCount: 1, totalValue: 85000 },
  ]
  
  // Employees
  const employees: Employee[] = [
    { id: "e1", name: "Mario Rossi", role: "Sviluppatore Senior", ccnl: "CCNL Metalmeccanico", contractType: "indeterminato", startDate: "2022-03-01" },
    { id: "e2", name: "Giulia Bianchi", role: "Project Manager", ccnl: "CCNL Commercio", contractType: "indeterminato", startDate: "2021-09-15" },
    { id: "e3", name: "Luca Verdi", role: "Junior Developer", ccnl: "CCNL Metalmeccanico", contractType: "determinato", startDate: "2024-01-10", endDate: "2025-01-09" },
  ]
  
  // Bandi
  const bandi: Bando[] = [
    { id: "b1", title: "Bando Digitalizzazione PMI", source: "Invitalia", budget: 150000, deadline: "2025-04-30", matchScore: 87, saved: true, requirements: ["P.IVA attiva", "Fatturato > 100k", "Settore IT"] },
    { id: "b2", title: "Appalto Servizi IT", source: "ANAC", budget: 85000, deadline: "2025-05-15", matchScore: 74, saved: false, requirements: ["Certificazione ISO", "Esperienza PA"] },
    { id: "b3", title: "Programma COSME", source: "TED Europa", budget: 230000, deadline: "2025-06-20", matchScore: 61, saved: false, requirements: ["Internazionalizzazione", "Export UE"] },
  ]
  
  // Save to localStorage
  localStorage.setItem("contractos_contracts", JSON.stringify(contracts))
  localStorage.setItem("contractos_alerts", JSON.stringify(alerts))
  localStorage.setItem("contractos_counterparts", JSON.stringify(counterparts))
  localStorage.setItem("contractos_employees", JSON.stringify(employees))
  localStorage.setItem("contractos_bandi", JSON.stringify(bandi))
  localStorage.setItem("contractos_initialized", "true")
}

// Getters
export function getContracts(): Contract[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("contractos_contracts")
  return data ? JSON.parse(data) : []
}

export function getAlerts(): Alert[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("contractos_alerts")
  return data ? JSON.parse(data) : []
}

export function getCounterparts(): Counterpart[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("contractos_counterparts")
  return data ? JSON.parse(data) : []
}

export function getEmployees(): Employee[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("contractos_employees")
  return data ? JSON.parse(data) : []
}

export function getBandi(): Bando[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("contractos_bandi")
  return data ? JSON.parse(data) : []
}

// KPI calculations
export function getDashboardKPIs() {
  const contracts = getContracts()
  const alerts = getAlerts()
  
  const activeContracts = contracts.filter(c => c.status === "attivo" || c.status === "in_scadenza").length
  const expiringContracts = contracts.filter(c => c.status === "in_scadenza").length
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0)
  const unreadAlerts = alerts.filter(a => !a.read).length
  const highRiskContracts = contracts.filter(c => c.riskLevel === "alto").length
  
  return {
    activeContracts,
    expiringContracts,
    totalValue,
    unreadAlerts,
    highRiskContracts,
  }
}

// Format helpers
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
