// ─── OpenAI-compatible client for LiteLLM proxy ────────────────────────────
// Supports both streaming and non-streaming inference via native fetch.

// ─── Available Models ───────────────────────────────────────────────────────

export const AI_MODELS = {
  /** Primary analysis model (default) */
  'nemotron-orchestrator': 'nemotron-orchestrator',
  /** Fast / cheap model */
  'nemotron-nano': 'nemotron-nano',
  /** OCR model — supports image input */
  'numarkdown': 'numarkdown',
  /** Alias for numarkdown */
  'ocr': 'numarkdown',
} as const

export type AIModel = keyof typeof AI_MODELS

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | ContentPart[]
}

export interface ChatCompletionOptions {
  /** Model name — default: 'nemotron-orchestrator' */
  model?: string
  messages: ChatMessage[]
  /** Sampling temperature — default: 0.3 */
  temperature?: number
  /** Max tokens to generate — default: 4096 */
  max_tokens?: number
  /** Enable streaming — default: false */
  stream?: boolean
  response_format?: { type: 'json_object' } | { type: 'text' }
}

export interface ChatCompletionResponse {
  id: string
  choices: Array<{
    message: { role: string; content: string }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ─── Errors ─────────────────────────────────────────────────────────────────

export class AIClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'AIClientError'
  }
}

export class AIRateLimitError extends AIClientError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
  ) {
    super(message, 429, 'rate_limit')
    this.name = 'AIRateLimitError'
  }
}

export class AIAuthError extends AIClientError {
  constructor(message: string) {
    super(message, 401, 'auth_error')
    this.name = 'AIAuthError'
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getBaseUrl(): string {
  return process.env.LITELLM_API_URL ?? 'https://ai.pezserv.org'
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const apiKey = process.env.LITELLM_API_KEY
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  return headers
}

function resolveModel(model?: string): string {
  if (!model) return AI_MODELS['nemotron-orchestrator']
  return (AI_MODELS as Record<string, string>)[model] ?? model
}

function buildRequestBody(options: ChatCompletionOptions) {
  return {
    model: resolveModel(options.model),
    messages: options.messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.max_tokens ?? 4096,
    stream: options.stream ?? false,
    ...(options.response_format ? { response_format: options.response_format } : {}),
  }
}

async function handleErrorResponse(response: Response): Promise<never> {
  let body: string
  try {
    body = await response.text()
  } catch {
    body = ''
  }

  let parsed: { error?: { message?: string; code?: string } } | undefined
  try {
    parsed = JSON.parse(body)
  } catch {
    // not JSON
  }

  const message =
    parsed?.error?.message ?? body || `LiteLLM request failed with status ${response.status}`

  if (response.status === 401 || response.status === 403) {
    throw new AIAuthError(message)
  }
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after')) || undefined
    throw new AIRateLimitError(message, retryAfter)
  }
  throw new AIClientError(message, response.status, parsed?.error?.code)
}

// ─── Non-streaming completion ───────────────────────────────────────────────

export async function chatCompletion(
  options: ChatCompletionOptions,
): Promise<ChatCompletionResponse> {
  const url = `${getBaseUrl()}/v1/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(buildRequestBody({ ...options, stream: false })),
  })

  if (!response.ok) {
    await handleErrorResponse(response)
  }

  const data = (await response.json()) as ChatCompletionResponse
  return data
}

// ─── Streaming completion ───────────────────────────────────────────────────

export async function* chatCompletionStream(
  options: ChatCompletionOptions,
): AsyncGenerator<string> {
  const url = `${getBaseUrl()}/v1/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(buildRequestBody({ ...options, stream: true })),
  })

  if (!response.ok) {
    await handleErrorResponse(response)
  }

  if (!response.body) {
    throw new AIClientError('Response body is null — streaming not supported', undefined, 'no_body')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Parse SSE lines
      const lines = buffer.split('\n')
      // Keep the last (possibly incomplete) line in the buffer
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue // skip empty / comments
        if (trimmed === 'data: [DONE]') return

        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6)
          try {
            const chunk = JSON.parse(jsonStr) as {
              choices?: Array<{ delta?: { content?: string } }>
            }
            const token = chunk.choices?.[0]?.delta?.content
            if (token) {
              yield token
            }
          } catch {
            // Malformed JSON chunk — skip
          }
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim() && buffer.trim() !== 'data: [DONE]') {
      const trimmed = buffer.trim()
      if (trimmed.startsWith('data: ')) {
        try {
          const chunk = JSON.parse(trimmed.slice(6)) as {
            choices?: Array<{ delta?: { content?: string } }>
          }
          const token = chunk.choices?.[0]?.delta?.content
          if (token) yield token
        } catch {
          // ignore
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// ─── JSON extraction helper ─────────────────────────────────────────────────

/**
 * Extracts and parses JSON from a chat completion response.
 * Handles cases where the model wraps JSON in markdown code fences.
 */
export function extractJSON<T>(response: ChatCompletionResponse): T {
  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new AIClientError('Empty response content', undefined, 'empty_content')
  }

  let jsonStr = content.trim()

  // Strip markdown code fences if present
  const fenceMatch = jsonStr.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/)
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim()
  }

  try {
    return JSON.parse(jsonStr) as T
  } catch (e) {
    throw new AIClientError(
      `Failed to parse JSON from AI response: ${(e as Error).message}`,
      undefined,
      'json_parse_error',
    )
  }
}
