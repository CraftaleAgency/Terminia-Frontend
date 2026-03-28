"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
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
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileSearch,
  FileOutput,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getAlerts } from "@/lib/mock-data"

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contratti", href: "/dashboard/contracts", icon: FileText },
  { label: "Controparti", href: "/dashboard/counterparts", icon: Building2 },
  { label: "Dipendenti", href: "/dashboard/employees", icon: Users },
  { label: "Fatture", href: "/dashboard/invoices", icon: Receipt },
  { label: "BandoRadar", href: "/dashboard/bandi", icon: Radar },
  { label: "Documenti", href: "/dashboard/documents", icon: FileOutput },
  { label: "Advisor OSINT", href: "/dashboard/advisor", icon: FileSearch },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Alert", href: "/dashboard/alerts", icon: Bell, badge: true },
]

const bottomNavItems = [
  { label: "Impostazioni", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [alertCount, setAlertCount] = useState(0)
  const [userName, setUserName] = useState("Demo User")
  const [userEmail, setUserEmail] = useState("demo@terminia.it")

  useEffect(() => {
    const alerts = getAlerts()
    setAlertCount(alerts.filter(a => a.status === "pending").length)
    
    const user = localStorage.getItem("terminia_user")
    if (user) {
      const parsed = JSON.parse(user)
      setUserName(parsed.name || parsed.fullName || "Demo User")
      setUserEmail(parsed.email || "demo@terminia.it")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("terminia_user")
    router.push("/")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ease-out",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
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
            {mainNavItems.map((item) => {
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
          {/* Settings */}
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

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200",
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
  )
}
