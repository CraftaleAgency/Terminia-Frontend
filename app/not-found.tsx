'use client'

import Link from "next/link"
import { Home, FileSearch, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { SecondaryShimmerButton } from "@/components/ui/shimmer-button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background effects */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Central radial glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.10_185/0.08)_0%,oklch(0.60_0.08_190/0.04)_40%,transparent_70%)]" />

          {/* Left orb */}
          <div className="absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.08_190/0.04)_0%,transparent_60%)]" />

          {/* Right orb */}
          <div className="absolute -right-40 top-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.60_0.10_180/0.03)_0%,transparent_60%)]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto py-20">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-[150px] sm:text-[180px] md:text-[220px] font-bold text-gradient leading-none">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Pagina non trovata
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Sembra che il contratto che stai cercando non esista o sia stato spostato.
              <br className="hidden sm:block" />
              Non preoccuparti, con Terminia sotto controllo tutto il resto.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/">
              <SecondaryShimmerButton size="lg" asChild>
                Torna alla Home
                <Home className="size-4 ml-2" aria-hidden />
              </SecondaryShimmerButton>
            </Link>

            <Link href="/docs">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 group">
                Vai alla Documentazione
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 pt-12 border-t border-border/20"
          >
            <p className="text-sm text-muted-foreground mb-6">Stavi cercando:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/#features"
                className="glass-card rounded-xl p-4 border border-border/20 hover:border-primary/30 hover:glow-teal-sm transition-all duration-300 text-left group"
              >
                <FileSearch className="size-5 text-primary mb-2" />
                <h3 className="font-medium text-foreground text-sm mb-1">Funzionalità</h3>
                <p className="text-xs text-muted-foreground">Scopri tutte le funzionalità di Terminia</p>
              </Link>

              <Link
                href="/#bandoradar"
                className="glass-card rounded-xl p-4 border border-border/20 hover:border-primary/30 hover:glow-teal-sm transition-all duration-300 text-left group"
              >
                <FileSearch className="size-5 text-primary mb-2" />
                <h3 className="font-medium text-foreground text-sm mb-1">BandoRadar</h3>
                <p className="text-xs text-muted-foreground">Trova bandi pubblici compatibili</p>
              </Link>

              <Link
                href="/docs"
                className="glass-card rounded-xl p-4 border border-border/20 hover:border-primary/30 hover:glow-teal-sm transition-all duration-300 text-left group"
              >
                <FileSearch className="size-5 text-primary mb-2" />
                <h3 className="font-medium text-foreground text-sm mb-1">Documentazione</h3>
                <p className="text-xs text-muted-foreground">Guide tecniche e approfondimenti</p>
              </Link>

              <Link
                href="/docs/integrazioni"
                className="glass-card rounded-xl p-4 border border-border/20 hover:border-primary/30 hover:glow-teal-sm transition-all duration-300 text-left group"
              >
                <FileSearch className="size-5 text-primary mb-2" />
                <h3 className="font-medium text-foreground text-sm mb-1">Integrazioni</h3>
                <p className="text-xs text-muted-foreground">ANAC, TED Europa, VIESAC e altro</p>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
