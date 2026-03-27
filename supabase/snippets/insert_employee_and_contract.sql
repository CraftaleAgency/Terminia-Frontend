-- ============================================================
-- QUERY COMPLETA: INSERISCI DIPENDENTE + CONTRATTO
-- Company ID: 88854fea-ae35-4554-ab92-5df9ad167522
-- ============================================================

-- Questa query inserisce prima il dipendente, poi usa il suo ID per creare il contratto

WITH new_employee AS (
  -- STEP 1: Inserisci il dipendente
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    phone,
    employee_type,
    role,
    department,
    hire_date,
    ccnl,
    ccnl_level,
    ral,
    meal_voucher_daily,
    company_phone,
    probation_end_date
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',  -- Company ID
    'Mario Rossi',                            -- Nome completo
    'RSSMRA85M01H501Z',                       -- Codice fiscale (esempio)
    '1985-08-01',                             -- Data di nascita
    'mario.rossi@example.com',                -- Email
    '+39 340 1234567',                        -- Telefono
    'employee',                               -- Tipo: dipendente
    'Software Developer',                     -- Ruolo
    'IT',                                     -- Dipartimento
    '2024-01-15',                             -- Data assunzione
    'Commercio',                              -- CCNL applicato
    'Livello 3',                              -- Livello CCNL
    35000,                                    -- RAL annua
    7,                                        -- Buoni pasto €7/giorno
    true,                                     -- Telefono aziendale
    '2024-07-15'                              -- Fine periodo di prova (6 mesi)
  )
  RETURNING id, full_name
)
-- STEP 2: Inserisci il contratto usando l'ID del dipendente appena creato
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
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',    -- Company ID
  'permanent',                                -- Contratto a tempo indeterminato
  id,                                         -- ID del dipendente appena creato
  'Contratto di Lavoro Subordinato - ' || full_name,  -- Titolo dinamico
  'CTR-EMP-2024-001',                         -- Numero di riferimento
  'active',                                   -- Stato attivo
  35000,                                      -- RAL annua
  'annual',                                   -- Valore annuale
  'EUR',                                      -- Valuta
  'monthly',                                  -- Pagamento mensile
  '2024-01-15',                               -- Data inizio
  NULL,                                       -- NULL = tempo indeterminato
  '2024-01-10',                               -- Data firma
  false,                                      -- No rinnovo automatico
  15,                                         -- Rischio basso
  'Contratto a tempo indeterminato full-time per Software Developer. CCNL Commercio, Livello 3. Periodo di prova: 6 mesi. RAL: €35.000',
  'Benefit: Buoni pasto €7/giorno, Telefono aziendale, Smart working 2 giorni/settimana'
FROM new_employee
RETURNING id, title, reference_number, employee_id;


-- ============================================================
-- VERIFICA: Visualizza dipendente e contratto creati
-- ============================================================
-- SELECT 
--   e.id as employee_id,
--   e.full_name,
--   e.role,
--   e.employee_type,
--   c.id as contract_id,
--   c.title as contract_title,
--   c.reference_number,
--   c.contract_type,
--   c.status,
--   c.value,
--   c.start_date
-- FROM employees e
-- LEFT JOIN contracts c ON c.employee_id = e.id
-- WHERE e.company_id = '88854fea-ae35-4554-ab92-5df9ad167522'
-- ORDER BY e.created_at DESC
-- LIMIT 1;
