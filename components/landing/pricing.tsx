"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"

const plans = [
  {
    name: "Starter",
    monthlyPrice: "€ 79",
    annualPrice: "€ 59",
    description: "Per le PMI che iniziano a strutturare la gestione contrattuale.",
    features: [
      "Fino a 50 contratti",
      "Estrazione AI automatica",
      "Alert scadenze (email)",
      "Dashboard KPI",
      "1 utente",
    ],
    cta: "Inizia Gratis 14 giorni",
    highlighted: false,
  },
  {
    name: "Business",
    monthlyPrice: "€ 189",
    annualPrice: "€ 149",
    description: "Per le aziende che gestiscono un portfolio contrattuale significativo.",
    features: [
      "Contratti illimitati",
      "Estrazione AI + chatbot contrattuale",
      "Alert via email e Slack",
      "BandoRadar — ricerca bandi AI",
      "Gestione dipendenti + lettere HR",
      "Analytics e cashflow proiettato",
      "Fino a 5 utenti",
      "Integrazioni DocuSign, Calendar",
    ],
    cta: "Inizia Gratis 14 giorni",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: "Su misura",
    annualPrice: "Su misura",
    description: "Per agenzie, studi professionali e aziende con esigenze custom.",
    features: [
      "Tutto di Business",
      "Utenti illimitati",
      "SSO e ruoli personalizzati",
      "API access",
      "SLA dedicato",
      "Onboarding personalizzato",
    ],
    cta: "Contattaci",
    highlighted: false,
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-32 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse,oklch(0.72_0.18_220/0.06)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-3 text-sm text-primary uppercase tracking-widest font-medium mb-6">
              <span className="w-10 h-px bg-primary/60" aria-hidden />
              Prezzi
              <span className="w-10 h-px bg-primary/60" aria-hidden />
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <h2 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Semplice e trasparente
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed mb-10">
              14 giorni di prova gratuita, nessuna carta di credito richiesta.
            </p>
          </ScrollReveal>

          {/* Toggle */}
          <ScrollReveal delay={0.4}>
            <div className="inline-flex items-center glass-card rounded-2xl p-1.5 border border-border/20">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "px-6 py-2.5 text-base rounded-xl transition-all duration-200",
                  !annual ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Mensile
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "px-6 py-2.5 text-base rounded-xl transition-all duration-200 flex items-center gap-2",
                  annual ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annuale
                <span className={cn(
                  "text-sm px-2 py-0.5 rounded-full",
                  annual ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary"
                )}>-20%</span>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Plans grid */}
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={0.2 + index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative rounded-3xl p-8 flex flex-col transition-all duration-300 border h-full",
                  plan.highlighted
                    ? "bg-primary/10 border-primary/40 glow-blue"
                    : "glass-card border-border/20 hover:glass-card-hover"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                      Più popolare
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground text-2xl mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice !== "Su misura" && (
                      <span className="text-base text-muted-foreground">/mese</span>
                    )}
                  </div>
                  {annual && plan.monthlyPrice !== "Su misura" && (
                    <p className="text-sm text-muted-foreground mt-1">fatturato annualmente</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="size-5 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                      <span className="text-base text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="#"
                  className={cn(
                    "block text-center text-base font-medium px-5 py-3.5 rounded-2xl transition-all duration-200",
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
                      : "glass-card border border-border/30 text-foreground hover:glass-card-hover"
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust note */}
        <ScrollReveal delay={0.6}>
          <p className="text-center text-base text-muted-foreground mt-10">
            Pagamento sicuro · Fattura elettronica disponibile · Disdetta in qualsiasi momento
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
