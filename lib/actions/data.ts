'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import type { InvoiceType, InvoiceKPIs } from '@/types/models'

type ContractRow = Database['public']['Tables']['contracts']['Row']
type CounterpartRow = Database['public']['Tables']['counterparts']['Row']
type EmployeeRow = Database['public']['Tables']['employees']['Row']
type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type BandoRow = Database['public']['Tables']['bandi']['Row']
type AlertRow = Database['public']['Tables']['alerts']['Row']

// Helper: get company ID for current user
async function getCompanyId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('users').select('company_id').eq('id', user.id).single()
  return data?.company_id || null
}

// ============ CONTRACTS ============

export async function fetchContracts(): Promise<(ContractRow & { counterpart_name?: string; employee_name?: string })[]> {
  const companyId = await getCompanyId()
  if (!companyId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      counterparts(name),
      employees(full_name)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contracts:', error)
    return []
  }

  return data?.map(c => ({
    ...c,
    counterpart_name: c.counterparts?.name,
    employee_name: c.employees?.full_name,
  })) || []
}

export async function fetchContract(id: string) {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  // Fetch contract with counterpart and employee joins
  const { data: contractData, error } = await supabase
    .from('contracts')
    .select(`
      *,
      counterparts!contracts_counterpart_id_fkey(name, type, reliability_score, reliability_label, has_anac_annotations),
      employees!contracts_employee_id_fkey(full_name, role, department, employee_type)
    `)
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !contractData) return null

  // Fetch related invoices
  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('*')
    .eq('contract_id', id)
    .order('invoice_date', { ascending: false })

  // Fetch clauses
  const { data: clausesData } = await supabase
    .from('clauses')
    .select('*')
    .eq('contract_id', id)
    .order('page_number', { ascending: true, nullsFirst: false })

  // Fetch obligations
  const { data: obligationsData } = await supabase
    .from('obligations')
    .select('*')
    .eq('contract_id', id)
    .order('due_date', { ascending: true, nullsFirst: false })

  // Fetch milestones
  const { data: milestonesData } = await supabase
    .from('milestones')
    .select('*')
    .eq('contract_id', id)
    .order('due_date', { ascending: true, nullsFirst: false })

  return {
    contract: {
      ...contractData,
      counterpart_name: contractData.counterparts?.name,
      employee_name: contractData.employees?.full_name,
    },
    counterpart: contractData.counterparts ? {
      id: contractData.counterpart_id ?? '',
      name: contractData.counterparts.name,
      type: contractData.counterparts.type,
      reliability_score: contractData.counterparts.reliability_score,
      reliability_label: contractData.counterparts.reliability_label,
      has_anac_annotations: contractData.counterparts.has_anac_annotations,
    } : null,
    employee: contractData.employees ? {
      id: contractData.employee_id ?? '',
      full_name: contractData.employees.full_name,
      role: contractData.employees.role,
      department: contractData.employees.department,
      employee_type: contractData.employees.employee_type,
    } : null,
    invoices: invoicesData || [],
    clauses: clausesData || [],
    obligations: obligationsData || [],
    milestones: milestonesData || [],
  }
}

// ============ COUNTERPARTS ============

export async function fetchCounterparts(): Promise<CounterpartRow[]> {
  const companyId = await getCompanyId()
  if (!companyId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('counterparts')
    .select('*')
    .eq('company_id', companyId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching counterparts:', error)
    return []
  }

  return data || []
}

export async function fetchCounterpart(id: string) {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  // Fetch counterpart
  const { data: counterpartData, error } = await supabase
    .from('counterparts')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !counterpartData) return null

  // Fetch related contracts
  const { data: contractsData } = await supabase
    .from('contracts')
    .select('*')
    .eq('counterpart_id', id)
    .eq('company_id', companyId)

  return {
    counterpart: counterpartData,
    contracts: contractsData || [],
  }
}

// ============ EMPLOYEES ============

export async function fetchEmployees(): Promise<EmployeeRow[]> {
  const companyId = await getCompanyId()
  if (!companyId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('company_id', companyId)
    .order('full_name', { ascending: true })

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }

  return data || []
}

export async function fetchEmployee(id: string) {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  // Fetch employee
  const { data: employeeData, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !employeeData) return null

  // Fetch related contracts
  const { data: contractsData } = await supabase
    .from('contracts')
    .select('*')
    .eq('employee_id', id)
    .eq('company_id', companyId)

  return {
    employee: employeeData,
    contracts: contractsData || [],
  }
}

// ============ INVOICES ============

export async function fetchInvoices(invoiceType?: string): Promise<(InvoiceRow & { counterpart_name?: string; contract_name?: string | null })[]> {
  const companyId = await getCompanyId()
  if (!companyId) return []

  const supabase = await createClient()
  let query = supabase
    .from('invoices')
    .select(`
      *,
      counterparts(name),
      contracts(title)
    `)
    .eq('company_id', companyId)
    .order('invoice_date', { ascending: false })

  if (invoiceType) {
    query = query.eq('invoice_type', invoiceType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }

  return data?.map(inv => ({
    ...inv,
    invoice_type: inv.invoice_type as InvoiceType,
    counterpart_name: inv.counterparts?.name,
    contract_name: inv.contracts?.title,
  })) || []
}

export async function fetchInvoice(id: string) {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  // Fetch invoice
  const { data: invoiceData, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !invoiceData) return null

  // Fetch counterpart if exists
  let counterpart: CounterpartRow | null = null
  if (invoiceData.counterpart_id) {
    const { data } = await supabase
      .from('counterparts')
      .select('*')
      .eq('id', invoiceData.counterpart_id)
      .single()
    counterpart = data || null
  }

  // Fetch contract if exists
  let contract: Database['public']['Tables']['contracts']['Row'] | null = null
  if (invoiceData.contract_id) {
    const { data } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', invoiceData.contract_id)
      .single()
    contract = data || null
  }

  return {
    invoice: invoiceData,
    counterpart,
    contract,
  }
}

export async function fetchInvoiceKPIs(invoiceType: InvoiceType): Promise<InvoiceKPIs> {
  const invoices = await fetchInvoices(invoiceType)

  const unpaid = invoices.filter(i => i.payment_status === 'unpaid')
  const paid = invoices.filter(i => i.payment_status === 'paid')
  const overdue = invoices.filter(i => i.payment_status === 'overdue')

  return {
    unpaid: unpaid.length,
    paid: paid.length,
    overdue: overdue.length,
    toCollect: unpaid.reduce((sum, i) => sum + (i.amount_gross ?? 0), 0),
    collected: paid.reduce((sum, i) => sum + (i.amount_gross ?? 0), 0),
    overdueAmount: overdue.reduce((sum, i) => sum + (i.amount_gross ?? 0), 0),
  }
}

// ============ BANDI ============

export async function fetchBandi(): Promise<BandoRow[]> {
  const companyId = await getCompanyId()
  if (!companyId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bandi')
    .select('*')
    .eq('company_id', companyId)
    .order('deadline', { ascending: true })

  if (error) {
    console.error('Error fetching bandi:', error)
    return []
  }

  return data || []
}

export async function fetchBando(id: string) {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bandi')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !data) return null

  const gapAnalysis = data.gap_analysis_json as { satisfied?: string[]; missing?: string[] } | null
  const requirements = data.requirements_json as { items?: string[] } | null

  return {
    ...data,
    match_score: data.match_score ?? 0,
    base_value: data.base_value ?? 0,
    score_sector: data.score_sector ?? 0,
    score_size: data.score_size ?? 0,
    score_geo: data.score_geo ?? 0,
    score_requirements: data.score_requirements ?? 0,
    score_feasibility: data.score_feasibility ?? 0,
    requirements: requirements?.items || [],
    gap_satisfied: gapAnalysis?.satisfied || [],
    gap_missing: gapAnalysis?.missing || [],
  }
}

// ============ ALERTS ============

export async function fetchAlerts(): Promise<AlertRow[]> {
  const companyId = await getCompanyId()
  if (!companyId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('company_id', companyId)
    .order('trigger_date', { ascending: true })

  if (error) {
    console.error('Error fetching alerts:', error)
    return []
  }

  return data || []
}

// ============ DASHBOARD ============

export async function fetchDashboardData() {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  // Fetch active contracts (last 5) with counterpart names
  const { data: contractsData } = await supabase
    .from('contracts')
    .select('*, counterparts(name)')
    .eq('company_id', companyId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch pending/escalated alerts (last 5)
  const { data: alertsData } = await supabase
    .from('alerts')
    .select('*')
    .eq('company_id', companyId)
    .in('status', ['pending', 'escalated'])
    .order('priority', { ascending: true })
    .limit(5)

  // KPIs: active contracts count
  const { count: activeCount } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('status', 'active')

  // KPIs: expiring in 30 days
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  const { count: expiringCount } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('status', 'active')
    .lte('end_date', thirtyDaysFromNow.toISOString())

  // KPIs: total portfolio value
  const { data: valueData } = await supabase
    .from('contracts')
    .select('value')
    .eq('company_id', companyId)
    .eq('status', 'active')

  const totalValue = valueData?.reduce((sum, c) => sum + (c.value || 0), 0) || 0

  // KPIs: pending alerts count
  const { count: alertsCount } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .in('status', ['pending', 'escalated'])

  return {
    contracts: contractsData || [],
    alerts: alertsData || [],
    kpis: {
      activeContracts: activeCount || 0,
      expiringIn30Days: expiringCount || 0,
      totalPortfolioValue: totalValue,
      pendingAlerts: alertsCount || 0,
      highMatchBandi: 0,
      toCollect: 0,
      toPay: 0,
    },
  }
}

// ============ ANALYTICS ============

export async function fetchAnalytics() {
  const companyId = await getCompanyId()
  if (!companyId) return null

  const supabase = await createClient()

  // Fetch all contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .eq('company_id', companyId)

  // Fetch all counterparts
  const { data: counterparts } = await supabase
    .from('counterparts')
    .select('*')
    .eq('company_id', companyId)

  // Fetch all alerts
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('company_id', companyId)

  return {
    contracts: contracts || [],
    counterparts: counterparts || [],
    alerts: alerts || [],
  }
}

// ============ MUTATIONS ============

export async function updateAlertStatus(id: string, status: string): Promise<{ success: boolean; data?: AlertRow; error?: string }> {
  const companyId = await getCompanyId()
  if (!companyId) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('alerts')
    .update({ status })
    .eq('id', id)
    .eq('company_id', companyId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function saveInvoiceAction(
  invoice: Omit<InvoiceRow, 'id'>
): Promise<{ success: boolean; data?: InvoiceRow; error?: string }> {
  const companyId = await getCompanyId()
  if (!companyId) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      ...invoice,
      company_id: companyId,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function markInvoiceAsPaidAction(
  invoiceId: string,
  paymentDate?: string
): Promise<{ success: boolean; data?: InvoiceRow; error?: string }> {
  const companyId = await getCompanyId()
  if (!companyId) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoices')
    .update({
      payment_status: 'paid',
      payment_date: paymentDate || new Date().toISOString().split('T')[0],
    })
    .eq('id', invoiceId)
    .eq('company_id', companyId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function deleteInvoiceAction(
  invoiceId: string
): Promise<{ success: boolean; error?: string }> {
  const companyId = await getCompanyId()
  if (!companyId) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('company_id', companyId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
