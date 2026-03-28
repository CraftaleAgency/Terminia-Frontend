"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
  sidebarWidth: number
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => setCollapsed(!collapsed)

  // Sidebar width: 220px when expanded, 64px when collapsed
  const sidebarWidth = collapsed ? 64 : 220

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
