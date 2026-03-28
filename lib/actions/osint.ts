'use server'

import { createClient } from '@/lib/supabase/server'
import {
  verifyOSINT,
  type OSINTRequest,
  type OSINTResponse,
  NemoClawError,
} from '@/lib/ai/client'

export interface VerifyCounterpartInput {
  vatNumber?: string
  fiscalCode?: string
  companyName?: string
  counterpartId?: string
}

export interface VerifyCounterpartResult {
  success: boolean
  data?: OSINTResponse
  error?: string
}

/** Run OSINT verification on a counterpart via NemoClaw */
export async function verifyCounterpartAction(
  input: VerifyCounterpartInput,
): Promise<VerifyCounterpartResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      return { success: false, error: 'Sessione scaduta' }
    }

    if (!input.vatNumber && !input.fiscalCode) {
      return { success: false, error: 'Inserisci almeno P.IVA o Codice Fiscale' }
    }

    const request: OSINTRequest = {
      vat_number: input.vatNumber,
      fiscal_code: input.fiscalCode,
      company_name: input.companyName,
      counterpart_id: input.counterpartId,
    }

    const result = await verifyOSINT(request, token)
    return { success: true, data: result }
  } catch (err) {
    if (err instanceof NemoClawError) {
      return { success: false, error: err.message }
    }
    console.error('OSINT verification failed:', err)
    return { success: false, error: 'Errore durante la verifica OSINT' }
  }
}
