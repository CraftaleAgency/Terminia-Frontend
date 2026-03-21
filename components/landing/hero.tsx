"use client"

import Link from "next/link"
import { ArrowRight, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { DashboardPreview } from "@/components/landing/dashboard-preview"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Central blue glow */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.18_220/0.15)_0%,transparent_70%)]" />
        {/* Top-left accent */}
        <div className="absolute -left-40 top-10 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.15_200/0.08)_0%,transparent_70%)]" />
        {/* Bottom-right accent */}
        <div className="absolute -right-40 bottom-10 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,oklch(0.60_0.12_240/0.08)_0%,transparent_70%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.72 0.18 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 220) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <ContainerScroll
        titleComponent={
          <div className="pt-32 pb-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 text-base text-muted-foreground mb-10 border border-border/40"
            >
              <TrendingDown className="size-4 text-primary" aria-hidden />
              <span>Le PMI perdono in media il</span>
              <span className="font-semibold text-primary">9% del fatturato</span>
              <span>per contratti non gestiti</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight mb-8"
            >
              <span className="text-foreground">Il tuo CRM contrattuale</span>
              <br />
              <span className="text-gradient">alimentato dall'AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto max-w-3xl text-balance text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12"
            >
              Carica i tuoi contratti, lascia che l'AI estragga tutto. Monitora scadenze, rischi e obblighi in tempo reale.
              Scopri i bandi pubblici compatibili con la tua azienda.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-primary text-primary-foreground font-medium px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-300 glow-blue text-lg"
              >
                Inizia Gratis
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 glass-card text-foreground font-medium px-8 py-4 rounded-2xl hover:glass-card-hover transition-all duration-300 text-lg border border-border/30"
              >
                Scopri come funziona
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
            >
              {[
                { value: "9%", label: "fatturato recuperato" },
                { value: "< 2 min", label: "analisi contratto AI" },
                { value: "ANAC + TED", label: "bandi monitorati" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-3xl md:text-4xl font-semibold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        }
      >
        {/* Dashboard Preview - mirrors real dashboard */}
        <DashboardPreview />
      </ContainerScroll>
    </section>
  )
}
