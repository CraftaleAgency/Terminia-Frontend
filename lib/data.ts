// Data access layer for Terminia
// All functions use Supabase for data fetching

import { createClient } from './supabase/client'
import type { InvoiceType } from './mock-data'
import type { Database } from '@/types/database'

type ContractRow = Database['public']['Tables']['contracts']['Row']
type CounterpartRow = Database['public']['Tables']['counterparts']['Row']
type EmployeeRow = Database['public']['Tables']['employees']['Row']
type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type BandoRow = Database['public']['Tables']['bandi']['Row']
type AlertRow = Database['public']['Tables']['alerts']['Row']

// Get current user's company ID
export async function getCompanyId(userId: string): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', userId)
    .single()
  return data?.company_id || null
}

// ============ CONTRACTS ============

export async function getContracts(companyId: string): Promise<(ContractRow & { counterpart_name?: string; employee_name?: string })[]> {
  const supabase = createClient()
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

// ============ COUNTERPARTS ============

export async function getCounterparts(companyId: string): Promise<CounterpartRow[]> {
  const supabase = createClient()
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

// ============ EMPLOYEES ============

export async function getEmployees(companyId: string): Promise<EmployeeRow[]> {
  const supabase = createClient()
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

// ============ INVOICES ============

export async function getInvoices(companyId: string, invoiceType?: InvoiceType): Promise<(InvoiceRow & { counterpart_name?: string; contract_name?: string | null })[]> {
  const supabase = createClient()
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

export async function saveInvoice(companyId: string, invoice: Omit<InvoiceRow, 'id'>): Promise<InvoiceRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      ...invoice,
      company_id: companyId,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving invoice:', error)
    return null
  }

  return data
}

export async function markInvoiceAsPaid(invoiceId: string, paymentDate: string): Promise<InvoiceRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('invoices')
    .update({
      payment_status: 'paid',
      payment_date: paymentDate,
    })
    .eq('id', invoiceId)
    .select()
    .single()

  if (error) {
    console.error('Error marking invoice as paid:', error)
    return null
  }

  return data
}

export interface InvoiceKPIs {
  unpaid: number
  paid: number
  overdue: number
  toCollect: number
  collected: number
  overdueAmount: number
}

export async function getInvoiceKPIs(companyId: string, invoiceType: InvoiceType): Promise<InvoiceKPIs> {
  const invoices = await getInvoices(companyId, invoiceType)

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

export async function getBandi(companyId: string): Promise<BandoRow[]> {
  const supabase = createClient()
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

// ============ ALERTS ============

export async function getAlerts(companyId: string): Promise<AlertRow[]> {
  const supabase = createClient()
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
