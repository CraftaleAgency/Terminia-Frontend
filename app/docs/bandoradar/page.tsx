import { CheckCircle, AlertTriangle, XCircle, HelpCircle, FileSearch, Target, BarChart3, FileText, Clock, Zap, Globe, Database, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BandoRadarDocsPage() {
  return (
    <article className="max-w-none">
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <FileSearch className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">BandoRadar</h1>
            <p className="text-muted-foreground">Sistema di matching intelligente per bandi pubblici</p>
          </div>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          BandoRadar analizza automaticamente i bandi pubblicati quotidianamente su tutte le 
          fonti pubbliche italiane ed europee, confrontandoli con il profilo della tua azienda 
          per identificare le opportunita piu rilevanti.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Zap className="size-6 text-primary" />
          Come Funziona
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Database, title: "1. Profilo Azienda", desc: "Il sistema costruisce automaticamente il tuo profilo aggregando dati da contratti, dipendenti e controparti." },
            { icon: Globe, title: "2. Scraping Bandi", desc: "Ogni 24h l'agente OpenClaw scarica i nuovi bandi da ANAC, TED, portali regionali e Consip." },
            { icon: Target, title: "3. Match & Alert", desc: "Calcolo del match score e notifica immediata per opportunita compatibili oltre l'80%." },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-xl p-5 border border-border/30">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <item.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Company profile example */}
        <div className="glass-card rounded-xl p-6 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/10">ESEMPIO PROFILO AZIENDA</span>
          </div>
          <code className="text-sm text-foreground leading-relaxed block">
            "Azienda ICT Milano, sviluppo software, 8 dipendenti, fatturato ~280k, 
            clienti PA e privati, nessun RTI attivo, settore ATECO 62.01, 
            no certificazioni rilevate"
          </code>
        </div>
      </section>

      {/* Data sources */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Globe className="size-6 text-primary" />
          Fonti Dati
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "ANAC API", desc: "Tutti i bandi PA pubblicati nelle ultime 24h" },
            { name: "TED Europa", desc: "Bandi EU sopra soglia comunitaria (150k+)" },
            { name: "Portali Regionali", desc: "Lombardia, Lazio, Piemonte, Emilia-Romagna" },
            { name: "Invitalia", desc: "Incentivi, voucher e bandi innovazione" },
            { name: "MIMIT", desc: "Voucher digitalizzazione, bandi PMI" },
            { name: "Consip", desc: "Convenzioni e accordi quadro PA" },
          ].map((source) => (
            <div key={source.name} className="glass-card rounded-lg p-4 border border-border/30">
              <h4 className="font-medium text-foreground mb-1">{source.name}</h4>
              <p className="text-sm text-muted-foreground">{source.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Match score calculation */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <BarChart3 className="size-6 text-primary" />
          Calcolo Match Score
        </h2>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Ogni bando viene valutato su 5 dimensioni per un totale di 100 punti.
          Il match score determina la priorita di visualizzazione e le notifiche.
        </p>

        <div className="glass-card rounded-xl overflow-hidden border border-border/30 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-4 px-5 font-semibold text-foreground">Dimensione</th>
                <th className="text-center py-4 px-5 font-semibold text-foreground">Punti</th>
                <th className="text-left py-4 px-5 font-semibold text-foreground">Criteri di Valutazione</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "Settore", pts: 35, desc: "Confronto CPV bando vs codice ATECO + servizi rilevati dai contratti" },
                { dim: "Dimensione Economica", pts: 25, desc: "Fatturato aziendale vs requisiti economici minimi del bando" },
                { dim: "Area Geografica", pts: 20, desc: "Sede legale/operativa vs NUTS code richiesto dal bando" },
                { dim: "Requisiti Tecnici", pts: 15, desc: "Certificazioni ISO, esperienze pregresse, personale qualificato" },
                { dim: "Fattibilita Operativa", pts: 5, desc: "RTI richiesto vs capacita di partecipazione singola" },
              ].map((row, i) => (
                <tr key={row.dim} className={i < 4 ? "border-b border-border/50" : ""}>
                  <td className="py-4 px-5 font-medium text-foreground">{row.dim}</td>
                  <td className="py-4 px-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold">
                      {row.pts}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notification thresholds */}
        <h3 className="text-lg font-semibold text-foreground mb-4">Soglie di Notifica</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { range: "> 80%", color: "emerald", action: "Alert immediato all'utente" },
            { range: "60-80%", color: "amber", action: "Badge giallo, visibile in lista" },
            { range: "40-60%", color: "zinc", action: "Badge grigio, salvato ma non notificato" },
            { range: "< 40%", color: "red", action: "Non salvato nel database" },
          ].map((threshold) => (
            <div
              key={threshold.range}
              className={`rounded-lg p-4 border ${
                threshold.color === "emerald" ? "border-emerald-500/30 bg-emerald-500/10" :
                threshold.color === "amber" ? "border-amber-500/30 bg-amber-500/10" :
                threshold.color === "zinc" ? "border-border bg-muted/20" :
                "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className={`font-bold text-lg mb-1 ${
                threshold.color === "emerald" ? "text-emerald-500" :
                threshold.color === "amber" ? "text-amber-500" :
                threshold.color === "zinc" ? "text-muted-foreground" :
                "text-red-500"
              }`}>{threshold.range}</div>
              <p className="text-sm text-muted-foreground">{threshold.action}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gap Analysis */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Target className="size-6 text-primary" />
          Gap Analysis
        </h2>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Per ogni bando, il sistema genera un'analisi dettagliata dei requisiti 
          con stato di conformita della tua azienda:
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="size-6 text-emerald-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-foreground">P.IVA attiva e regolare</span>
            </div>
            <span className="text-sm text-emerald-500 font-medium px-3 py-1 rounded-full bg-emerald-500/20">Verificato</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="size-6 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-foreground">2 contratti analoghi richiesti ultimi 5 anni</span>
            </div>
            <span className="text-sm text-amber-500 font-medium px-3 py-1 rounded-full bg-amber-500/20">Hai 1 rilevato</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <XCircle className="size-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-foreground">Certificazione ISO27001</span>
            </div>
            <span className="text-sm text-red-500 font-medium px-3 py-1 rounded-full bg-red-500/20">Non rilevata</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <HelpCircle className="size-6 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-foreground">Iscrizione albo fornitori regionale</span>
            </div>
            <span className="text-sm text-muted-foreground font-medium px-3 py-1 rounded-full bg-muted">Verifica manuale</span>
          </div>
        </div>
      </section>

      {/* Document checklist */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <FileText className="size-6 text-primary" />
          Checklist Partecipazione
        </h2>
        <p className="text-muted-foreground mb-6 max-w-3xl">
          Il sistema genera automaticamente una checklist dei documenti necessari con stima dei tempi:
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { doc: "DGUE", time: "Immediato", desc: "Scaricabile direttamente dal portale gara" },
            { doc: "Visura Camerale", time: "~3 giorni", desc: "Richiesta a CCIAA competente" },
            { doc: "DURC", time: "~5 giorni", desc: "Richiesta a INPS/INAIL" },
            { doc: "Dichiarazione Antimafia", time: "Immediato", desc: "Autocertificazione da modello" },
            { doc: "Offerta Tecnica", time: "3-5 giorni", desc: "Da preparare secondo disciplinare" },
            { doc: "Offerta Economica", time: "1 giorno", desc: "Compilazione moduli economici" },
          ].map((item) => (
            <div key={item.doc} className="glass-card rounded-xl p-4 border border-border/30 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="size-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">{item.doc}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <span className="text-xs text-primary mt-2 inline-block">Tempo stimato: {item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
          <Database className="size-6 text-primary" />
          Architettura Tecnica
        </h2>
        <div className="glass-card rounded-xl p-6 border border-border/30 font-mono text-sm overflow-x-auto">
          <pre className="text-muted-foreground whitespace-pre">
{`supabase/functions/
  bando-radar/
    index.ts          <- Edge Function (cron ogni 24h)
          |
          STEP 1: Carica company profile attivi
          STEP 2: Scarica bandi ultime 24h per fonte
          STEP 3: Calcola match score per ogni bando
          STEP 4: Se score > 40%: inserisci in tabella bandi
          STEP 5: Se score > 80%: crea alert notification
          STEP 6: Marca bandi scaduti come inactive`}
          </pre>
        </div>
      </section>

      {/* CTA */}
      <div className="glass-card rounded-xl p-6 border border-primary/20 bg-primary/5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground mb-1">Pronto per iniziare?</h3>
          <p className="text-sm text-muted-foreground">Attiva BandoRadar dal tuo piano Business o Enterprise.</p>
        </div>
        <Link href="/dashboard/bandi" className="flex items-center gap-2 text-primary font-medium hover:underline">
          Vai a BandoRadar
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}
