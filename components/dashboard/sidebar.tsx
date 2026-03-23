"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  BarChart3,
  Bell,
  Settings,
  Radar,
  BrainCircuit,
  Files,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Receipt,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { logout } from "@/app/auth/actions"
import { useUser } from "@/lib/hooks/use-user"

const companyNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contratti", href: "/dashboard/contracts", icon: FileText },
  { label: "Controparti", href: "/dashboard/counterparts", icon: Building2 },
  { label: "Dipendenti", href: "/dashboard/employees", icon: Users },
  { label: "Fatture", href: "/dashboard/invoices", icon: Receipt },
  { label: "BandoRadar", href: "/dashboard/bandi", icon: Radar },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Alert", href: "/dashboard/alerts", icon: Bell, badge: true },
]

const personalNavItems = [
  { label: "I Miei Contratti", href: "/dashboard/contracts", icon: FileText },
  { label: "Alert", href: "/dashboard/alerts", icon: Bell, badge: true },
  { label: "Analisi AI", href: "/dashboard/ai-analysis", icon: BrainCircuit },
  { label: "Documenti", href: "/dashboard/documents", icon: Files },
]

const bottomNavItems = [
  { label: "Impostazioni", href: "/dashboard/settings", icon: Settings },
]

interface DashboardSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function DashboardSidebar({ mobileOpen = false, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [alertCount, setAlertCount] = useState(0)
  const isPersonalAccount = user?.user_metadata?.account_type === "person"
  const navItems = isPersonalAccount ? personalNavItems : companyNavItems

  useEffect(() => {
    if (!user) return

    const fetchAlertCount = async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single()

        if (!userData?.company_id) return

        const { count } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', userData.company_id)
          .in('status', ['pending', 'escalated'])

        setAlertCount(count || 0)
      } catch (error) {
        console.error('Error fetching alert count:', error)
      }
    }

    fetchAlertCount()
  }, [user, supabase])

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.company_name || user?.email?.split('@')[0] || "Utente"
  const userEmail = user?.email || "utente@terminia.it"

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-out",
          // Mobile: hidden by default, shown when mobileOpen
          "-translate-x-full md:translate-x-0",
          mobileOpen && "translate-x-0",
          collapsed ? "w-[220px] md:w-[64px]" : "w-[220px]"
        )}
      >
        {/* Close button on mobile */}
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 md:hidden"
        >
          <X className="size-5" />
        </button>

        {/* Glass background */}
        <div className="absolute inset-0 glass-card border-r border-border/30" />
      
      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "flex items-center h-[60px] px-3 border-b border-border/20",
          collapsed ? "justify-center" : "gap-2"
        )}>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/terminia-logo.png"
              alt="Terminia"
              width={32}
              height={32}
              className="rounded-lg flex-shrink-0"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-foreground font-semibold text-base tracking-tight overflow-hidden whitespace-nowrap"
                >
                  Terminia
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/15 text-primary glow-teal-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Icon className={cn(
                      "size-4 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "group-hover:text-foreground"
                    )} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-sm font-medium overflow-hidden whitespace-nowrap flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.badge && alertCount > 0 && (
                      <span className={cn(
                        "flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium",
                        "bg-red-500 text-white",
                        collapsed && "absolute -top-1 -right-1"
                      )}>
                        {alertCount}
                      </span>
                    )}
                    {isActive && !collapsed && !item.badge && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="px-2 pb-3 border-t border-border/20 pt-3">
          {!isPersonalAccount && (
            <ul className="space-y-0.5 mb-3">
              {bottomNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      <Icon className="size-4 flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-sm font-medium overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {/* User profile */}
          <div className={cn(
            "flex items-center gap-2 p-2.5 rounded-lg glass-card border border-border/20",
            collapsed && "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <UserCircle className="size-4 text-primary" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <div className="text-sm font-medium text-foreground truncate">{userName}</div>
                  <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            )}
          </div>

          {/* Collapse toggle - hidden on mobile */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "mt-3 w-full hidden md:flex items-center justify-center gap-2 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200",
              collapsed && "px-0"
            )}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                <span className="text-xs">Riduci</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
