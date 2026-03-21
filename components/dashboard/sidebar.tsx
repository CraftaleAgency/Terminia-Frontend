"use client"

import Link from "next/link"
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
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const mainNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contratti", href: "/dashboard/contracts", icon: FileText },
  { label: "Controparti", href: "/dashboard/counterparts", icon: Building2 },
  { label: "Dipendenti", href: "/dashboard/employees", icon: Users },
  { label: "BandoRadar", href: "/dashboard/bandi", icon: Radar },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Alert", href: "/dashboard/alerts", icon: Bell },
]

const bottomNavItems = [
  { label: "Impostazioni", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Glass background */}
      <div className="absolute inset-0 glass-card border-r border-border/30" />
      
      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "flex items-center h-[72px] px-4 border-b border-border/20",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="2" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" className="text-primary"/>
                <path d="M5 4h5M5 7h5M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-primary"/>
                <circle cx="12.5" cy="12.5" r="2.5" fill="currentColor" className="text-primary"/>
              </svg>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-foreground font-semibold text-lg tracking-tight overflow-hidden whitespace-nowrap"
                >
                  ContractOS
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/15 text-primary glow-blue-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Icon className={cn(
                      "size-5 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "group-hover:text-foreground"
                    )} />
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
                    {isActive && !collapsed && (
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
        <div className="px-3 pb-4 border-t border-border/20 pt-4">
          {/* Settings */}
          <ul className="space-y-1 mb-4">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Icon className="size-5 flex-shrink-0" />
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
            "flex items-center gap-3 p-3 rounded-xl glass-card border border-border/20",
            collapsed && "justify-center"
          )}>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <UserCircle className="size-5 text-primary" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <div className="text-sm font-medium text-foreground truncate">Sitelab</div>
                  <div className="text-xs text-muted-foreground truncate">sitelab@yupmail.com</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
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
