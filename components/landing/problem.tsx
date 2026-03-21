import { AlertTriangle, FolderOpen, Clock, TrendingDown } from "lucide-react"

const pains = [
  {
    icon: FolderOpen,
    title: "Contratti dispersi ovunque",
    description: "PDF in cartelle Drive disorganizzate, allegati via email dimenticati, nessuna visione centralizzata del portfolio.",
  },
  {
    icon: Clock,
    title: "Rinnovi taciti non rilevati",
    description: "I contratti si rinnovano automaticamente senza che nessuno lo sappia, generando costi non preventivati.",
  },
  {
    icon: AlertTriangle,
    title: "Penali e clausole rischiose ignorate",
    description: "Clausole penali, SLA e obblighi contrattuali vengono scoperti solo quando è già troppo tardi.",
  },
  {
    icon: TrendingDown,
    title: "Bandi pubblici persi",
    description: "Opportunità di business come appalti ANAC e bandi europei compatibili con la tua azienda passano inosservati.",
  },
]

export function Problem() {
  return (
    <section className="py-24 px-6 relative">
      {/* Top divider glow */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/40 to-transparent" />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-medium mb-4">
            <span className="w-8 h-px bg-primary/60" aria-hidden />
            Il problema
            <span className="w-8 h-px bg-primary/60" aria-hidden />
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-semibold text-foreground mb-4 leading-tight">
            Ogni anno le PMI italiane perdono il{" "}
            <span className="text-gradient">9% del fatturato</span>
            <br className="hidden sm:block" />
            {" "}per contratti non gestiti
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-base leading-relaxed">
            Rinnovi non voluti, pagamenti non tracciati, penali non rilevate e opportunità mancate.
            È il costo invisibile di una gestione contrattuale improvvisata.
          </p>
        </div>

        {/* Pain cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {pains.map((pain) => {
            const Icon = pain.icon
            return (
              <div
                key={pain.title}
                className="glass-card rounded-2xl p-6 group hover:glass-card-hover transition-all duration-300 border border-border/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Icon className="size-5 text-primary" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1.5">{pain.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pain.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quote block */}
        <blockquote className="mt-10 glass-card rounded-2xl p-6 border border-primary/20 text-center">
          <p className="text-muted-foreground italic leading-relaxed">
            &ldquo;Abbiamo scoperto un tacito rinnovo da €18.000 solo tre giorni prima della scadenza.
            Con ContractOS lo avremmo visto 90 giorni prima.&rdquo;
          </p>
          <footer className="mt-3 text-sm text-primary font-medium">
            — Direttore Operativo, PMI manifatturiera italiana
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
