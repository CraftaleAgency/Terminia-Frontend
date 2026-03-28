export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          vat_number: string | null
          fiscal_code: string | null
          address: string | null
          city: string | null
          province: string | null
          cap: string | null
          country: string | null
          sector: string | null
          ateco_code: string | null
          size: string | null
          employee_count: number | null
          annual_revenue: number | null
          certifications: string[] | null
          sdi_code: string | null
          pec: string | null
          past_pa_contracts: boolean | null
          past_pa_contracts_value: number | null
          geographic_operations: string[] | null
          created_by_ai: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          vat_number?: string | null
          fiscal_code?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          cap?: string | null
          country?: string | null
          sector?: string | null
          ateco_code?: string | null
          size?: string | null
          employee_count?: number | null
          annual_revenue?: number | null
          certifications?: string[] | null
          sdi_code?: string | null
          pec?: string | null
          past_pa_contracts?: boolean | null
          past_pa_contracts_value?: number | null
          geographic_operations?: string[] | null
          created_by_ai?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          vat_number?: string | null
          fiscal_code?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          cap?: string | null
          country?: string | null
          sector?: string | null
          ateco_code?: string | null
          size?: string | null
          employee_count?: number | null
          annual_revenue?: number | null
          certifications?: string[] | null
          sdi_code?: string | null
          pec?: string | null
          past_pa_contracts?: boolean | null
          past_pa_contracts_value?: number | null
          geographic_operations?: string[] | null
          created_by_ai?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          company_id: string | null
          email: string
          full_name: string | null
          role: string | null
          avatar_url: string | null
          last_login_at: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          company_id?: string | null
          email: string
          full_name?: string | null
          role?: string | null
          avatar_url?: string | null
          last_login_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          email?: string
          full_name?: string | null
          role?: string | null
          avatar_url?: string | null
          last_login_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      counterparts: {
        Row: {
          id: string
          company_id: string
          type: string
          name: string
          vat_number: string | null
          fiscal_code: string | null
          address: string | null
          city: string | null
          province: string | null
          cap: string | null
          country: string | null
          sector: string | null
          pec: string | null
          sdi_code: string | null
          referent_name: string | null
          referent_email: string | null
          referent_phone: string | null
          total_exposure: number | null
          total_revenue: number | null
          payment_avg_days: number | null
          payment_score: number | null
          reliability_score: number | null
          reliability_label: string | null
          reliability_updated_at: string | null
          verification_json: Json | null
          score_legal: number | null
          score_contributory: number | null
          score_reputation: number | null
          score_solidity: number | null
          score_consistency: number | null
          has_bankruptcy: boolean | null
          has_anac_annotations: boolean | null
          vat_verified: boolean | null
          notes: string | null
          tags: string[] | null
          created_by_ai: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          type: string
          name: string
          vat_number?: string | null
          fiscal_code?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          cap?: string | null
          country?: string | null
          sector?: string | null
          pec?: string | null
          sdi_code?: string | null
          referent_name?: string | null
          referent_email?: string | null
          referent_phone?: string | null
          total_exposure?: number | null
          total_revenue?: number | null
          payment_avg_days?: number | null
          payment_score?: number | null
          reliability_score?: number | null
          reliability_label?: string | null
          reliability_updated_at?: string | null
          verification_json?: Json | null
          score_legal?: number | null
          score_contributory?: number | null
          score_reputation?: number | null
          score_solidity?: number | null
          score_consistency?: number | null
          has_bankruptcy?: boolean | null
          has_anac_annotations?: boolean | null
          vat_verified?: boolean | null
          notes?: string | null
          tags?: string[] | null
          created_by_ai?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          type?: string
          name?: string
          vat_number?: string | null
          fiscal_code?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          cap?: string | null
          country?: string | null
          sector?: string | null
          pec?: string | null
          sdi_code?: string | null
          referent_name?: string | null
          referent_email?: string | null
          referent_phone?: string | null
          total_exposure?: number | null
          total_revenue?: number | null
          payment_avg_days?: number | null
          payment_score?: number | null
          reliability_score?: number | null
          reliability_label?: string | null
          reliability_updated_at?: string | null
          verification_json?: Json | null
          score_legal?: number | null
          score_contributory?: number | null
          score_reputation?: number | null
          score_solidity?: number | null
          score_consistency?: number | null
          has_bankruptcy?: boolean | null
          has_anac_annotations?: boolean | null
          vat_verified?: boolean | null
          notes?: string | null
          tags?: string[] | null
          created_by_ai?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counterparts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          id: string
          company_id: string
          full_name: string
          fiscal_code: string | null
          birth_date: string | null
          birth_place: string | null
          address: string | null
          city: string | null
          province: string | null
          email: string | null
          phone: string | null
          iban: string | null
          employee_type: string | null
          role: string | null
          department: string | null
          hire_date: string | null
          termination_date: string | null
          current_contract_id: string | null
          ccnl: string | null
          ccnl_level: string | null
          ccnl_version_date: string | null
          ral: number | null
          gross_cost: number | null
          notice_days: number | null
          meal_voucher_daily: number | null
          company_car: boolean | null
          company_phone: boolean | null
          welfare_budget: number | null
          other_benefits: Json | null
          fixed_term_count: number | null
          fixed_term_months: number | null
          medical_exam_date: string | null
          safety_training_date: string | null
          probation_end_date: string | null
          fiscal_code_valid: boolean | null
          fiscal_code_match: boolean | null
          iban_valid: boolean | null
          data_verified_at: string | null
          osint_consent: boolean | null
          osint_consent_date: string | null
          notes: string | null
          created_by_ai: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          full_name: string
          fiscal_code?: string | null
          birth_date?: string | null
          birth_place?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          email?: string | null
          phone?: string | null
          iban?: string | null
          employee_type?: string | null
          role?: string | null
          department?: string | null
          hire_date?: string | null
          termination_date?: string | null
          current_contract_id?: string | null
          ccnl?: string | null
          ccnl_level?: string | null
          ccnl_version_date?: string | null
          ral?: number | null
          gross_cost?: number | null
          notice_days?: number | null
          meal_voucher_daily?: number | null
          company_car?: boolean | null
          company_phone?: boolean | null
          welfare_budget?: number | null
          other_benefits?: Json | null
          fixed_term_count?: number | null
          fixed_term_months?: number | null
          medical_exam_date?: string | null
          safety_training_date?: string | null
          probation_end_date?: string | null
          fiscal_code_valid?: boolean | null
          fiscal_code_match?: boolean | null
          iban_valid?: boolean | null
          data_verified_at?: string | null
          osint_consent?: boolean | null
          osint_consent_date?: string | null
          notes?: string | null
          created_by_ai?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          full_name?: string
          fiscal_code?: string | null
          birth_date?: string | null
          birth_place?: string | null
          address?: string | null
          city?: string | null
          province?: string | null
          email?: string | null
          phone?: string | null
          iban?: string | null
          employee_type?: string | null
          role?: string | null
          department?: string | null
          hire_date?: string | null
          termination_date?: string | null
          current_contract_id?: string | null
          ccnl?: string | null
          ccnl_level?: string | null
          ccnl_version_date?: string | null
          ral?: number | null
          gross_cost?: number | null
          notice_days?: number | null
          meal_voucher_daily?: number | null
          company_car?: boolean | null
          company_phone?: boolean | null
          welfare_budget?: number | null
          other_benefits?: Json | null
          fixed_term_count?: number | null
          fixed_term_months?: number | null
          medical_exam_date?: string | null
          safety_training_date?: string | null
          probation_end_date?: string | null
          fiscal_code_valid?: boolean | null
          fiscal_code_match?: boolean | null
          iban_valid?: boolean | null
          data_verified_at?: string | null
          osint_consent?: boolean | null
          osint_consent_date?: string | null
          notes?: string | null
          created_by_ai?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_current_contract"
            columns: ["current_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          id: string
          company_id: string
          contract_type: string
          counterpart_id: string | null
          employee_id: string | null
          parent_contract_id: string | null
          contract_relation: string | null
          status: string | null
          value: number | null
          value_type: string | null
          currency: string | null
          payment_terms: number | null
          payment_frequency: string | null
          vat_regime: string | null
          vat_rate: number | null
          withholding_tax: boolean | null
          withholding_rate: number | null
          istat_indexation: boolean | null
          istat_indexation_month: number | null
          surety_bond_required: boolean | null
          surety_bond_amount: number | null
          surety_bond_expiry: string | null
          surety_bond_issuer: string | null
          start_date: string | null
          end_date: string | null
          signed_date: string | null
          effective_date: string | null
          auto_renewal: boolean | null
          renewal_notice_days: number | null
          renewal_duration_months: number | null
          governing_law: string | null
          jurisdiction: string | null
          language: string | null
          is_public_admin: boolean | null
          risk_score: number | null
          ai_summary: string | null
          ai_extracted_at: string | null
          ai_confidence: number | null
          raw_text: string | null
          embedding: string | null
          version: number | null
          is_current_version: boolean | null
          title: string | null
          reference_number: string | null
          tags: string[] | null
          notes: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          contract_type: string
          counterpart_id?: string | null
          employee_id?: string | null
          parent_contract_id?: string | null
          contract_relation?: string | null
          status?: string | null
          value?: number | null
          value_type?: string | null
          currency?: string | null
          payment_terms?: number | null
          payment_frequency?: string | null
          vat_regime?: string | null
          vat_rate?: number | null
          withholding_tax?: boolean | null
          withholding_rate?: number | null
          istat_indexation?: boolean | null
          istat_indexation_month?: number | null
          surety_bond_required?: boolean | null
          surety_bond_amount?: number | null
          surety_bond_expiry?: string | null
          surety_bond_issuer?: string | null
          start_date?: string | null
          end_date?: string | null
          signed_date?: string | null
          effective_date?: string | null
          auto_renewal?: boolean | null
          renewal_notice_days?: number | null
          renewal_duration_months?: number | null
          governing_law?: string | null
          jurisdiction?: string | null
          language?: string | null
          is_public_admin?: boolean | null
          risk_score?: number | null
          ai_summary?: string | null
          ai_extracted_at?: string | null
          ai_confidence?: number | null
          raw_text?: string | null
          embedding?: string | null
          version?: number | null
          is_current_version?: boolean | null
          title?: string | null
          reference_number?: string | null
          tags?: string[] | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          contract_type?: string
          counterpart_id?: string | null
          employee_id?: string | null
          parent_contract_id?: string | null
          contract_relation?: string | null
          status?: string | null
          value?: number | null
          value_type?: string | null
          currency?: string | null
          payment_terms?: number | null
          payment_frequency?: string | null
          vat_regime?: string | null
          vat_rate?: number | null
          withholding_tax?: boolean | null
          withholding_rate?: number | null
          istat_indexation?: boolean | null
          istat_indexation_month?: number | null
          surety_bond_required?: boolean | null
          surety_bond_amount?: number | null
          surety_bond_expiry?: string | null
          surety_bond_issuer?: string | null
          start_date?: string | null
          end_date?: string | null
          signed_date?: string | null
          effective_date?: string | null
          auto_renewal?: boolean | null
          renewal_notice_days?: number | null
          renewal_duration_months?: number | null
          governing_law?: string | null
          jurisdiction?: string | null
          language?: string | null
          is_public_admin?: boolean | null
          risk_score?: number | null
          ai_summary?: string | null
          ai_extracted_at?: string | null
          ai_confidence?: number | null
          raw_text?: string | null
          embedding?: string | null
          version?: number | null
          is_current_version?: boolean | null
          title?: string | null
          reference_number?: string | null
          tags?: string[] | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_counterpart_id_fkey"
            columns: ["counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_parent_contract_id_fkey"
            columns: ["parent_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clauses: {
        Row: {
          id: string
          contract_id: string
          clause_type: string | null
          original_text: string
          simplified_text: string | null
          page_number: number | null
          risk_level: string | null
          risk_explanation: string | null
          ai_flag: string | null
          ai_suggestion: string | null
          benchmark_comparison: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          clause_type?: string | null
          original_text: string
          simplified_text?: string | null
          page_number?: number | null
          risk_level?: string | null
          risk_explanation?: string | null
          ai_flag?: string | null
          ai_suggestion?: string | null
          benchmark_comparison?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          clause_type?: string | null
          original_text?: string
          simplified_text?: string | null
          page_number?: number | null
          risk_level?: string | null
          risk_explanation?: string | null
          ai_flag?: string | null
          ai_suggestion?: string | null
          benchmark_comparison?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clauses_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      obligations: {
        Row: {
          id: string
          contract_id: string
          party: string
          description: string
          obligation_type: string | null
          due_date: string | null
          recurrence: string | null
          recurrence_end_date: string | null
          status: string | null
          completed_at: string | null
          completed_by: string | null
          completion_note: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          party: string
          description: string
          obligation_type?: string | null
          due_date?: string | null
          recurrence?: string | null
          recurrence_end_date?: string | null
          status?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_note?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          party?: string
          description?: string
          obligation_type?: string | null
          due_date?: string | null
          recurrence?: string | null
          recurrence_end_date?: string | null
          status?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_note?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "obligations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obligations_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          id: string
          contract_id: string
          title: string
          description: string | null
          due_date: string | null
          status: string | null
          amount: number | null
          requires_approval: boolean | null
          approval_contact: string | null
          delivery_date: string | null
          approval_date: string | null
          invoice_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: string | null
          amount?: number | null
          requires_approval?: boolean | null
          approval_contact?: string | null
          delivery_date?: string | null
          approval_date?: string | null
          invoice_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: string | null
          amount?: number | null
          requires_approval?: boolean | null
          approval_contact?: string | null
          delivery_date?: string | null
          approval_date?: string | null
          invoice_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestone_invoice"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          id: string
          company_id: string
          contract_id: string | null
          counterpart_id: string | null
          milestone_id: string | null
          invoice_type: string
          invoice_number: string | null
          invoice_date: string | null
          due_date: string | null
          amount_net: number
          vat_rate: number | null
          vat_amount: number | null
          amount_gross: number | null
          withholding_amount: number | null
          amount_payable: number | null
          currency: string | null
          pa_protocol: string | null
          sdi_status: string | null
          sdi_identifier: string | null
          sdi_error_code: string | null
          sdi_error_description: string | null
          payment_date: string | null
          payment_status: string | null
          file_url: string | null
          notes: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          contract_id?: string | null
          counterpart_id?: string | null
          milestone_id?: string | null
          invoice_type: string
          invoice_number?: string | null
          invoice_date?: string | null
          due_date?: string | null
          amount_net: number
          vat_rate?: number | null
          vat_amount?: number | null
          amount_gross?: number | null
          withholding_amount?: number | null
          amount_payable?: number | null
          currency?: string | null
          pa_protocol?: string | null
          sdi_status?: string | null
          sdi_identifier?: string | null
          sdi_error_code?: string | null
          sdi_error_description?: string | null
          payment_date?: string | null
          payment_status?: string | null
          file_url?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          contract_id?: string | null
          counterpart_id?: string | null
          milestone_id?: string | null
          invoice_type?: string
          invoice_number?: string | null
          invoice_date?: string | null
          due_date?: string | null
          amount_net?: number
          vat_rate?: number | null
          vat_amount?: number | null
          amount_gross?: number | null
          withholding_amount?: number | null
          amount_payable?: number | null
          currency?: string | null
          pa_protocol?: string | null
          sdi_status?: string | null
          sdi_identifier?: string | null
          sdi_error_code?: string | null
          sdi_error_description?: string | null
          payment_date?: string | null
          payment_status?: string | null
          file_url?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_counterpart_id_fkey"
            columns: ["counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scope_items: {
        Row: {
          id: string
          contract_id: string
          description: string
          item_type: string | null
          quantity: number | null
          unit: string | null
          unit_price: number | null
          detected_by_ai: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          description: string
          item_type?: string | null
          quantity?: number | null
          unit?: string | null
          unit_price?: number | null
          detected_by_ai?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          description?: string
          item_type?: string | null
          quantity?: number | null
          unit?: string | null
          unit_price?: number | null
          detected_by_ai?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scope_items_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      change_requests: {
        Row: {
          id: string
          contract_id: string
          title: string
          description: string | null
          additional_value: number | null
          scope_item_ids: string[] | null
          status: string | null
          sent_at: string | null
          approved_at: string | null
          resulting_amendment_id: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          title: string
          description?: string | null
          additional_value?: number | null
          scope_item_ids?: string[] | null
          status?: string | null
          sent_at?: string | null
          approved_at?: string | null
          resulting_amendment_id?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          title?: string
          description?: string | null
          additional_value?: number | null
          scope_item_ids?: string[] | null
          status?: string | null
          sent_at?: string | null
          approved_at?: string | null
          resulting_amendment_id?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_resulting_amendment_id_fkey"
            columns: ["resulting_amendment_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents: {
        Row: {
          id: string
          contract_id: string
          file_name: string
          file_url: string
          file_size: number | null
          file_type: string | null
          document_role: string | null
          version: number | null
          is_current: boolean | null
          uploaded_by: string | null
          uploaded_at: string | null
          signature_status: string | null
          signed_at: string | null
          signature_provider: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          file_type?: string | null
          document_role?: string | null
          version?: number | null
          is_current?: boolean | null
          uploaded_by?: string | null
          uploaded_at?: string | null
          signature_status?: string | null
          signed_at?: string | null
          signature_provider?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          file_type?: string | null
          document_role?: string | null
          version?: number | null
          is_current?: boolean | null
          uploaded_by?: string | null
          uploaded_at?: string | null
          signature_status?: string | null
          signed_at?: string | null
          signature_provider?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_dpa_document_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "gdpr_records"
            referencedColumns: ["dpa_document_id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          id: string
          company_id: string
          contract_id: string | null
          counterpart_id: string | null
          employee_id: string | null
          document_type: string
          content_json: Json | null
          generated_text: string | null
          file_url: string | null
          status: string | null
          generated_by: string | null
          sent_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          contract_id?: string | null
          counterpart_id?: string | null
          employee_id?: string | null
          document_type: string
          content_json?: Json | null
          generated_text?: string | null
          file_url?: string | null
          status?: string | null
          generated_by?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          contract_id?: string | null
          counterpart_id?: string | null
          employee_id?: string | null
          document_type?: string
          content_json?: Json | null
          generated_text?: string | null
          file_url?: string | null
          status?: string | null
          generated_by?: string | null
          sent_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_counterpart_id_fkey"
            columns: ["counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gdpr_records: {
        Row: {
          id: string
          company_id: string
          contract_id: string | null
          counterpart_id: string | null
          is_data_processor: boolean | null
          is_data_controller: boolean | null
          data_categories: string[] | null
          processing_purposes: string | null
          retention_period_months: number | null
          dpa_signed: boolean | null
          dpa_date: string | null
          dpa_document_id: string | null
          sub_processors: string[] | null
          last_review_date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          contract_id?: string | null
          counterpart_id?: string | null
          is_data_processor?: boolean | null
          is_data_controller?: boolean | null
          data_categories?: string[] | null
          processing_purposes?: string | null
          retention_period_months?: number | null
          dpa_signed?: boolean | null
          dpa_date?: string | null
          dpa_document_id?: string | null
          sub_processors?: string[] | null
          last_review_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          contract_id?: string | null
          counterpart_id?: string | null
          is_data_processor?: boolean | null
          is_data_controller?: boolean | null
          data_categories?: string[] | null
          processing_purposes?: string | null
          retention_period_months?: number | null
          dpa_signed?: boolean | null
          dpa_date?: string | null
          dpa_document_id?: string | null
          sub_processors?: string[] | null
          last_review_date?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gdpr_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gdpr_records_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gdpr_records_counterpart_id_fkey"
            columns: ["counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gdpr_records_dpa_document_id_fkey"
            columns: ["dpa_document_id"]
            isOneToOne: false
            referencedRelation: "contract_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          id: string
          company_id: string
          contract_id: string | null
          counterpart_id: string | null
          employee_id: string | null
          bando_id: string | null
          milestone_id: string | null
          invoice_id: string | null
          alert_type: string
          priority: string
          title: string
          description: string | null
          trigger_date: string
          triggered_at: string | null
          status: string | null
          handled_by: string | null
          handled_at: string | null
          handle_note: string | null
          snoozed_until: string | null
          escalated_to: string | null
          escalated_at: string | null
          escalation_reason: string | null
          notified_via: string[] | null
          notified_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          contract_id?: string | null
          counterpart_id?: string | null
          employee_id?: string | null
          bando_id?: string | null
          milestone_id?: string | null
          invoice_id?: string | null
          alert_type: string
          priority: string
          title: string
          description?: string | null
          trigger_date: string
          triggered_at?: string | null
          status?: string | null
          handled_by?: string | null
          handled_at?: string | null
          handle_note?: string | null
          snoozed_until?: string | null
          escalated_to?: string | null
          escalated_at?: string | null
          escalation_reason?: string | null
          notified_via?: string[] | null
          notified_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          contract_id?: string | null
          counterpart_id?: string | null
          employee_id?: string | null
          bando_id?: string | null
          milestone_id?: string | null
          invoice_id?: string | null
          alert_type?: string
          priority?: string
          title?: string
          description?: string | null
          trigger_date?: string
          triggered_at?: string | null
          status?: string | null
          handled_by?: string | null
          handled_at?: string | null
          handle_note?: string | null
          snoozed_until?: string | null
          escalated_to?: string | null
          escalated_at?: string | null
          escalation_reason?: string | null
          notified_via?: string[] | null
          notified_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_counterpart_id_fkey"
            columns: ["counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_escalated_to_fkey"
            columns: ["escalated_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bandi: {
        Row: {
          id: string
          company_id: string
          source: string
          source_label: string | null
          external_id: string | null
          cig: string | null
          cup: string | null
          source_url: string
          authority_name: string
          authority_type: string | null
          authority_code: string | null
          title: string
          description: string | null
          object: string | null
          cpv_codes: string[] | null
          nuts_code: string | null
          procedure_type: string | null
          contract_category: string | null
          award_criteria: string | null
          base_value: number | null
          estimated_value: number | null
          currency: string | null
          lot_count: number | null
          lots_json: Json | null
          publication_date: string | null
          deadline: string
          site_visit_date: string | null
          clarifications_deadline: string | null
          award_date: string | null
          requirements_json: Json | null
          documents_required: string[] | null
          technical_docs_url: string | null
          match_score: number | null
          match_explanation: string | null
          match_breakdown: Json | null
          score_sector: number | null
          score_size: number | null
          score_geo: number | null
          score_requirements: number | null
          score_feasibility: number | null
          gap_analysis_json: Json | null
          checklist_json: Json | null
          company_profile_snapshot: Json | null
          bando_embedding: string | null
          subappalto_allowed: boolean | null
          subappalto_max_pct: number | null
          rti_allowed: boolean | null
          rti_mandatory: boolean | null
          rti_partner_ids: string[] | null
          participation_status: string | null
          internal_notes: string | null
          winner_name: string | null
          winner_vat: string | null
          awarded_value: number | null
          resulting_contract_id: string | null
          alert_sent: boolean | null
          alert_sent_at: string | null
          scraped_at: string | null
          last_updated_at: string | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          company_id: string
          source: string
          source_label?: string | null
          external_id?: string | null
          cig?: string | null
          cup?: string | null
          source_url: string
          authority_name: string
          authority_type?: string | null
          authority_code?: string | null
          title: string
          description?: string | null
          object?: string | null
          cpv_codes?: string[] | null
          nuts_code?: string | null
          procedure_type?: string | null
          contract_category?: string | null
          award_criteria?: string | null
          base_value?: number | null
          estimated_value?: number | null
          currency?: string | null
          lot_count?: number | null
          lots_json?: Json | null
          publication_date?: string | null
          deadline: string
          site_visit_date?: string | null
          clarifications_deadline?: string | null
          award_date?: string | null
          requirements_json?: Json | null
          documents_required?: string[] | null
          technical_docs_url?: string | null
          match_score?: number | null
          match_explanation?: string | null
          match_breakdown?: Json | null
          score_sector?: number | null
          score_size?: number | null
          score_geo?: number | null
          score_requirements?: number | null
          score_feasibility?: number | null
          gap_analysis_json?: Json | null
          checklist_json?: Json | null
          company_profile_snapshot?: Json | null
          bando_embedding?: string | null
          subappalto_allowed?: boolean | null
          subappalto_max_pct?: number | null
          rti_allowed?: boolean | null
          rti_mandatory?: boolean | null
          rti_partner_ids?: string[] | null
          participation_status?: string | null
          internal_notes?: string | null
          winner_name?: string | null
          winner_vat?: string | null
          awarded_value?: number | null
          resulting_contract_id?: string | null
          alert_sent?: boolean | null
          alert_sent_at?: string | null
          scraped_at?: string | null
          last_updated_at?: string | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          company_id?: string
          source?: string
          source_label?: string | null
          external_id?: string | null
          cig?: string | null
          cup?: string | null
          source_url?: string
          authority_name?: string
          authority_type?: string | null
          authority_code?: string | null
          title?: string
          description?: string | null
          object?: string | null
          cpv_codes?: string[] | null
          nuts_code?: string | null
          procedure_type?: string | null
          contract_category?: string | null
          award_criteria?: string | null
          base_value?: number | null
          estimated_value?: number | null
          currency?: string | null
          lot_count?: number | null
          lots_json?: Json | null
          publication_date?: string | null
          deadline?: string
          site_visit_date?: string | null
          clarifications_deadline?: string | null
          award_date?: string | null
          requirements_json?: Json | null
          documents_required?: string[] | null
          technical_docs_url?: string | null
          match_score?: number | null
          match_explanation?: string | null
          match_breakdown?: Json | null
          score_sector?: number | null
          score_size?: number | null
          score_geo?: number | null
          score_requirements?: number | null
          score_feasibility?: number | null
          gap_analysis_json?: Json | null
          checklist_json?: Json | null
          company_profile_snapshot?: Json | null
          bando_embedding?: string | null
          subappalto_allowed?: boolean | null
          subappalto_max_pct?: number | null
          rti_allowed?: boolean | null
          rti_mandatory?: boolean | null
          rti_partner_ids?: string[] | null
          participation_status?: string | null
          internal_notes?: string | null
          winner_name?: string | null
          winner_vat?: string | null
          awarded_value?: number | null
          resulting_contract_id?: string | null
          alert_sent?: boolean | null
          alert_sent_at?: string | null
          scraped_at?: string | null
          last_updated_at?: string | null
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bandi_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bandi_resulting_contract_id_fkey"
            columns: ["resulting_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_interviews: {
        Row: {
          id: string
          company_id: string
          uploaded_by: string | null
          original_filename: string | null
          file_url: string | null
          parsed_text: string | null
          initial_classification: string | null
          initial_confidence: number | null
          final_classification: string | null
          routing_was_automatic: boolean | null
          questions_answers: Json | null
          status: string | null
          created_record_type: string | null
          created_contract_id: string | null
          created_counterpart_id: string | null
          created_employee_id: string | null
          created_bando_id: string | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          uploaded_by?: string | null
          original_filename?: string | null
          file_url?: string | null
          parsed_text?: string | null
          initial_classification?: string | null
          initial_confidence?: number | null
          final_classification?: string | null
          routing_was_automatic?: boolean | null
          questions_answers?: Json | null
          status?: string | null
          created_record_type?: string | null
          created_contract_id?: string | null
          created_counterpart_id?: string | null
          created_employee_id?: string | null
          created_bando_id?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          uploaded_by?: string | null
          original_filename?: string | null
          file_url?: string | null
          parsed_text?: string | null
          initial_classification?: string | null
          initial_confidence?: number | null
          final_classification?: string | null
          routing_was_automatic?: boolean | null
          questions_answers?: Json | null
          status?: string | null
          created_record_type?: string | null
          created_contract_id?: string | null
          created_counterpart_id?: string | null
          created_employee_id?: string | null
          created_bando_id?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interviews_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interviews_created_contract_id_fkey"
            columns: ["created_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interviews_created_counterpart_id_fkey"
            columns: ["created_counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interviews_created_employee_id_fkey"
            columns: ["created_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interviews_created_bando_id_fkey"
            columns: ["created_bando_id"]
            isOneToOne: false
            referencedRelation: "bandi"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          id: string
          company_id: string
          contract_id: string | null
          counterpart_id: string | null
          invoice_id: string | null
          direction: string
          amount: number
          currency: string | null
          expected_date: string | null
          actual_date: string | null
          days_delta: number | null
          status: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          contract_id?: string | null
          counterpart_id?: string | null
          invoice_id?: string | null
          direction: string
          amount: number
          currency?: string | null
          expected_date?: string | null
          actual_date?: string | null
          days_delta?: number | null
          status?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          contract_id?: string | null
          counterpart_id?: string | null
          invoice_id?: string | null
          direction?: string
          amount?: number
          currency?: string | null
          expected_date?: string | null
          actual_date?: string | null
          days_delta?: number | null
          status?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_counterpart_id_fkey"
            columns: ["counterpart_id"]
            isOneToOne: false
            referencedRelation: "counterparts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_events: {
        Row: {
          id: string
          contract_id: string
          event_type: string | null
          initiated_by: string | null
          description: string | null
          clauses_affected: string[] | null
          document_version: number | null
          event_date: string | null
        }
        Insert: {
          id?: string
          contract_id: string
          event_type?: string | null
          initiated_by?: string | null
          description?: string | null
          clauses_affected?: string[] | null
          document_version?: number | null
          event_date?: string | null
        }
        Update: {
          id?: string
          contract_id?: string
          event_type?: string | null
          initiated_by?: string | null
          description?: string | null
          clauses_affected?: string[] | null
          document_version?: number | null
          event_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_events_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      bandi_competitor_awards: {
        Row: {
          id: string
          company_id: string
          bando_id: string | null
          cig: string | null
          authority_name: string | null
          cpv_codes: string[] | null
          procedure_year: number | null
          winner_name: string
          winner_vat: string | null
          awarded_value: number | null
          base_value: number | null
          discount_pct: number | null
          source_url: string | null
          scraped_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          bando_id?: string | null
          cig?: string | null
          authority_name?: string | null
          cpv_codes?: string[] | null
          procedure_year?: number | null
          winner_name: string
          winner_vat?: string | null
          awarded_value?: number | null
          base_value?: number | null
          discount_pct?: number | null
          source_url?: string | null
          scraped_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          bando_id?: string | null
          cig?: string | null
          authority_name?: string | null
          cpv_codes?: string[] | null
          procedure_year?: number | null
          winner_name?: string
          winner_vat?: string | null
          awarded_value?: number | null
          base_value?: number | null
          discount_pct?: number | null
          source_url?: string | null
          scraped_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bandi_competitor_awards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bandi_competitor_awards_bando_id_fkey"
            columns: ["bando_id"]
            isOneToOne: false
            referencedRelation: "bandi"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
