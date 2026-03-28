"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
    <section id="pricing" className="py-24 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-24 bg-gradient-to-b from-primary/40 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(ellipse,oklch(0.72_0.18_220/0.05)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-primary uppercase tracking-widest font-medium mb-4">
            <span className="w-8 h-px bg-primary/60" aria-hidden />
            Prezzi
            <span className="w-8 h-px bg-primary/60" aria-hidden />
          </div>
          <h2 className="text-balance text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Semplice e trasparente
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-base leading-relaxed mb-8">
            14 giorni di prova gratuita, nessuna carta di credito richiesta.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center glass-card rounded-xl p-1 border border-border/20">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-lg transition-all duration-200",
                !annual ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensile
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-2",
                annual ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annuale
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                annual ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/20 text-primary"
              )}>-20%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-6 flex flex-col transition-all duration-300 border",
                plan.highlighted
                  ? "bg-primary/10 border-primary/40 glow-blue"
                  : "glass-card border-border/20 hover:glass-card-hover"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Più popolare
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-semibold text-foreground text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice !== "Su misura" && (
                    <span className="text-sm text-muted-foreground">/mese</span>
                  )}
                </div>
                {annual && plan.monthlyPrice !== "Su misura" && (
                  <p className="text-xs text-muted-foreground mt-1">fatturato annualmente</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="size-4 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={cn(
                  "block text-center text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200",
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
                    : "glass-card border border-border/30 text-foreground hover:glass-card-hover"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Pagamento sicuro · Fattura elettronica disponibile · Disdetta in qualsiasi momento
        </p>
      </div>
    </section>
  )
}
