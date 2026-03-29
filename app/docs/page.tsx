import Link from "next/link"
import { FileSearch, Shield, Database, ArrowRight, Zap, Lock, Brain, Cloud, Layers, FileText } from "lucide-react"

export default function DocsPage() {
  return (
    <article className="max-w-none">
      {/* Hero section */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card text-sm text-primary">
          <Zap className="size-4" />
          Documentazione Tecnica v1.0
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Documentazione <span className="text-gradient">TerminIA</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          TerminIA e il co-pilota legale AI per le PMI italiane. Questa documentazione 
          spiega i dettagli tecnici dei moduli principali e l'architettura del sistema.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Link
          href="/docs/bandoradar"
          className="group glass-card rounded-2xl p-6 border border-border/40 hover:border-primary/40 hover:glow-teal-sm transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
            <FileSearch className="size-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            BandoRadar
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Sistema di ricerca automatica bandi pubblici con matching AI, gap analysis e checklist documenti.
          </p>
          <span className="flex items-center gap-1 text-sm text-primary font-medium">
            Leggi la guida
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/docs/advisor"
          className="group glass-card rounded-2xl p-6 border border-border/40 hover:border-primary/40 hover:glow-teal-sm transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
            <Shield className="size-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            Advisor OSINT
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Verifica automatica affidabilita controparti con ricerca OSINT multi-fonte e scoring reputazionale.
          </p>
          <span className="flex items-center gap-1 text-sm text-primary font-medium">
            Leggi la guida
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/docs/architettura"
          className="group glass-card rounded-2xl p-6 border border-border/40 hover:border-primary/40 hover:glow-teal-sm transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
            <Layers className="size-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            Architettura Agenti
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Piattaforma agenti AI sandbox con NemoClaw, OpenShell e 10 skill OpenClaw per automazione business intelligence.
          </p>
          <span className="flex items-center gap-1 text-sm text-primary font-medium">
            Leggi la guida
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Architecture section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Layers className="size-6 text-primary" />
          Architettura
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed max-w-3xl">
          TerminIA utilizza un'architettura serverless basata su Next.js e Supabase, 
          con agenti AI per l'estrazione automatica di dati dai contratti e la ricerca 
          di bandi pubblici compatibili.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Cloud, label: "Frontend", desc: "Next.js 16, React 19, Tailwind CSS, Framer Motion" },
            { icon: Database, label: "Backend", desc: "Supabase Edge Functions, PostgreSQL, RLS" },
            { icon: Brain, label: "AI Engine", desc: "AI proprietaria per estrazione e analisi intelligente" },
            { icon: Lock, label: "Auth", desc: "Supabase Auth con SSO aziendale e MFA" },
            { icon: FileText, label: "Storage", desc: "Supabase Storage per PDF e documenti" },
            { icon: Zap, label: "Realtime", desc: "Supabase Realtime per alert e notifiche" },
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-xl p-4 border border-border/30">
              <div className="flex items-center gap-3 mb-2">
                <item.icon className="size-5 text-primary" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data flow section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Zap className="size-6 text-primary" />
          Flusso Dati
        </h2>
        <div className="glass-card rounded-2xl p-6 border border-border/30">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Upload", desc: "Upload contratto PDF/DOCX tramite dashboard" },
              { step: "02", title: "OCR & Parsing", desc: "Estrazione testo con OCR e parsing strutturato" },
              { step: "03", title: "AI Extraction", desc: "Estrazione AI di clausole, scadenze, obblighi" },
              { step: "04", title: "Risk Analysis", desc: "Calcolo risk score e generazione alert automatici" },
              { step: "05", title: "BandoRadar", desc: "Matching automatico con bandi pubblici compatibili" },
              { step: "06", title: "Advisor OSINT", desc: "Verifica affidabilita controparti" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations section teaser */}
      <div className="glass-card rounded-2xl p-8 border border-primary/20 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
            <Zap className="size-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Integrazioni Esterne</h3>
            <p className="text-muted-foreground mb-4">
              TerminIA si integra con le principali fonti dati pubbliche italiane ed europee
              per offrire una visione completa e sempre aggiornata delle opportunita di gara
              e della affidabilita delle controparti.
            </p>
            <Link
              href="/docs/integrazioni"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Vedi le integrazioni
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
