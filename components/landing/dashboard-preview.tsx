"use client"

import { FileText, Clock, Wallet, AlertTriangle, TrendingUp } from "lucide-react"

// Mock data for the preview - mirrors real dashboard structure
const kpis = [
  { label: "Contratti Attivi", value: "47", icon: FileText, color: "text-primary" },
  { label: "In Scadenza 30gg", value: "8", icon: Clock, color: "text-amber-400" },
  { label: "Valore Portfolio", value: "€1.2M", icon: Wallet, color: "text-emerald-400" },
  { label: "Alert Aperti", value: "5", icon: AlertTriangle, color: "text-red-400" },
  { label: "Rischio Alto", value: "3", icon: TrendingUp, color: "text-orange-400" },
]

const contracts = [
  { name: "Contratto Fornitura IT — TechSupply Srl", type: "Fornitore", status: "Attivo", risk: "Basso", date: "31 mag 2025" },
  { name: "Accordo di Servizi — Studio Rossi & Assoc.", type: "Cliente", status: "In Scadenza", risk: "Medio", date: "15 apr 2025" },
  { name: "Contratto Quadro — Logistica Express SpA", type: "Fornitore", status: "Attivo", risk: "Alto", date: "01 lug 2025" },
]

const alerts = [
  { title: "Rinnovo tacito in 30 giorni", contract: "Contratto Fornitura IT", priority: "high" },
  { title: "Contratto in scadenza", contract: "Accordo di Servizi", priority: "medium" },
  { title: "Nuovo bando compatibile", contract: "BandoRadar", priority: "info" },
]

export function DashboardPreview() {
  return (
    <div className="h-full flex flex-col">
      {/* Sidebar preview */}
      <div className="flex h-full">
        {/* Mini sidebar */}
        <div className="w-14 flex-shrink-0 border-r border-border/20 py-4 flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="2" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" className="text-primary"/>
              <path d="M5 4h5M5 7h5M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-primary"/>
              <circle cx="12.5" cy="12.5" r="2.5" fill="currentColor" className="text-primary"/>
            </svg>
          </div>
          {/* Nav icons */}
          {[1,2,3,4,5,6,7].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                i === 1 ? "bg-primary/15 text-primary" : "text-muted-foreground/40"
              }`}
            >
              <div className="w-4 h-4 rounded bg-current opacity-30" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-12 border-b border-border/20 flex items-center justify-between px-4">
            <div className="w-48 h-6 rounded-lg bg-muted/20" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-medium text-foreground">Sitelab</div>
                <div className="text-[10px] text-muted-foreground">sitelab@yupmail.com</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-muted/30" />
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* KPI Cards row */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {kpis.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <div key={kpi.label} className="glass-card rounded-xl p-3 border border-border/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-lg bg-muted/30 flex items-center justify-center ${kpi.color}`}>
                        <Icon className="size-3" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-foreground">{kpi.value}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{kpi.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-3 gap-3 h-[calc(100%-120px)]">
              {/* Contracts list - 2 columns */}
              <div className="col-span-2 glass-card rounded-xl border border-border/20 overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-border/20 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Contratti Recenti</span>
                  <span className="text-[10px] text-primary">Vedi tutti</span>
                </div>
                <div className="flex-1 divide-y divide-border/10 overflow-hidden">
                  {contracts.map((contract, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-foreground truncate">{contract.name}</div>
                        <div className="text-[10px] text-muted-foreground">{contract.type} · scade {contract.date}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                        contract.status === "Attivo" ? "border-primary/30 text-primary bg-primary/10" :
                        "border-amber-400/30 text-amber-400 bg-amber-400/10"
                      }`}>{contract.status}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        contract.risk === "Basso" ? "text-emerald-400 bg-emerald-400/10" :
                        contract.risk === "Medio" ? "text-amber-400 bg-amber-400/10" :
                        "text-red-400 bg-red-400/10"
                      }`}>{contract.risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts panel - 1 column */}
              <div className="glass-card rounded-xl border border-border/20 overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-border/20 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Alert</span>
                  <span className="text-[10px] text-primary">Gestisci</span>
                </div>
                <div className="flex-1 p-2 space-y-2 overflow-hidden">
                  {alerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/15">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        alert.priority === "high" ? "bg-red-400" :
                        alert.priority === "medium" ? "bg-amber-400" :
                        "bg-primary"
                      }`} />
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium text-foreground truncate">{alert.title}</div>
                        <div className="text-[9px] text-muted-foreground truncate">{alert.contract}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
