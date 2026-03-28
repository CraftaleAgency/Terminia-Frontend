import { CheckCircle, AlertTriangle, XCircle, Shield, Search, Database, Zap } from "lucide-react"

export default function AdvisorDocsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">Advisor OSINT</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sistema di verifica automatica dell'affidabilita delle controparti 
        attraverso ricerca OSINT multi-fonte.
      </p>

      <h2>Cos'e l'Advisor OSINT?</h2>
      <p>
        L'Advisor e un agente AI che esegue automaticamente verifiche di affidabilita 
        su clienti, fornitori e partner commerciali. Analizza fonti pubbliche (OSINT - 
        Open Source Intelligence) per costruire un profilo di rischio completo.
      </p>

      <div className="not-prose grid md:grid-cols-3 gap-4 my-8">
        <div className="glass-card rounded-xl p-5 border border-border/40">
          <Search className="size-8 text-primary mb-3" />
          <h4 className="font-semibold text-foreground mb-2">Ricerca Automatica</h4>
          <p className="text-sm text-muted-foreground">
            Scansione continua di registri pubblici, news, social media
          </p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-border/40">
          <Database className="size-8 text-primary mb-3" />
          <h4 className="font-semibold text-foreground mb-2">Multi-Fonte</h4>
          <p className="text-sm text-muted-foreground">
            CCIAA, ANAC, Tribunali, PEC, news economiche
          </p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-border/40">
          <Zap className="size-8 text-primary mb-3" />
          <h4 className="font-semibold text-foreground mb-2">Alert Proattivi</h4>
          <p className="text-sm text-muted-foreground">
            Notifica immediata se cambia lo stato di una controparte
          </p>
        </div>
      </div>

      <h2>Fonti Verificate</h2>
      <p>L'Advisor interroga automaticamente le seguenti fonti:</p>

      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-foreground">Fonte</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Dati Estratti</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Frequenza</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Registro Imprese (CCIAA)</td>
              <td className="py-3 px-4 text-muted-foreground">Stato attivita, sede, bilanci, cariche</td>
              <td className="py-3 px-4 text-primary">Ogni 24h</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Agenzia Entrate</td>
              <td className="py-3 px-4 text-muted-foreground">Validita P.IVA, stato operativo</td>
              <td className="py-3 px-4 text-primary">Real-time</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">ANAC</td>
              <td className="py-3 px-4 text-muted-foreground">Annotazioni, esclusioni, interdizioni</td>
              <td className="py-3 px-4 text-primary">Ogni 24h</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Tribunali</td>
              <td className="py-3 px-4 text-muted-foreground">Procedure concorsuali, fallimenti</td>
              <td className="py-3 px-4 text-primary">Ogni 7gg</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">Google News</td>
              <td className="py-3 px-4 text-muted-foreground">Notizie negative, reputazione</td>
              <td className="py-3 px-4 text-primary">Ogni 24h</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-foreground font-medium">LinkedIn</td>
              <td className="py-3 px-4 text-muted-foreground">Dimensione team, turnover</td>
              <td className="py-3 px-4 text-primary">Ogni 7gg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Calcolo Reliability Score</h2>
      <p>
        Il punteggio di affidabilita (0-100) viene calcolato su 5 dimensioni:
      </p>

      <div className="not-prose overflow-x-auto my-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-foreground">Dimensione</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Peso</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Indicatori</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">score_legal</td>
              <td className="py-3 px-4 text-primary">25%</td>
              <td className="py-3 px-4 text-muted-foreground">
                P.IVA valida, CCIAA attiva, no fallimenti
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">score_contributory</td>
              <td className="py-3 px-4 text-primary">20%</td>
              <td className="py-3 px-4 text-muted-foreground">
                DURC regolare, no debiti INPS/INAIL
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">score_reputation</td>
              <td className="py-3 px-4 text-primary">20%</td>
              <td className="py-3 px-4 text-muted-foreground">
                No annotazioni ANAC, no news negative
              </td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 px-4 text-foreground font-medium">score_solidity</td>
              <td className="py-3 px-4 text-primary">20%</td>
              <td className="py-3 px-4 text-muted-foreground">
                Capitale sociale, bilanci, fatturato
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-foreground font-medium">score_consistency</td>
              <td className="py-3 px-4 text-primary">15%</td>
              <td className="py-3 px-4 text-muted-foreground">
                Indirizzo coerente, website attivo, PEC valida
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Label di Affidabilita</h3>
      <div className="not-prose space-y-3 my-8">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Shield className="size-5 text-emerald-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">Excellent (85-100)</span>
            <span className="text-xs text-muted-foreground ml-2">Controparte altamente affidabile</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <CheckCircle className="size-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">Good (70-84)</span>
            <span className="text-xs text-muted-foreground ml-2">Nessun problema rilevato</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="size-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">Warning (50-69)</span>
            <span className="text-xs text-muted-foreground ml-2">Alcuni indicatori da monitorare</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <XCircle className="size-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">Risk (0-49)</span>
            <span className="text-xs text-muted-foreground ml-2">Criticita rilevate, approfondire</span>
          </div>
        </div>
      </div>

      <h2>Verification JSON</h2>
      <p>
        Per ogni controparte, l'Advisor genera un oggetto JSON strutturato 
        con i risultati delle verifiche:
      </p>

      <div className="not-prose glass-card rounded-xl p-6 border border-border/40 my-8 font-mono text-sm overflow-x-auto">
        <pre className="text-muted-foreground">
{`{
  "vat_valid": true,
  "cciaa_active": true,
  "cciaa_registration_date": "2015-03-12",
  "cciaa_address": "Via Roma 123, Milano",
  "bankruptcy_proceedings": false,
  "anac_annotations": false,
  "negative_news": false,
  "website_found": true,
  "contract_address_match": true,
  "contract_address_match_note": null,
  "sources_checked": [
    "agenzia_entrate",
    "cciaa_mi",
    "anac",
    "tribunale_mi",
    "google_news"
  ],
  "checked_at": "2026-03-22T10:30:00Z"
}`}
        </pre>
      </div>

      <h2>Flusso di Verifica</h2>
      <ol>
        <li><strong>Trigger:</strong> Nuova controparte creata o upload contratto</li>
        <li><strong>Estrazione:</strong> P.IVA e ragione sociale dal documento</li>
        <li><strong>Ricerca parallela:</strong> Query a tutte le fonti OSINT</li>
        <li><strong>Aggregazione:</strong> Calcolo score per dimensione</li>
        <li><strong>Label:</strong> Assegnazione reliability_label</li>
        <li><strong>Alert:</strong> Se Risk, notifica immediata all'utente</li>
        <li><strong>Monitoraggio:</strong> Re-check periodico ogni 7 giorni</li>
      </ol>

      <h2>Alert Automatici</h2>
      <p>Il sistema genera alert quando:</p>
      <ul>
        <li>Una controparte passa da Good a Warning o Risk</li>
        <li>Viene rilevata una nuova annotazione ANAC</li>
        <li>Viene aperta una procedura concorsuale</li>
        <li>La P.IVA risulta cessata</li>
        <li>Vengono pubblicate news negative significative</li>
      </ul>

      <h2>Privacy e Consenso</h2>
      <p>
        L'Advisor utilizza esclusivamente fonti pubbliche (OSINT). Non vengono 
        effettuate ricerche su dati personali non pubblici. Per le verifiche 
        sui dipendenti, e richiesto consenso esplicito (<code>osint_consent</code>).
      </p>
    </article>
  )
}
