"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Calendar,
  Euro,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building2,
  Mail,
  ExternalLink,
  Download,
  Trash2,
  Copy,
  FileCheck,
  FileX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatCurrency,
  formatDate,
  daysUntil,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getInvoiceTypeLabel,
  type PaymentStatus,
  type InvoiceType,
} from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"

type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type CounterpartRow = Database['public']['Tables']['counterparts']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']

type InvoiceWithRelations = InvoiceRow & {
  counterpart_name?: string | null
  contract_name?: string | null
  counterparts?: { name: string } | null
  contracts?: { title: string | null } | null
}
import { useUser } from "@/lib/hooks/use-user"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()
  const [invoice, setInvoice] = useState<InvoiceWithRelations | null>(null)
  const [counterpart, setCounterpart] = useState<CounterpartRow | null>(null)
  const [contract, setContract] = useState<ContractRow | null>(null)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (!userData?.company_id) return

        const { data: invoiceData, error } = await supabase
          .from('invoices')
          .select(`
            *,
            counterparts!invoices_counterpart_id_fkey(name),
            contracts!invoices_contract_id_fkey(title)
          `)
          .eq('id', params.id as string)
          .eq('company_id', userData.company_id)
          .single()

        if (error || !invoiceData) return

        const formattedInvoice: InvoiceWithRelations = {
          ...invoiceData,
          counterpart_name: invoiceData.counterparts?.name,
          contract_name: invoiceData.contracts?.title,
        }
        setInvoice(formattedInvoice)

        if (invoiceData.counterpart_id) {
          const { data: cp } = await supabase
            .from('counterparts')
            .select('*')
            .eq('id', invoiceData.counterpart_id)
            .single()
          setCounterpart(cp || null)
        }

        if (invoiceData.contract_id) {
          const { data: ct } = await supabase
            .from('contracts')
            .select('*')
            .eq('id', invoiceData.contract_id)
            .single()
          setContract(ct || null)
        }
      } catch (error) {
        console.error('Error fetching invoice data:', error)
      }
    }

    fetchData()
  }, [user, supabase, params.id])

  const handleMarkAsPaid = async () => {
    if (!invoice) return

    try {
      const { error } = await supabase
        .from('invoices')
        .update({ payment_status: 'paid', payment_date: paymentDate })
        .eq('id', invoice.id)

      if (error) throw error

      toast.success("Fattura segnata come pagata")
      setIsPayModalOpen(false)
      setInvoice({ ...invoice, payment_status: 'paid', payment_date: paymentDate })
    } catch (error) {
      console.error('Error marking invoice as paid:', error)
      toast.error("Errore nell'aggiornamento della fattura")
    }
  }

  const handleDelete = async () => {
    if (!invoice) return

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id)

      if (error) throw error

      toast.success("Fattura eliminata")
      router.push("/dashboard/invoices")
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast.error("Errore nell'eliminazione della fattura")
    }
  }

  const handleDownload = () => {
    toast.info("Funzionalità PDF in arrivo")
  }

  const handleDuplicate = () => {
    toast.info("Funzionalità duplica in arrivo")
  }

  // Calculate days until due
  const daysUntilDue = invoice ? daysUntil(invoice.due_date ?? '') : 0

  // Calculate VAT amount
  const vatAmount = invoice ? (invoice.amount_net * (invoice.vat_rate ?? 0)) / 100 : 0

  // Timeline steps
  const timelineSteps = useMemo(() => {
    if (!invoice) return []

    const steps: Array<{
      label: string
      date: string | null
      completed: boolean
      current?: boolean
      overdue?: boolean
      icon: React.ElementType
    }> = [
      {
        label: "Creata",
        date: invoice.invoice_date,
        completed: true,
        icon: FileText,
      },
      {
        label: "Scadenza",
        date: invoice.due_date,
        completed: invoice.payment_status === "paid" || daysUntilDue < 0,
        current: invoice.payment_status !== "paid" && daysUntilDue >= 0,
        overdue: daysUntilDue < 0 && invoice.payment_status !== "paid",
        icon: Calendar,
      },
    ]

    // Add overdue step if applicable
    if (daysUntilDue < 0 && invoice.payment_status !== "paid") {
      steps.push({
        label: "Scaduta",
        date: null,
        completed: true,
        overdue: true,
        icon: AlertTriangle,
      })
    }

    // Add paid step
    steps.push({
      label: "Pagata",
      date: invoice.payment_date || null,
      completed: invoice.payment_status === "paid",
      icon: CheckCircle2,
    })

    return steps
  }, [invoice, daysUntilDue])

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento fattura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/invoices"
            className="p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="size-5 text-muted-foreground" />
          </Link>
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/dashboard/invoices" className="hover:text-primary transition-colors">
                Fatture
              </Link>
              <span>/</span>
              <span className="text-foreground">#{invoice.invoice_number}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-foreground">
                Fattura #{invoice.invoice_number}
              </h1>
              <span className={cn(
                "text-sm px-3 py-1 rounded-full border",
                getPaymentStatusColor(invoice.payment_status as PaymentStatus)
              )}>
                {getPaymentStatusLabel(invoice.payment_status as PaymentStatus)}
              </span>
              <span className={cn(
                "text-xs px-2.5 py-1 rounded-full border",
                invoice.invoice_type === "active"
                  ? "border-primary/30 text-primary bg-primary/10"
                  : "border-purple-400/30 text-purple-400 bg-purple-400/10"
              )}>
                {getInvoiceTypeLabel(invoice.invoice_type as InvoiceType)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm"
          >
            <Download className="size-4" />
            Scarica PDF
          </button>
          {invoice.payment_status !== "paid" && (
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm border border-emerald-500/20"
            >
              <CheckCircle2 className="size-4" />
              Segna pagata
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm">
            <Edit className="size-4" />
            Modifica
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
                <MoreVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2">
                <Copy className="size-4" />
                Duplica fattura
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 text-red-400 focus:text-red-400"
              >
                <Trash2 className="size-4" />
                Elimina fattura
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Main Content - Left Column */}
        <div className="xl:col-span-3 space-y-6">
          {/* Invoice Data Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <FileText className="size-4" />
              Dati Fattura
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground">Data Emissione</div>
                  <div className="text-sm font-medium text-foreground mt-1">
                    {formatDate(invoice.invoice_date ?? '')}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Data Scadenza</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-foreground">
                      {formatDate(invoice.due_date ?? '')}
                    </span>
                    {invoice.payment_status !== "paid" && (
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        daysUntilDue < 0
                          ? "bg-red-500/10 text-red-400"
                          : daysUntilDue <= 7
                            ? "bg-red-500/10 text-red-400"
                            : daysUntilDue <= 30
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-muted/30 text-muted-foreground"
                      )}>
                        {daysUntilDue < 0
                          ? `Scaduta da ${Math.abs(daysUntilDue)} giorni`
                          : daysUntilDue === 0
                            ? "Scade oggi"
                            : `Tra ${daysUntilDue} giorni`
                        }
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Contratto Collegato</div>
                  {contract ? (
                    <Link
                      href={`/dashboard/contracts/${contract.id}`}
                      className="text-sm font-medium text-primary hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      {contract.title}
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">Nessuno</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Payment Status */}
                <div>
                  <div className="text-xs text-muted-foreground">Stato Pagamento</div>
                  <div className="flex items-center gap-2 mt-1">
                    {invoice.payment_status === "paid" ? (
                      <>
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-medium">
                          Pagata il {formatDate(invoice.payment_date!)}
                        </span>
                      </>
                    ) : invoice.payment_status === "overdue" ? (
                      <>
                        <AlertTriangle className="size-4 text-red-400" />
                        <span className="text-sm text-red-400 font-medium">
                          Scaduta da {Math.abs(daysUntilDue)} giorni
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          In attesa di pagamento
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {invoice.payment_status !== "paid" && (
                  <button
                    onClick={() => setIsPayModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm border border-emerald-500/20 w-fit"
                  >
                    <CheckCircle2 className="size-4" />
                    Segna come pagata
                  </button>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-6 pt-6 border-t border-border/20">
                <div className="text-xs text-muted-foreground mb-2">Note</div>
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Euro className="size-4" />
              Riepilogo Importi
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Importo Netto</span>
                <span className="text-sm text-foreground">{formatCurrency(invoice.amount_net)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  IVA ({invoice.vat_rate}%)
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(vatAmount)}
                </span>
              </div>

              <div className="border-t border-border/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-foreground">Totale Lordo</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(invoice.amount_gross ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Counterpart Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Building2 className="size-4" />
              Controparte
            </h2>

            {counterpart ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="size-5 text-primary" />
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/counterparts/${counterpart.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {counterpart.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {counterpart.type === "supplier" ? "Fornitore" :
                       counterpart.type === "client" ? "Cliente" : "Partner"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">P.IVA:</span>
                    <span className="text-foreground">{counterpart.vat_number}</span>
                  </div>

                  {counterpart.pec && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-3 text-muted-foreground" />
                      <a
                        href={`mailto:${counterpart.pec}`}
                        className="text-primary hover:underline"
                      >
                        {counterpart.pec}
                      </a>
                    </div>
                  )}

                  {counterpart.city && (
                    <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Città:</span>
                    <span className="text-foreground">{counterpart.city}</span>
                  </div>
                  )}
                </div>

                <Link
                  href={`/dashboard/counterparts/${counterpart.id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm mt-2"
                >
                  <ExternalLink className="size-4" />
                  Vedi scheda completa
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nessuna controparte associata
              </div>
            )}
          </motion.div>

          {/* Timeline Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl border border-border/20 p-6"
          >
            <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Clock className="size-4" />
              Timeline Stato
            </h2>

            <div className="space-y-4">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon
                const isLast = index === timelineSteps.length - 1

                return (
                  <div key={index} className="flex gap-3">
                    {/* Icon & Line */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2",
                        step.overdue
                          ? "bg-red-500/10 border-red-400 text-red-400"
                          : step.completed
                            ? "bg-emerald-500/10 border-emerald-400 text-emerald-400"
                            : step.current
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-muted/20 border-muted-foreground/30 text-muted-foreground/50"
                      )}>
                        <Icon className="size-4" />
                      </div>
                      {!isLast && (
                        <div className={cn(
                          "w-0.5 flex-1 my-1",
                          step.completed && !step.overdue
                            ? "bg-emerald-400/50"
                            : step.overdue
                              ? "bg-red-400/50"
                              : "bg-border/30"
                        )} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className={cn(
                        "text-sm font-medium",
                        step.overdue
                          ? "text-red-400"
                          : step.completed
                            ? "text-foreground"
                            : step.current
                              ? "text-primary"
                              : "text-muted-foreground"
                      )}>
                        {step.label}
                      </div>
                      {step.date && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(step.date)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mark as Paid Modal */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Conferma Pagamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
              <div className="text-sm text-muted-foreground">Fattura</div>
              <div className="text-lg font-semibold text-foreground mt-1">
                {invoice.invoice_number}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {formatCurrency(invoice.amount_gross ?? 0)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Data Pagamento *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Elimina Fattura</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertTriangle className="size-5 text-red-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-400">
                  Sei sicuro di voler eliminare questa fattura?
                </div>
                <div className="text-xs text-red-400/80 mt-1">
                  L'azione non può essere annullata.
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-xl p-4 border border-border/20 mt-4">
              <div className="text-sm text-muted-foreground">Fattura</div>
              <div className="text-lg font-semibold text-foreground mt-1">
                #{invoice.invoice_number}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {formatCurrency(invoice.amount_gross ?? 0)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              <Trash2 className="size-4 mr-2" />
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
