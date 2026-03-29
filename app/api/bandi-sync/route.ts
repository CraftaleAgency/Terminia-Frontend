import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const NEMOCLAW_URL = process.env.NEMOCLAW_API_URL || 'http://terminia-api:3100'

/**
 * POST /api/bandi-sync
 * Proxies the SSE bandi sync request to NemoClaw API.
 * Returns an SSE stream with progress events.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401 })
  }

  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token
  if (!token) {
    return new Response(JSON.stringify({ error: 'Sessione scaduta' }), { status: 401 })
  }

  // Get company_id
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.company_id) {
    return new Response(JSON.stringify({ error: 'Nessuna azienda associata' }), { status: 400 })
  }

  const body = await req.json().catch(() => ({}))

  // Proxy SSE to NemoClaw
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 300_000) // 5min timeout

  try {
    const upstream = await fetch(`${NEMOCLAW_URL}/api/bandi/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company_id: userData.company_id,
        ...body,
      }),
      signal: controller.signal,
    })

    if (!upstream.ok) {
      const err = await upstream.text()
      return new Response(err, { status: upstream.status })
    }

    // Pipe the SSE stream through
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 502 },
    )
  } finally {
    clearTimeout(timer)
  }
}
