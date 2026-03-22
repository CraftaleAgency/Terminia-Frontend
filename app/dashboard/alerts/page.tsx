"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  X,
  ExternalLink,
  Calendar,
  RefreshCw,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { format, formatDistanceToNow, addDays, addMonths, isPast, isToday } from "date-fns"
import { it } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// =====================
// TYPES
// =====================

type AlertPriority = 'critical' | 'high' | 'medium' | 'low'
type AlertStatus = 'pending' | 'handled' | 'snoozed' | 'escalated' | 'dismissed'
type AlertType =
  | 'auto_renewal' | 'contract_expiry' | 'obligation_due'
  | 'counterpart_obligation_overdue' | 'payment_expected'
  | 'fixed_term_expiry' | 'fixed_term_limit'
  | 'medical_exam_due' | 'safety_training_due'
  | 'invoice_not_issued' | 'payment_overdue'
  | 'exposure_threshold' | 'sdi_rejected'
  | 'new_bando_match' | 'bando_deadline'
  | 'dpa_missing' | 'gdpr_review_due'
  | 'reliability_score_drop' | 'milestone_approaching'
  | 'istat_indexation_due' | 'surety_bond_expiry'
  | 'ccnl_renewed' | 'fringe_benefit_threshold'
  | 'non_compete_expiry' | 'probation_ending'

interface AlertWithRelations {
  id: string
  company_id: string
  contract_id: string | null
  counterpart_id: string | null
  employee_id: string | null
  bando_id: string | null
  milestone_id: string | null
  invoice_id: string | null
  alert_type: AlertType
  priority: AlertPriority
  title: string
  description: string | null
  trigger_date: string
  triggered_at: string | null
  status: AlertStatus
  handled_by: string | null
  handled_at: string | null
  handle_note: string | null
  snoozed_until: string | null
  escalated_to: string | null
  escalated_at: string | null
  escalation_reason: string | null
  notified_via: string[]
  created_at: string
  contracts: { title: string } | null
  counterparts: { name: string } | null
  employees: { full_name: string } | null
  bandi: { title: string } | null
  milestones: { title: string } | null
  invoices: { invoice_number: string } | null
  handled_by_user: { full_name: string } | null
  escalated_to_user: { full_name: string } | null
}

// =====================
// CONSTANTS
// =====================

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  auto_renewal: 'Rinnovo automatico',
  contract_expiry: 'Scadenza contratto',
  obligation_due: 'Obbligo in scadenza',
  counterpart_obligation_overdue: 'Obbligo controparte scaduto',
  payment_expected: 'Pagamento atteso',
  fixed_term_expiry: 'Scadenza contratto termine',
  fixed_term_limit: 'Limite contratti termine',
  medical_exam_due: 'Visita medica in scadenza',
  safety_training_due: 'Formazione sicurezza',
  invoice_not_issued: 'Fattura non emessa',
  payment_overdue: 'Pagamento scaduto',
  exposure_threshold: 'Soglia esposizione',
  sdi_rejected: 'Fattura SDI rifiutata',
  new_bando_match: 'Nuovo bando compatibile',
  bando_deadline: 'Scadenza bando',
  dpa_missing: 'DPA GDPR mancante',
  gdpr_review_due: 'Revisione GDPR',
  reliability_score_drop: 'Calo affidabilità controparte',
  milestone_approaching: 'Milestone in scadenza',
  istat_indexation_due: 'Rivalutazione ISTAT',
  surety_bond_expiry: 'Scadenza fidejussione',
  ccnl_renewed: 'CCNL rinnovato',
  fringe_benefit_threshold: 'Soglia fringe benefit',
  non_compete_expiry: 'Scadenza non concorrenza',
  probation_ending: 'Fine periodo di prova',
}

const ALERT_TYPE_GROUPS: Record<string, AlertType[]> = {
  CONTRATTI: ['auto_renewal', 'contract_expiry', 'obligation_due', 'counterpart_obligation_overdue', 'istat_indexation_due', 'surety_bond_expiry', 'non_compete_expiry', 'dpa_missing', 'gdpr_review_due'],
  HR: ['fixed_term_expiry', 'fixed_term_limit', 'medical_exam_due', 'safety_training_due', 'fringe_benefit_threshold', 'ccnl_renewed', 'probation_ending'],
  FINANCE: ['payment_expected', 'invoice_not_issued', 'payment_overdue', 'exposure_threshold', 'sdi_rejected'],
  BANDI: ['new_bando_match', 'bando_deadline'],
  MILESTONE: ['milestone_approaching', 'reliability_score_drop'],
}

const PRIORITY_CONFIG: Record<AlertPriority, { label: string; color: string; bgColor: string; borderColor: string; badgeBg: string }> = {
  critical: { label: 'Critico', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-950/20', borderColor: 'border-l-red-500', badgeBg: 'bg-red-500' },
  high: { label: 'Alto', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20', borderColor: 'border-l-orange-500', badgeBg: 'bg-orange-500' },
  medium: { label: 'Medio', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20', borderColor: 'border-l-yellow-400', badgeBg: 'bg-yellow-400' },
  low: { label: 'Basso', color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-950/20', borderColor: 'border-l-gray-300', badgeBg: 'bg-gray-400' },
}

const STATUS_CONFIG: Record<AlertStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'In attesa', color: 'text-blue-500', bgColor: 'bg-white dark:bg-gray-900' },
  handled: { label: 'Gestito', color: 'text-green-500', bgColor: 'bg-gray-50 dark:bg-gray-900/50' },
  snoozed: { label: 'Posticipato', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
  escalated: { label: 'Escalato', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20' },
  dismissed: { label: 'Archiviato', color: 'text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' },
}

// =====================
// MAIN COMPONENT
// =====================

export default function AlertsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const supabase = createClient()

  const [alerts, setAlerts] = useState<AlertWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'active' | AlertStatus>('active')
  
  // Expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<AlertPriority>>(new Set(['critical', 'high']))
  
  // Modals
  const [handleModalOpen, setHandleModalOpen] = useState(false)
  const [handleAlertId, setHandleAlertId] = useState<string | null>(null)
  const [handleNote, setHandleNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [snoozePopoverOpen, setSnoozePopoverOpen] = useState<string | null>(null)
  const [customDateOpen, setCustomDateOpen] = useState(false)
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined)

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (!userData?.company_id) {
        setLoading(false)
        return
      }

      let query = supabase
        .from('alerts')
        .select(`
          *,
          contracts(title),
          counterparts(name),
          employees(full_name),
          bandi(title),
          milestones(title),
          invoices(invoice_number),
          handled_by_user:users!handled_by(full_name),
          escalated_to_user:users!escalated_to(full_name)
        `)
        .eq('company_id', userData.company_id)
        .neq('status', 'dismissed')

      if (statusFilter === 'active') {
        query = query.in('status', ['pending', 'snoozed', 'escalated'])
      } else {
        query = query.eq('status', statusFilter)
      }

      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter)
      }

      if (typeFilter !== 'all') {
        query = query.eq('alert_type', typeFilter)
      }

      const { data, error } = await query
        .order('trigger_date', { ascending: true })

      if (error) throw error
      
      // Sort by priority (critical first), then by trigger_date
      const priorityOrder: AlertPriority[] = ['critical', 'high', 'medium', 'low']
      const sorted = (data || []).sort((a, b) => {
        const pA = priorityOrder.indexOf(a.priority as AlertPriority)
        const pB = priorityOrder.indexOf(b.priority as AlertPriority)
        if (pA !== pB) return pA - pB
        return new Date(a.trigger_date).getTime() - new Date(b.trigger_date).getTime()
      })
      
      setAlerts(sorted)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare gli alert"
      })
    } finally {
      setLoading(false)
    }
  }, [user, supabase, statusFilter, priorityFilter, typeFilter, toast])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  // KPI counts
  const kpiCounts = useMemo(() => {
    const activeAlerts = alerts.filter(a => a.status === 'pending' || a.status === 'escalated')
    return {
      critical: activeAlerts.filter(a => a.priority === 'critical').length,
      high: activeAlerts.filter(a => a.priority === 'high').length,
      medium: activeAlerts.filter(a => a.priority === 'medium').length,
      low: activeAlerts.filter(a => a.priority === 'low').length,
      total: activeAlerts.length,
    }
  }, [alerts])

  // Group alerts by priority
  const groupedAlerts = useMemo(() => {
    const groups: Record<AlertPriority, AlertWithRelations[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    }
    alerts.forEach(alert => {
      groups[alert.priority].push(alert)
    })
    return groups
  }, [alerts])

  // Handle alert action
  const handleAlert = async (alertId: string, note: string) => {
    if (!user) return
    setSubmitting(true)
    
    const previousAlerts = [...alerts]
    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, status: 'handled' as AlertStatus, handle_note: note, handled_at: new Date().toISOString() }
        : a
    ))

    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'handled',
          handled_by: user.id,
          handled_at: new Date().toISOString(),
          handle_note: note
        })
        .eq('id', alertId)

      if (error) throw error
      
      toast({ title: "Alert gestito", description: "L'alert è stato segnato come gestito" })
      setHandleModalOpen(false)
      setHandleNote('')
      setHandleAlertId(null)
    } catch (error) {
      setAlerts(previousAlerts)
      toast({ variant: "destructive", title: "Errore", description: "Impossibile aggiornare l'alert" })
    } finally {
      setSubmitting(false)
    }
  }

  // Snooze alert
  const snoozeAlert = async (alertId: string, until: Date) => {
    const previousAlerts = [...alerts]
    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, status: 'snoozed' as AlertStatus, snoozed_until: until.toISOString() }
        : a
    ))

    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'snoozed', snoozed_until: until.toISOString() })
        .eq('id', alertId)

      if (error) throw error
      
      toast({ title: "Alert posticipato", description: `Posticipato al ${format(until, 'dd/MM/yyyy', { locale: it })}` })
      setSnoozePopoverOpen(null)
      setCustomDateOpen(false)
    } catch (error) {
      setAlerts(previousAlerts)
      toast({ variant: "destructive", title: "Errore", description: "Impossibile posticipare l'alert" })
    }
  }

  // Bulk handle
  const handleBulk = async () => {
    if (!user || selectedIds.size === 0) return
    setSubmitting(true)
    
    const ids = Array.from(selectedIds)
    const previousAlerts = [...alerts]
    
    setAlerts(prev => prev.map(a => 
      ids.includes(a.id)
        ? { ...a, status: 'handled' as AlertStatus, handle_note: 'Gestione bulk', handled_at: new Date().toISOString() }
        : a
    ))

    try {
      const { error } = await supabase
        .from('alerts')
        .update({ 
          status: 'handled', 
          handled_by: user.id, 
          handled_at: new Date().toISOString(), 
          handle_note: 'Gestione bulk' 
        })
        .in('id', ids)

      if (error) throw error
      
      toast({ title: "Alert gestiti", description: `${ids.length} alert segnati come gestiti` })
      setSelectedIds(new Set())
    } catch (error) {
      setAlerts(previousAlerts)
      toast({ variant: "destructive", title: "Errore", description: "Impossibile aggiornare gli alert" })
    } finally {
      setSubmitting(false)
    }
  }

  // Bulk snooze
  const snoozeBulk = async (until: Date) => {
    const ids = Array.from(selectedIds)
    const previousAlerts = [...alerts]
    
    setAlerts(prev => prev.map(a => 
      ids.includes(a.id)
        ? { ...a, status: 'snoozed' as AlertStatus, snoozed_until: until.toISOString() }
        : a
    ))

    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'snoozed', snoozed_until: until.toISOString() })
        .in('id', ids)

      if (error) throw error
      
      toast({ title: "Alert posticipati", description: `${ids.length} alert posticipati al ${format(until, 'dd/MM/yyyy', { locale: it })}` })
      setSelectedIds(new Set())
    } catch (error) {
      setAlerts(previousAlerts)
      toast({ variant: "destructive", title: "Errore", description: "Impossibile posticipare gli alert" })
    }
  }

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Toggle section
  const toggleSection = (priority: AlertPriority) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(priority)) next.delete(priority)
      else next.add(priority)
      return next
    })
  }

  // Get entity link
  const getEntityLink = (alert: AlertWithRelations): { href: string; label: string } | null => {
    if (alert.contract_id && alert.contracts) {
      return { href: `/dashboard/contracts/${alert.contract_id}`, label: `Contratto: ${alert.contracts.title}` }
    }
    if (alert.counterpart_id && alert.counterparts) {
      return { href: `/dashboard/counterparts/${alert.counterpart_id}`, label: `Controparte: ${alert.counterparts.name}` }
    }
    if (alert.employee_id && alert.employees) {
      return { href: `/dashboard/employees/${alert.employee_id}`, label: `Dipendente: ${alert.employees.full_name}` }
    }
    if (alert.bando_id && alert.bandi) {
      return { href: `/dashboard/bandi/${alert.bando_id}`, label: `Bando: ${alert.bandi.title}` }
    }
    if (alert.invoice_id && alert.invoices) {
      return { href: `/dashboard/invoices/${alert.invoice_id}`, label: `Fattura: ${alert.invoices.invoice_number}` }
    }
    return null
  }

  // Format trigger date
  const formatTriggerDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) {
      return 'Oggi'
    }
    if (isPast(date)) {
      return formatDistanceToNow(date, { locale: it, addSuffix: true })
    }
    return formatDistanceToNow(date, { locale: it, addSuffix: true })
  }

  const hasActiveFilters = priorityFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'active'
  const clearFilters = () => { 
    setPriorityFilter('all')
    setTypeFilter('all')
    setStatusFilter('active') 
  }
  
  const priorityOrder: AlertPriority[] = ['critical', 'high', 'medium', 'low']
  const alertToHandle = handleAlertId ? alerts.find(a => a.id === handleAlertId) : null

  // =====================
  // RENDER
  // =====================

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Centro Alert</h1>
          <p className="text-muted-foreground">
            {kpiCounts.total === 0 
              ? "Nessun alert da gestire" 
              : `${kpiCounts.total} alert non gestiti`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAlerts}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna
          </Button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-4 gap-4">
        {priorityOrder.map(priority => {
          const config = PRIORITY_CONFIG[priority]
          const count = kpiCounts[priority]
          const isActive = priorityFilter === priority
          
          return (
            <motion.button
              key={priority}
              onClick={() => setPriorityFilter(isActive ? 'all' : priority)}
              className={`
                relative p-4 rounded-xl border transition-all
                ${isActive ? 'ring-2 ring-offset-2' : ''}
                ${config.bgColor}
                hover:shadow-md cursor-pointer
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${config.color}`}>
                  {config.label}
                </span>
                <Badge className={`${config.badgeBg} text-white`}>
                  {count}
                </Badge>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-muted/30 border">
        <Filter className="h-4 w-4 text-muted-foreground" />
        
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as AlertPriority | 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priorità" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            <SelectItem value="critical">Critico</SelectItem>
            <SelectItem value="high">Alto</SelectItem>
            <SelectItem value="medium">Medio</SelectItem>
            <SelectItem value="low">Basso</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AlertType | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo alert" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i tipi</SelectItem>
            {Object.entries(ALERT_TYPE_GROUPS).map(([group, types]) => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {ALERT_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'active' | AlertStatus)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Attivi</SelectItem>
            <SelectItem value="pending">In attesa</SelectItem>
            <SelectItem value="snoozed">Posticipati</SelectItem>
            <SelectItem value="handled">Gestiti</SelectItem>
            <SelectItem value="escalated">Escalati</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Azzera filtri
          </Button>
        )}
      </div>

      {/* Alert List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-xl border">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Tutto sotto controllo! 🎉</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters 
              ? "Nessun alert corrisponde ai filtri selezionati"
              : "Non ci sono alert da gestire in questo momento"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
              Azzera filtri
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {priorityOrder.map(priority => {
            const alertsInGroup = groupedAlerts[priority]
            if (alertsInGroup.length === 0) return null
            
            const config = PRIORITY_CONFIG[priority]
            const isExpanded = expandedSections.has(priority)
            
            return (
              <div key={priority} className="rounded-xl border overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(priority)}
                  className={`w-full flex items-center justify-between p-4 ${config.bgColor} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className={`h-5 w-5 ${config.color}`} />
                    ) : (
                      <ChevronRight className={`h-5 w-5 ${config.color}`} />
                    )}
                    <span className={`font-semibold ${config.color}`}>
                      {config.label}
                    </span>
                    <Badge variant="secondary">
                      {alertsInGroup.length}
                    </Badge>
                  </div>
                </button>

                {/* Section Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="divide-y">
                        {alertsInGroup.map(alert => {
                          const entityLink = getEntityLink(alert)
                          const statusConf = STATUS_CONFIG[alert.status]
                          const isSelected = selectedIds.has(alert.id)
                          
                          return (
                            <div
                              key={alert.id}
                              className={`
                                p-4 border-l-4 ${config.borderColor}
                                ${statusConf.bgColor}
                                ${alert.status === 'handled' ? 'opacity-60' : ''}
                                transition-colors
                              `}
                            >
                              <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSelection(alert.id)}
                                  className="mt-1"
                                />
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Header row */}
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <Badge variant="outline" className={config.color}>
                                      {config.label}
                                    </Badge>
                                    <Badge variant="secondary">
                                      {ALERT_TYPE_LABELS[alert.alert_type]}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTriggerDate(alert.trigger_date)}
                                    </span>
                                  </div>

                                  {/* Title */}
                                  <h4 className="font-semibold mb-1">{alert.title}</h4>

                                  {/* Entity link */}
                                  {entityLink && (
                                    <Link 
                                      href={entityLink.href}
                                      className="text-sm text-primary hover:underline flex items-center gap-1 mb-2"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      {entityLink.label}
                                    </Link>
                                  )}

                                  {/* Description */}
                                  {alert.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                      {alert.description}
                                    </p>
                                  )}

                                  {/* Status banners */}
                                  {alert.status === 'snoozed' && alert.snoozed_until && (
                                    <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded inline-flex items-center gap-1 mb-3">
                                      <Clock className="h-3 w-3" />
                                      Posticipato al {format(new Date(alert.snoozed_until), 'dd/MM/yyyy', { locale: it })}
                                    </div>
                                  )}
                                  
                                  {alert.status === 'escalated' && alert.escalated_to_user && (
                                    <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded inline-flex items-center gap-1 mb-3">
                                      <AlertTriangle className="h-3 w-3" />
                                      Escalato a {alert.escalated_to_user.full_name}
                                    </div>
                                  )}
                                  
                                  {alert.status === 'handled' && alert.handled_by_user && (
                                    <div className="text-sm text-muted-foreground mb-3">
                                      Gestito da {alert.handled_by_user.full_name} il {format(new Date(alert.handled_at!), 'dd/MM/yyyy', { locale: it })}
                                    </div>
                                  )}

                                  {/* Actions */}
                                  {alert.status !== 'handled' && (
                                    <div className="flex items-center gap-2">
                                      {entityLink && (
                                        <Button variant="ghost" size="sm" asChild>
                                          <Link href={entityLink.href}>
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            Vai alla scheda
                                          </Link>
                                        </Button>
                                      )}
                                      
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setHandleAlertId(alert.id)
                                          setHandleModalOpen(true)
                                        }}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Gestisci
                                      </Button>

                                      <Popover 
                                        open={snoozePopoverOpen === alert.id} 
                                        onOpenChange={(open) => setSnoozePopoverOpen(open ? alert.id : null)}
                                      >
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Clock className="h-4 w-4 mr-1" />
                                            Posticipa
                                            <ChevronDown className="h-3 w-3 ml-1" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-2" align="start">
                                          <div className="space-y-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start"
                                              onClick={() => snoozeAlert(alert.id, addDays(new Date(), 1))}
                                            >
                                              Domani
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start"
                                              onClick={() => snoozeAlert(alert.id, addDays(new Date(), 3))}
                                            >
                                              Tra 3 giorni
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start font-medium"
                                              onClick={() => snoozeAlert(alert.id, addDays(new Date(), 7))}
                                            >
                                              Tra 7 giorni
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start"
                                              onClick={() => snoozeAlert(alert.id, addMonths(new Date(), 1))}
                                            >
                                              Tra 30 giorni
                                            </Button>
                                            <div className="border-t pt-1 mt-1">
                                              <Popover open={customDateOpen} onOpenChange={setCustomDateOpen}>
                                                <PopoverTrigger asChild>
                                                  <Button variant="ghost" size="sm" className="w-full justify-start">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Data personalizzata
                                                  </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                  <CalendarComponent
                                                    mode="single"
                                                    selected={customDate}
                                                    onSelect={(date) => {
                                                      if (date) {
                                                        snoozeAlert(alert.id, date)
                                                      }
                                                    }}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                  />
                                                </PopoverContent>
                                              </Popover>
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-4 px-6 py-3 bg-background border rounded-full shadow-lg">
              <span className="text-sm font-medium">
                {selectedIds.size} alert selezionati
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleBulk}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  )}
                  Gestisci tutti
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-1" />
                      Posticipa
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="center">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => snoozeBulk(addDays(new Date(), 1))}
                      >
                        Domani
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => snoozeBulk(addDays(new Date(), 7))}
                      >
                        Tra 7 giorni
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => snoozeBulk(addMonths(new Date(), 1))}
                      >
                        Tra 30 giorni
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Handle Modal */}
      <Dialog open={handleModalOpen} onOpenChange={setHandleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestisci alert</DialogTitle>
            <DialogDescription>
              {alertToHandle?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nota di gestione
              </label>
              <Textarea
                value={handleNote}
                onChange={(e) => setHandleNote(e.target.value)}
                placeholder="Descrivi come hai gestito questa situazione..."
                rows={4}
              />
              {handleNote.length > 0 && handleNote.length < 10 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Minimo 10 caratteri ({handleNote.length}/10)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHandleModalOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={() => handleAlertId && handleAlert(handleAlertId, handleNote)}
              disabled={handleNote.length < 10 || submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              )}
              Segna come gestito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
