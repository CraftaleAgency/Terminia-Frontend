# Documento Funzionale: Gestione Contratti e BandoRadar

## 1. Flusso Inserimento Nuovo Contratto

### 1.1 Accesso alla Pagina

L'utente accede alla funzione di inserimento contratto in due modi:

**Modalità A: Dal Dashboard**
1. Clicca sul bottone "+ Carica documento" in basso a destra (FAB button)
2. Oppure naviga in "Contratti" → clicca "+ Nuovo contratto"

**Modalità B: Pagina Diretta**
1. Va all'URL `/dashboard/contracts/new`

### 1.2 Scelta Modalità di Creazione

All'ingresso, l'utente vede due tab in alto:

**Tab "Carica PDF" (modalità AI)**
- Area drag & drop centrale con icona PDF
- Testo: "Trascina il contratto qui o clicca per selezionare"
- Formati accettati: PDF, DOCX (massimo 50MB)
- Sotto il box: "Oppure crea manualmente →"

**Tab "Crea Manuale"**
- Form multi-step compilabile manualmente
- Vedi sezione 1.4 per dettagli

### 1.3 Upload PDF e Analisi AI

#### Step 1: Upload del File

**Azioni Utente:**
1. Trascina il file PDF nell'area designata
   - OPPURE -
2. Clicca sull'area per aprire il file picker
3. Seleziona il file PDF dal computer

**Feedback Visivo:**
- Appare progress bar "Caricamento in corso..."
- Al completamento: "Analisi in corso..." con spinner
- Durata stimata: 10-30 secondi

#### Step 2: Classificazione AI

**Risultato - Scenario A: Alta Confidenza (>85%)**

Il sistema mostra un box verde:
```
✅ Contratto identificato con sicurezza
Tipo: Contratto di fornitura servizi
Confidenza: 92%

[Conferma e continua]
```

Cliccando "Conferma e continua" si procede direttamente allo Step 4.

**Risultato - Scenario B: Bassa Confidenza (<85%)**

Il sistema mostra un box giallo con domande AI:

```
⚠️ Contratto non classificato con certezza
Abbiamo bisogno di alcune informazioni

DOMANDA 1 di 3:
Questo contratto riguarda un fornitore o un dipendente?

[🏢 Fornitore]  [👤 Dipendente]
```

**Azioni Utente:**
- Risponde alle domande cliccando sui bottoni (NO campi testo)
- Massimo 5 domande per chiarire
- Ogni risposta mostra la domanda successiva

**Tipi di Domande AI:**
- Tipo attore: Fornitore vs Dipendente
- Categoria contrattuale: Servizi vs Beni vs Lavoro
- Presenza rinnovo: Sì vs No
- Tipo durata: Determinato vs Indeterminato

#### Step 2.1: Verifica OSINT Controparte (Solo Controparti)

Se la classificazione AI identifica una CONTROPARTE (fornitore, cliente, partner):
Il sistema lancia automaticamente la verifica OSINT parallela.

**Feedback Visivo:**
```
┌─────────────────────────────────────────────────────┐
│  VERIFICA CONTROPARTE IN CORSO...                   │
│                                                     │
│  Sto verificando "TechSupply Srl" (IT01234567890)  │
│  su Registro Imprese, ANAC, fonti pubbliche...      │
│                                                     │
│  ████████████████████ 100%                          │
│                                                     │
│  Risultato: RELIABILITY SCORE 78/100 BUONO         │
│  1 anomalia rilevata — vedi dettaglio               │
│                                                     │
│  [Vedi dettaglio verifica]  [Continua e salva]      │
└─────────────────────────────────────────────────────┘
```

**Per i DIPENDENTI:**
- Nessuna verifica OSINT estesa (GDPR compliance)
- Solo validazione Codice Fiscale (algoritmo locale)
- Validazione IBAN se presente

#### Step 2.2: Calcolo Reliability Score

Il Reliability Score è un punteggio 0-100 che indica l'affidabilità
della controparte basato su verifiche OSINT su fonti pubbliche italiane.

**STRUTTURA DEL PUNTEGGIO (TOTALE 100 punti):**

**LEGALE (0-30 punti)**
- P.IVA valida e attiva                    +10
- Società regolarmente iscritta CCIAA      +10
- Nessuna procedura fallimentare           +10
- Procedura in corso                       -20 (penalità)

**CONTRIBUTIVA (0-20 punti)**
- Nessuna segnalazione INPS/INAIL          +20
- Segnalazioni presenti                    -10 (penalità)
*Nota: DURC non verificabile automaticamente senza consenso*

**REPUTAZIONE PUBBLICA (0-20 punti)**
- Nessuna annotazione ANAC negativa        +10
- Nessuna notizia negativa rilevante       +10
- Annotazioni ANAC presenti                -15 (penalità)
- Notizie negative gravi                   -10 (penalità)

**PRESENZA E SOLIDITÀ (0-20 punti)**
- Sito web funzionante e coerente          +5
- Anni di attività (>5 anni)               +10
- Presenza LinkedIn / web professionale    +5
- Azienda costituita da meno di 1 anno    -5 (segnalazione)

**COERENZA CON IL CONTRATTO (0-10 punti)**
- Sede nel contratto = sede CCIAA          +5
- Rappresentante legale = firmatario       +5
- Discrepanze rilevate                     -10 (penalità)

**LABEL ASSOCIATI:**
- 80-100: "Eccellente" (verde)
- 60-79:  "Buono" (verde chiaro)
- 40-59:  "Attenzione" (giallo)
- 20-39:  "Rischio" (arancione)
- 0-19:   "Critico" (rosso)

#### Step 3: Preview Dati Estratti

Dopo la classificazione, il sistema mostra un form pre-compilato:

```
📋 Riepilogo Dati Estratti

Titolo contratto: [Contratto Fornitura Servizi IT]
Tipo: [Fornitura Servizi ▼]
Controparte rilevata: [TechSupply Srl]
Valore: [€ 45.000]
Periodicità: [Annuale ▼]
Data inizio: [15/01/2024]
Data fine: [31/05/2025]

Ogni campo è editabile - clicca per modificare
```

**Azioni Utente:**
1. Verifica ogni campo
2. Clicca sui campi da modificare per editare
3. Clicca "Salva e analizza clausole"

### 1.4 Creazione Manuale (Tab "Crea Manuale")

#### Step 1: Dati Generali

**Tipo Contratto**
- Dropdown con opzioni:
  - Fornitura Servizi
  - Fornitura Beni
  - Accordo Quadro
  - NDA
  - Agenzia
  - Partnership
  - Tempo Indeterminato
  - Tempo Determinato
  - Partita IVA
  - Collaborazione
  - Tirocinio
  - Apprendistato

**Attore Principale**
- Radio button: "Controparte" | "Dipendente"

**Se Controparte:**
- Dropdown: "Seleziona controparte" + link "+ Nuova controparte"
  - Mostra lista controparti esistenti
  - Ricerca live typing

**Se Dipendente:**
- Dropdown: "Seleziona dipendente" + link "+ Nuovo dipendente"

**Titolo Contratto**
- Campo testo libero (obbligatorio, min 3 caratteri)

**Numero Riferimento**
- Campo testo libero (opzionale)

**Stato Iniziale**
- Dropdown: Bozza | Negoziazione | Attivo

#### Step 2: Dati Economici (Collassabile)

Cliccando su "Dati Economici" si espande la sezione:

**Valore**
- Campo numerico: importo
- Dropdown: tipo valore (Totale | Annuale | Mensile | Orario)

**Termini di Pagamento**
- Campo numerico: giorni (es. 30, 60, 90)
- Etichetta: "giorni data fattura"

**Frequenza Pagamento**
- Dropdown: Mensile | Trimestrale | Milestone | Una Tanta | Annuale

**Regime IVA**
- Dropdown: Ordinario | Reverse Charge | Esente | Fuori Campo | Split Payment

**Aliquota IVA**
- Campo numerico: % (default 22%)
- Suggerimenti rapidi: 0% | 4% | 5% | 10% | 22%

**Ritenuta d'Acconto**
- Toggle: Sì | No
- Se attivo: campo aliquota %

**Indice ISTAT**
- Toggle: Sì | No
- Se attivo: campo mese riferimento

#### Step 3: Date (Collassabile)

**Date Chiave**
- Data firma: date picker
- Data inizio: date picker (obbligatorio)
- Data fine: date picker (obbligatorio per tempo determinato)
- Data efficacia: date picker (opzionale)

**Rinnovo Automatico**
- Toggle: Sì | No
- Se attivo:
  - Giorni preavviso: campo numerico (es. 30, 60)
  - Durata rinnovo: campo numerico in mesi (es. 12)

#### Step 4: Note e Tag (Collassabile)

**Note**
- Textarea: note libere sul contratto

**Tag**
- Input con autocomplet per aggiungere tag
- Tag suggeriti in base a tipo contratto, controparte

### 1.5 Salvataggio e Analisi Clausole

Dopo aver compilato il form (manuale o AI), cliccando "Salva contratto":

**Feedback Visivo:**
1. Bottone mostra stato "Salvataggio in corso..."
2. Successo: Toast "Contratto salvato con successo"
3. Redirect automatico alla pagina dettaglio contratto
4. Messaggio in overlay: "Analisi clausole in corso..."

**Analisi AI Background (non visibile all'utente):**
- Il sistema estrae le clausole dal PDF
- Identifica clausole a rischio
- Calcola risk score
- Genera riassunto in linguaggio naturale
- Crea obblighi e milestone

**Verifica OSINT Background (solo per controparti):**
- Se presente una controparte, lancia verifica OSINT parallela
- Verifica P.IVA su Registro Imprese e Agenzia Entrate
- Controlla procedure fallimentari presso tribunali
- Consulta casellario ANAC per annotazioni
- Cerca notizie negative e presenza web
- Calcola Reliability Score 0-100
- Crea o aggiorna scheda controparte con score salvato
- Genera alert se score < 60 o anomalie rilevate

**Durata stimata:** 30-60 secondi

**Notifica Completamento:**
- Toast: "Analisi completata - Contratto pronto"
- Badge verde sulla scheda contratto

---

## 2. Pagina Dettaglio Contratto

### 2.1 Struttura Pagina

La pagina è divisa in tre aree:

**Header (Sticky in alto)**
- Titolo contratto (H1)
- Badge: stato (es. "Attivo" in verde)
- Badge: risk score con colore (es. "28/100" in verde)
- Countdown: "Scade tra 45 giorni"
- Bottoni azione: "Modifica" | "Genera documento ▼" | "⋮ Altro"

**Sistema a Tab (Centro)**
8 tab navigabili cliccabili:
1. Riepilogo AI
2. Clausole
3. Obblighi
4. Milestone
5. Documenti
6. Fatture
7. Storico negoziazione
8. GDPR

**Sidebar (Destra, solo desktop)**
- Card controparte/dipendente
- Link "Vedi scheda →"
- Lista alert attivi (max 3)
- Lista contratti correlati

### 2.2 Tab 1: Riepilogo AI

**Contenuto:**
- Box azzurro con riassunto AI in linguaggio naturale
- Grid "Dati Economici": valore, tipo, pagamento, IVA, ritenuta
- Grid "Date Critiche": firma, inizio, fine, disdetta
- Box "Fidejussione" (se presente): importo, scadenza, emittente
- Box "Rinnovo Automatico" (se attivo): durata, preavviso, deadline

**Interazioni:**
- Nessuna interazione diretta (sola visualizzazione)
- Link ai tab correlati

### 2.3 Tab 2: Clausole

**Filtri in alto:**
- Toggle risk level: Tutte | Alto Rischio | Medio | Basso
- Filtri per tipo clausola

**Lista Clausole:**
Per ogni clausola:
- Header con tipo + risk level badge (🔴 Alto | 🟡 Medio | 🟢 Basso)
- Testo semplificato AI (in evidenza)
- Testo originale (collassabile - clic "▼" per espandere)
- Se AI Flag presente: box warning con spiegazione + suggerimento
- Se benchmark presente: "Confronta con mercato" link

**Colori Risk Level:**
- 🔴 Critico: rosso (score >80)
- 🟠 Alto: arancione (score 60-80)
- 🟡 Medio: giallo (score 40-60)
- 🟢 Basso: verde (score <40)

### 2.4 Tab 3: Obblighi

**Toggle in alto:**
- "Miei obblighi" | "Obblighi loro"

**Lista Obblighi:**
Per ogni obbligo:
- Descrizione obbligo
- Badge tipo: Pagamento | Consegna | Notifica | Compliance
- Data scadenza + countdown (colore in base urgenza)
- Ricorrenza (se presente): Mensile | Trimestrale | Annuale
- Status badge: In programma | In scadenza | Scaduto | Completato

**Azioni:**
- Bottone "Segna completato" → apre mini modal con nota
- Bottone "Posticipa" → apre date picker
- Bottone "+ Aggiungi obbligo manuale"

### 2.5 Tab 4: Milestone

**Timeline verticale:**
- Linea verticale che attraversa tutte le milestone
- Ogni milestone:
  - Titolo + descrizione
  - Data scadenza + countdown
  - Importo (se presente)
  - Status badge con colore
  - Se status = "Fatturabile": bottone "Genera fattura"

**Status Milestone:**
- Blu: Programmato
- Giallo: In corso
- Verde: Completato
- Viola: Approvato
- Arancione: Fatturabile
- Grigio: Fatturato

### 2.6 Tab 5: Documenti

**Lista Documenti:**
Per ogni documento:
- Nome file
- Badge tipo: Originale | Firmato | Emendamento | Allegato
- Versione: v1, v2, v3...
- Badge "Corrente" sul documento principale
- Data upload
- "Caricato da" + nome utente
- Badge stato firma (se presente): In attesa | Firmato
- Bottone download per ogni file

**Azioni:**
- Drag & drop per caricare nuovi documenti
- Bottone "+ Carica documento" apre file picker

### 2.7 Tab 6: Fatture

**Mini KPI in alto:**
- "Totale fatturato: € X / € Y (Z% del contratto)"
- Barra progresso visuale

**Lista Fatture:**
Stesso layout della pagina fatture, ma pre-filtrata per questo contratto.

**Azioni:**
- Bottone "+ Nuova fattura" → apre form pre-compilato

### 2.8 Tab 7: Storico Negoziazione

**Timeline eventi:**
- Linea verticale in ordine cronologico
- Ogni evento:
  - Tipo evento (icona + label)
  - "Iniziato da": Noi | Controparte
  - Descrizione
  - Data
  - Numero versione (se presente)

**Azioni:**
- Bottone "+ Aggiungi evento"

### 2.9 Tab 8: GDPR

**Se DPA presente:**
- Badge verde: "DPA Firmato il [data]"

**Se DPA mancante E controparte tratta dati:**
- Banner rosso: "⚠️ DPA mancante - Rischio violazione GDPR"
- Suggerimento: "Genera DPA GDPR"
- Bottone "Genera DPA" → apre wizard generazione documento

**Sezione Dati:**
- Categorie dati (lista)
- Finalità (testo)
- Periodo di retention (mesi)
- Sub-processori (lista)

---

## 3. Pagina BandoRadar

### 3.1 Accesso e Layout

**Accesso:**
- Menu laterale: "BandoRadar"
- Oppure dashboard widget: "Vedi tutti i bandi →"

**Layout:**
- KPI bar in alto (4 card)
- Barra filtri avanzata
- Toggle vista: Tabella | Card
- Lista bandi (card o tabella in base a toggle)

### 3.2 KPI Bar

**4 Card in alto:**

1. **Bandi trovati oggi**
   - Numero: count bandi caricati oggi
   - Delta: "+5 oggi" (se >0)

2. **Match >80%**
   - Numero: count bandi con match score ≥80%
   - Delta: "2 nuovi" (se ci sono nuovi)

3. **Scadono in 7gg**
   - Numero: count bandi che scadono entro 7 giorni
   - Colore: rosso se >0

4. **Sto partecipando**
   - Numero: count bandi con status "Partecipando" o "Inviato"
   - Sub-list: "1 in corso, 1 vinto, 2 persi"

### 3.3 Barra Filtri

**Filtri Disponibili:**

**Slider Match Score**
- Range: 0-100
- Default: 50
- Etichetta dinamica: "Match minimo: 50%"

**Multi-Select Fonte**
- Checkbox: ANAC | TED Europa | Invitalia | MIMIT | Regioni
- Default: Tutti selezionati

**Select Categoria**
- Dropdown: Tutte | Servizi | Beni | Lavori | Misto

**Range Picker Valore**
- Da: € [campo]
- A: € [campo]

**Select Scadenza**
- Dropdown: Tutte | 7gg | 30gg | 90gg | Tutti

**Select Status Partecipazione**
- Dropdown: Tutti | Nuovo | Salvato | In valutazione | Partecipando | Vinto | Perso | Ritirato

**Azioni:**
- Bottone "Azzera filtri"
- Filtri applicati in realtime (nessun bottone "cerca")

### 3.4 Toggle Vista Tabella/Card

**Posizione:**
- In alto a destra, sotto i filtri

**Aspetto:**
- Due bottoni affiancati con icone:
  - [📋 Tabella]
  - [⊞ Card]
- Bottone attivo: background primary, testo bianco
- Bottone inattivo: background muted, testo grigio

**Comportamento:**
- Clic cambia vista istantaneamente
- Preferenza salvata in localStorage
- Su mobile: forza card view automaticamente

### 3.5 Card View

**Struttura Card:**

**Header (colore in base urgenza scadenza)**
- 🔴 rosso: scade ≤7 giorni
- 🟡 giallo: scade ≤30 giorni
- ⚪ bianco/grigio: scade >30 giorni

**Contenuto:**
- Titolo bando (max 2 righe, truncate con "...")
- Ente + tipo ente badge
- "💰 Base d'asta: € 240.000"
- "📋 Categoria — Procedura"

**Box Match Score (centrale):**
- Progress bar orizzontale
- Percentuale grande con colore:
  - 80-100%: verde
  - 60-79%: giallo
  - 40-59%: arancione
  - <40%: grigio
- Breakdown 5 dimensioni:
  - Settore: 32/40
  - Dimensione: 22/30
  - Geo: 18/25
  - Requisiti: 12/20
  - Fattibilità: 3/20

**Footer con azioni:**
- Bottone primario: "Valuta →" (link a scheda bando)
- Bottone icona: "Salva" (bookmark)
- Bottone icona: "Ignora" (x)

**Animazioni:**
- Entrée: fade in + slide up (stagger 100ms tra card)
- Hover: leggera elevazione + shadow
- Click su "Ignora": fade out + rimozione dalla lista

### 3.6 Table View

**Colonne:**
1. Checkbox (per selezione multipla)
2. Scadenza (countdown + colore urgenza)
3. Titolo bando
4. Ente
5. Fonte (badge)
6. Base d'asta (€)
7. Match score (badge colorato)
8. Status (badge)
9. Azioni ("⋮")

**Ordinamento:**
- Clic su header colonna ordina
- Ordinamento default: Match score descendente

**Selezione Multipla:**
- Checkbox su ogni riga
- Header checkbox: seleziona/deseleziona tutte (visibili)
- Barra azioni bulk appare quando selezioni >0:
  - "Salva selezionati (X)"
  - "Ignora selezionati (X)"
  - "Esporta CSV (X)"

### 3.7 Refresh Bandi

**Bottone "Aggiorna ora" (vicino a KPI bar)**

**Azioni:**
1. Clic su bottone
2. Spinner su bottone
3. Toast: "Aggiornamento in corso..."
4. Durata: 10-30 secondi
5. Feedback completamento:
   - Toast: "Aggiornamento completato"
   - Toast: "5 nuovi bandi trovati" (se >0)
   - KPI bar aggiornata con nuove metriche

**Auto-Refresh:**
- Background refresh ogni 24 ore
- Notifica silenziosa (no toast se nessun nuovo bando)

---

## 4. Pagina Scheda Bando

### 4.1 Accesso

**Dalla lista bandi:**
- Clic su bottone "Valuta →" nella card
- Clic su titolo bando (table view)
- Clic su qualsiasi punto della card tranne azioni secondarie

### 4.2 Header

**Elementi:**
- Titolo bando (H1)
- Ente + badge tipo ente
- Fonte badge + link "Vai alla fonte →" (esterno)
- Scadenza countdown con colore
- Bottoni azione: "Torna alla lista", "Segnala problema"

**Box Match Score Grande (centrale):**
- Cerchio progressivo con %
- Colore in base score (vedi 3.5)
- Sotto: "[Analisi match dettagliata ▼]" (collassa/espande dettagli)

**Status Partecipazione:**
- Dropdown inline (clic per cambiare direttamente)
- Opzioni: Nuovo | Salvato | In valutazione | Partecipando | Inviato | Vinto | Perso | Ritirato
- Cambio salvato automaticamente (nessun bottone "salva")

### 4.3 Sistema a Tab (5 Tab)

**Tab 1: Dettaglio**
- Grid dati tecnici: CIG, CUP, fonte, procedura, categoria
- Grid date: pubblicazione, scadenza, sopralluogo, chiarimenti, aggiudicazione
- CPV codes con descrizione
- NUTS code (area geografica)
- Criteri aggiudicazione
- Link documenti tecnici (se disponibili)

**Tab 2: Analisi Match**
- Testo spiegazione AI del perché del match score
- Radar chart 5 dimensioni (vedi 3.5)
- Per ogni dimensione: spiegazione + score

**Tab 3: Gap Analysis**
- Lista requisiti bando
- Per ogni requisito:
  - Icona stato: ✅ Soddisfatto | ⚠️ Parzialmente | ❌ Mancante | ❓ Da verificare
  - Nome requisito
  - Spiegazione stato
  - Suggerimento AI su come colmare gap (se mancante/parziale)

**Sezione Subappalto:**
- Visibile solo se subappalto_allowed = true
- Mostra % massimo subappalto
- Suggerimento su quali gap coprire con subappalto

**Sezione RTI:**
- Visibile solo se rti_allowed = true
- Suggerimento su formazione RTI

**Tab 4: Checklist Documenti**
- Progress bar in alto: "Documenti pronti: 3/8 (37.5%)"
- Lista documenti necessari
- Per ogni documento:
  - Checkbox (persistente)
  - Nome documento
  - "Come ottenerlo": breve descrizione
  - "Tempo stimato": es. "5 min", "30 gg"
  - Badge "Lungo" se >7 giorni
  - Bottone "Segna come pronto" (abilita dopo click)
  - Bottone "Scarica modello" (se disponibile)

**Tab 5: Lotti**
- Visibile solo se lot_count >1
- Lista lotti con: numero, descrizione, valore, requisiti specifici

**Tab 6: Competitor**
- Titolo: "Storico aggiudicazioni simili"
- Lista aggiudicazioni passate per CPV simile
- Colonne: ente, anno, aggiudicatario, valore, ribasso %
- Insight AI: "Il ribasso medio in questo CPV è X%"

### 4.4 Sidebar (Destra)

**Box Azioni:**
- Dropdown status partecipazione (stesso dell'header)
- Se status = "Vinto": bottone "Ho vinto → Genera contratto"

**Box Note Interne:**
- Textarea libera per note personali
- Auto-salvataggio mentre si digita (nessun bottone salva)
- Persistente tra sessioni

**Alert Collegati:**
- Lista alert relativi a questo bando (max 3)
- Ogni alert: titolo + priorità + link

---

## 5. Componenti UI Riutilizzabili

### 5.1 Badge Colori

**Status Badge:**
- Bozza: grigio
- Negoziazione: blu
- Attivo: verde
- In Scadenza: giallo
- Rinnovato: verde chiaro
- Terminato: rosso

**Risk Score Badge:**
- 0-30: verde "Basso rischio"
- 31-60: giallo "Rischio medio"
- 61-80: arancione "Alto rischio"
- 81-100: rosso "Rischio critico"

**Reliability Badge:**
- 80-100: verde "Eccellente"
- 60-79: verde chiaro "Buono"
- 40-59: giallo "Attenzione"
- 20-39: arancione "Rischio"
- 0-19: rosso "Critico"
- null: grigio "Non verificato"

**Match Score Badge:**
- 80-100: verde
- 60-79: giallo
- 40-59: arancione
- <40: grigio

### 5.2 Countdown

**Comportamento:**
- Calcola giorni tra oggi e data target
- Se scaduto: testo rosso "Scaduto"
- Se ≤7 giorni: rosso "Scade tra X giorni"
- Se ≤30 giorni: giallo "Scade tra X giorni"
- Se >30 giorni: grigio "Scade tra X giorni"

### 5.3 Toast Notifications

**Tipi Toast:**
- Successo: verde + icona check
- Errore: rosso + icona X
- Warning: giallo + icona triangolo
- Info: blu + icona i

**Durata:**
- Successo: 3 secondi
- Errore: 5 secondi (o click per chiudere)
- Warning: 4 secondi
- Info: 4 secondi

**Posizione:**
- Bottom-right (desktop)
- Bottom-center (mobile)

### 5.4 Mini Modal

**Uso per:**
- "Segna obbligo completato"
- "Posticipa scadenza"
- "Modifica rapida"

**Caratteristiche:**
- Overlay scuro semi-trasparente
- Box bianco centrato
- Titolo + contenuto
- Bottoni "Annulla" + "Conferma"
- Click fuori = annulla
- Tasto ESC = annulla

### 5.5 Dropdown Menu

**Pattern azione "⋮ Altro":**
- Apre menu con 3-6 opzioni
- Prima opzione: azione principale (es. "Duplica")
- Seconda opzione: azione secondaria (es. "Archivia")
- Separatore
- Ultima opzione: azione distruttiva (es. "Elimina") in rosso

**Chiude su:**
- Selezione opzione
- Click fuori
- Tasto ESC

---

## 6. Stati di Caricamento

### 6.1 Skeleton Loading

**Durante caricamento dati:**
- Card con bordo + sfondo grigio chiaro
- Linee ondulate animate al posto del contenuto
- Struttura simile al contenuto finale

**Durata:**
- Lista: max 2 secondi
- Scheda dettaglio: max 3 secondi
- Oltre: mostra messaggio di errore

### 6.2 Empty States

**Lista vuota (es. 0 contratti):**
- Icona centrata (grande, grigia)
- Titolo: "Nessun contratto trovato"
- Sottotitolo: "Crea il tuo primo contratto per iniziare"
- CTA: "Crea contratto"

**Filtro senza risultati:**
- Icona centrata
- Titolo: "Nessun risultato per questi filtri"
- Sottotitolo: "Prova a modificare i filtri"
- CTA: "Azzera filtri"

### 6.3 Error States

**Errore caricamento:**
- Icona errore (rossa)
- Titolo: "Errore nel caricamento"
- Sottotitolo: messaggio errore tecnico
- CTA: "Riprova"

---

## 7. Responsive Design

### 7.1 Desktop (>1024px)

- Sidebar fissa a sinistra (260px)
- Tabella vista completa
- Card view: 3 colonne
- Tutti i filtri visibili orizzontalmente

### 7.2 Tablet (768px - 1024px)

- Sidebar collassata (hamburger menu)
- Card view: 2 colonne
- Filtri in accordion
- Sidebar dettaglio contratta: scompa in accordion sotto tabs

### 7.3 Mobile (<768px)

- No sidebar (menu drawer)
- Forza card view (niente tabella)
- Filtri in modal (bottone "Filtri" in alto)
- Tabs: orizzontali scroll
- Stack verticale tutto il contenuto
- Bottoni full-width

---

## 8. Shortcut Tastiera

### 8.1 Globali

- `CMD/CTRL + K`: Command palette (cerca globale)
- `CMD/CTRL + /`: Focus barra ricerca
- `ESC`: Chiude modal/dropdown/sidebar

### 8.2 Pagina Contratti

- `C`: Nuovo contratto
- `F`: Focus filtri
- `N`: Pagina successiva
- `P`: Pagina precedente

### 8.3 Scheda Contratto

- `E`: Modifica
- `TAB`: Prossimo tab
- `SHIFT + TAB`: Tab precedente
- `1-8`: Vai al tab numerato

---

## 9. Accessibilità

### 9.1 Focus Order

- Ordine logico tabulazione
- Focus ring visibile su tutti gli elementi interattivi
- Skip link: "Vai al contenuto principale"

### 9.2 Screen Reader

- Tutte le icone hanno testo alternativo (aria-label)
- Stati indicati con testo + icona (non solo colore)
- Form field con label associati
- Errori form letti dagli screen reader

### 9.3 Contrasto

- Ratio contrasto minimo 4.5:1 (WCAG AA)
- Testo su sfondo: sempre conforme
- Icone e decorazioni: esclusi dal requisito

---

## 10. Performance

### 10.1 Lazy Loading

- Immagini: lazy load sotto la fold
- Card bandi: load 20 alla volta, infinite scroll
- Tab contenuto: carica solo quando tab attivato

### 10.2 Ottimizzazioni

- Pagination per liste lunghe (20 items per pagina)
- Debounce ricerca (300ms)
- Throttle resize/scroll
- Virtualization per liste >100 items

---

## 11. Sistema OSINT Verification

### 11.1 Architettura del Sistema

Il sistema OSINT (Open Source Intelligence) verifica automaticamente
l'affidabilità delle controparti quando viene caricato un contratto.

**FLUSSO COMPLETO:**
```
UPLOAD CONTRATTO → AI classifica controparte
        |
        v
ESTRAZIONE DATI IDENTIFICATIVI
├── Ragione sociale
├── P.IVA / Codice Fiscale
├── Sede legale
└── Rappresentante legale (se presente)
        |
        v
OSINT ORCHESTRATOR — VERIFICA PARALLELA su fonti pubbliche
        |
        ├── REGISTRO IMPRESE (CCIAA)
        │   Verifica: società esiste, è attiva, sede corrisponde,
        │   capitale sociale, data costituzione, forma giuridica,
        │   eventuali procedure concorsuali in corso
        │   Fonte: API Registro Imprese / InfoCamere
        │
        ├── AGENZIA DELLE ENTRATE
        │   Verifica: P.IVA attiva e valida, non cessata
        │   Fonte: servizio verifica P.IVA pubblica AE
        │
        ├── INPS / INAIL — DURC
        │   Verifica: regolarità contributiva
        │   Nota: il DURC ufficiale richiede consenso,
        │   ma esistono segnali indiretti pubblici
        │
        ├── TRIBUNALI — PROCEDURE FALLIMENTARI
        │   Verifica: fallimento, concordato, liquidazione,
        │   amministrazione straordinaria
        │   Fonte: Portale dei Fallimenti / REIBO
        │
        ├── ANAC — CASELLARIO FORNITORI
        │   Verifica: annotazioni negative, esclusioni da gare,
        │   false dichiarazioni, reati gravi
        │   Fonte: ANAC Casellario Informatico
        │
        ├── NEWS & WEB SEARCH
        │   Verifica: notizie negative, cause legali pubbliche,
        │   scandali, recensioni gravi su piattaforme B2B
        │   Fonte: ricerca web in tempo reale
        │
        └── LINKEDIN / WEB — ESISTENZA REALE
            Verifica: azienda ha presenza online reale,
            sito web funzionante, profili social coerenti
            Segnala se azienda "fantasma" senza tracce online
```

### 11.2 Per le Controparti

**APPLICAZIONE:**
- Verifica completa automatica su fonti pubbliche
- Calcolo Reliability Score 0-100
- Salvataggio automatico in scheda controparte
- Alert automatici se score scende sotto 60

**DISPLAY NELLA SCHEDA CONTROPARTE:**
```
┌─────────────────────────────────────────────────────┐
│  TechSupply Srl                                       │
│  [FORNITORE]                                          │
│                                                       │
│─────────────────────────────────────────────────────│
│  RELIABILITY SCORE                                    │
│                                                       │
│  78 / 100   BUONO                                    │
│  ████████████████░░░░  Aggiornato: oggi 08:30        │
│                                                       │
│  Dettaglio:                                           │
│  ✅ P.IVA attiva e valida                             │
│  ✅ Iscritta CCIAA dal 2008 (17 anni di attività)    │
│  ✅ Nessuna procedura concorsuale                    │
│  ✅ Nessuna annotazione ANAC                         │
│  ⚠️ Sede contratto (Via Roma 1) non corrisponde     │
│     alla sede CCIAA (Via Verdi 5) — verifica         │
│  ⚠️ Nessun sito web rilevato — verifica esistenza   │
│  ❓ Regolarità contributiva non verificabile         │
│     automaticamente — richiedi DURC                  │
│                                                       │
│  [Aggiorna verifica]  [Richiedi DURC manuale]        │
└─────────────────────────────────────────────────────┘
```

### 11.3 Per i Dipendenti (GDPR Compliant)

**LIMITAZIONI ETICHE E LEGALI:**
- Nessuna OSINT estesa su persone fisiche senza consenso
- Nessun dato inviato a servizi esterni senza consenso esplicito
- Log di ogni verifica nel audit trail con base giuridica

**VERIFICHE CONSENTITE (locale):**
- Validità codice fiscale (algoritmo matematico)
- Corrispondenza CF con nome/cognome/data nascita
- Validità IBAN per pagamento stipendio
- Coerenza dati anagrafici interni

**VERIFICHE NON CONSENTITE (senza consenso esplicito):**
- Ricerca web sulla persona
- Verifica LinkedIn
- Ricerca notizie
- Qualsiasi OSINT su persona fisica privata

**CONSENSO OPZIONALE:**
L'utente può attivare "OSINT esteso" per dipendenti con:
- Checkbox opt-in durante onboarding
- Data e ora del consenso registrato
- Possibilità di revocare in qualsiasi momento

### 11.4 Quando Rieseguire la Verifica

**TRIGGER AUTOMATICI:**
```
┌────────────────────────────────────────────────────────┐
│ Trigger                    Azione                     │
├────────────────────────────────────────────────────────┤
│ Primo caricamento contratto   Verifica completa       │
│ Rinnovo contratto             Re-verifica automatica   │
│ Cron mensile                  Re-verifica tutte       │
│                               le controparti attive   │
│ Score scende sotto 60         Alert automatico        │
│ Nuova annotazione ANAC        Alert urgente           │
│ Manuale dall'utente           Bottone "Aggiorna"      │
└────────────────────────────────────────────────────────┘
```

### 11.5 API Reali da Integrare (Fase 2)

**FONTI DATI UFFICIALI:**
- Registro Imprese (InfoCamere): https://www.infocamere.it/
- ANAC Casellario: https://www.anac.it/
- Portale Fallimenti: https://www.fallimenti.publicgiustizia.it/
- Agenzia Entrate: Verifica P.IVA (API pubblica)

### 11.6 Archiviazione Dati Verifica

**DATABASE SCHEMA:**
Ogni controparte ha:
- `reliability_score` (int 0-100)
- `reliability_label` (text)
- `reliability_updated_at` (timestamp)
- `verification_json` (jsonb)
- `score_legal` (int 0-30)
- `score_contributory` (int 0-20)
- `score_reputation` (int 0-20)
- `score_solidity` (int 0-20)
- `score_consistency` (int 0-10)
- `has_bankruptcy` (boolean)
- `has_anac_annotations` (boolean)
- `vat_verified` (boolean)

---

**Documento:** Specifica Funzionale Contratti e BandoRadar
**Versione:** 1.1
**Data:** 22 Marzo 2026
**Stato:** Finale (con OSINT Verification)
