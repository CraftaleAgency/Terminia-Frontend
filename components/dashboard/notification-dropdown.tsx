"use client"

import { useEffect, useState, useCallback } from "react"
import { Bell, AlertTriangle, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/lib/hooks/use-user"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types
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

interface AlertNotification {
  id: string
  alert_type: AlertType
  priority: AlertPriority
  title: string
  description: string | null
  trigger_date: string
  status: AlertStatus
  created_at: string
  contract_id: string | null
  employee_id: string | null
  counterpart_id: string | null
  bando_id: string | null
}

// Constants
const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  auto_renewal: 'Rinnovo automatico',
  contract_expiry: 'Scadenza contratto',
  obligation_due: 'Obbligo in scadenza',
  counterpart_obligation_overdue: 'Obbligo controparte scaduto',
  payment_expected: 'Pagamento atteso',
  fixed_term_expiry: 'Scadenza termine',
  fixed_term_limit: 'Limite contratti termine',
  medical_exam_due: 'Visita medica',
  safety_training_due: 'Formazione sicurezza',
  invoice_not_issued: 'Fattura non emessa',
  payment_overdue: 'Pagamento scaduto',
  exposure_threshold: 'Soglia esposizione',
  sdi_rejected: 'SDI rifiutata',
  new_bando_match: 'Nuovo bando',
  bando_deadline: 'Scadenza bando',
  dpa_missing: 'DPA mancante',
  gdpr_review_due: 'Revisione GDPR',
  reliability_score_drop: 'Calo affidabilità',
  milestone_approaching: 'Milestone',
  istat_indexation_due: 'Rivalutazione ISTAT',
  surety_bond_expiry: 'Scadenza fidejussione',
  ccnl_renewed: 'CCNL rinnovato',
  fringe_benefit_threshold: 'Soglia fringe benefit',
  non_compete_expiry: 'Scadenza non concorrenza',
  probation_ending: 'Fine prova',
}

const PRIORITY_CONFIG: Record<AlertPriority, { label: string; color: string; bgColor: string; iconColor: string }> = {
  critical: { label: 'Critico', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-950/30', iconColor: 'text-red-500' },
  high: { label: 'Alto', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/30', iconColor: 'text-orange-500' },
  medium: { label: 'Medio', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30', iconColor: 'text-yellow-500' },
  low: { label: 'Basso', color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-800/30', iconColor: 'text-gray-400' },
}

export function NotificationDropdown() {
  const { user } = useUser()
  const supabase = createClient()
  
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState<AlertNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [companyId, setCompanyId] = useState<string | null>(null)

  // Fetch company ID once
  useEffect(() => {
    if (!user) return
    
    const fetchCompanyId = async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single()
      
      if (userData?.company_id) {
        setCompanyId(userData.company_id)
      }
    }
    
    fetchCompanyId()
  }, [user, supabase])

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!companyId) return

    const { count } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .in('status', ['pending', 'escalated'])

    setUnreadCount(count || 0)
  }, [companyId, supabase])

  // Fetch notifications when dropdown opens
  const fetchNotifications = useCallback(async () => {
    if (!companyId) return
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          id,
          alert_type,
          priority,
          title,
          description,
          trigger_date,
          status,
          created_at,
          contract_id,
          employee_id,
          counterpart_id,
          bando_id
        `)
        .eq('company_id', companyId)
        .in('status', ['pending', 'escalated'])
        .order('priority', { ascending: true })
        .order('trigger_date', { ascending: true })
        .limit(10)

      if (error) throw error
      
      // Sort by priority (critical first)
      const priorityOrder: Record<AlertPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
      const sorted = (data || []).sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority as AlertPriority] - priorityOrder[b.priority as AlertPriority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(a.trigger_date).getTime() - new Date(b.trigger_date).getTime()
      })
      
      setNotifications(sorted)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [companyId, supabase])

  // Initial fetch and setup realtime subscription
  useEffect(() => {
    if (!companyId) return

    fetchUnreadCount()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `company_id=eq.${companyId}`,
        },
        () => {
          fetchUnreadCount()
          if (open) {
            fetchNotifications()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [companyId, open, fetchUnreadCount, fetchNotifications, supabase])

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open, fetchNotifications])

  const getPriorityIcon = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="size-4" />
      case 'high':
        return <AlertTriangle className="size-4" />
      case 'medium':
        return <Clock className="size-4" />
      case 'low':
        return <Bell className="size-4" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: it })
    } catch {
      return dateString
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
          aria-label="Notifiche"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0 border-border/50" 
        align="end" 
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <h3 className="font-semibold text-sm">Notifiche</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Link 
            href="/dashboard/alerts"
            className="text-xs text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            Vedi tutte
          </Link>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <CheckCircle2 className="size-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-foreground">Tutto in ordine!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Non ci sono notifiche in sospeso
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notification) => {
                const config = PRIORITY_CONFIG[notification.priority]
                
                return (
                  <Link
                    key={notification.id}
                    href="/dashboard/alerts"
                    onClick={() => setOpen(false)}
                    className={`flex gap-3 px-4 py-3 hover:bg-muted/30 transition-colors ${config.bgColor}`}
                  >
                    {/* Icon */}
                    <div className={`size-8 rounded-full bg-background flex items-center justify-center shrink-0 border ${config.iconColor}`}>
                      {getPriorityIcon(notification.priority)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {ALERT_TYPE_LABELS[notification.alert_type]}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${config.color} border-current`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.trigger_date)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border/30 p-2">
            <Link href="/dashboard/alerts" onClick={() => setOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-center text-xs h-9 text-primary hover:text-primary"
              >
                Gestisci tutte le notifiche
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
