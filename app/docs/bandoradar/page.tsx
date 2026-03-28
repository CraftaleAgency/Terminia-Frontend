import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { CheckCircle, AlertTriangle, XCircle, FileSearch, Target, BarChart3, FileText, Clock, Zap, Globe, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BandoRadarDocsPage() {
  return (
    <article className="max-w-none">
      {/* Hero */}
      <ScrollReveal>
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
            <FileSearch className="size-4" />
            BandoRadar
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Matching Intelligente <span className="text-gradient">Bandi Pubblici</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Sistema automatico di analisi e matching per bandi di gara italiani ed europei,
            con scoring AI basato sul profilo aziendale.
          </p>
        </div>
      </ScrollReveal>

      {/* Come Funziona */}
      <ScrollReveal delay={0.1}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Zap className="size-6 text-primary" />
            Come Funziona
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="font-medium text-foreground mb-2">Sync Giornaliero</h4>
              <p className="text-sm text-muted-foreground">
                06:00 ANAC OpenData, 06:30 TED Europa. Download automatico nuovi bandi.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="font-medium text-foreground mb-2">AI Scoring</h4>
              <p className="text-sm text-muted-foreground">
                07:00 matching 5-dimensioni per ogni bando vs profilo aziendale.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="font-medium text-foreground mb-2">Alert Smart</h4>
              <p className="text-sm text-muted-foreground">
                Notifica immediata se match score {'>'} 80%. Badge visibile per 60-80%.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Fonti Dati */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Database className="size-6 text-primary" />
            Fonti Dati
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="size-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">ANAC OpenData</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tutti i bandi PA italiani sopra e sotto soglia
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-500">Download CSV</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Cron 06:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Database className="size-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">TED Europa</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Bandi EU sopra soglia comunitaria (150k+)
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-500">REST API</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Cron 06:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/docs/integrazioni"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Vedi dettaglio integrazioni
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Match Score */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <BarChart3 className="size-6 text-primary" />
            Match Score (5 Dimensioni)
          </h2>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Punteggio 0-100 calcolato su 5 dimensioni con pesi differenziati.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { name: "Sector", weight: 35, desc: "CPV↔ATECO mapping via inference", color: "purple" },
              { name: "Size", weight: 25, desc: "Contract value vs company revenue", color: "blue" },
              { name: "Geo", weight: 20, desc: "Geographic proximity (NUTS code)", color: "emerald" },
              { name: "Requirements", weight: 15, desc: "Technical vs capabilities", color: "amber" },
              { name: "Feasibility", weight: 5, desc: "Timeline, resources, RTI", color: "cyan" },
            ].map((dim) => (
              <div key={dim.name} className="glass-card rounded-lg p-4 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{dim.name}</span>
                  <span className="text-sm font-semibold text-primary">{dim.weight}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{dim.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">Soglie di Notifica</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-2xl font-bold text-emerald-500 mb-1">&gt; 80%</div>
              <p className="text-xs text-muted-foreground">Alert immediato</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-2xl font-bold text-amber-500 mb-1">60-80%</div>
              <p className="text-xs text-muted-foreground">Badge giallo</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/20 border border-border text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">40-60%</div>
              <p className="text-xs text-muted-foreground">Salvato, non notificato</p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">&lt; 40%</div>
              <p className="text-xs text-muted-foreground">Non salvato</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Gap Analysis */}
      <ScrollReveal delay={0.4}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Target className="size-6 text-primary" />
            Gap Analysis
          </h2>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Per ogni bando, analisi automatica dello stato di conformita aziendale.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="size-5 text-emerald-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">P.IVA attiva e regolare</span>
                <span className="text-xs text-emerald-500 ml-2">Verificato</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="size-5 text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">2 contratti analoghi richiesti</span>
                <span className="text-xs text-amber-500 ml-2">Hai 1</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle className="size-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">Certificazione ISO27001</span>
                <span className="text-xs text-red-500 ml-2">Non rilevata</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border">
              <Target className="size-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">Iscrizione albo fornitori</span>
                <span className="text-xs text-muted-foreground ml-2">Verifica manuale</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Checklist Partecipazione */}
      <ScrollReveal delay={0.5}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <FileText className="size-6 text-primary" />
            Documenti Richiesti
          </h2>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Checklist automatica con stima dei tempi di preparazione.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { doc: "DGUE", time: "Immediato", icon: CheckCircle },
              { doc: "Visura Camerale", time: "~3 gg", icon: Clock },
              { doc: "DURC", time: "~5 gg", icon: Clock },
              { doc: "Dich. Antimafia", time: "Immediato", icon: CheckCircle },
              { doc: "Offerta Tecnica", time: "3-5 gg", icon: FileText },
              { doc: "Offerta Economica", time: "~1 gg", icon: FileText },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.doc} className="glass-card rounded-lg p-4 border border-border/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.doc}</h4>
                    <p className="text-xs text-primary">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Link to Architecture */}
      <ScrollReveal delay={0.6}>
        <div className="glass-card rounded-xl p-6 border border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="size-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Architettura Tecnica</h3>
                <p className="text-sm text-muted-foreground">OpenClaw Skills: bandi-sync-anac, bandi-sync-ted, bandi-match</p>
              </div>
            </div>
            <Link
              href="/docs/architettura"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Vedi dettaglio
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </article>
  )
}
