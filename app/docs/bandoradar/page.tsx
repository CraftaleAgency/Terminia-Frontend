import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react"

export default function BandoRadarDocsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">BandoRadar</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sistema di ricerca automatica e matching intelligente di bandi pubblici 
        per le PMI italiane.
      </p>

      <h2>Come Funziona</h2>
      <p>
        BandoRadar costruisce automaticamente un profilo della tua azienda leggendo 
        i dati gia presenti in Terminia, poi confronta questo profilo con i bandi 
        pubblicati quotidianamente su tutte le fonti pubbliche italiane ed europee.
      </p>

      <h3>Costruzione Profilo Azienda</h3>
      <p>Il profilo viene costruito automaticamente aggregando:</p>
      <ul>
        <li><strong>companies:</strong> settore ATECO, dimensione, area geografica, certificazioni</li>
        <li><strong>contracts:</strong> tipologie di servizi/beni venduti o acquistati</li>
        <li><strong>counterparts:</strong> settori dei clienti e fornitori attuali</li>
        <li><strong>employees:</strong> numero dipendenti e competenze</li>
      </ul>

      <div className="not-prose glass-card rounded-xl p-6 border border-border/40 my-8">
        <h4 className="font-mono text-sm text-muted-foreground mb-3">ESEMPIO PROFILO VETTORIALE</h4>
        <code className="text-sm text-foreground">
          "Azienda ICT Milano, sviluppo software, 8 dipendenti, fatturato ~280k, 
          clienti PA e privati, nessun RTI attivo, settore ATECO 62.01, 
          no certificazioni rilevate"
        </code>
      </div>

      <h2>Fonti Dati</h2>
      <p>
        L'agente OpenClaw esegue uno scraping parallelo ogni 24 ore (cron job) 
        dalle seguenti fonti:
      </p>
      <ul>
        <li><strong>ANAC API:</strong> tutti i bandi pubblicati nelle ultime 24h</li>
        <li><strong>TED Europa API:</strong> bandi EU sopra soglia comunitaria</li>
        <li><strong>Portali regionali:</strong> Lombardia, Lazio, Piemonte, ecc.</li>
        <li><strong>Invitalia:</strong> incentivi e bandi innovazione</li>
        <li><strong>MIMIT:</strong> voucher digitali, bandi PMI</li>
        <li><strong>Consip:</strong> convenzioni e accordi quadro</li>
      </ul>

      <h2>Calcolo Match Score</h2>
      <p>
        Ogni bando viene valutato su 5 dimensioni per un totale di 100 punti:
      </p>

      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-foreground">Dimensione</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Punti Max</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Criteri</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Settore</td>
              <td className="py-3 px-4 text-primary">35</td>
              <td className="py-3 px-4 text-muted-foreground">
                Confronto CPV bando vs ATECO + servizi rilevati
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Dimensione Economica</td>
              <td className="py-3 px-4 text-primary">25</td>
              <td className="py-3 px-4 text-muted-foreground">
                Fatturato vs requisiti minimi bando
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Area Geografica</td>
              <td className="py-3 px-4 text-primary">20</td>
              <td className="py-3 px-4 text-muted-foreground">
                Sede aziendale vs NUTS code richiesto
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Requisiti Tecnici</td>
              <td className="py-3 px-4 text-primary">15</td>
              <td className="py-3 px-4 text-muted-foreground">
                Certificazioni, esperienze, personale
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-foreground font-medium">Fattibilita Operativa</td>
              <td className="py-3 px-4 text-primary">5</td>
              <td className="py-3 px-4 text-muted-foreground">
                RTI richiesto o meno
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Soglie di Notifica</h3>
      <ul>
        <li><strong>Match {'>'} 80%:</strong> Alert immediato all'utente</li>
        <li><strong>Match 60-80%:</strong> Badge giallo, visibile in lista</li>
        <li><strong>Match 40-60%:</strong> Badge grigio, salvato ma non notificato</li>
        <li><strong>Match {'<'} 40%:</strong> Non salvato nel database</li>
      </ul>

      <h2>Gap Analysis</h2>
      <p>
        Per ogni bando, il sistema genera un'analisi dettagliata dei requisiti 
        con stato di conformita:
      </p>

      <div className="not-prose space-y-3 my-8">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="size-5 text-emerald-500 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-foreground">P.IVA attiva e regolare</span>
            <span className="text-xs text-muted-foreground ml-2">Verificato</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="size-5 text-amber-500 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-foreground">2 contratti analoghi ultimi 5 anni</span>
            <span className="text-xs text-muted-foreground ml-2">Hai 1 rilevato</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <XCircle className="size-5 text-red-500 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-foreground">ISO27001</span>
            <span className="text-xs text-muted-foreground ml-2">Non rilevata nel profilo</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
          <HelpCircle className="size-5 text-muted-foreground flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-foreground">Iscrizione albo fornitori</span>
            <span className="text-xs text-muted-foreground ml-2">Verifica manuale richiesta</span>
          </div>
        </div>
      </div>

      <h2>Checklist Partecipazione</h2>
      <p>
        Il sistema genera automaticamente una checklist dei documenti necessari 
        con stima dei tempi:
      </p>

      <ul>
        <li><strong>DGUE:</strong> Scaricabile dal portale</li>
        <li><strong>Visura camerale:</strong> Richiedi a CCIAA (~3gg)</li>
        <li><strong>Dichiarazione antimafia:</strong> Autocertificazione</li>
        <li><strong>DURC:</strong> Richiedi a INPS (~5gg lavorativi)</li>
        <li><strong>Offerta tecnica:</strong> Da preparare (stima 3-5gg)</li>
        <li><strong>Offerta economica:</strong> Da preparare (stima 1gg)</li>
      </ul>

      <h2>Architettura Cron Job</h2>
      <div className="not-prose glass-card rounded-xl p-6 border border-border/40 my-8 font-mono text-sm">
        <pre className="text-muted-foreground overflow-x-auto">
{`supabase/functions/
  └── bando-radar/
      └── index.ts    <- Edge Function (cron ogni 24h)
            |
            STEP 1: carica company profile attivi
            STEP 2: scarica bandi ultime 24h per fonte
            STEP 3: calcola match score per ogni bando
            STEP 4: se > 40%: inserisci in bandi
            STEP 5: se > 80%: crea alert
            STEP 6: marca bandi scaduti inactive`}
        </pre>
      </div>

      <h2>Flusso Utente</h2>
      <ol>
        <li>Utente apre <code>/dashboard/bandi</code></li>
        <li>Vede lista bandi ordinata per match score</li>
        <li>Click su "Valuta" apre scheda bando con gap analysis</li>
        <li>Puo salvare, segnare come "sto partecipando", o archiviare</li>
        <li>Se vince, click su "Ho vinto" genera contratto automatico</li>
      </ol>
    </article>
  )
}
