"use client"

import { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { initializeMockData } from "@/lib/mock-data"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initializeMockData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-[220px] transition-all duration-300">
        <DashboardHeader />
        <main className="p-5">
          {children}
        </main>
      </div>
    </div>
  )
}
