"use client"

import { Bell, Search, LogOut, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user } = useUser()
  const supabase = createClient()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchAlertCount = async () => {
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

      setUnreadCount(count || 0)
    }

    fetchAlertCount()
  }, [user, supabase])

  return (
    <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between px-4 md:px-6 border-b border-border/20 glass-card">
      {/* Left section: Menu button + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
          aria-label="Apri menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-lg hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cerca contratti, controparti, alert..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground bg-muted/50 border border-border/30">
            <span className="text-[9px]">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Alerts */}
        <button className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-border/30">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-foreground">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utente'}
            </div>
            <div className="text-xs text-muted-foreground">{user?.email || ''}</div>
          </div>
          <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
