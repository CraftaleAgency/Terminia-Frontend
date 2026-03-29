'use server'

import { createClient } from '@/lib/supabase/server'
import { nemoclawClient, NemoClawError } from '@/lib/ai/client'

export interface OCRResult {
  success: boolean
  text?: string
  confidence?: string
  error?: string
}

/** Extract text from a document image via NemoClaw OCR */
export async function extractTextFromImageAction(
  imageBase64: string,
): Promise<OCRResult> {
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

    const result = await nemoclawClient.extractOCR({ image_base64: imageBase64 }, token)
    return { success: true, text: result.text, confidence: result.format }
  } catch (err) {
    if (err instanceof NemoClawError) {
      return { success: false, error: err.message }
    }
    console.error('OCR failed:', err)
    return { success: false, error: 'Errore durante l\'estrazione del testo' }
  }
}
