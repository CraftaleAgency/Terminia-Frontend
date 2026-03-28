-- ============================================================
-- QUERY PER POPOLARE LA TABELLA CLAUSES
-- Sostituisci 'YOUR_CONTRACT_ID' con l'ID effettivo del contratto
-- ============================================================

-- STEP 1: Trova il tuo contract_id
-- SELECT id, title FROM contracts WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid()) ORDER BY created_at DESC LIMIT 5;

-- STEP 2: Sostituisci 'YOUR_CONTRACT_ID' nelle query sotto

-- ============================================================
-- ESEMPIO 1: Clausola di Penale (Alta priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID', -- Sostituisci con il tuo contract_id
  'penalty',
  'In caso di ritardo nella consegna superiore a 15 giorni lavorativi, sarà applicata una penale pari al 2% del valore complessivo del contratto per ogni settimana di ritardo, con un massimo del 10% del valore contrattuale.',
  'Penale del 2% a settimana per ritardi oltre 15 giorni (max 10% totale)',
  5,
  'high',
  'La penale è significativa e può arrivare fino al 10% del valore del contratto. Importante rispettare le tempistiche.',
  'unfavorable',
  'Negoziare un periodo di grazia più lungo (30 giorni) e ridurre la percentuale all''1.5% settimanale',
  'La media di mercato prevede penali dell''1-1.5% settimanale con periodo di grazia di 20-30 giorni'
);

-- ============================================================
-- ESEMPIO 2: Clausola di Responsabilità Limitata (Media priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'liability_limit',
  'La responsabilità del fornitore per danni diretti derivanti dall''inadempimento contrattuale è limitata all''importo totale pagato dal cliente negli ultimi 12 mesi. Il fornitore non sarà responsabile per danni indiretti, incidentali o consequenziali.',
  'Responsabilità limitata a quanto pagato in 12 mesi. Esclusi danni indiretti.',
  8,
  'medium',
  'La limitazione protegge il fornitore ma potrebbe non coprire tutti i danni effettivi in caso di problemi gravi.',
  'ambiguity',
  'Chiarire meglio cosa si intende per "danni indiretti" con esempi specifici',
  'Standard: limitazione tra 100-200% del valore annuale contrattuale'
);

-- ============================================================
-- ESEMPIO 3: Clausola di Risoluzione (Critica)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'termination',
  'Ciascuna parte può recedere dal contratto con preavviso scritto di 90 giorni. In caso di gravi inadempimenti, il recesso può essere immediato previa diffida di 15 giorni senza esito. Alla risoluzione sono dovuti solo i corrispettivi per servizi già erogati.',
  'Recesso con 90 giorni di preavviso. Immediato per gravi inadempienze (dopo diffida 15gg)',
  12,
  'critical',
  'Il periodo di preavviso di 90 giorni è relativamente breve per servizi complessi. Importante gestire bene le transizioni.',
  'missing_critical',
  'Aggiungere clausola per gestione del periodo di transizione e trasferimento della conoscenza',
  'Best practice: 120-180 giorni per servizi complessi, con clausola di transition-out'
);

-- ============================================================
-- ESEMPIO 4: Clausola di Pagamento (Media priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'payment',
  'I pagamenti saranno effettuati entro 60 giorni data fattura, mediante bonifico bancario. Interessi di mora pari al tasso BCE + 8 punti percentuali in caso di ritardo.',
  'Pagamento a 60 giorni data fattura. Mora: BCE+8% per ritardi',
  3,
  'medium',
  'I termini di pagamento a 60 giorni sono standard ma potrebbero impattare il cash flow.',
  null,
  null,
  'Termini di pagamento tipici: 30-60 giorni per forniture B2B'
);

-- ============================================================
-- ESEMPIO 5: Clausola di Riservatezza (Bassa priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'confidentiality',
  'Le parti si impegnano a mantenere riservate tutte le informazioni confidenziali ricevute durante l''esecuzione del contratto, per un periodo di 5 anni dalla cessazione del contratto stesso.',
  'Obbligo di riservatezza per 5 anni dopo la fine del contratto',
  7,
  'low',
  'Clausola standard di riservatezza con durata adeguata.',
  null,
  null,
  'Durata tipica: 3-5 anni post-contratto per informazioni business-critical'
);

-- ============================================================
-- ESEMPIO 6: Clausola di Rinnovo Automatico (Media priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'renewal',
  'Il contratto si rinnova tacitamente per periodi successivi di 12 mesi, salvo disdetta scritta inviata con almeno 90 giorni di anticipo rispetto alla scadenza.',
  'Rinnovo automatico annuale. Disdetta con 90 giorni di preavviso',
  2,
  'medium',
  'Il rinnovo automatico può bloccare per un altro anno se si dimentica la disdetta. Importante segnare la data.',
  'anomaly',
  'Impostare un alert 120 giorni prima della scadenza per valutare il rinnovo',
  'Standard: rinnovo tacito con preavviso 60-90 giorni'
);

-- ============================================================
-- ESEMPIO 7: Clausola di Garanzia (Bassa priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'warranty',
  'Il fornitore garantisce che i servizi saranno eseguiti secondo le migliori pratiche di settore e in conformità alle specifiche tecniche allegate. Periodo di garanzia: 12 mesi dalla consegna.',
  'Garanzia 12 mesi secondo standard di settore',
  9,
  'low',
  'Garanzia standard di mercato con durata adeguata.',
  null,
  null,
  'Garanzia tipica: 12-24 mesi per servizi professionali'
);

-- ============================================================
-- ESEMPIO 8: Clausola SLA (Alta priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'sla',
  'Il fornitore garantisce un uptime del 99.5% mensile. In caso di mancato raggiungimento, il cliente ha diritto a un credito del 5% del canone mensile per ogni 0.5% di downtime oltre la soglia garantita.',
  'SLA 99.5% uptime. Credito 5% per ogni 0.5% sotto soglia',
  11,
  'high',
  'Lo SLA garantito è inferiore agli standard enterprise (99.9%). Monitorare attentamente le performance.',
  'unfavorable',
  'Negoziare SLA al 99.9% con penali progressive più severe',
  'Best practice enterprise: 99.9-99.99% uptime con penali scalate'
);

-- ============================================================
-- ESEMPIO 9: Clausola GDPR/Data Protection (Critica)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'data_protection',
  'Il fornitore agisce come responsabile del trattamento dei dati personali e si impegna a rispettare il GDPR. In caso di data breach, notifica entro 24 ore. Allegato DPA firmato.',
  'Fornitore = responsabile trattamento GDPR. Breach notification 24h',
  15,
  'critical',
  'La conformità GDPR è obbligatoria. Verificare che il DPA allegato sia completo e conforme.',
  'missing_critical',
  'Verificare che il DPA includa: misure di sicurezza, sub-processors, audit rights, data retention policy',
  'GDPR richiede: DPA completo, breach notification ≤72h, audit rights, data portability'
);

-- ============================================================
-- ESEMPIO 10: Clausola di Legge Applicabile (Bassa priorità)
-- ============================================================
INSERT INTO clauses (
  contract_id,
  clause_type,
  original_text,
  simplified_text,
  page_number,
  risk_level,
  risk_explanation,
  ai_flag,
  ai_suggestion,
  benchmark_comparison
) VALUES (
  'YOUR_CONTRACT_ID',
  'governing_law',
  'Il presente contratto è regolato dalla legge italiana. Per ogni controversia è competente in via esclusiva il Foro di Milano.',
  'Legge italiana. Foro competente: Milano',
  18,
  'low',
  'Clausola standard per contratti italiani.',
  null,
  null,
  'Standard per contratti B2B in Italia'
);

-- ============================================================
-- VERIFICA: Visualizza le clausole inserite
-- ============================================================
-- SELECT 
--   clause_type,
--   simplified_text,
--   risk_level,
--   ai_flag,
--   page_number
-- FROM clauses 
-- WHERE contract_id = 'YOUR_CONTRACT_ID'
-- ORDER BY page_number;
