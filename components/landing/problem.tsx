"use client"

import { AlertTriangle, FolderOpen, Clock, TrendingDown } from "lucide-react"
import { ScrollReveal, StaggerContainer } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"

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
    <section className="py-32 px-6 relative">
      {/* Background effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.10_195/0.05)_0%,transparent_60%)]" />
        <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.12_180/0.04)_0%,transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-3 text-sm text-primary uppercase tracking-widest font-medium mb-6">
              <span className="w-10 h-px bg-primary/60" aria-hidden />
              Il problema
              <span className="w-10 h-px bg-primary/60" aria-hidden />
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <h2 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
              I costi invisibili di una{" "}
              <span className="text-gradient">gestione improvvisata</span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
              Rinnovi non voluti, pagamenti non tracciati, penali non rilevate e opportunità mancate.
              È il costo invisibile di una gestione contrattuale improvvisata.
            </p>
          </ScrollReveal>
        </div>

        {/* Pain cards - Bento Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {pains.map((pain, index) => {
            const Icon = pain.icon
            return (
              <ScrollReveal key={pain.title} delay={0.1 * index} direction={index % 2 === 0 ? "left" : "right"}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card rounded-3xl p-8 group hover:glass-card-hover transition-all duration-300 border border-border/20 h-full hover:glow-teal-sm"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Icon className="size-6 text-primary" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-xl mb-2">{pain.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{pain.description}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Quote block */}
        <ScrollReveal delay={0.5}>
          <motion.blockquote
            whileHover={{ scale: 1.01 }}
            className="mt-12 glass-card rounded-3xl p-8 border border-primary/20 text-center glow-blue-sm"
          >
            <p className="text-muted-foreground italic leading-relaxed text-lg md:text-xl">
              &ldquo;Abbiamo scoperto un tacito rinnovo da €18.000 solo tre giorni prima della scadenza.
              Con ContractOS lo avremmo visto 90 giorni prima.&rdquo;
            </p>
            <footer className="mt-4 text-base text-primary font-medium">
              — Direttore Operativo, PMI manifatturiera italiana
            </footer>
          </motion.blockquote>
        </ScrollReveal>
      </div>
    </section>
  )
}
