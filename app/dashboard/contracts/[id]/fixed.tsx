"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Edit
  FileDown
  MoreVertical
  AlertTriangle
  Calendar
  Euro
  Building2
  Users
  Shield
  FileText
  CheckCircle2
  XCircle
  ChevronDown
  ChevronRight
  Plus
  Upload
  Download
  Sparkles
  RefreshCw
  AlertCircle
  FileSignature
  History
  Lock
  ExternalLink
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  formatCurrency,
  formatDate
  daysUntil
  getStatusLabel
  getStatusColor
  getRiskColor
  type Contract
  type Counterpart
  type Employee
  type Invoice
  type Clause
  type Obligation
  type Milestone
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"

export default function ContractDetailPage() {
  const params = useParams()
    const router = useRouter()
    const { user } = useUser()
    const supabase = createClient()

    const [contract, setContract] = useState<Contract | null>(null)
    const [counterpart, setCounterpart] = useState<Counterpart | null>(null)
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [clauses, setClauses] = useState<Clause[]>([])
    const [obligations, setObligations] = useState<Obligation[]>([])
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("dettaglio")

    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            try {
                // Get user's company
                const { data: userData } = await supabase
                    .from('users')
                    .select('company_id')
                    .eq('id', user.id)
                    .single()

                if (!userData?.company_id) {
                    setLoading(false)
                    return
                }

                // Fetch contract
                const { data: contractData, error: contractError } = await supabase
                    .from('contracts')
                    .select(`
                        *,
                        counterparts!contracts_counterpart_id_fkey(name),
                        employees!contracts_employee_id_fkey(full_name)
                    `)
                    .eq('id', params.id)
                    .eq('company_id', userData.company_id)
                    .single()

                if (contractError || !contractData) {
                    setLoading(false)
                    return
                }

                setContract({
                    ...contractData,
                    counterpart_name: contractData.counterparts?.name,
                    employee_name: contractData.employees?.full_name,
                })

                // Fetch counterpart if exists
                if (contractData.counterpart_id) {
                    const { data: counterpartData } = await supabase
                        .from('counterparts')
                        .select('*')
                        .eq('id', contractData.counterpart_id)
                        .single()
                    setCounterpart(counterpartData)
                }

                // Fetch employee if exists
                if (contractData.employee_id) {
                    const { data: employeeData } = await supabase
                        .from('employees')
                        .select('*')
                        .eq('id', contractData.employee_id)
                        .single()
                    setEmployee(employeeData)
                }

                // Fetch invoices
                const { data: invoicesData } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('contract_id', params.id)
                    .eq('company_id', userData.company_id)

                setInvoices(invoicesData || [])

                // Fetch clauses
                const { data: clausesData } = await supabase
                    .from('clauses')
                    .select('*')
                    .eq('contract_id', params.id)

                setClauses(clausesData || [])

                // Fetch obligations
                const { data: obligationsData } = await supabase
                    .from('obligations')
                    .select('*')
                    .eq('contract_id', params.id)

                setObligations(obligationsData || [])

                // Fetch milestones
                const { data: milestonesData } = await supabase
                    .from('milestones')
                    .select('*')
                    .eq('contract_id', params.id)

                setMilestones(milestonesData || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user, supabase, params.id])
