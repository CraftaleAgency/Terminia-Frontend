-- ============================================================
-- TERMINIA — 002 ROW LEVEL SECURITY POLICIES
-- Isolamento dati per company
-- ============================================================

-- ============================================================
-- ROW LEVEL SECURITY ENABLE
-- ============================================================
ALTER TABLE public.companies             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counterparts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obligations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_documents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_records          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandi                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandi_competitor_awards ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: auth_company_id()
-- Ottiene il company_id dell'utente autenticato
-- ============================================================
CREATE OR REPLACE FUNCTION public.auth_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- POLICIES: Tabelle con company_id diretto
-- ============================================================

-- COMPANIES
CREATE POLICY "company_isolation" ON public.companies
  FOR ALL USING (id = public.auth_company_id());

-- USERS
CREATE POLICY "users_own_company" ON public.users
  FOR ALL USING (company_id = public.auth_company_id());

-- COUNTERPARTS (pagina: /dashboard/counterparts)
CREATE POLICY "company_isolation" ON public.counterparts
  FOR ALL USING (company_id = public.auth_company_id());

-- EMPLOYEES (pagina: /dashboard/employees)
CREATE POLICY "company_isolation" ON public.employees
  FOR ALL USING (company_id = public.auth_company_id());

-- CONTRACTS (pagina: /dashboard/contracts)
CREATE POLICY "company_isolation" ON public.contracts
  FOR ALL USING (company_id = public.auth_company_id());

-- INVOICES (pagina: /dashboard/invoices)
CREATE POLICY "company_isolation" ON public.invoices
  FOR ALL USING (company_id = public.auth_company_id());

-- ALERTS
CREATE POLICY "company_isolation" ON public.alerts
  FOR ALL USING (company_id = public.auth_company_id());

-- BANDI (pagina: /dashboard/bandi)
CREATE POLICY "company_isolation" ON public.bandi
  FOR ALL USING (company_id = public.auth_company_id());

-- GENERATED DOCUMENTS
CREATE POLICY "company_isolation" ON public.generated_documents
  FOR ALL USING (company_id = public.auth_company_id());

-- AI INTERVIEWS
CREATE POLICY "company_isolation" ON public.ai_interviews
  FOR ALL USING (company_id = public.auth_company_id());

-- PAYMENT RECORDS
CREATE POLICY "company_isolation" ON public.payment_records
  FOR ALL USING (company_id = public.auth_company_id());

-- GDPR RECORDS
CREATE POLICY "company_isolation" ON public.gdpr_records
  FOR ALL USING (company_id = public.auth_company_id());

-- BANDI COMPETITOR AWARDS (pagina: /dashboard/analytics)
CREATE POLICY "company_isolation" ON public.bandi_competitor_awards
  FOR ALL USING (company_id = public.auth_company_id());

-- ============================================================
-- POLICIES: Tabelle con accesso via contract_id (JOIN)
-- ============================================================

-- CLAUSES
CREATE POLICY "company_isolation" ON public.clauses
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- OBLIGATIONS
CREATE POLICY "company_isolation" ON public.obligations
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- MILESTONES
CREATE POLICY "company_isolation" ON public.milestones
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- SCOPE ITEMS
CREATE POLICY "company_isolation" ON public.scope_items
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- CHANGE REQUESTS
CREATE POLICY "company_isolation" ON public.change_requests
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- CONTRACT DOCUMENTS
CREATE POLICY "company_isolation" ON public.contract_documents
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- NEGOTIATION EVENTS
CREATE POLICY "company_isolation" ON public.negotiation_events
  FOR ALL USING (
    contract_id IN (SELECT id FROM public.contracts WHERE company_id = public.auth_company_id())
  );

-- ============================================================
-- POLICIES AGGIUNTIVE: Onboarding e creazione company
-- ============================================================

-- Permetti agli utenti autenticati di creare la propria company
CREATE POLICY "allow_insert_own_company" ON public.companies
  FOR INSERT WITH CHECK (TRUE);

-- Permetti agli utenti autenticati di creare il proprio profilo user
CREATE POLICY "allow_insert_own_user" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Permetti agli utenti di vedere e aggiornare il proprio profilo
CREATE POLICY "allow_select_own_user" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "allow_update_own_user" ON public.users
  FOR UPDATE USING (id = auth.uid());
