// ─── NemoClaw API Client ────────────────────────────────────────────────────
// Calls nemoclaw.pezserv.org REST API from Server Actions.
// Handles contract analysis, OSINT, chat (streaming), and OCR.

import type { INemoClawClient } from '@/lib/interfaces'
import type {
  AnalyzeContractRequest, AnalyzeContractResponse,
  VerifyOSINTRequest, VerifyOSINTResponse,
  ChatRequest, ChatResponse,
  OCRRequest, OCRResponse,
} from '@/types/terminia'

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

export class NemoClawClient implements INemoClawClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? process.env.NEMOCLAW_API_URL ?? 'https://nemoclaw.pezserv.org'
  }

  private async fetch<T>(path: string, body: unknown, authToken: string): Promise<T> {
    const url = `${this.baseUrl}${path}`

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
  async analyzeContract(
    request: AnalyzeContractRequest,
    authToken: string,
  ): Promise<AnalyzeContractResponse> {
    return this.fetch('/api/analyze', request, authToken)
  }

  /** Run OSINT verification on a counterpart */
  async verifyOSINT(
    request: VerifyOSINTRequest,
    authToken: string,
  ): Promise<VerifyOSINTResponse> {
    return this.fetch('/api/osint', request, authToken)
  }

  /** Send a chat message (non-streaming) */
  async sendChat(
    request: ChatRequest,
    authToken: string,
  ): Promise<ChatResponse> {
    return this.fetch('/api/chat', { ...request, stream: false }, authToken)
  }

  /** Send a chat message and stream the response (SSE) */
  async *streamChat(
    request: ChatRequest,
    authToken: string,
  ): AsyncGenerator<string> {
    const url = `${this.baseUrl}/api/chat`

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

  /** Extract text from a document image via OCR */
  async extractOCR(
    request: OCRRequest,
    authToken: string,
  ): Promise<OCRResponse> {
    return this.fetch('/api/ocr', request, authToken)
  }
}

// Singleton for server-side use
export const nemoclawClient = new NemoClawClient()
