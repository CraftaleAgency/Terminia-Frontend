"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"
import { BorderMagicButton, SecondaryShimmerButton } from "@/components/ui/shimmer-button"

export function Cta() {
  return (
    <section className="py-32 px-6 relative">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary/50 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(ellipse,oklch(0.68_0.12_195/0.1)_0%,oklch(0.72_0.14_180/0.05)_50%,transparent_70%)]" />
        <div className="absolute -left-20 top-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.10_195/0.06)_0%,transparent_60%)]" />
        <div className="absolute -right-20 top-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.12_180/0.05)_0%,transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-3xl text-center relative z-10">
        <ScrollReveal delay={0.1}>
          <h2 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
            Smetti di perdere fatturato{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">per contratti non gestiti</span>
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <p className="text-muted-foreground leading-relaxed mb-10 text-lg md:text-xl">
            Inizia con 14 giorni gratuiti. Nessuna carta di credito, nessun vincolo.
            Il tuo primo contratto analizzato in meno di 2 minuti.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <BorderMagicButton size="lg" asChild>
                Inizia Gratis — 14 giorni
                <ArrowRight className="size-5" aria-hidden />
              </BorderMagicButton>
            </Link>
            <Link href="#">
              <SecondaryShimmerButton size="lg" asChild>
                Prenota una demo
              </SecondaryShimmerButton>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="mt-8 text-base text-muted-foreground">
            Costruito in Italia · GDPR compliant · Dati ospitati in EU
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
