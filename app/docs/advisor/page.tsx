import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Shield, Search, CheckCircle, AlertTriangle, XCircle, ArrowRight, FileText, Globe, Database } from "lucide-react"
import Link from "next/link"

export default function AdvisorDocsPage() {
  return (
    <article className="max-w-none">
      {/* Hero */}
      <ScrollReveal>
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
            <Shield className="size-4" />
            Advisor OSINT
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Verifica Affidabilita <span className="text-gradient">Controparti</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Sistema automatico di verifica OSINT multi-fonte per calcolare il reliability score
            di clienti, fornitori e partner commerciali.
          </p>
        </div>
      </ScrollReveal>

      {/* Overview */}
      <ScrollReveal delay={0.1}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Search className="size-6 text-primary" />
            Come Funziona
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="font-medium text-foreground mb-2">Estrazione Identificativi</h4>
              <p className="text-sm text-muted-foreground">
                P.IVA e Codice Fiscale estratti automaticamente dal contratto durante l'analisi.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="font-medium text-foreground mb-2">Verifica Multi-Fonte</h4>
              <p className="text-sm text-muted-foreground">
                Query parallela a VIES Europa, ANAC Casellario e algoritmo validazione CF locale.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-primary/15 text-primary font-bold text-sm flex-center mb-4">
                03
              </div>
              <h4 className="font-medium text-foreground mb-2">Reliability Score</h4>
              <p className="text-sm text-muted-foreground">
                Calcolo score 0-100 su 5 dimensioni con label di affidabilita automatica.
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
            Fonti Dati Verificate
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Globe className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">VIES Europa</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Verifica Partita IVA europea comunitaria
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-500">Cache 30gg</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">REST API</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <Shield className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">ANAC Casellario</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Annotazioni, esclusioni, interdizioni fornitori
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-500">Cache 7gg</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Scraping</span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/30">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <FileText className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Codice Fiscale</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Validazione algoritmo locale (GDPR compliant)
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-500">Locale</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">No dati esterni</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
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

      {/* Reliability Score */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Shield className="size-6 text-primary" />
            Reliability Score
          </h2>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Punteggio 0-100 calcolato su 5 dimensioni con pesi differenziati.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { name: "Legal", weight: 30, desc: "ANAC Casellario (annotations, exclusions)", color: "purple" },
              { name: "Contributory", weight: 20, desc: "VIES (VAT active, address verified)", color: "blue" },
              { name: "Reputation", weight: 20, desc: "ANAC history + inference analysis", color: "emerald" },
              { name: "Solidity", weight: 20, desc: "Financial indicators (when available)", color: "amber" },
              { name: "Consistency", weight: 10, desc: "CF validation + data cross-checks", color: "cyan" },
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

          <h3 className="text-lg font-semibold text-foreground mb-4">Label di Affidabilita</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="size-5 text-emerald-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">Excellent</div>
                <div className="text-xs text-muted-foreground">80-100</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <CheckCircle className="size-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">Good</div>
                <div className="text-xs text-muted-foreground">60-79</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="size-5 text-amber-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">Warning</div>
                <div className="text-xs text-muted-foreground">40-59</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle className="size-5 text-red-500 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">Risk</div>
                <div className="text-xs text-muted-foreground">0-39</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Verification JSON */}
      <ScrollReveal delay={0.4}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <FileText className="size-6 text-primary" />
            Risultato Verifica
          </h2>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Per ogni controparte, il sistema genera un JSON strutturato con i risultati delle verifiche.
          </p>

          <div className="glass-card rounded-xl p-6 border border-border/30 font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground">{`{
  "vat_valid": true,
  "vat_details": {
    "name": "Mario Rossi S.r.l.",
    "address": "Via Roma 123, 20100 Milano (MI)",
    "request_date": "2026-03-22"
  },
  "cf_valid": true,
  "cf_details": {
    "checksum": "X",
    "method": "local_algorithm"
  },
  "anac_annotations": [],
  "anac_checked_at": "2026-03-22T10:30:00Z",
  "reliability_score": 85,
  "reliability_label": "excellent"
}`}</pre>
          </div>
        </div>
      </ScrollReveal>

      {/* Alert Automatici */}
      <ScrollReveal delay={0.5}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="size-6 text-primary" />
            Alert Automatici
          </h2>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            Il sistema genera notifiche immediate quando vengono rilevate criticita.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "P.IVA non valida o cessata",
              "Nuova annotazione ANAC",
              "Codice Fiscale non conforme",
              "Score scende sotto soglia 40",
              "Indirizzo non coerente",
              "Cache scaduta con errori",
            ].map((alert) => (
              <div key={alert} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <AlertTriangle className="size-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-foreground">{alert}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* GDPR */}
      <ScrollReveal delay={0.6}>
        <div className="glass-card rounded-xl p-6 border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Shield className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">GDPR Compliance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>osint-cf</strong> usa puramente computazione locale - nessun dato personale esce dal sandbox.
                Le verifiche su aziende (business data) non rientrano nel perimetro GDPR personale.
                Cache con TTL configurabili per refresh periodico dei dati.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.7}>
        <div className="mt-12 glass-card rounded-2xl p-8 border border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
              <Shield className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">Architettura Tecnica</h3>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                Scopri come l'Advisor OSINT e implementato tramite OpenClaw Skills in ambiente sandbox NemoClaw.
              </p>
              <Link
                href="/docs/architettura"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Vedi Architettura Agenti
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </article>
  )
}
