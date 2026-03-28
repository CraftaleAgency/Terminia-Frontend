import { ScrollReveal, StaggerContainer } from "@/components/ui/scroll-reveal"
import {
  Globe,
  Database,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  Key,
  Download,
  Code,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

interface Integration {
  id: string
  name: string
  description: string
  cost: "free" | "paid"
  accessType: string
  accessTypeLabel: string
  difficulty: "low" | "medium" | "high"
  icon: React.ElementType
  color: string
}

const integrations: Integration[] = [
  {
    id: "anac-opendata",
    name: "ANAC OpenData",
    description: "Bandi di gara pubblicati dall'ANAC (Autorita Nazionale Anticorruzione). Contiene tutti i bandi italiani sopra e sotto soglia.",
    cost: "free",
    accessType: "download",
    accessTypeLabel: "Download CSV/JSON",
    difficulty: "high",
    icon: Database,
    color: "blue",
  },
  {
    id: "ted-europa",
    name: "TED Europa API",
    description: "Tenders Electronic Daily - Bandi di gara europei sopra soglia comunitaria. Fonte ufficiale per tutte le gare EU.",
    cost: "free",
    accessType: "api",
    accessTypeLabel: "REST API",
    difficulty: "high",
    icon: Globe,
    color: "emerald",
  },
  {
    id: "viesac",
    name: "VIESAC",
    description: "Vies Information Exchange System - Verifica Partita IVA europea per controlli automatizzati su fornitori comunitari.",
    cost: "free",
    accessType: "api-key",
    accessTypeLabel: "REST API + Key",
    difficulty: "high",
    icon: Shield,
    color: "purple",
  },
  {
    id: "verifica-cf",
    name: "Verifica Codice Fiscale",
    description: "Algoritmo di validazione del Codice Fiscale italiano. Calcolo automatico del carattere di controllo e verifica formale.",
    cost: "free",
    accessType: "local",
    accessTypeLabel: "Algoritmo Locale",
    difficulty: "medium",
    icon: FileText,
    color: "cyan",
  },
  {
    id: "anac-casellario",
    name: "ANAC Casellario",
    description: "Casellario informatico dei fornitori - verifica annotazioni, sospensioni e condanne amministrative su fornitori.",
    cost: "free",
    accessType: "scraping",
    accessTypeLabel: "Scraping",
    difficulty: "medium",
    icon: AlertTriangle,
    color: "amber",
  },
]

const getAccessIcon = (type: string) => {
  switch (type) {
    case "download":
      return Download
    case "api":
      return Code
    case "api-key":
      return Key
    case "local":
      return Zap
    case "scraping":
      return Globe
    default:
      return Code
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "low":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    case "medium":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    case "high":
      return "text-red-500 bg-red-500/10 border-red-500/20"
    default:
      return "text-muted-foreground bg-muted/20"
  }
}

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "low":
      return "Bassa"
    case "medium":
      return "Media"
    case "high":
      return "Alta"
    default:
      return difficulty
  }
}

const getCostIcon = (cost: string) => {
  return cost === "free" ? CheckCircle : AlertCircle
}

const getCostLabel = (cost: string) => {
  return cost === "free" ? "Gratuito" : "A pagamento"
}

const getCostColor = (cost: string) => {
  return cost === "free" ? "text-emerald-500" : "text-amber-500"
}

export default function IntegrazioniPage() {
  return (
    <article className="max-w-none">
      {/* Hero section */}
      <ScrollReveal>
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
            <Zap className="size-4" />
            Mappa delle Integrazioni
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Integrazioni <span className="text-gradient">TerminIA</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            TerminIA si integra con le principali fonti dati pubbliche italiane ed europee
            per offrire una visione completa e sempre aggiornata delle opportunita di gara
            e della affidabilita delle controparti.
          </p>
        </div>
      </ScrollReveal>

      {/* Stats overview */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card rounded-xl p-5 border border-border/30 text-center">
            <div className="text-3xl font-bold text-primary mb-1">{integrations.length}</div>
            <div className="text-sm text-muted-foreground">Integrazioni Attive</div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-border/30 text-center">
            <div className="text-3xl font-bold text-emerald-500 mb-1">
              {integrations.filter(i => i.cost === "free").length}
            </div>
            <div className="text-sm text-muted-foreground">Gratuite</div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-border/30 text-center">
            <div className="text-3xl font-bold text-amber-500 mb-1">
              {integrations.filter(i => i.difficulty === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">Difficolta Alta</div>
          </div>
          <div className="glass-card rounded-xl p-5 border border-border/30 text-center">
            <div className="text-3xl font-bold text-cyan-500 mb-1">24h</div>
            <div className="text-sm text-muted-foreground">Frequenza Aggiornamento</div>
          </div>
        </div>
      </ScrollReveal>

      {/* Integrations grid */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Globe className="size-6 text-primary" />
            Integrazioni Disponibili
          </h2>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon
              const AccessIcon = getAccessIcon(integration.accessType)
              const CostIcon = getCostIcon(integration.cost)

              return (
                <div
                  key={integration.id}
                  className="glass-card rounded-2xl p-6 border border-border/40 hover:border-primary/40 hover:glow-teal-sm transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0
                      ${integration.color === "blue" ? "bg-blue-500/10 text-blue-500" : ""}
                      ${integration.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : ""}
                      ${integration.color === "purple" ? "bg-purple-500/10 text-purple-500" : ""}
                      ${integration.color === "cyan" ? "bg-cyan-500/10 text-cyan-500" : ""}
                      ${integration.color === "amber" ? "bg-amber-500/10 text-amber-500" : ""}
                    `}>
                      <Icon className="size-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {integration.description}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Cost badge */}
                    <div className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
                      ${getCostColor(integration.cost)} bg-opacity-10 border-current
                    `}>
                      <CostIcon className="size-3.5" />
                      {getCostLabel(integration.cost)}
                    </div>

                    {/* Access type badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-muted/30 text-muted-foreground">
                      <AccessIcon className="size-3.5" />
                      {integration.accessTypeLabel}
                    </div>

                    {/* Difficulty badge */}
                    <div className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
                      ${getDifficultyColor(integration.difficulty)}
                    `}>
                      <AlertCircle className="size-3.5" />
                      Difficolta: {getDifficultyLabel(integration.difficulty)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="pt-4 border-t border-border/30">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Tipo Accesso:</span>
                        <span className="ml-2 text-foreground font-medium">{integration.accessTypeLabel}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Costo:</span>
                        <span className={`ml-2 font-medium ${getCostColor(integration.cost)}`}>
                          {getCostLabel(integration.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </StaggerContainer>
        </div>
      </ScrollReveal>

      {/* How integration works */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <Code className="size-6 text-primary" />
            Come Funziona l'Integrazione
          </h2>

          <div className="glass-card rounded-2xl p-8 border border-border/30">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                  01
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Configurazione</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Imposta le integrazioni desiderate dal pannello di configurazione.
                    Alcune richiedono chiavi API, altre usano algoritmi locali.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                  02
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Sincronizzazione</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I dati vengono sincronizzati automaticamente ogni 24h o in tempo reale
                    in base alla fonte. Le API vengono chiamate secondo i limiti rate.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                  03
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Utilizzo</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I dati integrati alimentano BandoRadar, Advisor OSINT e tutti i moduli
                    che richiedono informazioni esterne aggiornate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* API Access info */}
      <ScrollReveal delay={0.4}>
        <div className="glass-card rounded-2xl p-8 border border-primary/20 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
              <Key className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">API Access (Enterprise)</h3>
              <p className="text-muted-foreground mb-4 max-w-2xl">
                Hai bisogno di accedere direttamente alle integrazioni tramite API REST?
                Il piano Enterprise offre endpoint dedicati per integrazioni custom con i tuoi sistemi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Documentazione Tecnica
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors text-foreground font-medium"
                >
                  Contatta Sales
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Technical details */}
      <ScrollReveal delay={0.5}>
        <div className="mt-12 glass-card rounded-xl p-6 border border-border/30 font-mono text-sm overflow-x-auto">
          <pre className="text-muted-foreground whitespace-pre">
{`supabase/functions/
  integrations/
    index.ts          <- Edge Function per orchestrazione
          |
          ├── fetch_anac_bandi()      # Download CSV/JSON ANAC
          ├── fetch_ted_europa()      # REST API TED Europa
          ├── verify_vat_vies()       # SOAP API VIESAC
          ├── validate_codice_fiscale() # Algoritmo locale
          └── scrape_anac_casellario() # Web scraping ANCL

Database schema:
  integrations_config    # Configurazioni e API keys
  integrations_logs      # Log chiamate e errori
  integrations_sync      # Timestamp ultimi sync`}
          </pre>
        </div>
      </ScrollReveal>
    </article>
  )
}
