'use server'

import { createClient } from '@/lib/supabase/server'
import { nemoclawClient, NemoClawError } from '@/lib/ai/client'
import type { AnalyzeContractRequest, AnalyzeContractResponse } from '@/types/terminia'

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

    const companyId = user.user_metadata?.company_id
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

    const companyId = user.user_metadata?.company_id
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
    return { success: true, data: result }
  } catch (err) {
    if (err instanceof NemoClawError) {
      return { success: false, error: err.message }
    }
    return { success: false, error: 'Errore durante la ri-analisi' }
  }
}
