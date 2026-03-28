-- ============================================================
-- QUERY PER INSERIRE CONTRATTI COLLEGATI A DIPENDENTI
-- ============================================================

-- STEP 1: Trova il tuo company_id
-- SELECT company_id FROM users WHERE id = auth.uid();

-- STEP 2: Trova o crea un dipendente
-- SELECT id, full_name, role FROM employees WHERE company_id = 'YOUR_COMPANY_ID' ORDER BY created_at DESC LIMIT 5;

-- Se non hai dipendenti, creane uno prima:
-- INSERT INTO employees (company_id, full_name, email, role, department, employee_type, hire_date)
-- VALUES (
--   'YOUR_COMPANY_ID',
--   'Mario Rossi',
--   'mario.rossi@example.com',
--   'Software Developer',
--   'IT',
--   'employee',
--   '2024-01-15'
-- );

-- ============================================================
-- ESEMPIO 1: Contratto a Tempo Indeterminato (Permanent)
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  start_date,
  end_date,
  signed_date,
  auto_renewal,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'eca84e75-b4fc-4b83-8a81-fd9888c49657',           -- Sostituisci con il tuo company_id
  'permanent',                 -- Contratto a tempo indeterminato
  'YOUR_EMPLOYEE_ID',          -- Sostituisci con l'ID del dipendente
  'Contratto di Lavoro Subordinato - Mario Rossi',
  'CTR-EMP-2024-001',
  'active',
  35000,                       -- RAL annua
  'annual',
  'EUR',
  'monthly',
  '2024-01-15',               -- Data inizio
  NULL,                        -- NULL per indeterminato
  '2024-01-10',               -- Data firma
  false,
  15,                          -- Basso rischio
  'Contratto a tempo indeterminato full-time per Software Developer. CCNL Commercio. Livello 3. Periodo di prova: 6 mesi.',
  'Benefit: Buoni pasto €7/giorno, Smart working 2 giorni/settimana'
);

-- ============================================================
-- ESEMPIO 2: Contratto a Tempo Determinato (Fixed Term)
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  start_date,
  end_date,
  signed_date,
  auto_renewal,
  renewal_notice_days,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'eca84e75-b4fc-4b83-8a81-fd9888c49657',
  'fixed_term',                -- Tempo determinato
  'YOUR_EMPLOYEE_ID',
  'Contratto a Tempo Determinato - Luca Bianchi',
  'CTR-EMP-2024-002',
  'active',
  28000,
  'annual',
  'EUR',
  'monthly',
  '2024-02-01',
  '2025-01-31',               -- 12 mesi
  '2024-01-25',
  true,                        -- Può essere rinnovato
  60,                          -- Preavviso rinnovo 60 giorni
  35,                          -- Medio rischio (scadenza)
  'Contratto a tempo determinato 12 mesi per sostituzione maternità. CCNL Metalmeccanico. Livello 5.',
  'Possibile trasformazione a indeterminato al termine. Causale: sostituzione maternità'
);

-- ============================================================
-- ESEMPIO 3: Contratto Co.Co.Co (Collaborazione Coordinata)
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  withholding_tax,
  withholding_rate,
  start_date,
  end_date,
  signed_date,
  auto_renewal,
  renewal_notice_days,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'YOUR_COMPANY_ID',
  'cococo',                    -- Collaborazione coordinata
  'YOUR_EMPLOYEE_ID',
  'Contratto di Collaborazione Coordinata - Sara Verdi',
  'CTR-COCOCO-2024-001',
  'active',
  30000,
  'annual',
  'EUR',
  'monthly',
  true,                        -- Ritenuta d'acconto
  20,                          -- 20% ritenuta
  '2024-03-01',
  '2024-12-31',               -- 10 mesi
  '2024-02-20',
  false,
  30,
  'Collaborazione coordinata per progetto di sviluppo software. Durata 10 mesi. Compenso mensile fisso.',
  'Progetto: Sviluppo piattaforma e-commerce. Coordinamento: CTO'
);

-- ============================================================
-- ESEMPIO 4: Contratto Part-Time
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  start_date,
  end_date,
  signed_date,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'YOUR_COMPANY_ID',
  'part_time',
  'YOUR_EMPLOYEE_ID',
  'Contratto Part-Time - Anna Neri',
  'CTR-PT-2024-001',
  'active',
  18000,                       -- RAL proporzionata (50%)
  'annual',
  'EUR',
  'monthly',
  '2024-04-01',
  NULL,                        -- Indeterminato
  '2024-03-25',
  20,
  'Contratto part-time 50% (20 ore/settimana). CCNL Terziario. Orario: Lunedì-Venerdì mattina 9-13.',
  'Possibilità di aumento ore dopo 6 mesi. Flessibilità orari previo accordo'
);

-- ============================================================
-- ESEMPIO 5: Stage/Internship
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  start_date,
  end_date,
  signed_date,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'YOUR_COMPANY_ID',
  'internship',
  'YOUR_EMPLOYEE_ID',
  'Tirocinio Curriculare - Paolo Gialli',
  'CTR-STAGE-2024-001',
  'active',
  800,                         -- Rimborso spese mensile
  'monthly',
  'EUR',
  'monthly',
  '2024-05-01',
  '2024-10-31',               -- 6 mesi
  '2024-04-20',
  10,
  'Tirocinio formativo curriculare 6 mesi. Rimborso spese €800/mese. Tutor aziendale: Ing. Rossi. Università: Politecnico Milano.',
  'Orario: 9-13 / 14-18 (8h/giorno, 5gg/settimana). Progetto formativo approvato'
);

-- ============================================================
-- ESEMPIO 6: Apprendistato (Apprenticeship)
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  start_date,
  end_date,
  signed_date,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'YOUR_COMPANY_ID',
  'apprenticeship',
  'YOUR_EMPLOYEE_ID',
  'Contratto di Apprendistato Professionalizzante - Marco Blu',
  'CTR-APP-2024-001',
  'active',
  22000,                       -- RAL ridotta per apprendistato
  'annual',
  'EUR',
  'monthly',
  '2024-06-01',
  '2027-05-31',               -- 36 mesi (durata standard)
  '2024-05-20',
  25,
  'Apprendistato professionalizzante 36 mesi. Qualifica: Tecnico informatico - IV livello CCNL Commercio. Piano formativo 120 ore/anno.',
  'Formazione interna ed esterna. Tutor: Dott. Rossi. Possibilità conferma a tempo indeterminato'
);

-- ============================================================
-- ESEMPIO 7: Contratto P.IVA (Partita IVA)
-- ============================================================
INSERT INTO contracts (
  company_id,
  contract_type,
  employee_id,
  title,
  reference_number,
  status,
  value,
  value_type,
  currency,
  payment_frequency,
  payment_terms,
  vat_regime,
  vat_rate,
  start_date,
  end_date,
  signed_date,
  auto_renewal,
  renewal_notice_days,
  risk_score,
  ai_summary,
  notes
) VALUES (
  'YOUR_COMPANY_ID',
  'vat_number',                -- Contratto con partita IVA
  'YOUR_EMPLOYEE_ID',
  'Contratto Consulenza P.IVA - Giulia Rosa',
  'CTR-PIVA-2024-001',
  'active',
  4000,
  'monthly',
  'EUR',
  'monthly',
  30,                          -- Pagamento 30 giorni DF
  'ordinary',
  22,
  '2024-01-01',
  '2024-12-31',
  '2023-12-20',
  true,
  60,
  40,                          -- Medio-alto rischio (P.IVA)
  'Consulenza continuativa con P.IVA. Prestazione: Sviluppo e manutenzione software. Compenso mensile fisso €4.000 + IVA 22%.',
  'Committente: soggetta a ritenuta 20% se regime ordinario. Fatturazione entro il 5 del mese'
);

-- ============================================================
-- VERIFICA: Visualizza i contratti inseriti
-- ============================================================
-- SELECT 
--   c.id,
--   c.title,
--   c.contract_type,
--   c.reference_number,
--   c.status,
--   c.value,
--   c.value_type,
--   c.start_date,
--   c.end_date,
--   e.full_name as employee_name
-- FROM contracts c
-- LEFT JOIN employees e ON c.employee_id = e.id
-- WHERE c.company_id = 'YOUR_COMPANY_ID'
--   AND c.employee_id IS NOT NULL
-- ORDER BY c.created_at DESC;

-- ============================================================
-- NOTA: Dopo aver inserito il contratto, puoi aggiungere:
-- 1. Clausole (vedi insert_clauses_example.sql)
-- 2. Obblighi (scadenze, documenti da presentare, ecc.)
-- 3. Milestone (es: fine periodo di prova, scadenze rinnovo)
-- ============================================================
