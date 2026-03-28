"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Calendar,
  Euro,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Download,
  Eye,
  X,
  ChevronDown,
  Building2,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  formatCurrency,
  formatDate,
  daysUntil,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  type Invoice,
  type Counterpart,
  type Contract,
  type InvoiceType,
  type PaymentStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"

// Status filter options
const STATUS_OPTIONS = [
  { value: "all", label: "Tutti" },
  { value: "unpaid", label: "In attesa" },
  { value: "overdue", label: "Scaduta" },
  { value: "paid", label: "Pagata" },
]

// VAT rate options
const VAT_RATES = [22, 10, 5, 4, 0]

export default function InvoicesPage() {
  const { user } = useUser()
  const supabase = createClient()

  // State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("active")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState({
    unpaid: 0,
    paid: 0,
    overdue: 0,
    toCollect: 0,
    collected: 0,
    overdueAmount: 0,
  })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [counterpartFilter, setCounterpartFilter] = useState("all")
  const [dueDateFilter, setDueDateFilter] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [counterparts, setCounterparts] = useState<Counterpart[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)

  // Form state for new invoice
  const [formData, setFormData] = useState({
    invoice_type: "active" as InvoiceType,
    invoice_number: "",
    counterpart_id: "",
    contract_id: "",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: "",
    amount_net: 0,
    vat_rate: 22,
    notes: "",
  })

  // Load data from Supabase
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

        setCompanyId(userData.company_id)

        // Fetch invoices
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select(`
            *,
            counterparts(name),
            contracts(title)
          `)
          .eq('company_id', userData.company_id)
          .eq('invoice_type', invoiceType)
          .order('invoice_date', { ascending: false })

        if (invoiceError) throw invoiceError

        const formattedInvoices = invoiceData?.map(inv => ({
          ...inv,
          counterpart_name: inv.counterparts?.name,
          contract_name: inv.contracts?.title,
        })) || []

        setInvoices(formattedInvoices)

        // Calculate KPIs
        const unpaid = formattedInvoices.filter(i => i.payment_status === 'unpaid')
        const paid = formattedInvoices.filter(i => i.payment_status === 'paid')
        const overdue = formattedInvoices.filter(i => i.payment_status === 'overdue')

        setKpis({
          unpaid: unpaid.length,
          paid: paid.length,
          overdue: overdue.length,
          toCollect: unpaid.reduce((sum, i) => sum + i.amount_gross, 0),
          collected: paid.reduce((sum, i) => sum + i.amount_gross, 0),
          overdueAmount: overdue.reduce((sum, i) => sum + i.amount_gross, 0),
        })

        // Fetch counterparts
        const { data: counterpartData } = await supabase
          .from('counterparts')
          .select('*')
          .eq('company_id', userData.company_id)

        setCounterparts(counterpartData || [])

        // Fetch contracts
        const { data: contractData } = await supabase
          .from('contracts')
          .select('*')
          .eq('company_id', userData.company_id)

        setContracts(contractData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, supabase, invoiceType])

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        // Search filter
        const matchesSearch =
          search === "" ||
          inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
          inv.counterpart_name?.toLowerCase().includes(search.toLowerCase())

        // Status filter
        const matchesStatus =
          statusFilter === "all" || inv.payment_status === statusFilter

        // Counterpart filter
        const matchesCounterpart =
          counterpartFilter === "all" || inv.counterpart_id === counterpartFilter

        // Due date filter
        const matchesDueDate =
          dueDateFilter === "" || inv.due_date <= dueDateFilter

        return matchesSearch && matchesStatus && matchesCounterpart && matchesDueDate
      })
      .sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime())
  }, [invoices, search, statusFilter, counterpartFilter, dueDateFilter])

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearch("")
    setStatusFilter("all")
    setCounterpartFilter("all")
    setDueDateFilter("")
  }, [])

  // Calculate VAT and gross
  const calculatedVAT = useMemo(() => {
    return (formData.amount_net * formData.vat_rate) / 100
  }, [formData.amount_net, formData.vat_rate])

  const calculatedGross = useMemo(() => {
    return formData.amount_net + calculatedVAT
  }, [formData.amount_net, calculatedVAT])

  // Set default due date when invoice date changes
  useEffect(() => {
    if (formData.invoice_date && !formData.due_date) {
      const date = new Date(formData.invoice_date)
      date.setDate(date.getDate() + 30)
      setFormData(prev => ({
        ...prev,
        due_date: date.toISOString().split("T")[0]
      }))
    }
  }, [formData.invoice_date])

  // Filter contracts by counterpart
  const filteredContracts = useMemo(() => {
    if (!formData.counterpart_id) return contracts
    return contracts.filter(c => c.counterpart_id === formData.counterpart_id)
  }, [contracts, formData.counterpart_id])

  // Handle form submit
  const handleSubmit = useCallback(async () => {
    if (!formData.invoice_number || !formData.counterpart_id || !formData.invoice_date || !formData.due_date || formData.amount_net <= 0) {
      toast.error("Compila tutti i campi obbligatori")
      return
    }

    if (new Date(formData.due_date) <= new Date(formData.invoice_date)) {
      toast.error("La scadenza deve essere posteriore alla data emissione")
      return
    }

    if (!companyId) {
      toast.error("Errore: azienda non trovata")
      return
    }

    try {
      const { error } = await supabase
        .from('invoices')
        .insert({
          company_id: companyId,
          invoice_type: formData.invoice_type,
          invoice_number: formData.invoice_number,
          counterpart_id: formData.counterpart_id,
          contract_id: formData.contract_id || null,
          invoice_date: formData.invoice_date,
          due_date: formData.due_date,
          amount_net: formData.amount_net,
          vat_rate: formData.vat_rate,
          amount_gross: calculatedGross,
          payment_status: "unpaid",
          notes: formData.notes || null,
        })

      if (error) throw error

      toast.success("Fattura salvata con successo")
      setIsAddModalOpen(false)
      // Reset form
      setFormData({
        invoice_type: invoiceType,
        invoice_number: "",
        counterpart_id: "",
        contract_id: "",
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: "",
        amount_net: 0,
        vat_rate: 22,
        notes: "",
      })
      // Trigger refresh by changing loading state
      setLoading(true)
    } catch (error) {
      console.error('Error saving invoice:', error)
      toast.error("Errore nel salvataggio della fattura")
    }
  }, [formData, companyId, calculatedGross, invoiceType, supabase])

  // Handle mark as paid
  const handleMarkAsPaid = useCallback(async () => {
    if (!selectedInvoice) return

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          payment_status: 'paid',
          payment_date: paymentDate
        })
        .eq('id', selectedInvoice.id)

      if (error) throw error

      toast.success("Fattura segnata come pagata")
      setIsPayModalOpen(false)
      setSelectedInvoice(null)
      setPaymentDate(new Date().toISOString().split("T")[0])
      // Trigger refresh
      setLoading(true)
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      toast.error("Errore nell'aggiornamento della fattura")
    }
  }, [selectedInvoice, paymentDate, supabase])

  // Get countdown badge
  const getCountdownBadge = (invoice: Invoice) => {
    if (invoice.payment_status === "paid") return null

    const days = daysUntil(invoice.due_date)

    if (days < 0) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          Scaduta da {Math.abs(days)} giorni
        </span>
      )
    }

    if (days <= 7) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {days === 0 ? "Oggi" : `Tra ${days} giorni`}
        </span>
      )
    }

    if (days <= 30) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Tra {days} giorni
        </span>
      )
    }

    return null
  }

  // KPI labels based on type
  const kpiLabels = invoiceType === "active"
    ? { pending: "Da incassare", paid: "Incassato", overdue: "Scadute" }
    : { pending: "Da pagare", paid: "Pagato", overdue: "Scadute" }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fatture</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestisci fatture emesse e ricevute
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all glow-teal-sm text-sm"
        >
          <Plus className="size-4" />
          Aggiungi Fattura
          <ArrowUpRight className="size-4" />
        </Button>
      </div>

      {/* Toggle Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-1.5 border border-border/20 inline-flex"
      >
        <button
          onClick={() => setInvoiceType("active")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
            invoiceType === "active"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <ArrowUpRight className="size-4" />
          Emesse
        </button>
        <button
          onClick={() => setInvoiceType("passive")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
            invoiceType === "passive"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <ArrowDownRight className="size-4" />
          Ricevute
        </button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-5 border border-border/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            {kpiLabels.pending}
          </div>
          <div className="text-2xl font-semibold text-foreground mt-2">
            {formatCurrency(kpis.toCollect)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {kpis.unpaid} fatture
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5 border border-border/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-400" />
            {kpiLabels.paid}
          </div>
          <div className="text-2xl font-semibold text-emerald-400 mt-2">
            {formatCurrency(kpis.collected)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {kpis.paid} fatture
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-5 border border-border/20"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="size-4 text-red-400" />
            {kpiLabels.overdue}
          </div>
          <div className="text-2xl font-semibold text-red-400 mt-2">
            {formatCurrency(kpis.overdueAmount)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {kpis.overdue} fatture
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-4 border border-border/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca per numero fattura o controparte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Counterpart filter */}
          <select
            value={counterpartFilter}
            onChange={(e) => setCounterpartFilter(e.target.value)}
            className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[180px]"
          >
            <option value="all">Tutte le controparti</option>
            {counterparts.map(cp => (
              <option key={cp.id} value={cp.id}>{cp.name}</option>
            ))}
          </select>

          {/* Due date filter */}
          <input
            type="date"
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            placeholder="Scadenza fino al"
            className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {/* Reset button */}
          {(search || statusFilter !== "all" || counterpartFilter !== "all" || dueDateFilter) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
              Reset
            </Button>
          )}
        </div>
      </motion.div>

      {/* Invoices Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl border border-border/20 overflow-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20 bg-muted/10">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">N. Fattura</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Controparte</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Contratto</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Emissione</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Scadenza</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Netto</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">IVA</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Totale</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stato</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <FileText className="size-12 text-muted-foreground/50 mx-auto mb-4" />
                    <div className="text-foreground font-medium">Nessuna fattura {invoiceType === "active" ? "emessa" : "ricevuta"}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Aggiungi la prima fattura per iniziare
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      {invoice.counterpart_id ? (
                        <Link
                          href={`/dashboard/counterparts/${invoice.counterpart_id}`}
                          className="text-sm text-foreground hover:text-primary"
                        >
                          {invoice.counterpart_name}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {invoice.contract_id ? (
                        <Link
                          href={`/dashboard/contracts/${invoice.contract_id}`}
                          className="text-sm text-foreground hover:text-primary"
                        >
                          {invoice.contract_name}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(invoice.due_date)}
                        </span>
                        {getCountdownBadge(invoice)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground text-right">
                      {formatCurrency(invoice.amount_net)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-muted-foreground">
                        {invoice.vat_rate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency((invoice.amount_net * invoice.vat_rate) / 100)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground text-right">
                      {formatCurrency(invoice.amount_gross)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full border",
                        getPaymentStatusColor(invoice.payment_status)
                      )}>
                        {getPaymentStatusLabel(invoice.payment_status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                          title="Visualizza"
                        >
                          <Eye className="size-4" />
                        </Link>
                        {invoice.payment_status !== "paid" && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setIsPayModalOpen(true)
                            }}
                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-colors"
                            title="Segna pagata"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => toast.info("Download in arrivo")}
                          className="p-2 rounded-lg hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                          title="Download"
                        >
                          <Download className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border/10">
          {filteredInvoices.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="size-12 text-muted-foreground/50 mx-auto mb-4" />
              <div className="text-foreground font-medium">Nessuna fattura trovata</div>
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="block px-5 py-4 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">
                        {invoice.invoice_number}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        getPaymentStatusColor(invoice.payment_status)
                      )}>
                        {getPaymentStatusLabel(invoice.payment_status)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {invoice.counterpart_name || "Nessuna controparte"}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(invoice.invoice_date)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      {formatCurrency(invoice.amount_gross)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Netto: {formatCurrency(invoice.amount_net)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>

      {/* Add Invoice Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuova Fattura</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Invoice Type Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo Fattura</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, invoice_type: "active" }))}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                    formData.invoice_type === "active"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/20 bg-muted/20 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowUpRight className="size-4" />
                  Emessa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, invoice_type: "passive" }))}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                    formData.invoice_type === "passive"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/20 bg-muted/20 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowDownRight className="size-4" />
                  Ricevuta
                </button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Counterpart */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Controparte *
                </label>
                <select
                  value={formData.counterpart_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, counterpart_id: e.target.value, contract_id: "" }))}
                  className="w-full px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleziona controparte</option>
                  {counterparts.map(cp => (
                    <option key={cp.id} value={cp.id}>{cp.name}</option>
                  ))}
                </select>
              </div>

              {/* Invoice Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Numero Fattura *
                </label>
                <Input
                  value={formData.invoice_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_number: e.target.value }))}
                  placeholder="es. 2025/001"
                  className="bg-muted/30 border-border/20"
                />
              </div>

              {/* VAT Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Aliquota IVA *
                </label>
                <select
                  value={formData.vat_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, vat_rate: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {VAT_RATES.map(rate => (
                    <option key={rate} value={rate}>{rate}%</option>
                  ))}
                </select>
              </div>

              {/* Invoice Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Data Emissione *
                </label>
                <Input
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
                  className="bg-muted/30 border-border/20"
                />
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Data Scadenza *
                </label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="bg-muted/30 border-border/20"
                />
              </div>

              {/* Amount Net */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Importo Netto *
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount_net || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount_net: Number(e.target.value) }))}
                    placeholder="0.00"
                    className="pl-9 bg-muted/30 border-border/20"
                  />
                </div>
              </div>

              {/* Contract (optional) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Contratto Collegato
                </label>
                <select
                  value={formData.contract_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, contract_id: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  disabled={!formData.counterpart_id}
                >
                  <option value="">Nessuno</option>
                  {filteredContracts.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Note
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Note aggiuntive..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
              <h4 className="text-sm font-medium text-foreground mb-3">Riepilogo Importi</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Importo Netto</span>
                  <span className="text-foreground">{formatCurrency(formData.amount_net || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA ({formData.vat_rate}%)</span>
                  <span className="text-foreground">{formatCurrency(calculatedVAT)}</span>
                </div>
                <div className="border-t border-border/20 pt-2 mt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-foreground">Totale Lordo</span>
                    <span className="text-primary text-lg">{formatCurrency(calculatedGross)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
              Salva Fattura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Modal */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Conferma Pagamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedInvoice && (
              <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                <div className="text-sm text-muted-foreground">Fattura</div>
                <div className="text-lg font-semibold text-foreground mt-1">
                  {selectedInvoice.invoice_number}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(selectedInvoice.amount_gross)}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Data Pagamento *
              </label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="bg-muted/30 border-border/20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleMarkAsPaid} className="bg-emerald-500 text-white hover:bg-emerald-600">
              <CheckCircle2 className="size-4 mr-2" />
              Conferma Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
