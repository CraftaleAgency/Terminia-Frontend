import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.delete({ name, ...options })
        },
      },
    }
  )

  // Handle auth callback - exchange code for session
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
      // Redirect to dashboard after successful auth, removing the code from URL
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } catch (error) {
      console.error('Error exchanging code for session:', error)
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteggi le route della dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Se l'utente è loggato e cerca di accedere a login/register, redirect alla dashboard
  if ((req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/register')) && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/register', '/'],
}
