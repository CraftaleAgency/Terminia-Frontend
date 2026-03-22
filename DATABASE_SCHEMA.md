# TERMINIA - Documentazione Database Schema

## Overview

Lo schema database di Terminia è stato ristrutturato in **3 file di migrazione** separati per chiarezza e manutenibilità:

| File | Contenuto |
|------|-----------|
| `001_create_profiles.sql` | **20 Tabelle** + Indici + Views |
| `002_create_app_tables.sql` | **RLS Policies** (21 policy di isolamento company) |
| `003_create_triggers.sql` | **Triggers** + Funzioni automatiche |

---

## Tabelle e Mapping alle Pagine

### ✅ Tabelle COLLEGATE alle pagine esistenti

| Tabella | Pagina | Descrizione |
|---------|--------|-------------|
| `companies` | `/onboarding` | Dati aziendali (creata automaticamente con trigger) |
| `users` | `/auth`, `/dashboard` | Profili utente collegati a auth.users |
| `counterparts` | `/dashboard/counterparts` | Clienti, Fornitori, Partner |
| `employees` | `/dashboard/employees` | Dipendenti e collaboratori |
| `contracts` | `/dashboard/contracts` | Contratti commerciali e HR |
| `invoices` | `/dashboard/invoices` | Fatture attive e passive |
| `bandi` | `/dashboard/bandi` | Gare pubbliche e match scoring |
| `bandi_competitor_awards` | `/dashboard/analytics` | Analisi competitiva |

### ⚠️ Tabelle SENZA pagina dedicata (supporto/relazioni)

| Tabella | Utilizzata da | Note |
|---------|---------------|------|
| `clauses` | contracts | Clausole estratte da AI |
| `obligations` | contracts | Obblighi contrattuali |
| `milestones` | contracts | Milestone con fatturazione |
| `scope_items` | contracts | Scope incluso/escluso |
| `change_requests` | contracts | Gestione varianti |
| `contract_documents` | contracts | Documenti allegati |
| `generated_documents` | tutti | Documenti generati da AI |
| `gdpr_records` | contracts/counterparts | Tracciamento GDPR |
| `alerts` | dashboard | Sistema notifiche |
| `ai_interviews` | upload | Classificazione documenti |
| `payment_records` | invoices | Storico pagamenti |
| `negotiation_events` | contracts | Log negoziazioni |

---

## Architettura Multi-Company

Lo schema implementa **isolamento completo per company**:

```
auth.users (Supabase Auth)
    │
    └── users (profilo app)
          │
          └── companies (1:1 al primo utente)
                │
                ├── counterparts
                ├── employees  
                ├── contracts
                ├── invoices
                ├── bandi
                └── ... (tutte le altre tabelle)
```

### Funzione Helper

```sql
auth_company_id() -- Ritorna il company_id dell'utente loggato
```

Usata in tutte le RLS policy per garantire che ogni utente veda solo i dati della propria azienda.

---

## Tabelle Mancanti (da valutare)

Le seguenti tabelle nello schema potrebbero richiedere nuove pagine:

### 1. **Dashboard Documenti** (`/dashboard/documents`)
- `contract_documents` - Documenti caricati
- `generated_documents` - Documenti generati da AI

### 2. **Dashboard Alerts** (`/dashboard/alerts`)  
- `alerts` - Centro notifiche con filtri per tipo/priorità

### 3. **Dashboard GDPR** (`/dashboard/compliance`)
- `gdpr_records` - Registro trattamenti dati
- Collegamento DPA a contratti/controparti

### 4. **Pagina AI Upload** (`/dashboard/upload`)
- `ai_interviews` - Gestione documenti caricati
- Workflow classificazione automatica

---

## Views Disponibili

| View | Descrizione |
|------|-------------|
| `v_contracts_expiring_soon` | Contratti in scadenza 30gg |
| `v_bandi_top_match` | Bandi con match ≥60% |
| `v_dashboard_kpi` | KPI aggregati per company |

---

## Triggers Automatici

| Trigger | Azione |
|---------|--------|
| `on_auth_user_created` | Crea company + user automaticamente |
| `trg_contracts_status` | Auto-update status (expiring/terminated) |
| `trg_invoices_status` | Auto-set overdue |
| `trg_contract_alerts` | Genera alert scadenze |
| `trg_invoice_alerts` | Genera alert pagamenti |
| `trg_employee_alerts` | Genera alert HR (visite mediche, sicurezza) |

---

## Prossimi Passi Consigliati

1. **Creare pagina Alerts** - Il sistema genera automaticamente alert ma non c'è UI dedicata
2. **Creare pagina Documents** - Per gestire documenti generati/caricati  
3. **Integrare widgets dashboard** - Usare `v_dashboard_kpi` per mostrare KPI
4. **Testare onboarding** - Il trigger crea company+user automaticamente

---

## Note Tecniche

- **Estensioni richieste**: `uuid-ossp`, `vector` (pgvector), `pg_trgm`
- **Embedding**: Colonne `embedding` (contracts) e `bando_embedding` (bandi) per ricerca semantica
- **Check constraints**: Tutti i valori con range (scores, stati) hanno vincoli
