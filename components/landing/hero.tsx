"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { motion } from "framer-motion"
import { ShimmerButton, SecondaryShimmerButton } from "@/components/ui/shimmer-button"

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Background layers - inspired by wope/terminia logo colors */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Central radial glow - teal/cyan from logo */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1400px] h-[800px] bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.08_200/0.2)_0%,oklch(0.55_0.12_185/0.12)_35%,transparent_65%)]" />
        
        {/* Soft accent orbs */}
        <div className="absolute -left-60 top-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.10_185/0.08)_0%,transparent_55%)]" />
        <div className="absolute -right-60 top-60 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.12_180/0.06)_0%,transparent_55%)]" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-background to-transparent" />
        
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero content */}
        <div className="pt-32 md:pt-40 lg:pt-48 pb-12 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass-card text-sm text-muted-foreground"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Il CRM contrattuale AI per le PMI</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight mb-8"
          >
            <span className="block text-foreground">Ogni scadenza.</span>
            <span className="block text-foreground">Ogni clausola.</span>
            <span className="block text-gradient">Sotto controllo.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-2xl text-balance text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12"
          >
            Lascia che l'AI legga, capisca e protegga ogni contratto della tua azienda.
            Il co-pilota legale per le PMI italiane.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link href="/auth/register">
              <ShimmerButton variant="primary" size="lg">
                Inizia Gratis
                <ArrowRight className="size-5" aria-hidden />
              </ShimmerButton>
            </Link>
            <Link href="#how-it-works">
              <SecondaryShimmerButton size="lg">
                <Play className="size-4" aria-hidden />
                Scopri come funziona
              </SecondaryShimmerButton>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-sm text-muted-foreground/60"
          >
            Nessuna carta richiesta. Setup in 2 minuti.
          </motion.p>
        </div>

        {/* Dashboard Preview with glass frame */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mx-auto max-w-6xl"
        >
          {/* Glow effect behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 rounded-3xl blur-3xl opacity-50" />
          
          {/* Glass frame */}
          <div className="relative glass-card rounded-2xl p-1.5 glow-teal-sm">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <div className="flex gap-1.5" aria-hidden>
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="glass-card rounded-lg px-4 py-1.5 text-sm text-muted-foreground text-center max-w-xs mx-auto border-border/20">
                  app.terminia.ai/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content - using real screenshot style */}
            <div className="rounded-b-xl overflow-hidden bg-card/50">
              <DashboardPreviewContent />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DashboardPreviewContent() {
  return (
    <div className="h-[500px] md:h-[600px] flex">
      {/* Mini sidebar */}
      <div className="w-14 flex-shrink-0 border-r border-border/20 py-4 flex flex-col items-center gap-3 bg-sidebar/50">
        {/* Logo */}
        <div className="w-9 h-9 rounded-xl overflow-hidden mb-4 border border-border/30">
          <Image
            src="/images/terminia-logo.png"
            alt="Terminia"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Nav icons */}
        {[1,2,3,4,5,6,7,8,9,10].map((i) => (
          <div
            key={i}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground/40 hover:text-muted-foreground/60"
            }`}
          >
            <div className={`w-4 h-4 rounded ${i === 1 ? "bg-current" : "bg-current opacity-30"}`} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-border/20 flex items-center justify-between px-5 bg-card/30">
          <div>
            <div className="text-sm font-medium text-foreground">Dashboard</div>
            <div className="text-xs text-muted-foreground">Benvenuto, Mario Rossi</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-foreground">Rossi SRL</div>
              <div className="text-xs text-muted-foreground">rossi@pec.it</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30" />
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 p-5 overflow-hidden bg-background/30">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-5">
            {[
              { label: "Contratti Attivi", value: "47", color: "text-primary" },
              { label: "In Scadenza", value: "8", color: "text-amber-500" },
              { label: "Valore Tot.", value: "€1.2M", color: "text-emerald-500" },
              { label: "Alert Aperti", value: "5", color: "text-red-400" },
              { label: "Rischio Alto", value: "3", color: "text-orange-400" },
            ].map((kpi) => (
              <div key={kpi.label} className="glass-card rounded-xl p-4 border border-border/20">
                <div className={`w-8 h-8 rounded-lg bg-muted/30 mb-3 flex items-center justify-center ${kpi.color}`}>
                  <div className="w-4 h-4 rounded bg-current opacity-50" />
                </div>
                <div className={`text-2xl font-semibold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid md:grid-cols-3 gap-4 h-[calc(100%-140px)]">
            {/* Contracts table */}
            <div className="md:col-span-2 glass-card rounded-xl border border-border/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Contratti Recenti</span>
                <span className="text-sm text-primary cursor-pointer">Vedi tutti</span>
              </div>
              <div className="divide-y divide-border/10">
                {[
                  { name: "Contratto Fornitura IT — TechSupply Srl", status: "Attivo", risk: "Basso" },
                  { name: "Accordo Servizi — Studio Rossi & Assoc.", status: "In Scadenza", risk: "Medio" },
                  { name: "Contratto Quadro — Logistica Express SpA", status: "Attivo", risk: "Alto" },
                ].map((c, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">Fornitore</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      c.status === "Attivo" ? "border-primary/30 text-primary bg-primary/10" : "border-amber-400/30 text-amber-400 bg-amber-400/10"
                    }`}>{c.status}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      c.risk === "Basso" ? "text-emerald-400 bg-emerald-400/10" :
                      c.risk === "Medio" ? "text-amber-400 bg-amber-400/10" : "text-red-400 bg-red-400/10"
                    }`}>{c.risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="glass-card rounded-xl border border-border/20 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/20">
                <span className="text-sm font-medium text-foreground">Alert Recenti</span>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { title: "Rinnovo tacito in 30 giorni", priority: "high" },
                  { title: "Contratto in scadenza", priority: "medium" },
                  { title: "Nuovo bando compatibile", priority: "info" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/20">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      a.priority === "high" ? "bg-red-400" : a.priority === "medium" ? "bg-amber-400" : "bg-primary"
                    }`} />
                    <span className="text-sm text-foreground">{a.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
