// ─── NemoClaw API Client ────────────────────────────────────────────────────
// Calls nemoclaw.pezserv.org REST API from Server Actions.
// Handles contract analysis, OSINT, chat (streaming), and OCR.

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AnalyzeRequest {
  document_text?: string
  document_base64?: string
  content_type?: string
  company_id: string
  contract_id?: string
}

export interface AnalyzeResponse {
  classification: {
    contract_type: string
    counterpart_type?: string
    language?: string
    confidence: number
    parties?: {
      company?: string
      counterpart?: {
        name?: string
        vat?: string
        cf?: string
        role?: string
      }
    }
    summary_it?: string
  }
  extraction: {
    dates?: {
      start_date?: string
      end_date?: string
      signing_date?: string
      notice_period_days?: number
    }
    value?: {
      total_value?: number
      currency?: string
      payment_terms_days?: number
      payment_method?: string
    }
    renewal?: {
      auto_renewal?: boolean
      renewal_notice_days?: number
      max_renewals?: number
      renewal_duration_months?: number
    }
    clauses: Array<{
      clause_type?: string
      title?: string
      summary_it?: string
      risk_level?: string
      risk_reason?: string
      original_text?: string
    }>
    obligations: Array<{
      description: string
      responsible_party?: string
      deadline?: string
      recurring?: boolean
      frequency?: string
    }>
    milestones: Array<{
      title?: string
      due_date?: string
      amount?: number
      description?: string
    }>
  }
  risk: {
    risk_score: number
    risk_label?: string
    dimensions?: Record<string, { score: number; note: string }>
    top_risks: Array<{ title: string; description: string; severity: string }>
    recommendations_it: string[]
  }
  counterpart_id?: string
  warnings?: string[]
}

export interface OSINTRequest {
  vat_number?: string
  fiscal_code?: string
  company_name?: string
  counterpart_id?: string
}

export interface OSINTResponse {
  vies: {
    valid: boolean | null
    country_code?: string
    vat_number?: string
    name?: string
    address?: string
    request_date?: string
    error?: string | null
  } | null
  fiscal_code: {
    valid: boolean
    checksum_ok: boolean
    extracted?: {
      surname_code: string
      name_code: string
      birth_year: string
      birth_month: number | null
      birth_day: number
      gender: string
      municipality_code: string
    } | null
    errors: string[]
  } | null
  anac: {
    checked: boolean
    annotations_found: boolean
    annotations: Array<{
      type: string
      date: string | null
      description: string
      reference: string
    }>
    error?: string | null
  } | null
  reliability: {
    score: number
    dimensions: {
      legal: number
      contributory: number
      reputation: number
      solidity: number
      consistency: number
    }
  }
}

export interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  company_id: string
}

export interface OCRRequest {
  image_base64: string
}

export interface OCRResponse {
  text: string
  confidence: string
}

// ─── Errors ─────────────────────────────────────────────────────────────────

export class NemoClawError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'NemoClawError'
  }
}

// ─── Client ─────────────────────────────────────────────────────────────────

function getBaseUrl(): string {
  return process.env.NEMOCLAW_API_URL ?? 'https://nemoclaw.pezserv.org'
}

async function nemoclawFetch<T>(
  path: string,
  body: unknown,
  authToken: string,
): Promise<T> {
  const url = `${getBaseUrl()}${path}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let message: string
    try {
      const err = await response.json() as { error?: string }
      message = err.error ?? `NemoClaw request failed (${response.status})`
    } catch {
      message = `NemoClaw request failed (${response.status})`
    }
    throw new NemoClawError(message, response.status)
  }

  return (await response.json()) as T
}

/** Analyze a contract document (classify → extract → risk score) */
export async function analyzeContract(
  request: AnalyzeRequest,
  authToken: string,
): Promise<AnalyzeResponse> {
  return nemoclawFetch<AnalyzeResponse>('/api/analyze', request, authToken)
}

/** Run OSINT verification on a counterpart */
export async function verifyOSINT(
  request: OSINTRequest,
  authToken: string,
): Promise<OSINTResponse> {
  return nemoclawFetch<OSINTResponse>('/api/osint', request, authToken)
}

/** Extract text from a document image via OCR */
export async function extractOCR(
  request: OCRRequest,
  authToken: string,
): Promise<OCRResponse> {
  return nemoclawFetch<OCRResponse>('/api/ocr', request, authToken)
}

/** Send a chat message and stream the response (SSE) */
export async function* streamChat(
  request: ChatRequest,
  authToken: string,
): AsyncGenerator<string> {
  const url = `${getBaseUrl()}/api/chat`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new NemoClawError(`Chat request failed (${response.status})`, response.status)
  }

  if (!response.body) {
    throw new NemoClawError('No response body for streaming')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue
        if (trimmed === 'data: [DONE]') return

        if (trimmed.startsWith('data: ')) {
          try {
            const chunk = JSON.parse(trimmed.slice(6)) as { content?: string }
            if (chunk.content) yield chunk.content
          } catch {
            // skip malformed chunk
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
