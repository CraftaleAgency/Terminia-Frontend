export default function DatabaseDocsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="text-4xl font-bold mb-4">Schema Database</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Struttura completa del database PostgreSQL di Terminia con tutti i tipi, 
        le relazioni e gli enum.
      </p>

      <h2>Tabelle Principali</h2>

      <h3>companies</h3>
      <p>Tabella centrale per i dati aziendali dell'utente.</p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium text-foreground">Colonna</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Tipo</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Note</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-primary">id</td>
              <td className="py-2 px-3 text-muted-foreground">uuid</td>
              <td className="py-2 px-3 text-muted-foreground">PK</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">name</td>
              <td className="py-2 px-3 text-muted-foreground">text</td>
              <td className="py-2 px-3 text-muted-foreground">Ragione sociale</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">vat_number</td>
              <td className="py-2 px-3 text-muted-foreground">text</td>
              <td className="py-2 px-3 text-muted-foreground">P.IVA</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">ateco_code</td>
              <td className="py-2 px-3 text-muted-foreground">text</td>
              <td className="py-2 px-3 text-muted-foreground">Codice ATECO</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">size</td>
              <td className="py-2 px-3 text-muted-foreground">company_size</td>
              <td className="py-2 px-3 text-muted-foreground">micro | small | medium | large</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">certifications</td>
              <td className="py-2 px-3 text-muted-foreground">text[]</td>
              <td className="py-2 px-3 text-muted-foreground">ISO, SOA, ecc.</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-foreground">annual_revenue</td>
              <td className="py-2 px-3 text-muted-foreground">numeric</td>
              <td className="py-2 px-3 text-muted-foreground">Fatturato annuo</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>contracts</h3>
      <p>Tutti i contratti (commerciali e HR) dell'azienda.</p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium text-foreground">Colonna</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Tipo</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Note</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-primary">id</td>
              <td className="py-2 px-3 text-muted-foreground">uuid</td>
              <td className="py-2 px-3 text-muted-foreground">PK</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">contract_type</td>
              <td className="py-2 px-3 text-muted-foreground">contract_type</td>
              <td className="py-2 px-3 text-muted-foreground">service_supply | nda | permanent | ...</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">counterpart_id</td>
              <td className="py-2 px-3 text-muted-foreground">uuid</td>
              <td className="py-2 px-3 text-muted-foreground">FK counterparts (commerciali)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">employee_id</td>
              <td className="py-2 px-3 text-muted-foreground">uuid</td>
              <td className="py-2 px-3 text-muted-foreground">FK employees (HR)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">status</td>
              <td className="py-2 px-3 text-muted-foreground">contract_status</td>
              <td className="py-2 px-3 text-muted-foreground">draft | active | expiring | ...</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">value</td>
              <td className="py-2 px-3 text-muted-foreground">numeric</td>
              <td className="py-2 px-3 text-muted-foreground">Valore contratto</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">auto_renewal</td>
              <td className="py-2 px-3 text-muted-foreground">boolean</td>
              <td className="py-2 px-3 text-muted-foreground">Rinnovo tacito</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">risk_score</td>
              <td className="py-2 px-3 text-muted-foreground">integer</td>
              <td className="py-2 px-3 text-muted-foreground">0-100, calcolato da AI</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-foreground">embedding</td>
              <td className="py-2 px-3 text-muted-foreground">vector(1536)</td>
              <td className="py-2 px-3 text-muted-foreground">Per similarity search</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>counterparts</h3>
      <p>Clienti, fornitori e partner commerciali.</p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium text-foreground">Colonna</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Tipo</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Note</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">type</td>
              <td className="py-2 px-3 text-muted-foreground">counterpart_type</td>
              <td className="py-2 px-3 text-muted-foreground">supplier | client | partner</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">reliability_score</td>
              <td className="py-2 px-3 text-muted-foreground">integer</td>
              <td className="py-2 px-3 text-muted-foreground">0-100, da Advisor OSINT</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">reliability_label</td>
              <td className="py-2 px-3 text-muted-foreground">reliability_label</td>
              <td className="py-2 px-3 text-muted-foreground">excellent | good | warning | risk</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">verification_json</td>
              <td className="py-2 px-3 text-muted-foreground">jsonb</td>
              <td className="py-2 px-3 text-muted-foreground">Risultati OSINT</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-foreground">total_exposure</td>
              <td className="py-2 px-3 text-muted-foreground">numeric</td>
              <td className="py-2 px-3 text-muted-foreground">Esposizione totale</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>bandi</h3>
      <p>Bandi pubblici trovati da BandoRadar.</p>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium text-foreground">Colonna</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Tipo</th>
              <th className="text-left py-2 px-3 font-medium text-foreground">Note</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">source</td>
              <td className="py-2 px-3 text-muted-foreground">bando_source</td>
              <td className="py-2 px-3 text-muted-foreground">anac | ted_europa | ...</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">match_score</td>
              <td className="py-2 px-3 text-muted-foreground">integer</td>
              <td className="py-2 px-3 text-muted-foreground">0-100</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">match_breakdown</td>
              <td className="py-2 px-3 text-muted-foreground">jsonb</td>
              <td className="py-2 px-3 text-muted-foreground">Score per dimensione</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">gap_analysis_json</td>
              <td className="py-2 px-3 text-muted-foreground">jsonb</td>
              <td className="py-2 px-3 text-muted-foreground">Requisiti satisfied/missing</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 px-3 text-foreground">participation_status</td>
              <td className="py-2 px-3 text-muted-foreground">participation_status</td>
              <td className="py-2 px-3 text-muted-foreground">new | participating | won | ...</td>
            </tr>
            <tr>
              <td className="py-2 px-3 text-foreground">bando_embedding</td>
              <td className="py-2 px-3 text-muted-foreground">vector(1536)</td>
              <td className="py-2 px-3 text-muted-foreground">Per similarity search</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Enum Types</h2>
      
      <h3>contract_status</h3>
      <code className="text-sm">draft | negotiating | active | expiring | renewed | terminated | suspended</code>

      <h3>contract_type</h3>
      <p>Commerciali:</p>
      <code className="text-sm">service_supply | goods_supply | framework | nda | agency | partnership</code>
      <p className="mt-2">HR:</p>
      <code className="text-sm">permanent | fixed_term | part_time | cococo | vat_number | internship | apprenticeship</code>

      <h3>alert_type</h3>
      <code className="text-sm block overflow-x-auto whitespace-nowrap">auto_renewal | contract_expiry | obligation_due | payment_expected | fixed_term_expiry | new_bando_match | reliability_score_drop | ...</code>

      <h3>risk_level</h3>
      <code className="text-sm">low | medium | high | critical</code>

      <h2>Relazioni Chiave</h2>
      <ul>
        <li><code>contracts.counterpart_id</code> → <code>counterparts.id</code></li>
        <li><code>contracts.employee_id</code> → <code>employees.id</code></li>
        <li><code>contracts.parent_contract_id</code> → <code>contracts.id</code> (self-reference)</li>
        <li><code>alerts.contract_id</code> → <code>contracts.id</code></li>
        <li><code>alerts.bando_id</code> → <code>bandi.id</code></li>
        <li><code>invoices.contract_id</code> → <code>contracts.id</code></li>
        <li><code>clauses.contract_id</code> → <code>contracts.id</code></li>
      </ul>

      <h2>Indici e Performance</h2>
      <ul>
        <li>Indici B-tree su tutte le FK e colonne di lookup frequente</li>
        <li>Indice GIN su <code>contracts.tags</code> e <code>counterparts.tags</code></li>
        <li>Indice ivfflat su colonne vector per similarity search</li>
        <li>Partitioning su <code>alerts</code> per <code>trigger_date</code></li>
      </ul>
    </article>
  )
}
