"use client"

import Link from "next/link"
import { ArrowRight, Play, LayoutDashboard, FileText, Users, Bell, BarChart3, Radar, Settings, Briefcase, FolderOpen, Shield, Search, TrendingUp, Clock, AlertTriangle, Target, ChevronRight, Receipt } from "lucide-react"
import { motion } from "framer-motion"
import { BorderMagicButton, SecondaryShimmerButton } from "@/components/ui/shimmer-button"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

export function Hero() {
  return (
    <section className="relative min-h-screen pt-20 md:pt-0">
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Central radial glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1400px] h-[900px] bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.10_185/0.08)_0%,oklch(0.60_0.08_190/0.04)_40%,transparent_70%)]" />
        
        {/* Left orb */}
        <div className="absolute -left-40 top-60 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.08_190/0.04)_0%,transparent_60%)]" />
        
        {/* Right orb */}
        <div className="absolute -right-40 top-80 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.60_0.10_180/0.03)_0%,transparent_60%)]" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ContainerScroll with 3D dashboard */}
      <ContainerScroll
        titleComponent={
          <div className="pt-20 md:pt-24 pb-6">
            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-balance text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold leading-[0.95] tracking-tight mb-6"
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
              className="mx-auto max-w-2xl text-balance text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
            >
              Lascia che l&apos;AI legga, capisca e protegga ogni contratto della tua azienda.
              Il co-pilota legale per le PMI italiane.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link href="/auth/register">
                <BorderMagicButton size="lg" asChild>
                  Inizia Gratis 14 giorni
                  <ArrowRight className="size-5" aria-hidden />
                </BorderMagicButton>
              </Link>
              <Link href="#how-it-works">
                <SecondaryShimmerButton size="lg" asChild>
                  <Play className="size-4" aria-hidden />
                  Scopri come funziona
                </SecondaryShimmerButton>
              </Link>
            </motion.div>

            {/* Trust line - more spacing from dashboard */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-sm text-muted-foreground/70 mb-10"
            >
              Nessuna carta richiesta. Setup in 2 minuti.
            </motion.p>
          </div>
        }
      >
        {/* Dashboard content inside ContainerScroll card */}
        <DashboardPreviewContent />
      </ContainerScroll>
    </section>
  )
}

function DashboardPreviewContent() {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FileText, label: "Contratti", active: false },
    { icon: Users, label: "Controparti", active: false },
    { icon: Users, label: "Dipendenti", active: false },
    { icon: Receipt, label: "Fatture", active: false },
    { icon: Radar, label: "BandoRadar", active: false },
    { icon: FolderOpen, label: "Documenti", active: false },
    { icon: Shield, label: "Advisor OSINT", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Bell, label: "Alert", badge: 6, active: false },
  ]

  const kpis = [
    { icon: FileText, label: "Contratti Attivi", value: "7", subtext: "+3 questo mese", color: "text-primary", bgColor: "bg-primary/10" },
    { icon: Clock, label: "In Scadenza 30gg", value: "1", subtext: "Richiede attenzione", color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { icon: TrendingUp, label: "Valore Portfolio", value: "398.400", prefix: "", suffix: " EUR", subtext: "+12% vs anno precedente", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { icon: AlertTriangle, label: "Alert Aperti", value: "6", subtext: "Da gestire", color: "text-red-500", bgColor: "bg-red-500/10" },
    { icon: Target, label: "Bandi Match Alto", value: "2", subtext: "Opportunita", color: "text-primary", bgColor: "bg-primary/10" },
  ]

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex w-52 flex-shrink-0 border-r border-border/30 flex-col bg-sidebar">
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-border/20">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3dc1c3] to-[#0d4f5f] flex items-center justify-center flex-shrink-0">
            <Shield className="size-4 text-white" aria-hidden />
          </div>
          <span className="font-semibold text-foreground text-sm">Terminia</span>
        </div>
        
        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-hidden">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="size-4 flex-shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="p-2 border-t border-border/20">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground">
            <Settings className="size-4" aria-hidden />
            <span>Impostazioni</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border/30 flex items-center justify-between px-3 md:px-5 bg-card/50">
          {/* Search - hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-sm flex-1 max-w-72">
            <Search className="size-4" aria-hidden />
            <span className="truncate">Cerca contratti, controparti...</span>
            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded hidden md:inline">CMD K</span>
          </div>

          {/* Mobile: Logo */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3dc1c3] to-[#0d4f5f] flex items-center justify-center">
              <Shield className="size-3.5 text-white" aria-hidden />
            </div>
            <span className="font-semibold text-foreground text-sm">Terminia</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <Bell className="size-5 text-muted-foreground" aria-hidden />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">6</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Azienda Demo</div>
                <div className="text-xs text-muted-foreground">admin@example.com</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30" />
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 p-3 md:p-5 overflow-auto bg-background">
          {/* Title + action */}
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Dashboard</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Panoramica del tuo portfolio contrattuale</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-lg">
              Nuovo Contratto
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>

          {/* KPI Cards - responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-5">
            {kpis.map((kpi, i) => (
              <div key={i} className="glass-card rounded-xl p-3 md:p-4 border border-border/20">
                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg ${kpi.bgColor} mb-2 md:mb-3 flex items-center justify-center`}>
                  <kpi.icon className={`size-4 md:size-5 ${kpi.color}`} aria-hidden />
                </div>
                <div className={`text-lg md:text-2xl font-semibold ${kpi.color}`}>
                  {kpi.prefix}{kpi.value}{kpi.suffix}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
                <div className={`text-[10px] md:text-xs mt-1 ${kpi.color}`}>{kpi.subtext}</div>
              </div>
            ))}
          </div>

          {/* Financial summary row */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-5">
            <div className="glass-card rounded-xl p-3 md:p-4 border border-border/20 flex items-center justify-between">
              <div>
                <div className="text-xs md:text-sm text-muted-foreground">Da Incassare</div>
                <div className="text-lg md:text-2xl font-semibold text-primary">9.760 EUR</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="size-4 md:size-5 text-primary" aria-hidden />
              </div>
            </div>
            <div className="glass-card rounded-xl p-3 md:p-4 border border-border/20 flex items-center justify-between">
              <div>
                <div className="text-xs md:text-sm text-muted-foreground">Da Pagare</div>
                <div className="text-lg md:text-2xl font-semibold text-red-500">18.300 EUR</div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Receipt className="size-4 md:size-5 text-red-500" aria-hidden />
              </div>
            </div>
          </div>

          {/* Charts row - stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5">
            {/* Area chart */}
            <div className="lg:col-span-2 glass-card rounded-xl p-3 md:p-4 border border-border/20">
              <div className="mb-3">
                <div className="text-sm font-medium text-foreground">Andamento Contratti</div>
                <div className="text-xs text-muted-foreground">Ultimi 6 mesi</div>
              </div>
              {/* Simple area chart visualization */}
              <div className="h-24 md:h-28 flex items-end gap-1 pt-4">
                {[30, 35, 32, 40, 38, 45].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-primary/40 to-primary/10 border-t-2 border-primary"
                      style={{ height: `${h * 2}px` }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {["Gen", "Feb", "Mar", "Apr", "Mag", "Giu"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart */}
            <div className="glass-card rounded-xl p-3 md:p-4 border border-border/20">
              <div className="mb-3">
                <div className="text-sm font-medium text-foreground">Distribuzione Rischio</div>
                <div className="text-xs text-muted-foreground">Per contratto</div>
              </div>
              {/* Simple donut visualization */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.72 0.13 180)" strokeWidth="4" strokeDasharray="60 40" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.70 0.15 85)" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-60" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(0.60 0.20 25)" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-85" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Basso: 28</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Medio: 12</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Alto: 7</span>
              </div>
            </div>
          </div>

          {/* Contracts list - stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3">
            {/* Bar chart */}
            <div className="glass-card rounded-xl p-3 md:p-4 border border-border/20">
              <div className="mb-3">
                <div className="text-sm font-medium text-foreground">Scadenze per Mese</div>
                <div className="text-xs text-muted-foreground">Prossimi 6 mesi</div>
              </div>
              <div className="h-20 md:h-24 flex items-end gap-2">
                {[2, 8, 5, 3, 6, 4].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/60"
                      style={{ height: `${h * 10}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent contracts */}
            <div className="lg:col-span-2 glass-card rounded-xl border border-border/20 overflow-hidden">
              <div className="px-3 md:px-4 py-3 border-b border-border/20 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Contratti Recenti</span>
                <span className="text-sm text-primary flex items-center gap-1">Vedi tutti <ChevronRight className="size-3" /></span>
              </div>
              <div className="divide-y divide-border/10">
                {[
                  { name: "Contratto Fornitura Servizi IT - TechSupply Srl", type: "Service supply", date: "31 mag 2025", status: "Attivo", risk: "Basso" },
                  { name: "Accordo Quadro Consulenza - Studio Rossi & Associati", type: "Framework", date: "15 apr 2025", status: "In Scadenza", risk: "Medio" },
                  { name: "Contratto Logistica e Trasporti - Logistica Express SpA", type: "Logistica", date: "01 lug 2025", status: "Attivo", risk: "Alto" },
                ].map((c, i) => (
                  <div key={i} className="px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 md:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-medium text-foreground truncate">{c.name}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">{c.type} - scade {c.date}</div>
                    </div>
                    <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border flex-shrink-0 ${
                      c.status === "Attivo" ? "border-primary/30 text-primary bg-primary/10" : "border-amber-500/30 text-amber-500 bg-amber-500/10"
                    }`}>{c.status}</span>
                    <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0 ${
                      c.risk === "Basso" ? "text-emerald-500 bg-emerald-500/10" :
                      c.risk === "Medio" ? "text-amber-500 bg-amber-500/10" : "text-red-500 bg-red-500/10"
                    }`}>{c.risk}</span>
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
