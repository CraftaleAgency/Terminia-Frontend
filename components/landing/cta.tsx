"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { motion } from "framer-motion"

export function Cta() {
  return (
    <section className="py-32 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(ellipse,oklch(0.72_0.18_220/0.12)_0%,transparent_70%)]" />
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-primary text-primary-foreground font-medium px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-200 glow-blue text-lg"
              >
                Inizia Gratis — 14 giorni
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#"
                className="flex items-center gap-2 glass-card text-foreground font-medium px-8 py-4 rounded-2xl hover:glass-card-hover transition-all duration-200 text-lg border border-border/30"
              >
                Prenota una demo
              </Link>
            </motion.div>
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
