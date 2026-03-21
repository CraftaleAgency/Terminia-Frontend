import { Radar, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react"

const mockBandi = [
  {
    title: "Bando Digitalizzazione PMI — Invitalia",
    source: "Invitalia",
    budget: "€ 150.000",
    deadline: "30 apr 2025",
    score: 87,
    status: "Alto match",
  },
  {
    title: "Appalto Servizi IT — Comune di Milano",
    source: "ANAC",
    budget: "€ 85.000",
    deadline: "15 mag 2025",
    score: 74,
    status: "Buon match",
  },
  {
    title: "Programma COSME — TED Europa",
    source: "TED Europa",
    budget: "€ 230.000",
    deadline: "20 giu 2025",
    score: 61,
    status: "Match parziale",
  },
]

const sources = ["ANAC", "TED Europa", "Invitalia", "MIMIT", "Portali Regionali"]

export function BandoRadar() {
  return (
    <section id="bandoradar" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.18_220/0.08)_0%,transparent_70%)]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: content */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-medium mb-6">
              <Radar className="size-3.5 text-primary" aria-hidden />
              BandoRadar
            </div>
            <h2 className="text-balance text-3xl sm:text-4xl font-semibold text-foreground mb-5 leading-tight">
              Scopri i bandi pubblici{" "}
              <span className="text-gradient">su misura per la tua azienda</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              L&apos;agente AI costruisce automaticamente il profilo della tua azienda dai contratti caricati
              — settore, fatturato, area geografica, certificazioni — e lo usa per trovare ogni giorno
              i bandi pubblici più compatibili.
            </p>

            {/* Source pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {sources.map((source) => (
                <span
                  key={source}
                  className="glass-card text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border/20"
                >
                  {source}
                </span>
              ))}
            </div>

            {/* Benefits */}
            <ul className="space-y-3">
              {[
                "Match score 0–100 basato sul tuo profilo reale",
                "Gap analysis automatica dei requisiti mancanti",
                "Checklist documenti con stima dei tempi",
                "Alert scadenza sui bandi salvati",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: mock bandi cards */}
          <div className="space-y-3">
            {mockBandi.map((bando, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 border border-border/20 group hover:glass-card-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate mb-1">{bando.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{bando.source}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">Budget: {bando.budget}</span>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                </div>

                <div className="flex items-center gap-3">
                  {/* Match score bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Match score</span>
                      <span className="text-xs font-semibold text-primary">{bando.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${bando.score}%` }}
                        role="progressbar"
                        aria-valuenow={bando.score}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Match score: ${bando.score}%`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="size-3" aria-hidden />
                    <span>{bando.deadline}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="glass-card rounded-2xl p-4 border border-primary/20 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                <span className="text-primary font-medium">+24 bandi</span> compatibili trovati questa settimana
              </p>
              <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                Vedi tutti i bandi →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
