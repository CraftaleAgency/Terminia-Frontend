-- ============================================================
-- TERMINIA — 003 TRIGGERS E FUNZIONI
-- Automazione: updated_at, status, onboarding
-- ============================================================

-- ============================================================
-- FUNZIONI BASE: update_updated_at
-- ============================================================
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

-- ============================================================
-- TRIGGERS updated_at PER OGNI TABELLA
-- ============================================================

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

CREATE TRIGGER trg_milestones_updated 
  BEFORE UPDATE ON public.milestones 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_invoices_updated 
  BEFORE UPDATE ON public.invoices 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_change_requests_updated 
  BEFORE UPDATE ON public.change_requests 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_generated_docs_updated 
  BEFORE UPDATE ON public.generated_documents 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Bandi usa last_updated_at
CREATE TRIGGER trg_bandi_updated 
  BEFORE UPDATE ON public.bandi 
  FOR EACH ROW EXECUTE FUNCTION public.update_last_updated_at();

-- ============================================================
-- TRIGGER: Onboarding - Crea company e user automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Crea la company con i dati dall'onboarding
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

  -- Crea il profilo utente collegato alla company
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
    'admin'  -- Il primo utente è sempre admin
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger che si attiva quando un utente si registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Auto-aggiornamento status contratto
-- ============================================================
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

-- ============================================================
-- TRIGGER: Auto-aggiornamento status fattura (overdue)
-- ============================================================
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

-- ============================================================
-- TRIGGER: Auto-aggiornamento status obblighi (overdue)
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_obligation_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.due_date IS NOT NULL AND NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_obligations_status
  BEFORE UPDATE ON public.obligations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_obligation_status();

-- ============================================================
-- TRIGGER: Generazione automatica alert scadenze
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_contract_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- Alert per contratti in scadenza (30 giorni prima)
  IF NEW.end_date IS NOT NULL AND NEW.status = 'active' THEN
    IF NEW.end_date <= CURRENT_DATE + INTERVAL '30 days' 
       AND NEW.end_date > CURRENT_DATE THEN
      INSERT INTO public.alerts (
        company_id,
        contract_id,
        alert_type,
        priority,
        title,
        description,
        trigger_date
      ) VALUES (
        NEW.company_id,
        NEW.id,
        CASE WHEN NEW.auto_renewal THEN 'auto_renewal' ELSE 'contract_expiry' END,
        'high',
        CASE 
          WHEN NEW.auto_renewal THEN 'Rinnovo automatico in scadenza: ' || COALESCE(NEW.title, 'Contratto')
          ELSE 'Contratto in scadenza: ' || COALESCE(NEW.title, 'Contratto')
        END,
        'Il contratto scade il ' || NEW.end_date::TEXT,
        (NEW.end_date - INTERVAL '30 days')::TIMESTAMPTZ
      ) ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contract_alerts
  AFTER INSERT OR UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_contract_alerts();

-- ============================================================
-- TRIGGER: Alert per fatture in scadenza
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_invoice_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- Alert 7 giorni prima della scadenza
  IF NEW.due_date IS NOT NULL AND NEW.payment_status = 'unpaid' THEN
    IF NEW.due_date <= CURRENT_DATE + INTERVAL '7 days' 
       AND NEW.due_date > CURRENT_DATE THEN
      INSERT INTO public.alerts (
        company_id,
        invoice_id,
        alert_type,
        priority,
        title,
        description,
        trigger_date
      ) VALUES (
        NEW.company_id,
        NEW.id,
        CASE 
          WHEN NEW.invoice_type = 'passive' THEN 'payment_expected'
          ELSE 'invoice_not_issued'
        END,
        'medium',
        CASE 
          WHEN NEW.invoice_type = 'passive' THEN 'Pagamento in scadenza: ' || COALESCE(NEW.invoice_number, 'Fattura')
          ELSE 'Fattura da incassare: ' || COALESCE(NEW.invoice_number, 'Fattura')
        END,
        'Scadenza: ' || NEW.due_date::TEXT || ' - Importo: €' || NEW.amount_gross::TEXT,
        (NEW.due_date - INTERVAL '7 days')::TIMESTAMPTZ
      ) ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_alerts
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_invoice_alerts();

-- ============================================================
-- TRIGGER: Alert per scadenze HR dipendenti
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_employee_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- Visita medica in scadenza
  IF NEW.medical_exam_date IS NOT NULL THEN
    IF NEW.medical_exam_date <= CURRENT_DATE + INTERVAL '30 days' 
       AND NEW.medical_exam_date > CURRENT_DATE THEN
      INSERT INTO public.alerts (
        company_id,
        employee_id,
        alert_type,
        priority,
        title,
        description,
        trigger_date
      ) VALUES (
        NEW.company_id,
        NEW.id,
        'medical_exam_due',
        'high',
        'Visita medica in scadenza: ' || NEW.full_name,
        'Scadenza visita medica: ' || NEW.medical_exam_date::TEXT,
        (NEW.medical_exam_date - INTERVAL '30 days')::TIMESTAMPTZ
      ) ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Formazione sicurezza in scadenza
  IF NEW.safety_training_date IS NOT NULL THEN
    IF NEW.safety_training_date <= CURRENT_DATE + INTERVAL '30 days' 
       AND NEW.safety_training_date > CURRENT_DATE THEN
      INSERT INTO public.alerts (
        company_id,
        employee_id,
        alert_type,
        priority,
        title,
        description,
        trigger_date
      ) VALUES (
        NEW.company_id,
        NEW.id,
        'safety_training_due',
        'high',
        'Formazione sicurezza in scadenza: ' || NEW.full_name,
        'Scadenza formazione: ' || NEW.safety_training_date::TEXT,
        (NEW.safety_training_date - INTERVAL '30 days')::TIMESTAMPTZ
      ) ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Fine periodo di prova
  IF NEW.probation_end_date IS NOT NULL THEN
    IF NEW.probation_end_date <= CURRENT_DATE + INTERVAL '15 days' 
       AND NEW.probation_end_date > CURRENT_DATE THEN
      INSERT INTO public.alerts (
        company_id,
        employee_id,
        alert_type,
        priority,
        title,
        description,
        trigger_date
      ) VALUES (
        NEW.company_id,
        NEW.id,
        'probation_ending',
        'medium',
        'Fine periodo di prova: ' || NEW.full_name,
        'Fine prova: ' || NEW.probation_end_date::TEXT,
        (NEW.probation_end_date - INTERVAL '15 days')::TIMESTAMPTZ
      ) ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employee_alerts
  AFTER INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_employee_alerts();

-- ============================================================
-- TRIGGER: Aggiornamento reliability_updated_at counterpart
-- ============================================================
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

-- ============================================================
-- FUNZIONE: Calcolo KPI Dashboard
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_dashboard_kpi(p_company_id UUID)
RETURNS TABLE (
  active_contracts BIGINT,
  expiring_30d BIGINT,
  portfolio_value NUMERIC,
  pending_alerts BIGINT,
  unpaid_invoices_value NUMERIC,
  top_bandi_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.contracts 
     WHERE company_id = p_company_id AND status = 'active'),
    (SELECT COUNT(*) FROM public.contracts 
     WHERE company_id = p_company_id 
       AND status IN ('active', 'expiring')
       AND end_date <= CURRENT_DATE + INTERVAL '30 days'
       AND end_date >= CURRENT_DATE),
    (SELECT COALESCE(SUM(value), 0) FROM public.contracts 
     WHERE company_id = p_company_id AND status = 'active'),
    (SELECT COUNT(*) FROM public.alerts 
     WHERE company_id = p_company_id AND status = 'pending'),
    (SELECT COALESCE(SUM(amount_gross), 0) FROM public.invoices 
     WHERE company_id = p_company_id 
       AND payment_status IN ('unpaid', 'overdue')),
    (SELECT COUNT(*) FROM public.bandi 
     WHERE company_id = p_company_id 
       AND is_active = TRUE 
       AND match_score >= 60);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
