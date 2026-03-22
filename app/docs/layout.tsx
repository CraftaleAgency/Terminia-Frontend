import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft } from "lucide-react"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 glass-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/terminia-logo.png"
                  alt="TerminIA"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <span className="font-bold text-xl text-gradient">TerminIA</span>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">Documentazione</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-4" />
                Torna al sito
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-3">Introduzione</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Panoramica
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-3">Moduli</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/docs/bandoradar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      BandoRadar
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs/advisor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Advisor OSINT
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-3">Tecnico</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/docs/database" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Schema Database
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
