'use server'

import { createClient } from '@/lib/supabase/server'
import { NemoClawError } from '@/lib/ai/client'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SendChatResult {
  success: boolean
  response?: string
  error?: string
}

/** Send a chat message to Terminia AI via NemoClaw (non-streaming) */
export async function sendChatMessageAction(
  messages: ChatMessage[],
): Promise<SendChatResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const companyId = user.user_metadata?.company_id
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) {
      return { success: false, error: 'Sessione scaduta' }
    }

    const baseUrl = process.env.NEMOCLAW_API_URL ?? 'https://nemoclaw.pezserv.org'

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: messages.slice(-20), // Last 20 messages for context window
        company_id: companyId,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new NemoClawError(`Chat failed (${response.status})`, response.status)
    }

    const data = await response.json() as { content: string }
    return { success: true, response: data.content }
  } catch (err) {
    if (err instanceof NemoClawError) {
      return { success: false, error: err.message }
    }
    console.error('Chat failed:', err)
    return { success: false, error: 'Errore di comunicazione con l\'AI' }
  }
}

/**
 * Get the NemoClaw chat streaming URL + auth token.
 * The client component uses this to establish an SSE connection directly.
 */
export async function getChatStreamConfig(): Promise<{
  url: string
  token: string
  companyId: string
} | { error: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Non autenticato' }
    }

    const companyId = user.user_metadata?.company_id
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token || !companyId) {
      return { error: 'Sessione scaduta' }
    }

    const baseUrl = process.env.NEMOCLAW_API_URL ?? 'https://nemoclaw.pezserv.org'
    return { url: `${baseUrl}/api/chat`, token, companyId }
  } catch {
    return { error: 'Errore di configurazione' }
  }
}
