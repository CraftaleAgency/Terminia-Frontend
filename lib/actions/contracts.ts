'use server'

import { createClient } from '@/lib/supabase/server'
import { nemoclawClient, NemoClawError } from '@/lib/ai/client'
import type { AnalyzeContractRequest, AnalyzeContractResponse } from '@/types/terminia'
import type { Database } from '@/types/database'

type ContractInsert = Database['public']['Tables']['contracts']['Insert']
type ClauseInsert = Database['public']['Tables']['clauses']['Insert']
type ObligationInsert = Database['public']['Tables']['obligations']['Insert']
type MilestoneInsert = Database['public']['Tables']['milestones']['Insert']

async function getCompanyId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('users').select('company_id').eq('id', user.id).single()
  return data?.company_id || null
}

export interface AnalyzeContractInput {
  documentText?: string
  documentBase64?: string
  contentType?: string
  contractId?: string
}

export interface AnalyzeContractResult {
  success: boolean
  data?: AnalyzeContractResponse
  error?: string
}

/** Analyze a contract document via NemoClaw pipeline */
export async function analyzeContractAction(
  input: AnalyzeContractInput,
): Promise<AnalyzeContractResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const companyId = await getCompanyId()
    if (!companyId) {
      return { success: false, error: 'Nessuna azienda associata' }
    }

    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      return { success: false, error: 'Sessione scaduta' }
    }

    const request: AnalyzeContractRequest = {
      document_text: input.documentText,
      document_base64: input.documentBase64,
      content_type: input.contentType,
      company_id: companyId,
      contract_id: input.contractId,
    }

    const result = await nemoclawClient.analyzeContract(request, token)
    return { success: true, data: result }
  } catch (err) {
    if (err instanceof NemoClawError) {
      return { success: false, error: err.message }
    }
    console.error('Contract analysis failed:', err)
    return { success: false, error: 'Errore durante l\'analisi del contratto' }
  }
}

/** Re-analyze an existing contract */
export async function reanalyzeContractAction(
  contractId: string,
): Promise<AnalyzeContractResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const companyId = await getCompanyId()
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token || !companyId) {
      return { success: false, error: 'Sessione scaduta' }
    }

    // Fetch existing contract text
    const { data: contract } = await supabase
      .from('contracts')
      .select('ai_summary, title')
      .eq('id', contractId)
      .single()

    if (!contract) {
      return { success: false, error: 'Contratto non trovato' }
    }

    const request: AnalyzeContractRequest = {
      company_id: companyId,
      contract_id: contractId,
    }

    const result = await nemoclawClient.analyzeContract(request, token)

    // Persist updated analysis results to DB
    await supabase.from('contracts').update({
      ai_summary: result.classification?.summary_it ?? null,
      ai_confidence: result.classification?.confidence ?? null,
      ai_extracted_at: new Date().toISOString(),
      risk_score: result.risk?.risk_score ?? null,
    }).eq('id', contractId)

    // Replace clauses with fresh extraction
    if (result.extraction?.clauses?.length) {
      await supabase.from('clauses').delete().eq('contract_id', contractId)
      await supabase.from('clauses').insert(result.extraction.clauses.map(c => ({
        contract_id: contractId,
        clause_type: c.clause_type ?? c.title ?? null,
        original_text: c.original_text || c.title || '',
        simplified_text: c.summary_it ?? null,
        risk_level: c.risk_level ?? null,
        risk_explanation: c.risk_reason ?? null,
      })))
    }

    return { success: true, data: result }
  } catch (err) {
    if (err instanceof NemoClawError) {
      return { success: false, error: err.message }
    }
    return { success: false, error: 'Errore durante la ri-analisi' }
  }
}

// ─── Save Contract with Analysis ────────────────────────────────────────────

export interface SaveContractInput {
  formData: {
    title: string
    contract_type: string
    actor_type: 'counterpart' | 'employee'
    counterpart_id?: string
    employee_id?: string
    status: string
    reference_number?: string
    value?: string
    value_type?: string
    payment_terms_days?: string
    payment_frequency?: string
    vat_regime?: string
    vat_rate?: string
    withholding_tax_enabled?: boolean
    withholding_tax_rate?: string
    istat_index_enabled?: boolean
    signing_date?: string
    start_date?: string
    end_date?: string
    effectiveness_date?: string
    auto_renewal?: boolean
    renewal_notice_days?: string
    renewal_duration_months?: string
    notes?: string
    tags?: string[]
  }
  analysisResult?: AnalyzeContractResponse | null
  reliabilityScore?: number | null
}

export interface SaveContractResult {
  success: boolean
  contractId?: string
  error?: string
}

/** Save a new contract (with optional AI analysis results) to Supabase */
export async function saveContractAction(input: SaveContractInput): Promise<SaveContractResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const companyId = await getCompanyId()
    if (!companyId) {
      return { success: false, error: 'Nessuna azienda associata' }
    }

    const { formData, analysisResult } = input
    const ai = analysisResult

    // Map AI results onto contract insert
    const contractInsert: ContractInsert = {
      company_id: companyId,
      created_by: user.id,
      title: formData.title || ai?.classification?.parties?.counterpart?.name || 'Nuovo Contratto',
      contract_type: formData.contract_type,
      status: formData.status || 'draft',
      counterpart_id: formData.actor_type === 'counterpart' && formData.counterpart_id
        ? formData.counterpart_id : null,
      employee_id: formData.actor_type === 'employee' && formData.employee_id
        ? formData.employee_id : null,
      reference_number: formData.reference_number || null,
      value: formData.value ? parseFloat(formData.value) : (ai?.extraction?.value?.total_value ?? null),
      value_type: formData.value_type || null,
      payment_terms: formData.payment_terms_days ? parseInt(formData.payment_terms_days)
        : (ai?.extraction?.value?.payment_terms_days ?? null),
      payment_frequency: formData.payment_frequency || null,
      vat_regime: formData.vat_regime || null,
      vat_rate: formData.vat_rate ? parseFloat(formData.vat_rate) : null,
      withholding_tax: formData.withholding_tax_enabled ?? false,
      withholding_rate: formData.withholding_tax_enabled && formData.withholding_tax_rate
        ? parseFloat(formData.withholding_tax_rate) : null,
      istat_indexation: formData.istat_index_enabled ?? false,
      signed_date: formData.signing_date || (ai?.extraction?.dates?.signing_date ?? null),
      start_date: formData.start_date || (ai?.extraction?.dates?.start_date ?? null),
      end_date: formData.end_date || (ai?.extraction?.dates?.end_date ?? null),
      effective_date: formData.effectiveness_date || null,
      auto_renewal: formData.auto_renewal ?? (ai?.extraction?.renewal?.auto_renewal ?? false),
      renewal_notice_days: formData.renewal_notice_days
        ? parseInt(formData.renewal_notice_days)
        : (ai?.extraction?.dates?.notice_period_days ?? null),
      renewal_duration_months: formData.renewal_duration_months
        ? parseInt(formData.renewal_duration_months)
        : (ai?.extraction?.renewal?.renewal_duration_months ?? null),
      notes: formData.notes || null,
      tags: formData.tags?.length ? formData.tags : null,
      language: ai?.classification?.language ?? null,
      // AI analysis fields
      ai_summary: ai?.classification?.summary_it ?? null,
      ai_confidence: ai?.classification?.confidence ?? null,
      ai_extracted_at: ai ? new Date().toISOString() : null,
      risk_score: ai?.risk?.risk_score ?? null,
    }

    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert(contractInsert)
      .select('id')
      .single()

    if (contractError || !contract) {
      console.error('Contract insert failed:', contractError)
      return { success: false, error: contractError?.message || 'Errore salvataggio contratto' }
    }

    const contractId = contract.id

    // Insert clauses
    if (ai?.extraction?.clauses?.length) {
      const clauses: ClauseInsert[] = ai.extraction.clauses.map(c => ({
        contract_id: contractId,
        clause_type: c.clause_type ?? c.title ?? null,
        original_text: c.original_text || c.title || '',
        simplified_text: c.summary_it ?? null,
        risk_level: c.risk_level ?? null,
        risk_explanation: c.risk_reason ?? null,
      }))
      await supabase.from('clauses').insert(clauses)
    }

    // Insert obligations
    if (ai?.extraction?.obligations?.length) {
      const obligations: ObligationInsert[] = ai.extraction.obligations.map(o => ({
        contract_id: contractId,
        description: o.description,
        party: o.responsible_party || 'entrambe',
        due_date: o.deadline ?? null,
        recurrence: o.recurring ? (o.frequency ?? 'periodica') : null,
        status: 'pending',
      }))
      await supabase.from('obligations').insert(obligations)
    }

    // Insert milestones
    if (ai?.extraction?.milestones?.length) {
      const milestones: MilestoneInsert[] = ai.extraction.milestones.map(m => ({
        contract_id: contractId,
        title: m.title || 'Milestone',
        due_date: m.due_date ?? null,
        amount: m.amount ?? null,
        description: m.description ?? null,
        status: 'pending',
      }))
      await supabase.from('milestones').insert(milestones)
    }

    return { success: true, contractId }
  } catch (err) {
    console.error('saveContractAction failed:', err)
    return { success: false, error: 'Errore durante il salvataggio' }
  }
}

/** Update an existing contract with new AI analysis results */
export async function updateContractAnalysisAction(
  contractId: string,
  analysis: AnalyzeContractResponse,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Non autenticato' }

    const { error } = await supabase
      .from('contracts')
      .update({
        ai_summary: analysis.classification?.summary_it ?? null,
        ai_confidence: analysis.classification?.confidence ?? null,
        ai_extracted_at: new Date().toISOString(),
        risk_score: analysis.risk?.risk_score ?? null,
      })
      .eq('id', contractId)

    if (error) return { success: false, error: error.message }

    // Replace clauses: delete old, insert new
    if (analysis.extraction?.clauses?.length) {
      await supabase.from('clauses').delete().eq('contract_id', contractId)
      const clauses: ClauseInsert[] = analysis.extraction.clauses.map(c => ({
        contract_id: contractId,
        clause_type: c.clause_type ?? c.title ?? null,
        original_text: c.original_text || c.title || '',
        simplified_text: c.summary_it ?? null,
        risk_level: c.risk_level ?? null,
        risk_explanation: c.risk_reason ?? null,
      }))
      await supabase.from('clauses').insert(clauses)
    }

    return { success: true }
  } catch (err) {
    console.error('updateContractAnalysisAction failed:', err)
    return { success: false, error: 'Errore durante l\'aggiornamento' }
  }
}

/**
 * Save the registration document as the user's first contract.
 * Called after signup completes and the user lands on the dashboard.
 * Uploads the file to storage and creates a contract record + triggers analysis.
 */
export async function saveRegistrationContractAction(input: {
  documentBase64: string
  contentType: string
  filename: string
  title?: string
}): Promise<{ success: boolean; contractId?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Non autenticato' }

    const companyId = await getCompanyId()
    if (!companyId) return { success: false, error: 'Nessuna azienda associata' }

    // Upload file to Supabase storage
    const storagePath = `${user.id}/contracts/${Date.now()}-${input.filename}`
    const buffer = Buffer.from(input.documentBase64, 'base64')
    await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, { contentType: input.contentType, upsert: false })

    // Create draft contract record
    const contractTitle = input.title || input.filename.replace(/\.[^.]+$/, '') || 'Documento Costitutivo'
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        company_id: companyId,
        created_by: user.id,
        title: contractTitle,
        contract_type: 'altro',
        status: 'draft',
      } satisfies ContractInsert)
      .select('id')
      .single()

    if (contractError || !contract) {
      return { success: false, error: contractError?.message || 'Errore creazione contratto' }
    }

    // Link document to contract
    await supabase.from('contract_documents').insert({
      contract_id: contract.id,
      file_name: input.filename,
      file_url: storagePath,
      file_size: buffer.length,
      file_type: input.contentType.includes('pdf') ? 'pdf' : 'docx',
      document_role: 'original',
      is_current: true,
      uploaded_by: user.id,
    })

    // Trigger full AI analysis pipeline (fire-and-forget via server action)
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (token) {
      try {
        const apiUrl = process.env.NEMOCLAW_API_URL || 'http://terminia-api:3100'
        const response = await fetch(`${apiUrl}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            document_base64: input.documentBase64,
            content_type: input.contentType,
            company_id: companyId,
            contract_id: contract.id,
          }),
        })
        if (response.ok) {
          const analysis = await response.json()
          // Update contract with analysis results
          if (analysis.classification) {
            await supabase.from('contracts').update({
              contract_type: analysis.classification.contract_type || 'altro',
              ai_summary: analysis.classification.summary_it || null,
              ai_confidence: analysis.classification.confidence || null,
              ai_extracted_at: new Date().toISOString(),
              risk_score: analysis.risk?.risk_score ?? null,
              status: 'active',
              start_date: analysis.extraction?.dates?.start_date || null,
              end_date: analysis.extraction?.dates?.end_date || null,
              signed_date: analysis.extraction?.dates?.signing_date || null,
              value: analysis.extraction?.value?.total_value || null,
              auto_renewal: analysis.extraction?.renewal?.auto_renewal || false,
              language: analysis.classification.language || 'it',
            }).eq('id', contract.id)

            // Update title with counterpart name if available
            const counterpartName = analysis.classification.parties?.counterpart?.name
            if (counterpartName) {
              await supabase.from('contracts').update({
                title: `${counterpartName} - ${analysis.classification.contract_type || contractTitle}`,
              }).eq('id', contract.id)
            }
          }
        }
      } catch {
        // Non-fatal — contract created, analysis can be retried manually
      }
    }

    return { success: true, contractId: contract.id }
  } catch (err) {
    console.error('saveRegistrationContractAction failed:', err)
    return { success: false, error: 'Errore durante il salvataggio' }
  }
}

/**
 * Upload a contract document file to Supabase storage and link to contract.
 */
export async function uploadContractDocumentAction(input: {
  contractId: string
  documentBase64: string
  contentType: string
  filename: string
}): Promise<{ success: boolean; storagePath?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Non autenticato' }

    const storagePath = `${user.id}/contracts/${Date.now()}-${input.filename}`
    const buffer = Buffer.from(input.documentBase64, 'base64')
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, { contentType: input.contentType, upsert: false })

    if (uploadError) return { success: false, error: uploadError.message }

    await supabase.from('contract_documents').insert({
      contract_id: input.contractId,
      file_name: input.filename,
      file_url: storagePath,
      file_size: buffer.length,
      file_type: input.contentType.includes('pdf') ? 'pdf' : 'docx',
      document_role: 'original',
      is_current: true,
      uploaded_by: user.id,
    })

    return { success: true, storagePath }
  } catch (err) {
    console.error('uploadContractDocumentAction failed:', err)
    return { success: false, error: 'Errore upload documento' }
  }
}
