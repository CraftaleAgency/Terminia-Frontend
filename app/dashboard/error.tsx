'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-xl font-semibold text-destructive">Errore nel caricamento</h2>
        <p className="text-muted-foreground max-w-md">
          {error.message || 'Non è stato possibile caricare questa sezione.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Riprova
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
          >
            Torna alla Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
