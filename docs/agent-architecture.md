# Architettura Agenti OpenClaw - Terminia NemoClaw

## 1. Overview della Piattaforma Agent

Terminia-Nemoclaw implementa una piattaforma di agenti AI sandbox basata su **NVIDIA NemoClaw** e **OpenShell**, con 10 skill OpenClaw che operano in un ambiente isolato e sicuro.

### Componenti Chiave
- **OpenClaw Sandbox**: Ambiente di esecuzione isolato per gli agenti
- **OpenShell Gateway**: Gateway che gestisce il lifecycle dei sandbox (porta 18789:30051)
- **Skills OpenClaw**: 10 skill JavaScript per automazione business intelligence
- **Nebula Inference Stack**: 4 modelli llama.cpp dietro proxy LiteLLM

---

## 2. Architettura OpenShell Gateway

### 2.1 Configurazione Container

```yaml
openshell-gateway:
  image: ghcr.io/nvidia/openshell/cluster:0.0.16
  privileged: true
  pid: host
  ports:
    - "18789:30051"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock   # gestisce sandbox containers
    - nemoclaw-data:/root/.nemoclaw
    - openshell-data:/root/.openshell
    - sandbox-data:/sandbox
```

**Caratteristiche principali:**
- Container privilegiato con accesso a Docker socket
- Gestione dinamica dei sandbox (non sono servizi compose)
- Intercezza delle chiamate inference verso https://inference.local
- Injection automatica delle credenziali API

### 2.2 CLI NemoClaw

Il CLI è installato sull'host (non nei container) e permette di gestire il sandbox:

| Comando | Scopo |
|---------|-------|
| `nemoclaw terminia connect` | Entra nella shell del sandbox |
| `nemoclaw terminia status` | Health + status inference |
| `nemoclaw terminia logs --follow` | Stream log sandbox |
| `openshell sandbox connect terminia -- <cmd>` | Esegue comando nel sandbox |
| `openshell sandbox upload terminia <src> <dst>` | Upload file nel sandbox |
| `openshell sandbox download terminia <src> <dst>` | Download file dal sandbox |
| `openshell term` | TUI: monitora agenti, approva egress rete |
| `openshell provider create ...` | Registra provider inference |
| `openshell inference set --provider litellm --model nemotron-orchestrator` | Setta modello attivo |
| `openshell policy set <file>` | Applica policy rete/filesystem |

---

## 3. Isolamento e Policy del Sandbox

### 3.1 Policy Network (Deny-by-Default)

Il sandbox opera con una **whitelist rigorosa** - solo gli endpoint approvati sono raggiungibili:

| Regola | Endpoint | Binari | Metodi |
|--------|----------|--------|--------|
| inference | inference.local:443 | openclaw | ALL |
| supabase | *.supabase.co:443 | node, openclaw | ALL |
| vies_api | ec.europa.eu:443 | node | GET, POST |
| anac_opendata | dati.anticorruzione.it:443 | node | GET |
| anac_casellario | casellario.anticorruzione.it:443 | node | GET, POST |
| ted_europa | ted.europa.eu:443, api.ted.europa.eu:443 | node | GET |

**Richieste non in whitelist** richiedono approvazione operator via TUI `openshell term`.

### 3.2 Policy Filesystem

```yaml
filesystem:
  read_write:
    - /sandbox
    - /tmp
    - /dev/null
  read_only:
    - /usr
    - /lib
    - /proc
    - /dev/urandom
    - /app
    - /etc
    - /var/log
```

**Principio di sicurezza**: Solo /sandbox e /tmp sono scrivibili, tutto il resto è read-only o negato.

### 3.3 Isolamento Credenziali

| Credenziale | Location | Visibile al sandbox? |
|-------------|----------|---------------------|
| Inference API keys | ~/.nemoclaw/credentials.json (host) | **No** - inject da gateway |
| Supabase service role | Sandbox env var | **Sì** - richiesto dalle skill |
| VIES API key | Sandbox env var | **Sì** - richiesto da osint-vat |

---

## 4. Inference Routing

### 4.1 Flusso Richiesta

```
Agent Code (skill)
    │
    │ POST inference.local /v1/chat/completions
    ▼
OpenShell Gateway (intercept)
    │
    │ POST litellm-proxy:4000 /v1/chat/completions
    │ + injected api_key
    ▼
LiteLLM Proxy (routing by model alias)
    │
    ├─▶ llama-server-orchestrator:8080 (nemotron-orchestrator)
    ├─▶ llama-server-worker:8080 (nemotron-nano/fast)
    └─▶ llama-server-ocr:8080 (numarkdown/ocr)
```

### 4.2 Helper callInference()

Ogni skill usa l'helper da `_shared/utils.js`:

```javascript
const response = await fetch('https://inference.local/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'nemotron-orchestrator',  // risolto da LiteLLM
    messages: [...],
    temperature: 0.2,
    max_tokens: 4096,
  }),
});
```

### 4.3 Modelli Disponibili

| Alias | Modello | Container | Vision | Scopo |
|-------|---------|-----------|--------|-------|
| nemotron-orchestrator | Nemotron-Orchestrator-8B | llama-server-orchestrator:8080 | No | Task planning, ragionamento complesso |
| nemotron-nano / fast | NVIDIA-Nemotron3-Nano-4B | llama-server-worker:8080 | No | Esecuzione veloce |
| numarkdown / ocr | NuMarkdown-8B-Thinking | llama-server-ocr:8080 | **Sì** | OCR documenti |

---

## 5. OpenClaw Skills

### 5.1 Inventario Skill (10 totali)

Le skill sono divise in 3 categorie:

#### Contract Pipeline (4 skill)
1. **document-preprocessor**: PDF/DOCX/Image → clean text (con OCR se necessario)
2. **contract-classify**: Type, parties, language, confidence
3. **contract-extract**: Dates, values, clauses, obligations, milestones
4. **contract-risk-score**: Risk score 0-100, alerts

#### OSINT (3 skill)
5. **osint-cf**: Validazione Codice Fiscale (algoritmo locale)
6. **osint-vat**: Validazione P.IVA via VIES API (cached 30d)
7. **osint-anac-casellario**: Annotations ANAC (scraping, cached 7d)

#### BandoRadar (3 skill)
8. **bandi-sync-anac**: Sync bandi ANAC (cron 06:00)
9. **bandi-sync-ted**: Sync TED Europa (cron 06:30)
10. **bandi-match**: Match scoring via inference (cron 07:00)

### 5.2 Trigger e Automazione

**Le skill NON sono direttamente invocabili** - si attivano automaticamente:

| Skill | Trigger | Input → Output |
|-------|---------|----------------|
| document-preprocessor | Upload contratto | Storage path → Clean text |
| contract-classify | After preprocessing | Text → Contract type, parties |
| contract-extract | After classification | Text + contract_id → Dates, values, clauses |
| contract-risk-score | After extraction | contract_id → Risk score, alerts |
| osint-* | Counterpart extracted | VAT/CF → Validation results |
| bandi-sync-* | Cron (06:00, 06:30) | — → Synced bandi |
| bandi-match | Cron (07:00) | company_id → Matched bandi |

### 5.3 Pipeline Contract Completa

```
Upload PDF (Supabase Storage)
    │
    ▼
document-preprocessor (model: ocr)
    │ PDF/DOCX/Image → clean text
    ▼
contract-classify (model: orchestrator)
    │ 13 tipi contratti riconosciuti
    ▼
contract-extract (model: orchestrator)
    │ Writes: contracts + clauses + obligations + milestones + scope_items
    │
    ├───────┬────────────────────┐
    ▼       ▼                    ▼
contract-  OSINT chain         Dashboard
risk-score (cf, vat, anac)     (Frontend)
```

### 5.4 OSINT Chain

Quando `contract-extract` trova identificatori controparte:

```
{ counterpart_identifiers: { vat, cf, name } }
    │
    ├─▶ osint-cf(codice_fiscale=cf)
    │   └─▶ counterparts.cf_valid, cf_details (algoritmo locale)
    │
    ├─▶ osint-vat(vat_number=vat)
    │   ├─ Check cache (30d TTL)
    │   ├─ If miss → VIES API
    │   └─▶ counterparts.vat_valid, vat_details
    │
    └─▶ osint-anac-casellario(vat_number=vat, company_name=name)
        ├─ Check cache (7d TTL)
        ├─ If miss → scrape casellario.anticorruzione.it
        └─▶ counterparts.anac_annotations, anac_checked_at
```

**Output**: `reliability_score` (0-100) composto da:
- Legal (30): ANAC Casellario
- Contributory (20): VIES
- Reputation (20): ANAC history + inference
- Solidity (20): Financial indicators
- Consistency (10): CF validation + cross-checks

### 5.5 BandoRadar Pipeline

```
06:00                     06:30                     07:00
    │                         │                         │
    ▼                         ▼                         ▼
┌──────────┐          ┌──────────┐          ┌──────────────────┐
│bandi-sync│          │bandi-sync│          │   bandi-match    │
│  -anac   │          │  -ted    │          │                  │
│          │          │          │          │ For each company: │
│ Download │          │ Query    │          │  - Load profile  │
│ CSV/JSON │          │ API for  │          │  - Score each    │
│ datasets │          │ Italian  │          │    new bando     │
│          │          │ notices  │          │  - 5-dimension   │
│ Dedup by │          │          │          │    scoring via   │
│ CIG code │          │ Dedup by │          │    inference     │
│          │          │ TED ID   │          │  - Alert if >80% │
└────┬─────┘          └────┬─────┘          └────────┬─────────┘
     │                     │                         │
     └─────────┬───────────┘                         │
               ▼                                     ▼
     ┌──────────────────┐              ┌──────────────────────┐
     │  Supabase: bandi  │              │  Supabase: alerts    │
     │  table (upsert)   │              │  (high-match bandi)  │
     └──────────────────┘              └──────────────────────┘
```

**Match Score** (5 dimensioni, max 100):
- Sector (35): CPV↔ATECO mapping via inference
- Size (25): Contract value vs company revenue
- Geo (20): Geographic proximity
- Requirements (15): Technical vs capabilities
- Feasibility (5): Timeline, resources

---

## 6. Workspace Agent

I file che definiscono la personalità e comportamento dell'agente:

| File | Purpose |
|------|---------|
| **SOUL.md** | Personality, tone, behavioral rules, available skills |
| **IDENTITY.md** | Agent name (Terminia), emoji, tagline, self-introduction |
| **USER.md** | Default company profile template (populated per-user) |
| **AGENTS.md** | Skill orchestration flows, safety guidelines, memory conventions |

Questi file sono uploadati in `/sandbox/.openclaw/workspace/` durante `setup.sh`.

---

## 7. Moduli Condivisi

### 7.1 skills/_shared/

Tutte le skill importano da tre moduli condivisi:

#### supabase-client.js
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```
**Service role bypassa RLS** - le skill hanno pieno accesso al database.

#### cache.js
Cache Supabase con TTL configurabile:
- `getCached(table, keyColumn, keyValue, timestampColumn, maxAgeMinutes)`
- `setCache(table, data, conflictColumn)`

#### utils.js
Funzioni utility:
- `callInference(systemPrompt, userMessage, options)`: POST a inference.local
- `parseInferenceJSON(text)`: Strip markdown, parse JSON
- `computeReliabilityScore({...})`: Score 0-100
- `computeMatchScore({...})`: Bando match score
- `reliabilityLabel(score)`: Labels (excellent|good|warning|risk)
- `isoNow()`: Current UTC ISO 8601

---

## 8. Security & Compliance

### 8.1 GDPR Compliance

| Aspect | Implementation |
|--------|----------------|
| **osint-cf** | Pure local computation - no dati personali escono dal sandbox |
| **Dati dipendenti** | Tabelle dedicate Supabase con RLS |
| **Dati controparti** | Business data, non personali sotto GDPR |
| **Cache TTL** | Refresh periodico per dati stale |

### 8.2 Credential Isolation

- Inference API keys: Mai visibili nel sandbox (inject da gateway)
- Supabase service role: Visibile (richiesto dalle skill)
- VIES API key: Sandbox env var

### 8.3 Network Security

**Approccio deny-by-default**:
- Solo endpoint whitelist approvati
- Richieste non approvate richiedono ok operator via TUI
- Policy definibile in `nemoclaw/policies/openclaw-sandbox.yaml`

---

## 9. Deployment

### 9.1 First-Time Setup

```bash
# 1. Crea rete Docker condivisa
./nebula/create-network.sh

# 2. Configura environment
cp nebula/.env.example nebula/.env
cp nemoclaw/.env.example nemoclaw/.env

# 3. Deploy stack inference Nebula
cd nebula && docker compose up -d

# 4. Onboarding NemoClaw (wizard guidato)
nemoclaw onboard

# 5. Upload skills, workspace, env vars, cron
cd nemoclaw && ./setup.sh
```

### 9.2 setup.sh

Esegue:
1. Wait per OpenShell gateway health
2. Upload tutte le 10 skill in `/sandbox/.openclaw/skills/`
3. Upload workspace files in `/sandbox/.openclaw/workspace/`
4. Set Supabase + VIES credentials come env vars
5. Configura cron BandoRadar (06:00/06:30/07:00)
6. Start Telegram bot bridge (se TELEGRAM_BOT_TOKEN presente)

---

## 10. External Integrations

| Source | Method | Cost | Rate Limits | Used By |
|--------|--------|------|-------------|---------|
| ANAC OpenData | REST/CSV | Free | None | bandi-sync-anac |
| TED Europa | REST API | Free | Fair use | bandi-sync-ted |
| VIES | REST API | Free | ~100 req/min | osint-vat |
| ANAC Casellario | Scraping | Free | Be respectful | osint-anac-casellario |
| Supabase | Client library | Per plan | Per plan | All skills |

**Priority & Reliability**:
- **Supabase**: Critical, High
- **VIES**: High, Medium (cache 30d + graceful error)
- **ANAC OpenData**: Medium, Medium
- **TED Europa**: Medium, High
- **ANAC Casellario**: Low, Low (scraping, cache 7d)

---

## 11. Telegram Bot Bridge

NemoClaw include un bridge Telegram per interazione diretta con l'assistente Terminia AI.

### Configurazione
- Bot token in `nemoclaw/.env` come `TELEGRAM_BOT_TOKEN` (mai committare)
- Start automatico via `setup.sh` o manuale: `nemoclaw start --telegram`

### Comandi
| Comando | Descrizione |
|---------|-------------|
| `/start` | Welcome message + usage |
| `/help` | Lista comandi e capabilities |
| (regular message) | Query contratti processata da Terminia AI |

**Language**: Italian (target audience: professionisti gare pubbliche italiane)

---

## 12. Health Checks

```bash
curl http://localhost:8083/health   # orchestrator
curl http://localhost:8084/health   # worker
curl http://localhost:8086/health   # OCR
curl http://localhost:4000/health   # litellm-proxy
curl http://localhost:18789/health  # openshell-gateway
```

---

## 13. Architettura Reti Docker

```
┌─────────────────────────────────────────────────────────────┐
│         llmserver-ai-network  (172.28.0.0/16)               │
│                                                             │
│  llama-server-orchestrator:8080                             │
│  llama-server-worker:8080                                   │
│  llama-server-ocr:8080                                      │
│  litellm-proxy:4000                                         │
│  openshell-gateway:30051                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │ (dual-homed containers)
┌─────────────────────▼───────────────────────────────────────┐
│         dokploy-network  (10.0.1.0/24)                      │
│  Traefik reverse proxy → Cloudflare Tunnel                  │
└─────────────────────────────────────────────────────────────┘
```

Entrambe le reti sono `external: true` - create una volta con `nebula/create-network.sh`.

---

## 14. Tipi Contratto Riconosciuti

La skill `contract-classify` riconosce 13 tipi:

- appalto_servizi
- appalto_lavori
- fornitura
- consulenza
- licenza_software
- locazione
- lavoro_subordinato
- lavoro_determinato
- somministrazione
- collaborazione
- nda
- framework
- altro

---

## 15. Risk Scoring Rules

Punteggio più alto = più rischioso:

| Category | Condition | Points |
|----------|-----------|--------|
| Renewal | Auto-renewal + no notice | +15 |
| Renewal | Auto-renewal + notice < 30 days | +10 |
| Payment | payment_terms_days > 60 | +10 |
| Duration | No end_date (indefinite) | +5 |
| Clauses | Any critical-risk clause | +20 |
| Clauses | Each high-risk clause (max +30) | +10 |
| Specific | non_compete ≥ medium | +15 |
| Specific | limitazione_responsabilita ≥ high | +10 |
| Obligations | Past-due deadline | +5 each |

---

## 16. Dettaglio Integrazioni

TerminIA si integra con le principali fonti dati pubbliche italiane ed europee per offrire una visione completa delle opportunità di gara e dell'affidabilità delle controparti.

### 16.1 ANAC OpenData

**Descrizione**: Bandi di gara pubblicati dall'ANAC (Autorità Nazionale Anticorruzione). Contiene tutti i bandi italiani sopra e sotto soglia.

| Proprietà | Valore |
|-----------|--------|
| **Tipo Accesso** | Download CSV/JSON |
| **Costo** | Gratuito |
| **Difficoltà** | Alta |
| **Rate Limits** | Nessuno |
| **Skill** | bandi-sync-anac |
| **Frequenza** | Giornaliera (06:00 UTC) |

**Implementazione**:
```javascript
// skill: bandi-sync-anac
async function fetch_anac_bandi() {
  // Download CSV/JSON da dati.anticorruzione.it
  const response = await fetch('https://dati.anticorruzione.it/open/data/bandi.csv');
  const data = await parseCSV(response);

  // Dedup by CIG code
  const unique = dedupByCIG(data);

  // Upsert su Supabase
  await supabase.from('bandi').upsert(unique);

  return { synced: unique.length, skipped: data.length - unique.length };
}
```

**Deduplicazione**: I bandi sono deduplicati per codice CIG prima dell'inserimento nel database.

### 16.2 TED Europa API

**Descrizione**: Tenders Electronic Daily - Bandi di gara europei sopra soglia comunitaria. Fonte ufficiale per tutte le gare EU.

| Proprietà | Valore |
|-----------|--------|
| **Tipo Accesso** | REST API |
| **Costo** | Gratuito |
| **Difficoltà** | Alta |
| **Rate Limits** | Fair use |
| **Skill** | bandi-sync-ted |
| **Frequenza** | Giornaliera (06:30 UTC) |

**Implementazione**:
```javascript
// skill: bandi-sync-ted
async function fetch_ted_europa(days_back = 1) {
  // Query API per notizie italiane
  const endpoint = 'https://api.ted.europa.eu/v1/notifications/search';
  const params = {
    country: 'IT',
    days_back: days_back
  };

  const response = await fetch(`${endpoint}?${new URLSearchParams(params)}`);
  const data = await response.json();

  // Parse notices
  const bandi = parseTEDNotices(data);

  // Dedup by TED ID
  const unique = dedupByTEDId(bandi);

  // Upsert su Supabase
  await supabase.from('bandi').upsert(unique);

  return { synced: unique.length, skipped: bandi.length - unique.length };
}
```

**Filtro**: Solo notifiche italiane (`country: 'IT'`).

### 16.3 VIESAC (VAT Information Exchange System)

**Descrizione**: Verifica Partita IVA europea per controlli automatizzati su fornitori comunitari.

| Proprietà | Valore |
|-----------|--------|
| **Tipo Accesso** | REST API + Key |
| **Costo** | Gratuito |
| **Difficoltà** | Alta |
| **Rate Limits** | ~100 req/min |
| **Skill** | osint-vat |
| **Cache** | 30 giorni |

**Implementazione**:
```javascript
// skill: osint-vat
async function verify_vat_vies(vat_number) {
  // Check cache (30d TTL)
  const cached = await getCached('vat_cache', 'vat_number', vat_number, 'updated_at', 30 * 24 * 60);
  if (cached) return cached;

  // Call VIES API
  const response = await fetch('https://ec.europa.eu/taxation_customs/vies/viesREST-api/checkVat', {
    method: 'POST',
    body: JSON.stringify({ vatNumber: vat_number, countryCode: 'IT' })
  });

  const data = await response.json();

  // Cache result
  await setCache('vat_cache', { vat_number, ...data }, 'vat_number');

  return {
    valid: data.valid,
    name: data.name,
    address: data.address,
    request_date: data.requestDate
  };
}
```

**Cache**: I risultati sono cachati per 30 giorni in Supabase per ridurre le chiamate API.

### 16.4 Verifica Codice Fiscale

**Descrizione**: Algoritmo di validazione del Codice Fiscale italiano. Calcolo automatico del carattere di controllo e verifica formale.

| Proprietà | Valore |
|-----------|--------|
| **Tipo Accesso** | Algoritmo Locale |
| **Costo** | Gratuito |
| **Difficoltà** | Media |
| **Rate Limits** | N/A |
| **Skill** | osint-cf |
| **GDPR** | Fully compliant (local only) |

**Implementazione**:
```javascript
// skill: osint-cf
function validate_codice_fiscale(cf) {
  // Algoritmo locale - nessuna chiamata esterna
  const regex = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z]$/i;

  if (!regex.test(cf)) {
    return { valid: false, error: 'invalid_format' };
  }

  // Calcolo carattere di controllo
  const checksum = computeChecksum(cf.substring(0, 15));

  if (checksum !== cf[15]) {
    return { valid: false, error: 'invalid_checksum' };
  }

  return {
    valid: true,
    cf: cf.toUpperCase(),
    checksum: checksum,
    method: 'local_algorithm'
  };
}
```

**GDPR**: Pure local computation - nessun dato personale esce dal sandbox.

### 16.5 ANAC Casellario

**Descrizione**: Casellario informatico dei fornitori - verifica annotazioni, sospensioni e condanne amministrative su fornitori.

| Proprietà | Valore |
|-----------|--------|
| **Tipo Accesso** | Web Scraping |
| **Costo** | Gratuito |
| **Difficoltà** | Media |
| **Rate Limits** | Be respectful |
| **Skill** | osint-anac-casellario |
| **Cache** | 7 giorni |

**Implementazione**:
```javascript
// skill: osint-anac-casellario
async function scrape_anac_casellario(vat_number, company_name) {
  // Check cache (7d TTL)
  const cached = await getCached('anac_cache', 'vat_number', vat_number, 'updated_at', 7 * 24 * 60);
  if (cached) return cached;

  // Web scraping casellario.anticorruzione.it
  const response = await fetch(`https://casellario.anticorruzione.it/search?piva=${vat_number}`);
  const html = await response.text();

  // Parse annotations
  const annotations = parseANACAnnotations(html);

  // Cache result
  await setCache('anac_cache', {
    vat_number,
    annotations,
    checked_at: new Date().toISOString()
  }, 'vat_number');

  return {
    has_annotations: annotations.length > 0,
    annotations: annotations,
    exclusions: annotations.filter(a => a.type === 'exclusion'),
    suspensions: annotations.filter(a => a.type === 'suspension')
  };
}
```

**Fragility**: Scraping-based - degrada gracefully su cambiamenti della pagina.

### 16.6 Reliability Score Composition

I dati delle integrazioni OSINT alimentano il **Reliability Score** (0-100) delle controparti:

| Dimensione | Peso | Fonte |
|------------|------|-------|
| Legal | 30 | ANAC Casellario (annotations, exclusions) |
| Contributory | 20 | VIES (VAT active, address verified) |
| Reputation | 20 | ANAC history + inference analysis |
| Solidity | 20 | Financial indicators (when available) |
| Consistency | 10 | CF validation + data cross-checks |
| **Totale** | **100** | |

**Labels**:
- ≥80: **excellent**
- ≥60: **good**
- ≥40: **warning**
- <40: **risk**

### 16.7 Flusso di Sincronizzazione

```
00:00 - 05:59    06:00 - 06:29    06:30 - 06:59    07:00 - 23:59
     │                │                │                │
     │                ▼                ▼                ▼
     │          ┌──────────┐    ┌──────────┐    ┌──────────────────┐
     │          │bandi-sync │    │bandi-sync │    │   bandi-match    │
     │          │  -anac   │    │  -ted    │    │                  │
     │          │Download  │    │Query API │    │For each company: │
     │          │CSV/JSON  │    │TED EU    │    │ - Load profile   │
     │          │          │    │          │    │ - Score bandi    │
     │          │Dedup CIG │    │Dedup TED │    │ - Create alerts  │
     │          └────┬─────┘    └────┬─────┘    └────────┬─────────┘
     │               │               │                   │
     └───────────────┴───────────────┴───────────────────┘
                         ▼
                 ┌──────────────────┐
                 │  Supabase: bandi │
                 │  + alerts        │
                 └──────────────────┘
```

### 16.8 Error Handling & Retry Policy

| Integrazione | Error Strategy | Retry Policy |
|--------------|----------------|--------------|
| ANAC OpenData | Cache in bandi table | Retry next day |
| TED Europa | Cache in bandi table | Retry next day |
| VIES | Cache 30d + graceful error | Immediate retry (max 3) |
| ANAC Casellario | Stale cache 7d | Retry next day |
| CF Algo | N/A (local) | N/A |

---

## 17. Mappa delle Integrazioni

| # | Integrazione | Tipo | Costo | Skill | Cron |
|---|--------------|------|-------|-------|------|
| 1 | ANAC OpenData | Download CSV/JSON | Free | bandi-sync-anac | 06:00 |
| 2 | TED Europa | REST API | Free | bandi-sync-ted | 06:30 |
| 3 | VIESAC | REST API + Key | Free | osint-vat | On-demand |
| 4 | Verifica CF | Algoritmo Locale | Free | osint-cf | On-demand |
| 5 | ANAC Casellario | Scraping | Free | osint-anac-casellario | On-demand |

**Tutte le integrazioni sono gratuite** e operate in ambiente sandbox con whitelist rigorosa.

---

## Conclusione

L'architettura degli agenti Terminia-Nemoclaw combina:

1. **Sandboxing rigoroso** via OpenShell (network + filesystem isolation)
2. **Multi-model routing** via LiteLLM (4 modelli specializzati)
3. **Skill orchestration** automatica basata su eventi e cron
4. **Integrazioni complete** con ANAC, TED Europa, VIES, Casellario (tutte gratuite)
5. **Caching intelligente** per API esterne (VIES 30d, ANAC 7d)
6. **Compliance GDPR** con isolamento credenziali e computazione locale

Il risultato è una piattaforma AI robusta, sicura e scalabile per analisi contratti, OSINT e matching bandi di gara.
