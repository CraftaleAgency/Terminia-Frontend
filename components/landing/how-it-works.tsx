import { Upload, Cpu, BellRing } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Carica i tuoi contratti",
    description:
      "Importa PDF e DOCX direttamente dalla tua cartella Drive o dal tuo computer. Contratti di fornitura, clienti, dipendenti: tutto in un unico posto.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "L'AI estrae tutto automaticamente",
    description:
      "Il motore AI legge ogni documento e struttura scadenze, parti coinvolte, obblighi, clausole rischiose e milestone di pagamento. Zero inserimento manuale.",
  },
  {
    number: "03",
    icon: BellRing,
    title: "Ricevi alert preventivi",
    description:
      "Notifiche via email e Slack 90, 60 e 30 giorni prima di ogni scadenza critica. Taciti rinnovi, pagamenti attesi, e nuovi bandi pubblici compatibili.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.18_220/0.06)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-medium mb-4">
            <span className="w-8 h-px bg-primary/60" aria-hidden />
            Come funziona
            <span className="w-8 h-px bg-primary/60" aria-hidden />
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Operativo in meno di un'ora
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-base leading-relaxed">
            Tre passaggi essenziali. Nessuna configurazione complessa, nessun corso di formazione.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent -translate-x-1/2"
          />

          <div className="grid gap-6 lg:gap-0">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isRight = index % 2 === 1

              return (
                <div
                  key={step.number}
                  className={`lg:flex ${isRight ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isRight ? "lg:text-right" : ""}`}>
                    <div className="glass-card rounded-2xl p-6 border border-border/20 group hover:glass-card-hover transition-all duration-300">
                      <div className={`flex items-start gap-4 ${isRight ? "lg:flex-row-reverse" : ""}`}>
                        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                          <Icon className="size-5 text-primary" aria-hidden />
                        </div>
                        <div className={isRight ? "lg:text-right" : ""}>
                          <div className="text-xs text-primary/60 font-mono mb-1">{step.number}</div>
                          <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden lg:flex flex-shrink-0 w-10 items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-background ring-2 ring-primary/30" aria-hidden />
                  </div>

                  {/* Spacer */}
                  <div className="hidden lg:block flex-1" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
