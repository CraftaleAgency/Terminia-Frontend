# SPEC TECNICHE PAGINA FATTURE - Terminia

## Contesto
- **Percorso**: `/dashboard/invoices`
- **Stack**: Next.js 14+ App Router, React, Tailwind CSS, shadcn/ui, Framer Motion
- **Stile**: Glass morphism, gradient teal/cyan, animazioni subtle
- **Dati**: localStorage con funzioni helper già implementate in `lib/mock-data.ts`

---

## FUNZIONALITÀ RICHIESTE

### 1. Gestione Doppio Registro
Toggle per switchare tra:
- **Fatture Emesse (Attive)** - quelle che inviamo ai clienti
- **Fatture Ricevute (Passive)** - quelle che riceviamo dai fornitori

Ogni vista ha i propri KPI e la propria lista filtrata.

### 2. KPI Bar (3 card dinamiche)
**Per Fatture Emesse:**
- **Da incassare**: somma lordo delle fatture non pagate (unpaid + overdue)
- **Incassato**: somma lordo delle fatture pagate
- **Scadute**: somma lordo delle fatture scadute (status = overdue)

**Per Fatture Ricevute:**
- **Da pagare**: somma lordo delle fatture non pagate
- **Pagato**: somma lordo delle fatture pagate
- **Scadute**: somma lordo delle fatture scadute

### 3. Filtri Avanzati
- **Search**: ricerca full-text su numero fattura E nome controparte
- **Status**: dropdown con opzioni (Tutti / In attesa / Scaduta / Pagata)
- **Controparte**: dropdown searchable delle controparti
- **Scadenza**: date picker singolo (data fine)
- **Reset**: bottone per azzera tutti i filtri

### 4. Tabella Fatture
**Colonne richieste:**
1. **N. Fattura** - link a pagina dettaglio, primary color
2. **Controparte** - link a scheda controparte
3. **Contratto** - nome contratto se collegato, altrimenti placeholder
4. **Data Emissione** - formato "10 Mar 2025"
5. **Scadenza** - data + badge countdown se non pagata (tra X giorni / scaduta)
6. **Importo Netto** - allineato destra, formato €
7. **IVA** - percentuale + importo su seconda riga
8. **Totale Lordo** - allineato destra, bold, formato €
9. **Stato** - badge colorato al centro
10. **Azioni** - 3 icone: Visualizza, Segna pagata (se non pagata), Download

**Ordinamento:** Data emissione DESC (più recenti in alto)

### 5. Stati Fattura e Badge
- **Pagata (paid)**: verde, mostra anche data pagamento
- **In attesa (unpaid)**: grigio, mostra countdown giorni se > 7gg
- **Scaduta (overdue)**: rosso, mostra "scaduta" se data passata
- **Parziale (partial)**: arancione

**Regola automatica:** Se `due_date < today` E `payment_status != paid` → setta `overdue`

### 6. Azioni Rapide
- **Visualizza**: naviga a `/dashboard/invoices/[id]`
- **Segna pagata**: apre modal con solo DatePicker "Data pagamento" → aggiorna stato
- **Download**: azione placeholder (show toast "Download in arrivo")

---

## MODAL "Aggiungi Fattura"

### Campo Tipo (radio button)
- Due opzioni visive: "Emessa" (icona freccia su) / "Ricevuta" (icona freccia giù)
- Cambia etichette del form in base alla selezione

### Campi Obbligatori
1. **Controparte** - Select searchable da lista controparti
2. **Numero fattura** - Input text libero
3. **Data emissione** - DatePicker
4. **Scadenza** - DatePicker (default = +30 giorni dalla data emissione)
5. **Importo netto** - Input number (min 0, step 0.01)
6. **Aliquota IVA** - Select (22%, 10%, 5%, 4%, 0%)

### Campi Opzionali
- **Contratto collegato** - Select filtrata per controparte selezionata
- **Note** - Textarea

### Calcolo Automatico
Box riepilogativo che aggiorna in real-time:
- Importo IVA = netto × aliquota / 100
- Totale Lordo = netto + IVA

### Validazione
- Tutti i campi obbligatori required
- Scadenza deve essere posteriore a data emissione
- Importo netto deve essere > 0

---

## LOGICA APPLICATIVA

### Funzioni da Utilizzare (già in lib/mock-data.ts)
```typescript
getInvoices() // Tutte le fatture
getInvoicesByType(type: "active" | "passive") // Filtrate per tipo
saveInvoice(invoice) // Crea o aggiorna
deleteInvoice(id) // Elimina
markInvoiceAsPaid(id, paymentDate) // Segna pagata
getInvoiceKPIs(type) // Calcola KPI per tipo
```

### Tipi TypeScript
```typescript
type InvoiceType = "active" | "passive" // Emessa/Ricevuta
type PaymentStatus = "unpaid" | "partial" | "paid" | "overdue"

interface Invoice {
  id: string
  invoice_type: InvoiceType
  invoice_number: string
  counterpart_id?: string
  counterpart_name?: string
  contract_id?: string
  contract_name?: string
  invoice_date: string // YYYY-MM-DD
  due_date: string // YYYY-MM-DD
  amount_net: number
  vat_rate: number
  amount_gross: number
  payment_status: PaymentStatus
  payment_date?: string
}
```

### Calcolo Scadenze
```typescript
daysUntil(dueDate) // Giorni mancanti
// Se < 0: scaduta
// Se 0-7: urgente (rosso)
// Se 8-30: attenzione (arancione)
// Se > 30: ok (verde)
```

---

## REQUISITI UI/UX

### Animazioni
- Entrata pagina: fade-in + slide-up (stagger per card)
- Hover righe: background leggero + scale 1.01
- Modal: fade-in + scale-in
- Toggle: slide smoothly

### Empty States
Se nessuna fattura:
- Illustrazione placeholder (icona Document grande)
- Testo: "Nessuna fattura {emesse/ricevute}"
- CTA: "Aggiungi la prima fattura"

### Loading States
- Skeleton loader per tabella durante caricamento
- Spinner su bottone "Salva" durante submit

### Toast Notifications
- Success: "Fattura salvata con successo"
- Error: "Errore durante il salvataggio"
- Info: "Fattura segnata come pagata"

---

## NAVIGAZIONE

### Link Esterni
- Numero fattura → `/dashboard/invoices/[id]`
- Nome controparte → `/dashboard/counterparts/[id]`
- Nome contratto → `/dashboard/contracts/[id]`

### Breadcrumb
Non richiesto (siamo in pagina secondaria dashboard)

---

## RESPONSIVE BREAKPOINTS

### Mobile (< 640px)
- Toggle: stacked verticalmente, full-width
- KPI: 1 colonna
- Filtri: stacked
- Tabella: convertire in card view O hide colonne non-essenziali
  - Mantieni: numero, controparte, totale, status, azioni

### Tablet (640px - 1024px)
- KPI: 3 colonne
- Filtri: wrap a 2 colonne
- Tabella: horizontal scroll se necessario

### Desktop (> 1024px)
- Layout completo

---

## INTEGRAZIONE DATI

### Initial Load
1. Leggi `invoiceType` dallo state (default: "active")
2. Chiama `getInvoicesByType(invoiceType)`
3. Chiama `getInvoiceKPIs(invoiceType)`
4. Popola lista e KPI

### Salvataggio Nuova Fattura
1. Calcola `amount_gross` da `amount_net` + IVA
2. Crea oggetto invoice con tutti i campi
3. Chiama `saveInvoice(invoice)`
4. Refresh lista + KPI
5. Chiudi modal + toast success

### Aggiornamento Stato Pagamento
1. Click icona "Check" su riga
2. Apri modal con DatePicker data pagamento
3. Conferma → chiama `markInvoiceAsPaid(id, date)`
4. Refresh lista + KPI

### Cambio Tipo (Emesse/Ricevute)
1. Aggiorna state `invoiceType`
2. Refetch dati
3. Animazione transizione lista

---

## ACCESSIBILITÀ

- Keyboard navigation: Tab, Enter, Escape
- ARIA labels per icone senza testo
- Focus management in modal
- Screen reader friendly per tabella
- Color contrast ratio WCAG AA

---

## PERFORMANCE

- Pagination: 20 item per pagina (non implementare infinite scroll nell'MVP)
- Debounce search input (300ms)
- Memo per componenti lista
- Virtual scrolling solo se > 100 fatture (nice to have)

---

# SCHEDA FATTURE (Pagina Dettaglio)

## Contesto
- **Percorso**: `/dashboard/invoices/[id]`
- **Layout**: Header sticky + contenuto principale su 2 colonne

---

## STRUTTURA PAGINA

### Header (sticky)
**Elementi:**
- Breadcrumb: "Fatture > #{numero_fattura}"
- Titolo: "Fattura #{numero_fattura}" (H1 grande)
- Badge stato grande (pagata/in attesa/scaduta)
- Bottoni azione:
  - "Modifica" (icona Edit)
  - "Segna pagata" (icona Check, solo se non pagata)
  - "Scarica PDF" (icona Download)
  - Menu "⋮" con opzioni: Elimina, Duplica

### Layout Contenuto (2 colonne)
```
┌────────────────────────────────────────────────────────────────┐
│  Colonna Sinistra (60%)           │  Colonna Destra (40%)      │
│  ────────────────────────          │  ──────────────────────   │
│  📋 Dati Fattura                   │  📊 Riepilogo Importi      │
│  • Data emissione                   │  • Importo netto           │
│  • Data scadenza                    │  • IVA (22%)               │
│  • Contratto collegato              │  • TOTALE LORDO (grande)   │
│  • Note                             │                           │
│                                    │  🏢 Controparte           │
│                                    │  • Nome                   │
│                                    │  • P.IVA                  │
│                                    │  • PEC                    │
│                                    │  • Link a scheda          │
│                                    │                           │
│                                    │  📅 Timeline Stato        │
│                                    │  Creata → Scadenza →      │
│                                    │  (Scaduta) → Pagata       │
└────────────────────────────────────────────────────────────────┘
```

---

## SEZIONI DETTAGLIO

### Colonna Sinistra: Dati Fattura
**Card "Dati Fattura"**
- Data emissione: "15 Gennaio 2025"
- Data scadenza: "14 Febbraio 2025" + countdown se non pagata
- Contratto collegato: link a `/dashboard/contracts/[id]` se presente, altrimenti "Nessuno"
- Note: testo multilinea se presenti, altrimenti placeholder

**Stato Pagamento**
- Se pagata: mostra data pagamento + icona check verde
- Se non pagata: mostra giorni mancanti + badge urgente se scaduta
- Bottone "Segna come pagata" prominente

### Colonna Destra: Riepilogo
**Card "Riepilogo Importi"**
- Importo netto: € X.XXX (normale)
- IVA: XX% - € X.XXX (grigio, più piccolo)
- Separatore orizzontale
- Totale Lordo: € X.XXX (grande, bold, primary color)

**Card "Controparte"**
- Logo/icona aziendale (placeholder)
- Nomeazienda (link a scheda)
- Partita IVA
- PEC (clicabile mailto:)
- Bottone "Vedi scheda completa" → `/dashboard/counterparts/[id]`

**Timeline Stato Verticale**
4 step con timeline visiva:
1. **Creata** - data emissione (sempre completo)
2. **Scadenza** - data scadenza (completo se pagata prima, scaduto se overdue)
3. **Scaduta** - appare solo se overdue (step evidenziato in rosso)
4. **Pagata** - data pagamento (completo se paid, grigio se pending)

**Stile timeline:**
- Step completati: icona check verde, cerchio pieno
- Step corrente: icona orologio, cerchio con bordo colorato
- Step futuri: cerchio vuoto grigio
- Linea di connessione tra step

---

## MODAL "Segna come Pagata"

### Contenuto
Modal semplice con:
- Titolo: "Conferma Pagamento"
- DatePicker: "Data pagamento"
- Note opzionali: textarea
- Bottone "Conferma" (primario)
- Bottone "Annulla" (secondario)

### Comportamento
- Data default: oggi
- All conferma: chiama `markInvoiceAsPaid(id, date)`
- Success: toast + redirect a lista fatture

---

## MODAL "Modifica Fattura"

### Campi Modificabili
- Tutti i campi del form "Aggiungi Fattura" sono modificabili
- Eccezione: non si può cambiare il tipo (emesse/ricevute) dopo la creazione
- Calcolo automatico IVA aggiornato in real-time

### Validazione Extra
- Se fattura già pagata: avviso "Stai modificando una fattura già pagata"
- Require conferma prima di salvare

---

## AZIONI SECONDARIE

### Menu Dropdown (⋮)
**Opzioni:**
- **Elimina fattura**: mostra alert di conferma, poi chiama `deleteInvoice(id)`
- **Duplica fattura**: apre modal pre-compilato con stessi dati, nuovo numero

### Download PDF
- Azione placeholder nell'MVP
- Toast: "Funzionalità PDF in arrivo"

---

## INTEGRAZIONE DATI

### Initial Load
1. Leggi ID dai params URL
2. Chiama `getInvoice(id)`
3. Se non trovato: mostra 404 o redirect a lista
4. Popola tutti i campi

### Aggiornamento Stato
1. Click "Segna pagata"
2. Apri modal
3. Conferma → `markInvoiceAsPaid(id, date)`
4. Refresh dati pagina
5. Toast success

### Eliminazione
1. Click menu → Elimina
2. Alert conferma: "Sei sicuro di voler eliminare questa fattura?"
3. Conferma → `deleteInvoice(id)`
4. Redirect a `/dashboard/invoices`

---

## EMPTY STATES & ERROR STATES

### Fattura Non Trovata
- Titolo: "Fattura non trovata"
- Descrizione: "La fattura che stai cercando non esiste o è stata eliminata"
- CTA: "Torna alla lista fatture"

### Errore Caricamento
- Titolo: "Errore di caricamento"
- Descrizione: "Impossibile caricare i dati della fattura"
- CTA: "Riprova" / "Torna alla lista"

---

## RESPONSIVE

### Mobile (< 640px)
- Header: stacked (title + badge sopra, bottoni sotto)
- Layout: 1 colonna (stack verticale)
- Timeline: orizzontale se possibile, altrimenti verticale compatta
- Card riepilogo: prima della card dati fattura

### Tablet (640px - 1024px)
- Layout: 2 colonne mantenuto
- Card leggermente più strette
- Timeline: verticale ok

### Desktop (> 1024px)
- Layout completo come specificato

---

## STATI VISIVI

### Fattura Pagata
- Badge grande verde "PAGATA" in alto
- Timeline con step "Pagata" completato
- Nessun countdown
- Data pagamento visibile nella timeline

### Fattura In Attesa (non scaduta)
- Badge grigio "IN ATTESA"
- Countdown giorni (es. "tra 18 giorni")
- Step "Pagata" grigio (futuro)
- Bottone "Segna pagata" prominente

### Fattura Scaduta (overdue)
- Badge rosso "SCADUTA"
- Testo rosso "Scaduta da X giorni"
- Step "Scaduta" evidenziato in rosso
- Bottone "Segna pagata" con icona warning

### Fattura Parzialmente Pagata
- Badge arancione "PARZIALMENTE PAGATA"
- Mostra importo pagato / importo totale
- Timeline con step intermedio

---

## NAVIGAZIONE

### Breadcrumb
```
Fatture > #{numero_fattura}
```
- "Fatture" link a `/dashboard/invoices`
- Numero fattura è testo (non link)

### Link Correlati
- Nome controparte → `/dashboard/counterparts/[id]`
- Nome contratto → `/dashboard/contracts/[id]`
- Bottone "Torna alla lista" in basso

---

## ACCESSIBILITÀ

- Heading hierarchy corretta (H1 breadcrumb, H2 card titles)
- Focus order logico
- ARIA labels per bottoni icon-only
- Keyboard shortcuts:
  - Escape: chiudi modal
  - Ctrl/Cmd + E: focus campo modifica (se implementato)
  - Ctrl/Cmd + P: apre modal "Segna pagata" (nice to have)

---

## PERFORMANCE

- Lazy load dati controparte/contratto se non già in cache
- Memo per calcoli importi
- Non necessario pagination (singola fattura)
