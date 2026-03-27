-- ============================================================
-- ESEMPI MULTIPLI: INSERISCI DIPENDENTE + CONTRATTO
-- Company ID: 88854fea-ae35-4554-ab92-5df9ad167522
-- ============================================================

-- ============================================================
-- ESEMPIO 1: TEMPO INDETERMINATO (Permanent)
-- ============================================================
WITH new_employee AS (
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
    ral
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Mario Rossi',
    'RSSMRA85M01H501Z',
    '1985-08-01',
    'mario.rossi@company.com',
    '+39 340 1234567',
    'employee',
    'Software Developer',
    'IT',
    '2024-01-15',
    'Commercio',
    'Livello 3',
    35000
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency,
  start_date, end_date, signed_date, risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'permanent',
  id,
  'Contratto di Lavoro Subordinato - ' || full_name,
  'CTR-2024-001',
  'active', 35000, 'annual', 'EUR', 'monthly',
  '2024-01-15', NULL, '2024-01-10', 15,
  'Contratto a tempo indeterminato full-time. CCNL Commercio Livello 3. Periodo prova 6 mesi.',
  'Benefit: Buoni pasto €7/gg, Smart working 2gg/sett'
FROM new_employee;

-- ============================================================
-- ESEMPIO 2: TEMPO DETERMINATO (Fixed Term)
-- ============================================================
WITH new_employee AS (
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    employee_type,
    role,
    department,
    hire_date,
    ccnl,
    ccnl_level,
    ral
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Luca Bianchi',
    'BNCLCU90H12F205X',
    '1990-06-12',
    'luca.bianchi@company.com',
    'employee',
    'Marketing Specialist',
    'Marketing',
    '2024-02-01',
    'Terziario',
    'Livello 4',
    28000
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency,
  start_date, end_date, signed_date, auto_renewal, renewal_notice_days,
  risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'fixed_term',
  id,
  'Contratto a Tempo Determinato - ' || full_name,
  'CTR-2024-002',
  'active', 28000, 'annual', 'EUR', 'monthly',
  '2024-02-01', '2025-01-31', '2024-01-25', true, 60, 35,
  'Tempo determinato 12 mesi. CCNL Terziario Livello 4. Causale: sostituzione maternità.',
  'Possibile trasformazione a indeterminato al termine'
FROM new_employee;

-- ============================================================
-- ESEMPIO 3: CO.CO.CO (Collaborazione Coordinata)
-- ============================================================
WITH new_employee AS (
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    phone,
    employee_type,
    role,
    hire_date,
    ral
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Sara Verdi',
    'VRDSRA88C42L219Y',
    '1988-03-02',
    'sara.verdi@freelance.com',
    '+39 348 9876543',
    'collaborator',
    'UX/UI Designer',
    '2024-03-01',
    30000
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency,
  withholding_tax, withholding_rate,
  start_date, end_date, signed_date, auto_renewal, renewal_notice_days,
  risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'cococo',
  id,
  'Contratto di Collaborazione Coordinata - ' || full_name,
  'CTR-COCOCO-2024-001',
  'active', 30000, 'annual', 'EUR', 'monthly',
  true, 20,  -- Ritenuta d'acconto 20%
  '2024-03-01', '2024-12-31', '2024-02-20', false, 30, 30,
  'Collaborazione coordinata 10 mesi. Progetto: Redesign piattaforma. Compenso fisso mensile.',
  'Progetto: Sviluppo nuovo design system. Coordinamento: Head of Design'
FROM new_employee;

-- ============================================================
-- ESEMPIO 4: PART-TIME
-- ============================================================
WITH new_employee AS (
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    employee_type,
    role,
    department,
    hire_date,
    ccnl,
    ccnl_level,
    ral,
    meal_voucher_daily
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Anna Neri',
    'NRENNN92D50D969W',
    '1992-04-10',
    'anna.neri@company.com',
    'employee',
    'Customer Support',
    'Operations',
    '2024-04-01',
    'Terziario',
    'Livello 3',
    18000,
    5  -- Buoni pasto proporzionati
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency,
  start_date, end_date, signed_date, risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'part_time',
  id,
  'Contratto Part-Time - ' || full_name,
  'CTR-PT-2024-001',
  'active', 18000, 'annual', 'EUR', 'monthly',
  '2024-04-01', NULL, '2024-03-25', 20,
  'Part-time 50% (20h/sett). CCNL Terziario Livello 3. Orario: Lun-Ven 9-13.',
  'Flessibilità orari previo accordo. Possibilità aumento ore dopo 6 mesi'
FROM new_employee;

-- ============================================================
-- ESEMPIO 5: STAGE/TIROCINIO
-- ============================================================
WITH new_employee AS (
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    employee_type,
    role,
    department,
    hire_date
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Paolo Gialli',
    'GLLPLA00A01F205M',
    '2000-01-01',
    'paolo.gialli@studenti.polimi.it',
    'intern',
    'Junior Developer',
    'IT',
    '2024-05-01'
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency,
  start_date, end_date, signed_date, risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'internship',
  id,
  'Tirocinio Curriculare - ' || full_name,
  'CTR-STAGE-2024-001',
  'active', 800, 'monthly', 'EUR', 'monthly',
  '2024-05-01', '2024-10-31', '2024-04-20', 10,
  'Tirocinio curriculare 6 mesi. Rimborso spese €800/mese. Tutor: Ing. Rossi.',
  'Università: Politecnico Milano. Orario: 8h/gg 5gg/sett. Progetto formativo approvato'
FROM new_employee;

-- ============================================================
-- ESEMPIO 6: APPRENDISTATO
-- ============================================================
WITH new_employee AS (
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    employee_type,
    role,
    department,
    hire_date,
    ccnl,
    ccnl_level,
    ral
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Marco Blu',
    'BLUMRC98M15H501K',
    '1998-08-15',
    'marco.blu@company.com',
    'apprentice',
    'Junior Technician',
    'IT',
    '2024-06-01',
    'Commercio',
    'Livello 4',
    22000
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency,
  start_date, end_date, signed_date, risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'apprenticeship',
  id,
  'Contratto di Apprendistato - ' || full_name,
  'CTR-APP-2024-001',
  'active', 22000, 'annual', 'EUR', 'monthly',
  '2024-06-01', '2027-05-31', '2024-05-20', 25,
  'Apprendistato professionalizzante 36 mesi. Qualifica: Tecnico informatico IV livello.',
  'Piano formativo 120h/anno. Tutor: Dott. Rossi. Conferma a TD possibile al termine'
FROM new_employee;

-- ============================================================
-- ESEMPIO 7: PARTITA IVA
-- ============================================================
WITH new_employee AS (
  INSERT INTO employees (
    company_id,
    full_name,
    fiscal_code,
    birth_date,
    email,
    phone,
    employee_type,
    role,
    hire_date,
    ral
  ) VALUES (
    '88854fea-ae35-4554-ab92-5df9ad167522',
    'Giulia Rosa',
    'RSOGLI86T48F205R',
    '1986-12-08',
    'giulia.rosa@consulenza.it',
    '+39 345 1122334',
    'vat_number',
    'Senior Consultant',
    '2024-01-01',
    48000  -- Compenso annuo lordo
  )
  RETURNING id, full_name
)
INSERT INTO contracts (
  company_id, contract_type, employee_id, title, reference_number,
  status, value, value_type, currency, payment_frequency, payment_terms,
  vat_regime, vat_rate,
  start_date, end_date, signed_date, auto_renewal, renewal_notice_days,
  risk_score, ai_summary, notes
)
SELECT 
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'vat_number',
  id,
  'Contratto Consulenza P.IVA - ' || full_name,
  'CTR-PIVA-2024-001',
  'active', 4000, 'monthly', 'EUR', 'monthly', 30,
  'ordinary', 22,
  '2024-01-01', '2024-12-31', '2023-12-20', true, 60, 40,
  'Consulenza continuativa P.IVA. Sviluppo software. Compenso fisso €4.000/mese + IVA 22%.',
  'Fatturazione entro il 5 del mese. Ritenuta 20% se regime ordinario. Pagamento 30gg DF'
FROM new_employee;
