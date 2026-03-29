import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Proxy SSE streaming from the browser to the internal NemoClaw API.
 * The browser can't reach http://terminia-api:3100 directly, so it hits
 * this Next.js route which forwards the request server-side.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token
  if (!token) {
    return new Response(JSON.stringify({ error: 'Sessione scaduta' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const baseUrl = process.env.NEMOCLAW_API_URL ?? 'https://nemoclaw.pezserv.org'

  let upstream: Response
  try {
    upstream = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return new Response(
      `data: ${JSON.stringify({ error: 'Servizio AI non raggiungibile' })}\n\ndata: [DONE]\n\n`,
      { status: 502, headers: { 'Content-Type': 'text/event-stream' } },
    )
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(
      `data: ${JSON.stringify({ error: `Errore AI (${upstream.status})` })}\n\ndata: [DONE]\n\n`,
      { status: upstream.status, headers: { 'Content-Type': 'text/event-stream' } },
    )
  }

  // Stream the SSE response back to the browser
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
