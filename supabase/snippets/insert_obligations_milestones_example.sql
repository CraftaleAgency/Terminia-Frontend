-- ============================================================
-- QUERY PER POPOLARE OBLIGATIONS E MILESTONES
-- Sostituisci 'YOUR_CONTRACT_ID' con l'ID del contratto
-- ============================================================

-- ============================================================
-- OBLIGATIONS (Obblighi e Adempimenti)
-- ============================================================

-- OBBLIGHI MIEI (party = 'mine')
-- ============================================================

-- 1. Pagamento mensile
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  recurrence,
  recurrence_end_date,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'mine',
  'Pagamento canone mensile entro il 5 del mese',
  'payment',
  '2024-12-05',
  'monthly',
  '2025-12-05',
  'pending'
);

-- 2. Report trimestrale
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  recurrence,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'mine',
  'Invio report trimestrale attività e KPI',
  'report',
  '2024-12-31',
  'quarterly',
  'pending'
);

-- 3. Rinnovo polizza
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'mine',
  'Rinnovo polizza RC professionale e invio copia',
  'compliance',
  '2025-01-15',
  'pending'
);

-- 4. Disdetta contratto (se non si vuole rinnovare)
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'mine',
  'Invio disdetta scritta se non si intende rinnovare (90gg di preavviso)',
  'renewal_notice',
  '2025-07-03',
  'pending'
);

-- 5. Manutenzione annuale
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  recurrence,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'mine',
  'Manutenzione ordinaria software e aggiornamenti di sicurezza',
  'maintenance',
  '2025-01-31',
  'annual',
  'pending'
);

-- OBBLIGHI LORO (party = 'theirs')
-- ============================================================

-- 1. Pagamento fatture
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  recurrence,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'theirs',
  'Pagamento fatture entro 30 giorni data fattura',
  'payment',
  '2024-12-30',
  'monthly',
  'pending'
);

-- 2. Fornitura credenziali
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'theirs',
  'Fornitura credenziali di accesso ai sistemi entro 5gg dalla firma',
  'delivery',
  '2024-01-20',
  'completed',
  '2024-01-18',
  'Credenziali fornite via email il 18/01'
);

-- 3. Approvazione deliverable
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  due_date,
  recurrence,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'theirs',
  'Approvazione deliverable entro 15gg dalla consegna',
  'approval',
  '2024-12-15',
  'monthly',
  'pending'
);

-- 4. Notifica modifiche organizzative
INSERT INTO obligations (
  contract_id,
  party,
  description,
  obligation_type,
  status
) VALUES (
  'YOUR_CONTRACT_ID',
  'theirs',
  'Notifica tempestiva di modifiche organizzative che impattano il servizio',
  'notification',
  'pending'
);

-- ============================================================
-- MILESTONES (Scadenze e Milestone)
-- ============================================================

-- 1. Analisi e Progettazione
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval,
  approval_contact
) VALUES (
  'YOUR_CONTRACT_ID',
  'Fase 1: Analisi Requisiti e Progettazione',
  'Analisi dei requisiti funzionali, progettazione architetturale e stesura documentazione tecnica',
  '2024-02-28',
  'approved',
  5000,
  true,
  'Ing. Mario Rossi',
  '2024-02-25',
  '2024-03-01'
);

-- 2. Sviluppo Core Features
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval,
  approval_contact,
  delivery_date
) VALUES (
  'YOUR_CONTRACT_ID',
  'Fase 2: Sviluppo Funzionalità Base',
  'Implementazione moduli core: autenticazione, gestione utenti, dashboard amministrativa',
  '2024-04-30',
  'delivered',
  8000,
  true,
  'Ing. Mario Rossi',
  '2024-04-28'
);

-- 3. Testing e QA
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval,
  approval_contact
) VALUES (
  'YOUR_CONTRACT_ID',
  'Fase 3: Testing e Quality Assurance',
  'Test funzionali, test di integrazione, correzione bug e ottimizzazioni performance',
  '2024-06-15',
  'in_progress',
  3000,
  true,
  'Ing. Mario Rossi'
);

-- 4. Go-Live e Training
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval,
  approval_contact
) VALUES (
  'YOUR_CONTRACT_ID',
  'Fase 4: Deploy Produzione e Formazione',
  'Rilascio in produzione, training agli utenti finali, documentazione utente',
  '2024-07-31',
  'upcoming',
  4000,
  true,
  'Ing. Mario Rossi'
);

-- 5. Supporto Post Go-Live
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval
) VALUES (
  'YOUR_CONTRACT_ID',
  'Fase 5: Supporto e Stabilizzazione',
  'Supporto tecnico dedicato, risoluzione issues critici, ottimizzazioni finali',
  '2024-09-30',
  'upcoming',
  3000,
  false
);

-- 6. Milestone fatturabile (pronta per fatturazione)
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval,
  approval_contact,
  delivery_date,
  approval_date
) VALUES (
  'YOUR_CONTRACT_ID',
  'Rilascio Modulo Reporting Avanzato',
  'Sviluppo e rilascio modulo reporting con dashboard personalizzabili ed export automatici',
  '2024-11-30',
  'invoiceable',
  6000,
  true,
  'Dott.ssa Laura Bianchi',
  '2024-11-28',
  '2024-11-29'
);

-- 7. Milestone con pagamento mensile ricorrente
INSERT INTO milestones (
  contract_id,
  title,
  description,
  due_date,
  status,
  amount,
  requires_approval
) VALUES (
  'YOUR_CONTRACT_ID',
  'Canone mensile Dicembre 2024',
  'Servizio di manutenzione e supporto applicativo - Dicembre 2024',
  '2024-12-31',
  'upcoming',
  2500,
  false
);

-- ============================================================
-- VERIFICA: Visualizza obligations e milestones inseriti
-- ============================================================

-- Verifica Obligations
-- SELECT 
--   party,
--   description,
--   obligation_type,
--   due_date,
--   recurrence,
--   status,
--   completed_at
-- FROM obligations 
-- WHERE contract_id = 'YOUR_CONTRACT_ID'
-- ORDER BY due_date NULLS LAST;

-- Verifica Milestones
-- SELECT 
--   title,
--   status,
--   amount,
--   due_date,
--   delivery_date,
--   approval_date,
--   requires_approval
-- FROM milestones 
-- WHERE contract_id = 'YOUR_CONTRACT_ID'
-- ORDER BY due_date;

-- Totale valore milestones
-- SELECT 
--   COUNT(*) as total_milestones,
--   SUM(amount) as total_value,
--   SUM(CASE WHEN status IN ('approved', 'invoiced') THEN amount ELSE 0 END) as completed_value,
--   SUM(CASE WHEN status = 'invoiceable' THEN amount ELSE 0 END) as invoiceable_value
-- FROM milestones 
-- WHERE contract_id = 'YOUR_CONTRACT_ID';
