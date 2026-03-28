"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { AIChatSidebar } from "@/components/dashboard/ai-chat-sidebar"
import { AIChatProvider, useAIChat } from "@/contexts/ai-chat-context"
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isChatOpen, chatWidth } = useAIChat()
  const { sidebarWidth } = useSidebar()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const mainLeft = isMobile ? 0 : sidebarWidth
  const mainRight = isChatOpen ? chatWidth : 0

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Header - fixed top, z-index alto (z-[60]) */}
      <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)}/>

      {/* Sidebar - fixed left, full height (100vh) */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* AI Chat Sidebar - fixed right, SOTTO l'header (top-[72px]) */}
      <AIChatSidebar />

      {/* Main content - fixed top-[72px], con left e right dinamici */}
      <main
        className="fixed top-[72px] bottom-0 right-0 overflow-y-auto p-4 md:p-5 transition-all duration-300"
        style={{ left: mainLeft, right: mainRight }}
      >
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AIChatProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </AIChatProvider>
    </SidebarProvider>
  )
}
