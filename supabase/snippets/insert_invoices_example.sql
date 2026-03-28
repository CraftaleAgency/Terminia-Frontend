-- ============================================================
-- QUERY PER INSERIRE FATTURE (INVOICES)
-- Company ID: 88854fea-ae35-4554-ab92-5df9ad167522
-- ============================================================

-- IMPORTANTE: Prima di inserire fatture, assicurati di avere:
-- 1. Almeno una controparte (counterpart)
-- 2. Almeno un contratto (contract) - opzionale ma consigliato

-- ============================================================
-- ESEMPIO 1: FATTURA ATTIVA (emessa da noi - in attesa di pagamento)
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  withholding_amount,
  amount_payable,
  payment_status,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'active',                              -- Fattura attiva (emessa da noi)
  '92c34e14-e0b3-4d56-b7c6-4d4ce2edb0aa',                 -- Sostituisci con ID cliente
  '88854fea-ae35-4554-ab92-5df9ad167522',                    -- Sostituisci con ID contratto (opzionale)
  'FT001/2024',                          -- Numero fattura
  '2024-11-15',                          -- Data emissione
  '2024-12-15',                          -- Scadenza (30gg)
  5000.00,                               -- Imponibile
  22,                                    -- IVA 22%
  1100.00,                               -- IVA calcolata (5000 * 0.22)
  6100.00,                               -- Totale lordo
  NULL,                                  -- Nessuna ritenuta
  6100.00,                               -- Totale da pagare
  'unpaid',                              -- In attesa di pagamento
  'delivered',                           -- Inviata tramite SDI
  'Sviluppo software - Fase 1'
);

-- ============================================================
-- ESEMPIO 2: FATTURA ATTIVA SCADUTA
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  amount_payable,
  payment_status,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'active',
  '92c34e14-e0b3-4d56-b7c6-4d4ce2edb0aa',
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'FT002/2024',
  '2024-09-30',
  '2024-10-30',                          -- Scaduta!
  3500.00,
  22,
  770.00,
  4270.00,
  4270.00,
  'overdue',                             -- Scaduta
  'accepted',
  'Consulenza mese di Settembre 2024'
);

-- ============================================================
-- ESEMPIO 3: FATTURA ATTIVA PAGATA
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  amount_payable,
  payment_status,
  payment_date,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'active',
  'YOUR_COUNTERPART_ID',
  'YOUR_CONTRACT_ID',
  'FT003/2024',
  '2024-10-31',
  '2024-11-30',
  4000.00,
  22,
  880.00,
  4880.00,
  4880.00,
  'paid',                                -- Pagata
  '2024-11-25',                          -- Data pagamento
  'accepted',
  'Canone mensile Ottobre 2024'
);

-- ============================================================
-- ESEMPIO 4: FATTURA ATTIVA CON RITENUTA D'ACCONTO
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  withholding_amount,
  amount_payable,
  payment_status,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'active',
  'YOUR_COUNTERPART_ID',
  NULL,                                  -- Nessun contratto collegato
  'FT004/2024',
  '2024-11-30',
  '2024-12-30',
  2000.00,
  22,
  440.00,
  2440.00,
  400.00,                                -- Ritenuta 20% (2000 * 0.20)
  2040.00,                               -- Netto da pagare (2440 - 400)
  'unpaid',
  'pending',
  'Consulenza professionale con ritenuta d\'acconto'
);

-- ============================================================
-- ESEMPIO 5: FATTURA PASSIVA (ricevuta da fornitore - da pagare)
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  amount_payable,
  payment_status,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'passive',                             -- Fattura passiva (ricevuta)
  'YOUR_SUPPLIER_COUNTERPART_ID',        -- ID fornitore
  NULL,
  'FOR-2024-125',                        -- Numero fattura fornitore
  '2024-11-20',
  '2024-12-20',
  1500.00,
  22,
  330.00,
  1830.00,
  1830.00,
  'unpaid',
  'not_applicable',                      -- Non passa da SDI (ricevuta)
  'Licenze software annuali'
);

-- ============================================================
-- ESEMPIO 6: FATTURA PASSIVA PAGATA
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  amount_payable,
  payment_status,
  payment_date,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'passive',
  'YOUR_SUPPLIER_COUNTERPART_ID',
  'FOR-2024-098',
  '2024-10-15',
  '2024-11-15',
  800.00,
  22,
  176.00,
  976.00,
  976.00,
  'paid',
  '2024-11-10',
  'not_applicable',
  'Servizi hosting mese Ottobre'
);

-- ============================================================
-- ESEMPIO 7: FATTURA PA (Pubblica Amministrazione)
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  amount_payable,
  payment_status,
  sdi_status,
  sdi_identifier,
  pa_protocol,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'active',
  'YOUR_PA_COUNTERPART_ID',              -- Cliente Pubblica Amministrazione
  'YOUR_CONTRACT_ID',
  'FT005/2024',
  '2024-11-01',
  '2025-01-30',                          -- PA paga a 90 giorni
  10000.00,
  22,
  2200.00,
  12200.00,
  12200.00,
  'unpaid',
  'accepted',                            -- Accettata da SDI
  'SDI-12345678',                        -- Identificativo SDI
  'PA-PROT-2024-0987',                   -- Protocollo PA
  'Fornitura software gestionale - CIG: Z1234567890'
);

-- ============================================================
-- ESEMPIO 8: FATTURA COLLEGATA A MILESTONE
-- ============================================================
INSERT INTO invoices (
  company_id,
  invoice_type,
  counterpart_id,
  contract_id,
  milestone_id,
  invoice_number,
  invoice_date,
  due_date,
  amount_net,
  vat_rate,
  vat_amount,
  amount_gross,
  amount_payable,
  payment_status,
  sdi_status,
  notes
) VALUES (
  '88854fea-ae35-4554-ab92-5df9ad167522',
  'active',
  'YOUR_COUNTERPART_ID',
  'YOUR_CONTRACT_ID',
  'YOUR_MILESTONE_ID',                   -- Collegata a una milestone
  'FT006/2024',
  '2024-12-01',
  '2024-12-31',
  6000.00,
  22,
  1320.00,
  7320.00,
  7320.00,
  'unpaid',
  'delivered',
  'Fattura Milestone: Fase 2 - Sviluppo Core Features'
);

-- ============================================================
-- VERIFICA: Visualizza le fatture inserite
-- ============================================================
-- SELECT 
--   invoice_number,
--   invoice_type,
--   invoice_date,
--   due_date,
--   amount_gross,
--   payment_status,
--   sdi_status,
--   notes
-- FROM invoices 
-- WHERE company_id = '88854fea-ae35-4554-ab92-5df9ad167522'
-- ORDER BY invoice_date DESC;

-- KPI Fatture Attive
-- SELECT 
--   COUNT(*) as total_fatture,
--   SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) as da_incassare,
--   SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as incassate,
--   SUM(CASE WHEN payment_status = 'overdue' THEN 1 ELSE 0 END) as scadute,
--   SUM(CASE WHEN payment_status = 'unpaid' THEN amount_gross ELSE 0 END) as importo_da_incassare,
--   SUM(CASE WHEN payment_status = 'paid' THEN amount_gross ELSE 0 END) as importo_incassato,
--   SUM(CASE WHEN payment_status = 'overdue' THEN amount_gross ELSE 0 END) as importo_scaduto
-- FROM invoices 
-- WHERE company_id = '88854fea-ae35-4554-ab92-5df9ad167522'
--   AND invoice_type = 'active';
