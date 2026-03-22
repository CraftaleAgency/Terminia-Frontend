-- =============================================
-- TERMINIA - Complete Database Schema
-- Version: 1.0
-- Date: 2025-03-22
-- =============================================

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE contract_status AS ENUM ('draft', 'negotiating', 'active', 'expiring', 'renewed', 'terminated');
CREATE TYPE contract_type AS ENUM ('service_supply', 'goods_supply', 'framework', 'nda', 'agency', 'partnership', 'permanent', 'fixed_term', 'cococo', 'apprenticeship', 'internship', 'collaboration');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE counterpart_type AS ENUM ('supplier', 'client', 'partner');
CREATE TYPE reliability_label AS ENUM ('excellent', 'good', 'warning', 'risk', 'critical', 'unknown');
CREATE TYPE employee_type AS ENUM ('employee', 'collaborator', 'consultant', 'intern');
CREATE TYPE bando_source AS ENUM ('anac', 'ted_europa', 'invitalia', 'mimit', 'regione');
CREATE TYPE participation_status AS ENUM ('new', 'saved', 'evaluating', 'participating', 'submitted', 'won', 'lost', 'withdrawn');
CREATE TYPE invoice_type AS ENUM ('active', 'passive');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid', 'overdue');
CREATE TYPE alert_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE alert_status AS ENUM ('pending', 'handled', 'snoozed', 'dismissed');
CREATE TYPE alert_type AS ENUM ('auto_renewal', 'contract_expiry', 'obligation_due', 'payment_expected', 'new_bando_match', 'reliability_score_drop', 'medical_exam_due', 'milestone_approaching');
CREATE TYPE milestone_status AS ENUM ('scheduled', 'in_progress', 'completed', 'approved', 'billable', 'invoiced');
CREATE TYPE obligation_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE obligation_recurrence AS ENUM ('none', 'monthly', 'quarterly', 'annual');
CREATE TYPE document_type AS ENUM ('original', 'signed', 'amendment', 'attachment', 'dpa', 'invoice');
CREATE TYPE signature_status AS ENUM ('pending', 'signed', 'rejected');
CREATE TYPE vat_regime AS ENUM ('ordinary', 'reverse_charge', 'exempt', 'out_of_scope', 'split_payment');
CREATE TYPE payment_frequency AS ENUM ('monthly', 'quarterly', 'milestone', 'one_time', 'annual');
CREATE TYPE value_type AS ENUM ('total', 'annual', 'monthly', 'hourly');
CREATE TYPE obligation_party AS ENUM ('mine', 'theirs');
CREATE TYPE obligation_type AS ENUM ('payment', 'delivery', 'notification', 'compliance', 'other');

-- =============================================
-- COUNTERPARTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.counterparts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type counterpart_type NOT NULL DEFAULT 'supplier',

  -- Anagrafici
  vat_number TEXT,
  fiscal_code TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Italia',
  pec TEXT,
  sdI_code TEXT,

  -- Referente
  referent_name TEXT,
  referent_email TEXT,
  referent_phone TEXT,

  -- Business
  sector TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,

  -- OSINT Reliability Score
  reliability_score INTEGER CHECK (reliability_score >= 0 AND reliability_score <= 100),
  reliability_label reliability_label DEFAULT 'unknown',
  reliability_updated_at TIMESTAMP WITH TIME ZONE,

  -- Score Breakdown
  score_legal INTEGER DEFAULT 0 CHECK (score_legal >= 0 AND score_legal <= 30),
  score_contributory INTEGER DEFAULT 0 CHECK (score_contributory >= 0 AND score_contributory <= 20),
  score_reputation INTEGER DEFAULT 0 CHECK (score_reputation >= 0 AND score_reputation <= 20),
  score_solidity INTEGER DEFAULT 0 CHECK (score_solidity >= 0 AND score_solidity <= 20),
  score_consistency INTEGER DEFAULT 0 CHECK (score_consistency >= 0 AND score_consistency <= 10),

  -- OSINT Flags
  has_bankruptcy BOOLEAN DEFAULT false,
  has_anac_annotations BOOLEAN DEFAULT false,
  vat_verified BOOLEAN DEFAULT false,
  verification_json JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_counterparts_user ON public.counterparts(user_id);
CREATE INDEX idx_counterparts_name ON public.counterparts(name);
CREATE INDEX idx_counterparts_vat ON public.counterparts(vat_number);

-- =============================================
-- EMPLOYEES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Anagrafici
  full_name TEXT NOT NULL,
  fiscal_code TEXT,
  email TEXT,
  phone TEXT,

  -- Contratto
  employee_type employee_type NOT NULL DEFAULT 'employee',
  role TEXT,
  department TEXT,
  hire_date DATE NOT NULL,
  termination_date DATE,

  -- CCNL e Livello
  ccnl TEXT,
  ccnl_level TEXT,

  -- Economici
  ral INTEGER DEFAULT 0,
  gross_cost INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10,2),

  -- Periodo di Prova
  probation_end_date DATE,

  -- Scadenze HR
  medical_exam_date DATE,
  medical_exam_due_date DATE,
  safety_training_date DATE,
  safety_training_due_date DATE,

  -- Contratti a Tempo Determinato
  fixed_term_count INTEGER DEFAULT 0,
  fixed_term_months INTEGER DEFAULT 0,

  -- IBAN per pagamenti
  iban TEXT,

  -- GDPR Consent
  osint_consent BOOLEAN DEFAULT false,
  osint_consent_date TIMESTAMP WITH TIME ZONE,

  -- Note
  notes TEXT,
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_employees_user ON public.employees(user_id);
CREATE INDEX idx_employees_name ON public.employees(full_name);
CREATE INDEX idx_employees_department ON public.employees(department);

-- =============================================
-- CONTRACTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Dati Generali
  title TEXT NOT NULL,
  reference_number TEXT,
  contract_type contract_type NOT NULL,
  status contract_status NOT NULL DEFAULT 'draft',

  -- Relazioni
  counterpart_id UUID REFERENCES public.counterparts ON DELETE SET NULL,
  employee_id UUID REFERENCES public.employees ON DELETE SET NULL,

  -- Valore
  value NUMERIC(15,2) DEFAULT 0,
  value_type value_type NOT NULL DEFAULT 'total',

  -- Termini di Pagamento
  payment_terms_days INTEGER DEFAULT 30,
  payment_frequency payment_frequency DEFAULT 'monthly',

  -- IVA
  vat_regime vat_regime DEFAULT 'ordinary',
  vat_rate NUMERIC(5,2) DEFAULT 22.00,

  -- Ritenuta d'Acconto
  withholding_tax_enabled BOOLEAN DEFAULT false,
  withholding_tax_rate NUMERIC(5,2) DEFAULT 20.00,

  -- Indice ISTAT
  istat_index_enabled BOOLEAN DEFAULT false,
  istat_reference_month TEXT,

  -- Date
  signing_date DATE,
  start_date DATE NOT NULL,
  end_date DATE,
  effectiveness_date DATE,

  -- Rinnovo Automatico
  auto_renewal BOOLEAN DEFAULT false,
  renewal_notice_days INTEGER DEFAULT 30,
  renewal_duration_months INTEGER DEFAULT 12,

  -- Fidejussione
  fidejussione_amount NUMERIC(15,2),
  fidejussione_expiry DATE,
  fidejussione_issuer TEXT,

  -- AI Analysis
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  ai_summary TEXT,
  ai_analysis_json JSONB DEFAULT '{}',

  -- GDPR
  dpa_signed BOOLEAN DEFAULT false,
  dpa_date DATE,
  data_categories TEXT[],
  data_purposes TEXT,
  data_retention_months INTEGER,
  sub_processors TEXT[],

  -- Note e Tag
  notes TEXT,
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_contracts_user ON public.contracts(user_id);
CREATE INDEX idx_contracts_counterpart ON public.contracts(counterpart_id);
CREATE INDEX idx_contracts_employee ON public.contracts(employee_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contracts_end_date ON public.contracts(end_date);

-- =============================================
-- CLAUSES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,

  clause_type TEXT NOT NULL,
  original_text TEXT NOT NULL,
  simplified_text TEXT,

  -- Risk Analysis
  risk_level risk_level DEFAULT 'low',
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),

  -- AI Flags
  ai_flag TEXT,
  ai_suggestion TEXT,
  benchmark_data JSONB,

  -- Ordinamento
  position INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_clauses_contract ON public.clauses(contract_id);
CREATE INDEX idx_clauses_risk ON public.clauses(risk_level);

-- =============================================
-- OBLIGATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,

  description TEXT NOT NULL,
  party obligation_party NOT NULL DEFAULT 'theirs',
  obligation_type obligation_type DEFAULT 'other',

  -- Scadenza
  due_date DATE,
  recurrence obligation_recurrence DEFAULT 'none',
  next_recurrence_date DATE,

  -- Status
  status obligation_status DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_obligations_contract ON public.obligations(contract_id);
CREATE INDEX idx_obligations_due_date ON public.obligations(due_date);
CREATE INDEX idx_obligations_status ON public.obligations(status);

-- =============================================
-- MILESTONES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,

  title TEXT NOT NULL,
  description TEXT,

  -- Date
  due_date DATE,
  completed_date DATE,

  -- Importo
  amount NUMERIC(15,2),

  -- Status
  status milestone_status DEFAULT 'scheduled',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_milestones_contract ON public.milestones(contract_id);
CREATE INDEX idx_milestones_due_date ON public.milestones(due_date);
CREATE INDEX idx_milestones_status ON public.milestones(status);

-- =============================================
-- DOCUMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts ON DELETE CASCADE,

  -- File Info
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  mime_type TEXT,

  -- Documento
  document_type document_type NOT NULL DEFAULT 'attachment',
  version INTEGER DEFAULT 1,
  is_current BOOLEAN DEFAULT true,

  -- Firma
  signature_status signature_status,
  signed_at TIMESTAMP WITH TIME ZONE,
  signed_by TEXT,

  -- Upload
  uploaded_by UUID REFERENCES auth.users ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_documents_contract ON public.documents(contract_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);

-- =============================================
-- NEGOTIATION HISTORY TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.negotiation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts ON DELETE CASCADE NOT NULL,

  event_type TEXT NOT NULL,
  description TEXT,
  initiated_by TEXT NOT NULL, -- 'mine' | 'theirs'
  version_number INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_negotiation_contract ON public.negotiation_history(contract_id);

-- =============================================
-- BANDI TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.bandi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Fonte
  source bando_source NOT NULL,
  external_id TEXT,
  source_url TEXT,

  -- Dati Base
  title TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  authority_type TEXT,
  description TEXT,

  -- Categoria e Procedura
  category TEXT,
  procedure_type TEXT,

  -- Valore
  base_value NUMERIC(15,2),
  lot_count INTEGER DEFAULT 1,

  -- Codici
  cpv_codes TEXT[],
  cigs TEXT[],
  cups TEXT[],
  nuts_code TEXT,

  -- Date
  publication_date DATE,
  deadline DATE,
  site_visit_date DATE,
  clarification_date DATE,
  award_date DATE,

  -- Match Score
  match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  match_explanation TEXT,

  -- Score Breakdown
  score_sector INTEGER DEFAULT 0 CHECK (score_sector >= 0 AND score_sector <= 40),
  score_size INTEGER DEFAULT 0 CHECK (score_size >= 0 AND score_size <= 30),
  score_geo INTEGER DEFAULT 0 CHECK (score_geo >= 0 AND score_geo <= 25),
  score_requirements INTEGER DEFAULT 0 CHECK (score_requirements >= 0 AND score_requirements <= 20),
  score_feasibility INTEGER DEFAULT 0 CHECK (score_feasibility >= 0 AND score_feasibility <= 20),

  -- Status
  participation_status participation_status DEFAULT 'new',

  -- Gap Analysis
  requirements TEXT[],
  gap_satisfied TEXT[],
  gap_missing TEXT[],

  -- Subappalto e RTI
  subappalto_allowed BOOLEAN DEFAULT false,
  subappalto_max_percent NUMERIC(5,2),
  rti_allowed BOOLEAN DEFAULT false,

  -- Criteri Aggiudicazione
  award_criteria JSONB,

  -- Competitor Analysis
  competitor_history JSONB DEFAULT '[]',

  -- Note Interne
  internal_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_bandi_user ON public.bandi(user_id);
CREATE INDEX idx_bandi_deadline ON public.bandi(deadline);
CREATE INDEX idx_bandi_match_score ON public.bandi(match_score);
CREATE INDEX idx_bandi_status ON public.bandi(participation_status);
CREATE INDEX idx_bandi_source ON public.bandi(source);

-- =============================================
-- BANDO DOCUMENTS CHECKLIST TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.bando_document_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bando_id UUID REFERENCES public.bandi ON DELETE CASCADE NOT NULL,

  document_name TEXT NOT NULL,
  description TEXT,
  how_to_obtain TEXT,
  estimated_time TEXT,
  is_long_process BOOLEAN DEFAULT false,

  -- Status
  is_ready BOOLEAN DEFAULT false,
  ready_at TIMESTAMP WITH TIME ZONE,

  -- Template
  template_url TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_bando_checklist_bando ON public.bando_document_checklist(bando_id);

-- =============================================
-- BANDO LOTTI TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.bando_lotti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bando_id UUID REFERENCES public.bandi ON DELETE CASCADE NOT NULL,

  lot_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC(15,2),

  -- Requisiti Specifici
  specific_requirements TEXT[],

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_bando_lotti_bando ON public.bando_lotti(bando_id);

-- =============================================
-- INVOICES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Tipo
  invoice_type invoice_type NOT NULL,
  invoice_number TEXT NOT NULL,

  -- Relazioni
  counterpart_id UUID REFERENCES public.counterparts ON DELETE SET NULL,
  contract_id UUID REFERENCES public.contracts ON DELETE SET NULL,

  -- Date
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Importi
  amount_net NUMERIC(15,2) NOT NULL,
  vat_rate NUMERIC(5,2) DEFAULT 22.00,
  vat_amount NUMERIC(15,2),
  amount_gross NUMERIC(15,2) NOT NULL,

  -- Pagamento
  payment_status payment_status DEFAULT 'unpaid',
  payment_date DATE,
  payment_method TEXT,

  -- Note
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_invoices_user ON public.invoices(user_id);
CREATE INDEX idx_invoices_counterpart ON public.invoices(counterpart_id);
CREATE INDEX idx_invoices_contract ON public.invoices(contract_id);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_status ON public.invoices(payment_status);

-- =============================================
-- ALERTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Tipo
  alert_type alert_type NOT NULL,
  priority alert_priority DEFAULT 'medium',
  status alert_status DEFAULT 'pending',

  -- Contenuto
  title TEXT NOT NULL,
  description TEXT,

  -- Trigger
  trigger_date DATE NOT NULL,

  -- Relazioni
  contract_id UUID REFERENCES public.contracts ON DELETE CASCADE,
  counterpart_id UUID REFERENCES public.counterparts ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees ON DELETE CASCADE,
  bando_id UUID REFERENCES public.bandi ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices ON DELETE CASCADE,

  -- Snooze
  snoozed_until TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_alerts_user ON public.alerts(user_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_priority ON public.alerts(priority);
CREATE INDEX idx_alerts_trigger_date ON public.alerts(trigger_date);

-- =============================================
-- OSINT VERIFICATION LOG TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.osint_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counterpart_id UUID REFERENCES public.counterparts ON DELETE CASCADE NOT NULL,

  -- Verifica
  verification_type TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failed', 'warning'

  -- Risultati
  result_json JSONB DEFAULT '{}',
  error_message TEXT,

  -- Score Changes
  score_before INTEGER,
  score_after INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_osint_logs_counterpart ON public.osint_verification_logs(counterpart_id);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.counterparts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bando_document_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bando_lotti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osint_verification_logs ENABLE ROW LEVEL SECURITY;

-- Counterparts Policies
CREATE POLICY "Users can view their own counterparts"
  ON public.counterparts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own counterparts"
  ON public.counterparts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own counterparts"
  ON public.counterparts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own counterparts"
  ON public.counterparts FOR DELETE
  USING (auth.uid() = user_id);

-- Employees Policies
CREATE POLICY "Users can view their own employees"
  ON public.employees FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own employees"
  ON public.employees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employees"
  ON public.employees FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employees"
  ON public.employees FOR DELETE
  USING (auth.uid() = user_id);

-- Contracts Policies
CREATE POLICY "Users can view their own contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
  ON public.contracts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts"
  ON public.contracts FOR DELETE
  USING (auth.uid() = user_id);

-- Clauses Policies (inherit from contracts)
CREATE POLICY "Users can view clauses of their contracts"
  ON public.clauses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = clauses.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert clauses of their contracts"
  ON public.clauses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = clauses.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update clauses of their contracts"
  ON public.clauses FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = clauses.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete clauses of their contracts"
  ON public.clauses FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = clauses.contract_id
    AND contracts.user_id = auth.uid()
  ));

-- Obligations Policies (inherit from contracts)
CREATE POLICY "Users can view obligations of their contracts"
  ON public.obligations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = obligations.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert obligations of their contracts"
  ON public.obligations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = obligations.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update obligations of their contracts"
  ON public.obligations FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = obligations.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete obligations of their contracts"
  ON public.obligations FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = obligations.contract_id
    AND contracts.user_id = auth.uid()
  ));

-- Milestones Policies (inherit from contracts)
CREATE POLICY "Users can view milestones of their contracts"
  ON public.milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = milestones.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert milestones of their contracts"
  ON public.milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = milestones.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update milestones of their contracts"
  ON public.milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = milestones.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete milestones of their contracts"
  ON public.milestones FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = milestones.contract_id
    AND contracts.user_id = auth.uid()
  ));

-- Documents Policies (inherit from contracts)
CREATE POLICY "Users can view documents of their contracts"
  ON public.documents FOR SELECT
  USING (contract_id IS NULL OR EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = documents.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert documents of their contracts"
  ON public.documents FOR INSERT
  WITH CHECK (contract_id IS NULL OR EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = documents.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update documents of their contracts"
  ON public.documents FOR UPDATE
  USING (contract_id IS NULL OR EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = documents.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete documents of their contracts"
  ON public.documents FOR DELETE
  USING (contract_id IS NULL OR EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = documents.contract_id
    AND contracts.user_id = auth.uid()
  ));

-- Negotiation History Policies (inherit from contracts)
CREATE POLICY "Users can view negotiation history of their contracts"
  ON public.negotiation_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = negotiation_history.contract_id
    AND contracts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert negotiation history of their contracts"
  ON public.negotiation_history FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.contracts
    WHERE contracts.id = negotiation_history.contract_id
    AND contracts.user_id = auth.uid()
  ));

-- Bandi Policies
CREATE POLICY "Users can view their own bandi"
  ON public.bandi FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bandi"
  ON public.bandi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bandi"
  ON public.bandi FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bandi"
  ON public.bandi FOR DELETE
  USING (auth.uid() = user_id);

-- Bando Document Checklist Policies (inherit from bandi)
CREATE POLICY "Users can view checklist of their bandi"
  ON public.bando_document_checklist FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_document_checklist.bando_id
    AND bandi.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert checklist of their bandi"
  ON public.bando_document_checklist FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_document_checklist.bando_id
    AND bandi.user_id = auth.uid()
  ));

CREATE POLICY "Users can update checklist of their bandi"
  ON public.bando_document_checklist FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_document_checklist.bando_id
    AND bandi.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete checklist of their bandi"
  ON public.bando_document_checklist FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_document_checklist.bando_id
    AND bandi.user_id = auth.uid()
  ));

-- Bando Lotti Policies (inherit from bandi)
CREATE POLICY "Users can view lotti of their bandi"
  ON public.bando_lotti FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_lotti.bando_id
    AND bandi.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert lotti of their bandi"
  ON public.bando_lotti FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_lotti.bando_id
    AND bandi.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete lotti of their bandi"
  ON public.bando_lotti FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.bandi
    WHERE bandi.id = bando_lotti.bando_id
    AND bandi.user_id = auth.uid()
  ));

-- Invoices Policies
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON public.invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Alerts Policies
CREATE POLICY "Users can view their own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON public.alerts FOR DELETE
  USING (auth.uid() = user_id);

-- OSINT Logs Policies (inherit from counterparts)
CREATE POLICY "Users can view osint logs of their counterparts"
  ON public.osint_verification_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.counterparts
    WHERE counterparts.id = osint_verification_logs.counterpart_id
    AND counterparts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert osint logs of their counterparts"
  ON public.osint_verification_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.counterparts
    WHERE counterparts.id = osint_verification_logs.counterpart_id
    AND counterparts.user_id = auth.uid()
  ));

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================

CREATE TRIGGER counterparts_updated_at
  BEFORE UPDATE ON public.counterparts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER clauses_updated_at
  BEFORE UPDATE ON public.clauses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER obligations_updated_at
  BEFORE UPDATE ON public.obligations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER bandi_updated_at
  BEFORE UPDATE ON public.bandi
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER bando_checklist_updated_at
  BEFORE UPDATE ON public.bando_document_checklist
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- FUNCTIONS FOR CALCULATED FIELDS
-- =============================================

-- Function to update contract status based on dates
CREATE OR REPLACE FUNCTION update_contract_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set status based on end_date
  IF NEW.end_date IS NOT NULL THEN
    IF NEW.end_date < CURRENT_DATE AND NEW.status = 'active' THEN
      NEW.status := 'terminated';
    ELSIF NEW.end_date <= CURRENT_DATE + INTERVAL '30 days' AND NEW.status = 'active' THEN
      NEW.status := 'expiring';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contracts_status_trigger
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_status();

-- Function to update invoice payment_status based on due_date
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'unpaid' AND NEW.due_date < CURRENT_DATE THEN
    NEW.payment_status := 'overdue';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_status_trigger
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_status();

-- Function to update obligation status based on due_date
CREATE OR REPLACE FUNCTION update_obligation_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.due_date IS NOT NULL AND NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER obligations_status_trigger
  BEFORE UPDATE ON public.obligations
  FOR EACH ROW
  EXECUTE FUNCTION update_obligation_status();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for contracts with counterpart/employee names
CREATE OR REPLACE VIEW contracts_with_details AS
SELECT
  c.*,
  cp.name as counterpart_name,
  cp.type as counterpart_type,
  cp.reliability_score as counterpart_reliability,
  e.full_name as employee_name,
  e.role as employee_role,
  e.department as employee_department
FROM public.contracts c
LEFT JOIN public.counterparts cp ON c.counterpart_id = cp.id
LEFT JOIN public.employees e ON c.employee_id = e.id;

-- View for invoices with related names
CREATE OR REPLACE VIEW invoices_with_details AS
SELECT
  i.*,
  cp.name as counterpart_name,
  c.title as contract_name,
  c.contract_type
FROM public.invoices i
LEFT JOIN public.counterparts cp ON i.counterpart_id = cp.id
LEFT JOIN public.contracts c ON i.contract_id = c.id;

-- View for bandi statistics
CREATE OR REPLACE VIEW bandi_stats AS
SELECT
  user_id,
  COUNT(*) as total_bandi,
  COUNT(*) FILTER (WHERE participation_status = 'new') as new_bandi,
  COUNT(*) FILTER (WHERE match_score >= 80) as high_match_bandi,
  COUNT(*) FILTER (WHERE deadline <= CURRENT_DATE + INTERVAL '7 days') as expiring_soon_bandi,
  COUNT(*) FILTER (WHERE participation_status IN ('participating', 'submitted')) as participating_bandi,
  SUM(base_value) FILTER (WHERE participation_status = 'won') as won_value
FROM public.bandi
GROUP BY user_id;
