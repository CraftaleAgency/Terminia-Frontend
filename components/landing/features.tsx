import {
  Brain,
  Bell,
  ShieldCheck,
  Users,
  BarChart3,
  FileText,
  MessageSquare,
  GitBranch,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Estrazione AI",
    description: "Il modello AI analizza ogni clausola e struttura automaticamente tutti i dati rilevanti: parti, obblighi, scadenze, valore.",
    size: "large",
  },
  {
    icon: Bell,
    title: "Alert Preventivi",
    description: "Ricevi notifiche via email e Slack 90, 60 e 30 giorni prima di ogni evento critico.",
    size: "small",
  },
  {
    icon: ShieldCheck,
    title: "Risk Score",
    description: "Ogni contratto riceve un punteggio di rischio basato sull'analisi delle clausole critiche.",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Cashflow Proiettato",
    description: "Visualizza i pagamenti attesi nei prossimi 6-12 mesi costruiti dalle milestone estratte automaticamente.",
    size: "large",
  },
  {
    icon: MessageSquare,
    title: "Chatbot Contrattuale",
    description: "Fai domande in italiano su qualsiasi contratto: il sistema risponde attingendo direttamente al documento.",
    size: "small",
  },
  {
    icon: GitBranch,
    title: "Versioning Documenti",
    description: "Tieni traccia di ogni modifica con diff semantico tra versioni del documento.",
    size: "small",
  },
  {
    icon: Users,
    title: "Gestione Dipendenti",
    description: "CCNL, contratti a termine D.Lgs 81/2015, lettere HR generate automaticamente.",
    size: "small",
  },
  {
    icon: FileText,
    title: "Compliance Italiana",
    description: "Costruito sulla normativa italiana: CCNL, fatturazione elettronica PA, foro competente.",
    size: "small",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-1/3 w-80 h-80 rounded-full bg-[radial-gradient(circle,oklch(0.65_0.15_200/0.07)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-medium mb-4">
            <span className="w-8 h-px bg-primary/60" aria-hidden />
            Funzionalità
            <span className="w-8 h-px bg-primary/60" aria-hidden />
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Tutto ciò che serve per gestire i contratti
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-base leading-relaxed">
            Un sistema completo pensato per la realtà operativa delle PMI italiane.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Row 1: large + small + small */}
          <FeatureCard feature={features[0]} className="sm:col-span-2 lg:col-span-2" />
          <FeatureCard feature={features[1]} />

          {/* Row 2: small + large */}
          <FeatureCard feature={features[2]} />
          <FeatureCard feature={features[3]} className="sm:col-span-1 lg:col-span-2" />

          {/* Row 3: all smalls */}
          <FeatureCard feature={features[4]} />
          <FeatureCard feature={features[5]} />
          <FeatureCard feature={features[6]} />
          <FeatureCard feature={features[7]} />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  className = "",
}: {
  feature: (typeof features)[0]
  className?: string
}) {
  const Icon = feature.icon
  return (
    <div
      className={`glass-card rounded-2xl p-6 border border-border/20 group hover:glass-card-hover transition-all duration-300 flex flex-col gap-4 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors flex-shrink-0">
        <Icon className="size-5 text-primary" aria-hidden />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </div>
  )
}
