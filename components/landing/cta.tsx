"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"
import { BorderMagicButton, SecondaryShimmerButton } from "@/components/ui/shimmer-button"

export function Cta() {
  return (
    <section className="py-20 px-6 relative">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse,oklch(0.68_0.12_195/0.1)_0%,oklch(0.72_0.14_180/0.05)_50%,transparent_70%)]" />
        <div className="absolute -left-20 top-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.10_195/0.06)_0%,transparent_60%)]" />
        <div className="absolute -right-20 top-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.12_180/0.05)_0%,transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-3xl text-center relative z-10">
        <ScrollReveal delay={0.1}>
          <h2 className="text-balance text-3xl sm:text-4xl lg:text-4xl font-semibold text-foreground mb-4 leading-tight">
            In 14 giorni scoprirai{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">contratti che non sapevi di avere</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-muted-foreground leading-relaxed mb-8 text-base md:text-lg">
            Carica i tuoi contratti oggi e entro venerdì avrai: scadenze mappate per i prossimi 6 mesi,
            3 bandi compatibili da valutare, rischi clausole penali identificati, cashflow proiettato automaticamente.
            <span className="text-foreground font-medium"> Nessuna carta di credito. Dati al sicuro in Italia.</span>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register">
              <BorderMagicButton size="md" asChild>
                Inizia la prova gratuita — 14 giorni
                <ArrowRight className="size-4" aria-hidden />
              </BorderMagicButton>
            </Link>
            <Link href="#">
              <SecondaryShimmerButton size="md" asChild>
                Prenota demo 15 minuti
              </SecondaryShimmerButton>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="mt-6 text-sm text-muted-foreground">
            GDPR nativo · AI proprietaria (i tuoi dati non trainano modelli terzi) · Hosting in Italia
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
