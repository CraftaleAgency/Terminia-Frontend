"use client"

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
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"

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
    <section id="features" className="py-32 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-1/3 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.15_200/0.08)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-3 text-sm text-primary uppercase tracking-widest font-medium mb-6">
              <span className="w-10 h-px bg-primary/60" aria-hidden />
              Funzionalità
              <span className="w-10 h-px bg-primary/60" aria-hidden />
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <h2 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Tutto ciò che serve per gestire i contratti
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed">
              Un sistema completo pensato per la realtà operativa delle PMI italiane.
            </p>
          </ScrollReveal>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
          {/* Row 1: large (2 cols) + 2 smalls */}
          <ScrollReveal delay={0.1} className="sm:col-span-2">
            <FeatureCard feature={features[0]} isLarge />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <FeatureCard feature={features[1]} />
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <FeatureCard feature={features[2]} />
          </ScrollReveal>

          {/* Row 2: 2 smalls + large (2 cols) */}
          <ScrollReveal delay={0.25}>
            <FeatureCard feature={features[4]} />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <FeatureCard feature={features[5]} />
          </ScrollReveal>
          <ScrollReveal delay={0.35} className="sm:col-span-2">
            <FeatureCard feature={features[3]} isLarge />
          </ScrollReveal>

          {/* Row 3: all smalls */}
          <ScrollReveal delay={0.4}>
            <FeatureCard feature={features[6]} />
          </ScrollReveal>
          <ScrollReveal delay={0.45}>
            <FeatureCard feature={features[7]} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  isLarge = false,
}: {
  feature: (typeof features)[0]
  isLarge?: boolean
}) {
  const Icon = feature.icon
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card rounded-3xl p-8 border border-border/20 group hover:glass-card-hover hover:glow-teal-sm transition-all duration-300 flex flex-col gap-5 h-full ${
        isLarge ? "min-h-[200px]" : ""
      }`}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors glow-blue-sm flex-shrink-0">
        <Icon className="size-6 text-primary" aria-hidden />
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-xl mb-3">{feature.title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  )
}
