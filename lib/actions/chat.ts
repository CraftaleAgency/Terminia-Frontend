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
  conversation_id?: string,
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
        ...(conversation_id && { conversation_id }),
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
  userId: string
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
    return { url: `${baseUrl}/api/chat`, token, companyId, userId: user.id }
  } catch {
    return { error: 'Errore di configurazione' }
  }
}

// ---------------------------------------------------------------------------
// Conversation CRUD
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string
  user_id: string
  company_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ConversationMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  attachment: string | null
  created_at: string
}

/** List conversations for the authenticated user, most recent first. */
export async function listConversationsAction(): Promise<
  { success: true; conversations: Conversation[] } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('listConversations failed:', error)
      return { success: false, error: 'Errore nel caricamento delle conversazioni' }
    }

    return { success: true, conversations: data as Conversation[] }
  } catch (err) {
    console.error('listConversations failed:', err)
    return { success: false, error: 'Errore nel caricamento delle conversazioni' }
  }
}

/** Create a new conversation for the authenticated user. */
export async function createConversationAction(title?: string): Promise<
  { success: true; conversation: Conversation } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const companyId = user.user_metadata?.company_id
    if (!companyId) {
      return { success: false, error: 'Company non configurata' }
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        company_id: companyId,
        title: title || 'Nuova conversazione',
      })
      .select()
      .single()

    if (error) {
      console.error('createConversation failed:', error)
      return { success: false, error: 'Errore nella creazione della conversazione' }
    }

    return { success: true, conversation: data as Conversation }
  } catch (err) {
    console.error('createConversation failed:', err)
    return { success: false, error: 'Errore nella creazione della conversazione' }
  }
}

/** Get all messages for a conversation. */
export async function getConversationMessagesAction(conversationId: string): Promise<
  { success: true; messages: ConversationMessage[] } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    // Verify the conversation belongs to this user
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (convError || !conv) {
      return { success: false, error: 'Conversazione non trovata' }
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('getConversationMessages failed:', error)
      return { success: false, error: 'Errore nel caricamento dei messaggi' }
    }

    return { success: true, messages: data as ConversationMessage[] }
  } catch (err) {
    console.error('getConversationMessages failed:', err)
    return { success: false, error: 'Errore nel caricamento dei messaggi' }
  }
}

/** Rename a conversation. */
export async function renameConversationAction(conversationId: string, title: string): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    const { error } = await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('renameConversation failed:', error)
      return { success: false, error: 'Errore nella rinomina della conversazione' }
    }

    return { success: true }
  } catch (err) {
    console.error('renameConversation failed:', err)
    return { success: false, error: 'Errore nella rinomina della conversazione' }
  }
}

/** Delete a conversation and its messages. */
export async function deleteConversationAction(conversationId: string): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    // Delete messages first (or rely on CASCADE if configured)
    await supabase
      .from('chat_messages')
      .delete()
      .eq('conversation_id', conversationId)

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id)

    if (error) {
      console.error('deleteConversation failed:', error)
      return { success: false, error: 'Errore nella cancellazione della conversazione' }
    }

    return { success: true }
  } catch (err) {
    console.error('deleteConversation failed:', err)
    return { success: false, error: 'Errore nella cancellazione della conversazione' }
  }
}

/** Save a single message to a conversation. */
export async function saveMessageAction(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
): Promise<
  { success: true; message: ConversationMessage } | { success: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Non autenticato' }
    }

    // Verify ownership
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', user.id)
      .single()

    if (convError || !conv) {
      return { success: false, error: 'Conversazione non trovata' }
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error('saveMessage failed:', error)
      return { success: false, error: 'Errore nel salvataggio del messaggio' }
    }

    // Touch conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    return { success: true, message: data as ConversationMessage }
  } catch (err) {
    console.error('saveMessage failed:', err)
    return { success: false, error: 'Errore nel salvataggio del messaggio' }
  }
}
