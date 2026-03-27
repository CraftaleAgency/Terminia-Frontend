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
  'eca84e75-b4fc-4b83-8a81-fd9888c49657',                    -- Sostituisci con ID contratto (opzionale)
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
  'eca84e75-b4fc-4b83-8a81-fd9888c49657',
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