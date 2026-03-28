# Export produzione (subset tabelle + trigger + policy)

Di seguito l'estrazione SQL **solo** per:
`companies`, `users`, `counterparts`, `employees`, `contracts`, `invoices`, `bandi`, `bandi_competitor_awards`.

## 1) Tabelle

```sql
CREATE TABLE public.companies (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  vat_number              TEXT UNIQUE,
  fiscal_code             TEXT,
  address                 TEXT,
  city                    TEXT,
  province                TEXT,
  cap                     TEXT,
  country                 TEXT DEFAULT 'IT',
  sector                  TEXT,
  ateco_code              TEXT,
  size                    TEXT CHECK (size IN ('micro','small','medium','large')),
  employee_count          INT,
  annual_revenue          NUMERIC,
  certifications          TEXT[] DEFAULT '{}'::TEXT[],
  sdi_code                TEXT,
  pec                     TEXT,
  past_pa_contracts       BOOLEAN DEFAULT FALSE,
  past_pa_contracts_value NUMERIC,
  geographic_operations   TEXT[] DEFAULT '{}'::TEXT[],
  created_by_ai           BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id    UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  role          TEXT DEFAULT 'viewer' CHECK (role IN ('admin','manager','viewer')),
  avatar_url    TEXT,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.counterparts (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id               UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type                     TEXT NOT NULL CHECK (type IN ('supplier','client','partner')),
  name                     TEXT NOT NULL,
  vat_number               TEXT,
  fiscal_code              TEXT,
  address                  TEXT,
  city                     TEXT,
  province                 TEXT,
  cap                      TEXT,
  country                  TEXT DEFAULT 'IT',
  sector                   TEXT,
  pec                      TEXT,
  sdi_code                 TEXT,
  referent_name            TEXT,
  referent_email           TEXT,
  referent_phone           TEXT,
  total_exposure           NUMERIC DEFAULT 0,
  total_revenue            NUMERIC DEFAULT 0,
  payment_avg_days         INT,
  payment_score            INT CHECK (payment_score BETWEEN 0 AND 100),
  reliability_score        INT CHECK (reliability_score BETWEEN 0 AND 100),
  reliability_label        TEXT CHECK (reliability_label IN ('excellent','good','warning','risk','unknown')) DEFAULT 'unknown',
  reliability_updated_at   TIMESTAMPTZ,
  verification_json        JSONB DEFAULT '{}'::JSONB,
  score_legal              INT DEFAULT 0,
  score_contributory       INT DEFAULT 0,
  score_reputation         INT DEFAULT 0,
  score_solidity           INT DEFAULT 0,
  score_consistency        INT DEFAULT 0,
  has_bankruptcy           BOOLEAN DEFAULT FALSE,
  has_anac_annotations     BOOLEAN DEFAULT FALSE,
  vat_verified             BOOLEAN DEFAULT FALSE,
  notes                    TEXT,
  tags                     TEXT[] DEFAULT '{}'::TEXT[],
  created_by_ai            BOOLEAN DEFAULT FALSE,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.employees (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id            UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  full_name             TEXT NOT NULL,
  fiscal_code           TEXT,
  birth_date            DATE,
  birth_place           TEXT,
  address               TEXT,
  city                  TEXT,
  province              TEXT,
  email                 TEXT,
  phone                 TEXT,
  iban                  TEXT,
  employee_type         TEXT CHECK (employee_type IN (
                          'employee','collaborator','consultant',
                          'intern','apprentice','vat_number'
                        )),
  role                  TEXT,
  department            TEXT,
  hire_date             DATE,
  termination_date      DATE,
  current_contract_id   UUID,
  ccnl                  TEXT,
  ccnl_level            TEXT,
  ccnl_version_date     DATE,
  ral                   NUMERIC,
  gross_cost            NUMERIC,
  notice_days           INT,
  meal_voucher_daily    NUMERIC,
  company_car           BOOLEAN DEFAULT FALSE,
  company_phone         BOOLEAN DEFAULT FALSE,
  welfare_budget        NUMERIC,
  other_benefits        JSONB DEFAULT '{}'::JSONB,
  fixed_term_count      INT DEFAULT 0,
  fixed_term_months     INT DEFAULT 0,
  medical_exam_date     DATE,
  safety_training_date  DATE,
  probation_end_date    DATE,
  fiscal_code_valid     BOOLEAN,
  fiscal_code_match     BOOLEAN,
  iban_valid            BOOLEAN,
  data_verified_at      TIMESTAMPTZ,
  osint_consent         BOOLEAN DEFAULT FALSE,
  osint_consent_date    TIMESTAMPTZ,
  notes                 TEXT,
  created_by_ai         BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contracts (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id              UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  contract_type           TEXT NOT NULL CHECK (contract_type IN (
                            'service_supply','goods_supply','framework',
                            'nda','agency','partnership',
                            'permanent','fixed_term','part_time',
                            'cococo','vat_number','internship','apprenticeship'
                          )),
  counterpart_id          UUID REFERENCES public.counterparts(id),
  employee_id             UUID REFERENCES public.employees(id),
  parent_contract_id      UUID REFERENCES public.contracts(id),
  contract_relation       TEXT CHECK (contract_relation IN (
                            'parent','subcontract','addendum','renewal','amendment'
                          )),
  status                  TEXT DEFAULT 'draft' CHECK (status IN (
                            'draft','negotiating','active',
                            'expiring','renewed','terminated','suspended'
                          )),
  value                   NUMERIC,
  value_type              TEXT CHECK (value_type IN ('total','annual','monthly','hourly')),
  currency                TEXT DEFAULT 'EUR',
  payment_terms           INT,
  payment_frequency       TEXT CHECK (payment_frequency IN (
                            'monthly','quarterly','milestone','one_time','annual'
                          )),
  vat_regime              TEXT CHECK (vat_regime IN (
                            'ordinary','reverse_charge','exempt','out_of_scope','split_payment'
                          )),
  vat_rate                NUMERIC DEFAULT 22,
  withholding_tax         BOOLEAN DEFAULT FALSE,
  withholding_rate        NUMERIC,
  istat_indexation        BOOLEAN DEFAULT FALSE,
  istat_indexation_month  INT,
  surety_bond_required    BOOLEAN DEFAULT FALSE,
  surety_bond_amount      NUMERIC,
  surety_bond_expiry      DATE,
  surety_bond_issuer      TEXT,
  start_date              DATE,
  end_date                DATE,
  signed_date             DATE,
  effective_date          DATE,
  auto_renewal            BOOLEAN DEFAULT FALSE,
  renewal_notice_days     INT,
  renewal_duration_months INT,
  governing_law           TEXT DEFAULT 'IT',
  jurisdiction            TEXT,
  language                TEXT DEFAULT 'it',
  is_public_admin         BOOLEAN DEFAULT FALSE,
  risk_score              INT CHECK (risk_score BETWEEN 0 AND 100),
  ai_summary              TEXT,
  ai_extracted_at         TIMESTAMPTZ,
  ai_confidence           NUMERIC CHECK (ai_confidence BETWEEN 0 AND 1),
  raw_text                TEXT,
  embedding               VECTOR(1536),
  version                 INT DEFAULT 1,
  is_current_version      BOOLEAN DEFAULT TRUE,
  title                   TEXT,
  reference_number        TEXT,
  tags                    TEXT[] DEFAULT '{}'::TEXT[],
  notes                   TEXT,
  created_by              UUID REFERENCES public.users(id),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_single_actor CHECK (
    (counterpart_id IS NOT NULL AND employee_id IS NULL) OR
    (counterpart_id IS NULL AND employee_id IS NOT NULL) OR
    (counterpart_id IS NULL AND employee_id IS NULL)
  )
);

ALTER TABLE public.employees
  ADD CONSTRAINT fk_current_contract
  FOREIGN KEY (current_contract_id) REFERENCES public.contracts(id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE public.invoices (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id            UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  contract_id           UUID REFERENCES public.contracts(id),
  counterpart_id        UUID REFERENCES public.counterparts(id),
  milestone_id          UUID REFERENCES public.milestones(id),
  invoice_type          TEXT NOT NULL CHECK (invoice_type IN ('active','passive')),
  invoice_number        TEXT,
  invoice_date          DATE,
  due_date              DATE,
  amount_net            NUMERIC NOT NULL,
  vat_rate              NUMERIC DEFAULT 22,
  vat_amount            NUMERIC,
  amount_gross          NUMERIC,
  withholding_amount    NUMERIC,
  amount_payable        NUMERIC,
  currency              TEXT DEFAULT 'EUR',
  pa_protocol           TEXT,
  sdi_status            TEXT CHECK (sdi_status IN (
                          'draft','pending','delivered',
                          'accepted','rejected','not_applicable'
                        )) DEFAULT 'draft',
  sdi_identifier        TEXT,
  sdi_error_code        TEXT,
  sdi_error_description TEXT,
  payment_date          DATE,
  payment_status        TEXT DEFAULT 'unpaid' CHECK (payment_status IN (
                          'unpaid','partial','paid','overdue','disputed'
                        )),
  file_url              TEXT,
  notes                 TEXT,
  created_by            UUID REFERENCES public.users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bandi (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id               UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  source                   TEXT NOT NULL CHECK (source IN (
                             'anac','ted_europa','regione_lombardia',
                             'regione_lazio','regione_piemonte',
                             'invitalia','mimit','consip',
                             'camera_commercio','inps','other'
                           )),
  source_label             TEXT,
  external_id              TEXT,
  cig                      TEXT,
  cup                      TEXT,
  source_url               TEXT NOT NULL,
  authority_name           TEXT NOT NULL,
  authority_type           TEXT CHECK (authority_type IN (
                             'comune','provincia','regione','ministero',
                             'ente_pubblico','azienda_sanitaria',
                             'universita','other'
                           )),
  authority_code           TEXT,
  title                    TEXT NOT NULL,
  description              TEXT,
  object                   TEXT,
  cpv_codes                TEXT[] DEFAULT '{}'::TEXT[],
  nuts_code                TEXT,
  procedure_type           TEXT CHECK (procedure_type IN (
                             'open','negotiated','restricted',
                             'competitive_dialogue','direct_award'
                           )),
  contract_category        TEXT CHECK (contract_category IN (
                             'services','goods','works','mixed'
                           )),
  award_criteria           TEXT CHECK (award_criteria IN (
                             'lowest_price','best_offer'
                           )),
  base_value               NUMERIC,
  estimated_value          NUMERIC,
  currency                 TEXT DEFAULT 'EUR',
  lot_count                INT DEFAULT 1,
  lots_json                JSONB DEFAULT '[]'::JSONB,
  publication_date         DATE,
  deadline                 TIMESTAMPTZ NOT NULL,
  site_visit_date          TIMESTAMPTZ,
  clarifications_deadline  TIMESTAMPTZ,
  award_date               DATE,
  requirements_json        JSONB DEFAULT '{}'::JSONB,
  documents_required       TEXT[] DEFAULT '{}'::TEXT[],
  technical_docs_url       TEXT,
  match_score              INT CHECK (match_score BETWEEN 0 AND 100),
  match_explanation        TEXT,
  match_breakdown          JSONB DEFAULT '{}'::JSONB,
  score_sector             INT DEFAULT 0,
  score_size               INT DEFAULT 0,
  score_geo                INT DEFAULT 0,
  score_requirements       INT DEFAULT 0,
  score_feasibility        INT DEFAULT 0,
  gap_analysis_json        JSONB DEFAULT '{}'::JSONB,
  checklist_json           JSONB DEFAULT '[]'::JSONB,
  company_profile_snapshot JSONB DEFAULT '{}'::JSONB,
  bando_embedding          VECTOR(1536),
  subappalto_allowed       BOOLEAN DEFAULT FALSE,
  subappalto_max_pct       NUMERIC,
  rti_allowed              BOOLEAN DEFAULT TRUE,
  rti_mandatory            BOOLEAN DEFAULT FALSE,
  rti_partner_ids          UUID[] DEFAULT '{}'::UUID[],
  participation_status     TEXT DEFAULT 'new' CHECK (participation_status IN (
                             'new','saved','evaluating','participating',
                             'submitted','won','lost','withdrawn'
                           )),
  internal_notes           TEXT,
  winner_name              TEXT,
  winner_vat               TEXT,
  awarded_value            NUMERIC,
  resulting_contract_id    UUID REFERENCES public.contracts(id),
  alert_sent               BOOLEAN DEFAULT FALSE,
  alert_sent_at            TIMESTAMPTZ,
  scraped_at               TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at          TIMESTAMPTZ DEFAULT NOW(),
  is_active                BOOLEAN DEFAULT TRUE,
  UNIQUE(company_id, external_id, source)
);

CREATE TABLE public.bandi_competitor_awards (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id     UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  bando_id       UUID REFERENCES public.bandi(id) ON DELETE SET NULL,
  cig            TEXT,
  authority_name TEXT,
  cpv_codes      TEXT[] DEFAULT '{}'::TEXT[],
  procedure_year INT,
  winner_name    TEXT NOT NULL,
  winner_vat     TEXT,
  awarded_value  NUMERIC,
  base_value     NUMERIC,
  discount_pct   NUMERIC,
  source_url     TEXT,
  scraped_at     TIMESTAMPTZ DEFAULT NOW()
);
```

## 2) Funzioni e trigger (solo correlati al subset)

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_counterparts_updated
  BEFORE UPDATE ON public.counterparts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_employees_updated
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_contracts_updated
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_invoices_updated
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_bandi_updated
  BEFORE UPDATE ON public.bandi
  FOR EACH ROW EXECUTE FUNCTION public.update_last_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
BEGIN
  INSERT INTO public.companies (
    name,
    vat_number,
    sector,
    size,
    city
  ) VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Azienda di ' || COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utente')),
    NEW.raw_user_meta_data->>'vat_number',
    NEW.raw_user_meta_data->>'sector',
    NEW.raw_user_meta_data->>'size',
    NEW.raw_user_meta_data->>'city'
  ) RETURNING id INTO new_company_id;

  INSERT INTO public.users (
    id,
    company_id,
    email,
    full_name,
    role
  ) VALUES (
    NEW.id,
    new_company_id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'admin'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_contract_status()
RETURNS TRIGGER AS $$
BEGIN
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

CREATE TRIGGER trg_contracts_status
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_contract_status();

CREATE OR REPLACE FUNCTION public.update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'unpaid' AND NEW.due_date < CURRENT_DATE THEN
    NEW.payment_status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoices_status
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_status();

CREATE OR REPLACE FUNCTION public.update_reliability_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.reliability_score IS DISTINCT FROM NEW.reliability_score THEN
    NEW.reliability_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_counterpart_reliability
  BEFORE UPDATE ON public.counterparts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reliability_timestamp();
```

> Nota: nel progetto esistono anche trigger su `contracts`, `invoices`, `employees` che inseriscono in `public.alerts`. Non li includo qui perché `alerts` non è nel subset richiesto.

## 3) RLS + Policies (solo subset richiesto)

```sql
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counterparts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandi_competitor_awards ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.auth_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE POLICY "company_isolation" ON public.companies
  FOR ALL USING (id = public.auth_company_id());

CREATE POLICY "users_own_company" ON public.users
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "company_isolation" ON public.counterparts
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "company_isolation" ON public.employees
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "company_isolation" ON public.contracts
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "company_isolation" ON public.invoices
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "company_isolation" ON public.bandi
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "company_isolation" ON public.bandi_competitor_awards
  FOR ALL USING (company_id = public.auth_company_id());

CREATE POLICY "allow_insert_own_company" ON public.companies
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "allow_insert_own_user" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "allow_select_own_user" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "allow_update_own_user" ON public.users
  FOR UPDATE USING (id = auth.uid());
```
