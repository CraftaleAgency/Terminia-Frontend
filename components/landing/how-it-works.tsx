"use client"

import { Upload, Cpu, BellRing } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { TimelineScroll, TimelineItem } from "@/components/ui/timeline-scroll"
import { motion } from "framer-motion"

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
      "Notifiche via email e Telegram 90, 60 e 30 giorni prima di ogni scadenza critica. Taciti rinnovi, pagamenti attesi, e nuovi bandi pubblici compatibili.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.18_220/0.08)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-3 text-sm text-primary uppercase tracking-widest font-medium mb-4">
              <span className="w-8 h-px bg-primary/60" aria-hidden />
              Come funziona
              <span className="w-8 h-px bg-primary/60" aria-hidden />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h2 className="text-balance text-3xl sm:text-4xl lg:text-4xl font-semibold text-foreground mb-4">
              Operativo in meno di un'ora
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mx-auto max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
              Tre passaggi essenziali. Nessuna configurazione complessa, nessun corso di formazione.
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline Steps */}
        <TimelineScroll className="space-y-12 md:space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isRight = index % 2 === 1

            return (
              <TimelineItem key={step.number} isRight={isRight}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card rounded-2xl p-6 border border-border/20 group hover:glass-card-hover hover:glow-teal-sm transition-all duration-300"
                >
                  <div className={`flex items-start gap-4 ${isRight ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors glow-blue-sm">
                      <Icon className="size-5 text-primary" aria-hidden />
                    </div>
                    <div className={isRight ? "" : "md:text-right"}>
                      <div className="text-sm text-primary/70 font-mono mb-1.5">{step.number}</div>
                      <h3 className="font-semibold text-foreground text-xl mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              </TimelineItem>
            )
          })}
        </TimelineScroll>
      </div>
    </section>
  )
}
