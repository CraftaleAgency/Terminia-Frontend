// Runtime environment validation — import in layout.tsx or middleware.ts

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  nemoclawApiUrl: process.env.NEMOCLAW_API_URL ?? 'https://nemoclaw.pezserv.org',
} as const
