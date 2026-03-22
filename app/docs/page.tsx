import Link from "next/link"
import { FileSearch, Shield, Database, ArrowRight } from "lucide-react"

export default function DocsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">Documentazione Terminia</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Terminia e il co-pilota legale AI per le PMI italiane. Questa documentazione 
        spiega i dettagli tecnici dei moduli principali.
      </p>

      <div className="grid md:grid-cols-2 gap-6 not-prose">
        <Link
          href="/docs/bandoradar"
          className="group glass-card rounded-xl p-6 border border-border/40 hover:border-primary/40 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <FileSearch className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            BandoRadar
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sistema di ricerca automatica bandi pubblici con matching AI e gap analysis.
          </p>
          <span className="flex items-center gap-1 text-sm text-primary">
            Leggi la guida
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/docs/advisor"
          className="group glass-card rounded-xl p-6 border border-border/40 hover:border-primary/40 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Shield className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            Advisor OSINT
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Verifica automatica affidabilita controparti con ricerca OSINT multi-fonte.
          </p>
          <span className="flex items-center gap-1 text-sm text-primary">
            Leggi la guida
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/docs/database"
          className="group glass-card rounded-xl p-6 border border-border/40 hover:border-primary/40 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Database className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            Schema Database
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Struttura completa del database PostgreSQL con tutti i tipi e le relazioni.
          </p>
          <span className="flex items-center gap-1 text-sm text-primary">
            Vedi lo schema
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      <hr className="my-12" />

      <h2>Architettura</h2>
      <p>
        Terminia utilizza un'architettura serverless basata su Next.js e Supabase, 
        con agenti AI per l'estrazione automatica di dati dai contratti e la ricerca 
        di bandi pubblici compatibili.
      </p>

      <h3>Stack Tecnologico</h3>
      <ul>
        <li><strong>Frontend:</strong> Next.js 16, React 19, Tailwind CSS</li>
        <li><strong>Backend:</strong> Supabase Edge Functions, PostgreSQL</li>
        <li><strong>AI:</strong> Qwen 3.5 per estrazione, embeddings per matching semantico</li>
        <li><strong>Storage:</strong> Supabase Storage per documenti</li>
        <li><strong>Auth:</strong> Supabase Auth con SSO aziendale</li>
      </ul>

      <h3>Flusso Dati</h3>
      <ol>
        <li>Upload contratto PDF/DOCX</li>
        <li>OCR e parsing del documento</li>
        <li>Estrazione AI di clausole, scadenze, obblighi</li>
        <li>Calcolo risk score e alert automatici</li>
        <li>Matching con bandi pubblici (BandoRadar)</li>
        <li>Verifica OSINT controparti (Advisor)</li>
      </ol>
    </article>
  )
}
