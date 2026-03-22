"use client"

import Link from "next/link"
import { ArrowRight, TrendingDown } from "lucide-react"

function BorderMagicButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,oklch(0.78_0.12_175)_0%,oklch(0.35_0.12_220)_50%,oklch(0.78_0.12_175)_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-background px-8 py-1 text-lg font-medium text-foreground backdrop-blur-3xl transition-all duration-300 group-hover:bg-card">
        {children}
        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" aria-hidden />
      </span>
    </Link>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Central blue glow */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.18_220/0.12)_0%,transparent_70%)]" />
        {/* Top-left accent */}
        <div className="absolute -left-40 top-10 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.15_200/0.07)_0%,transparent_70%)]" />
        {/* Bottom-right accent */}
        <div className="absolute -right-40 bottom-10 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,oklch(0.60_0.12_240/0.06)_0%,transparent_70%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.75 0.14 180) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.14 180) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8 border border-border/40">
          <TrendingDown className="size-3.5 text-primary" aria-hidden />
          <span>Le PMI perdono in media il</span>
          <span className="font-semibold text-primary">9% del fatturato</span>
          <span>per contratti non gestiti</span>
        </div>

        {/* Heading */}
        <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight mb-6">
          <span className="text-foreground">Il tuo CRM contrattuale</span>
          <br />
          <span className="text-gradient">alimentato dall'AI</span>
        </h1>

        <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed mb-10">
          Carica i tuoi contratti, lascia che l'AI estragga tutto. Monitora scadenze, rischi e obblighi in tempo reale.
          Scopri i bandi pubblici compatibili con la tua azienda.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="#"
            className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 glow-blue text-[15px]"
          >
            Inizia Gratis
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 glass-card text-foreground font-medium px-6 py-3 rounded-xl hover:glass-card-hover transition-all duration-200 text-[15px]"
          >
            Scopri come funziona
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[
            { value: "9%", label: "fatturato recuperato" },
            { value: "< 2 min", label: "analisi contratto AI" },
            { value: "ANAC + TED", label: "bandi monitorati" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-16">
        <div className="relative">
          {/* Fade bottom */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-background to-transparent"
          />
          <div className="glass-card rounded-2xl overflow-hidden border border-border/30 glow-blue">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <div className="flex gap-1.5" aria-hidden>
                <div className="w-3 h-3 rounded-full bg-muted/60" />
                <div className="w-3 h-3 rounded-full bg-muted/60" />
                <div className="w-3 h-3 rounded-full bg-muted/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="glass-card rounded-lg px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto border-border/20">
                  app.contractos.it/dashboard
                </div>
              </div>
            </div>
            {/* Dashboard content */}
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="p-5 bg-[oklch(0.10_0.012_250)] min-h-64">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Contratti Attivi", value: "47", delta: "+3", color: "text-primary" },
          { label: "In Scadenza 30gg", value: "8", delta: "!", color: "text-amber-400" },
          { label: "Valore Portfolio", value: "€1.2M", delta: "", color: "text-foreground" },
          { label: "Alert Aperti", value: "5", delta: "urgente", color: "text-red-400" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-xl p-3 border border-border/20">
            <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
            <div className={`text-xl font-semibold ${kpi.color}`}>{kpi.value}</div>
            {kpi.delta && <div className="text-xs text-muted-foreground mt-0.5">{kpi.delta}</div>}
          </div>
        ))}
      </div>

      {/* Contracts list preview */}
      <div className="glass-card rounded-xl border border-border/20 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border/20 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Contratti Recenti</span>
          <span className="text-xs text-primary cursor-pointer">Vedi tutti →</span>
        </div>
        <div className="divide-y divide-border/10">
          {[
            { name: "Contratto Fornitura IT — TechSupply Srl", type: "Fornitore", status: "Attivo", risk: "Basso", date: "31 mag 2025" },
            { name: "Accordo di Servizi — Studio Rossi & Assoc.", type: "Cliente", status: "In Scadenza", risk: "Medio", date: "15 apr 2025" },
            { name: "Contratto Quadro — Logistica Express", type: "Fornitore", status: "Attivo", risk: "Alto", date: "01 lug 2025" },
          ].map((contract, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{contract.name}</div>
                <div className="text-xs text-muted-foreground">{contract.type} · scade {contract.date}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                contract.status === "Attivo" ? "border-primary/30 text-primary bg-primary/10" :
                "border-amber-400/30 text-amber-400 bg-amber-400/10"
              }`}>{contract.status}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                contract.risk === "Basso" ? "text-emerald-400 bg-emerald-400/10" :
                contract.risk === "Medio" ? "text-amber-400 bg-amber-400/10" :
                "text-red-400 bg-red-400/10"
              }`}>{contract.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
