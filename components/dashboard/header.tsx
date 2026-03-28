"use client"

import { useState, useEffect } from "react"
import { Search, Menu, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NotificationDropdown } from "@/components/dashboard/notification-dropdown"
import { useAIChat } from "@/contexts/ai-chat-context"
import { useSidebar } from "@/contexts/sidebar-context"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { isChatOpen, toggleChat } = useAIChat()
  const { sidebarWidth } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const headerLeft = isMobile ? 0 : sidebarWidth

  return (
    <header
      className="fixed top-0 right-0 z-[60] h-[72px] flex items-center justify-between px-4 md:px-6 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0 shadow-sm transition-all duration-300 ease-out"
      style={{ left: headerLeft }}
    >
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
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Alerts */}
        <NotificationDropdown />

        {/* AI Chat */}
        <button
          onClick={toggleChat}
          className={`p-2.5 rounded-xl transition-all ${
            isChatOpen
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/25"
          }`}
          aria-label={isChatOpen ? "Chiudi assistente AI" : "Apri assistente AI"}
        >
          <Sparkles className="size-4" />
        </button>
      </div>
    </header>
  )
}
