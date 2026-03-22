"use client"

import { Radar, CheckCircle2, Clock, ExternalLink } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"

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
    <section id="bandoradar" className="py-32 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute right-0 bottom-0 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.12_195/0.08)_0%,transparent_60%)]" />
        <div className="absolute left-0 top-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.14_180/0.05)_0%,transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <div>
            <ScrollReveal delay={0.1}>
              <div className="inline-flex items-center gap-3 text-sm text-primary uppercase tracking-widest font-medium mb-8">
                <Radar className="size-4 text-primary" aria-hidden />
                BandoRadar
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <h2 className="text-balance text-4xl sm:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Scopri i bandi pubblici{" "}
                <span className="text-gradient">su misura per la tua azienda</span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg md:text-xl">
                L&apos;agente AI costruisce automaticamente il profilo della tua azienda dai contratti caricati
                — settore, fatturato, area geografica, certificazioni — e lo usa per trovare ogni giorno
                i bandi pubblici più compatibili.
              </p>
            </ScrollReveal>

            {/* Source pills */}
            <ScrollReveal delay={0.4}>
              <div className="flex flex-wrap gap-3 mb-10">
                {sources.map((source) => (
                  <motion.span
                    key={source}
                    whileHover={{ scale: 1.05 }}
                    className="glass-card text-sm text-muted-foreground px-4 py-2 rounded-full border border-border/20"
                  >
                    {source}
                  </motion.span>
                ))}
              </div>
            </ScrollReveal>

            {/* Benefits */}
            <ScrollReveal delay={0.5}>
              <ul className="space-y-4">
                {[
                  "Match score 0–100 basato sul tuo profilo reale",
                  "Gap analysis automatica dei requisiti mancanti",
                  "Checklist documenti con stima dei tempi",
                  "Alert scadenza sui bandi salvati",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="text-base text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          {/* Right: mock bandi cards */}
          <div className="space-y-4">
            {mockBandi.map((bando, i) => (
              <ScrollReveal key={i} delay={0.2 + i * 0.1} direction="right">
                <motion.div
                  whileHover={{ scale: 1.02, x: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card rounded-3xl p-6 border border-border/20 group hover:glass-card-hover hover:glow-teal-sm transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium text-foreground truncate mb-2">{bando.title}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{bando.source}</span>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">Budget: {bando.budget}</span>
                      </div>
                    </div>
                    <ExternalLink className="size-5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Match score bar */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Match score</span>
                        <span className="text-sm font-semibold text-primary">{bando.score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bando.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                          role="progressbar"
                          aria-valuenow={bando.score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Match score: ${bando.score}%`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                      <Clock className="size-4" aria-hidden />
                      <span>{bando.deadline}</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}

            {/* CTA */}
            <ScrollReveal delay={0.6}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-3xl p-5 border border-primary/30 text-center glow-blue-sm"
              >
                <p className="text-base text-muted-foreground mb-3">
                  <span className="text-primary font-semibold">+24 bandi</span> compatibili trovati questa settimana
                </p>
                <button className="text-base text-primary hover:text-primary/80 transition-colors font-medium">
                  Vedi tutti i bandi →
                </button>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
