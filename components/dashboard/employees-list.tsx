"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  ArrowUpRight,
  Users,
  MoreHorizontal,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Database } from "@/types/database"

type Employee = Database['public']['Tables']['employees']['Row']

export interface EmployeesListProps {
  employees: Employee[]
}

const isEmployeeActive = (emp: Employee): boolean =>
  !emp.termination_date || new Date(emp.termination_date) > new Date()

const getContractTypeLabel = (type: string) => {
  switch (type) {
    case "permanent": return "Tempo Indeterminato"
    case "fixed_term": return "Tempo Determinato"
    case "cococo": return "Partita IVA"
    case "collaboration": return "Collaborazione"
    default: return type
  }
}

const getContractTypeColor = (type: string) => {
  switch (type) {
    case "permanent": return "bg-purple-500/10 text-purple-400"
    case "fixed_term": return "bg-blue-500/10 text-blue-400"
    case "cococo": return "bg-green-500/10 text-green-400"
    default: return "bg-muted/20 text-muted-foreground"
  }
}

const getDaysUntil = (dateStr: string | null | undefined) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

export function EmployeesList({ employees }: EmployeesListProps) {
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [contractTypeFilter, setContractTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = search === "" ||
      emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (emp.department?.toLowerCase().includes(search.toLowerCase()) ?? false)

    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter
    const matchesContractType = contractTypeFilter === "all" || emp.employee_type === contractTypeFilter
    const empStatus = isEmployeeActive(emp) ? "active" : "inactive"
    const matchesStatus = statusFilter === "all" || empStatus === statusFilter

    return matchesSearch && matchesDepartment && matchesContractType && matchesStatus
  })

  const stats = {
    total: employees.length,
    active: employees.filter(e => isEmployeeActive(e)).length,
    expiring: employees.filter(e => {
      if (!e.termination_date) return false
      const endDate = new Date(e.termination_date)
      const days = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return days <= 90 && isEmployeeActive(e)
    }).length,
    totalSalary: employees.reduce((sum, e) => sum + (e.ral || 0), 0) / 12,
  }

  const departments = [...new Set(employees.map(e => e.department).filter((d): d is string => Boolean(d)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dipendenti</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestisci il team e i contratti di lavoro
          </p>
        </div>
        <Link
          href="/dashboard/employees/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all glow-teal-sm text-sm"
        >
          <Plus className="size-4" />
          Nuovo Dipendente
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Totale Dipendenti</div>
          <div className="text-2xl font-semibold text-foreground mt-1">{stats.total}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Attivi</div>
          <div className="text-2xl font-semibold text-primary mt-1">{stats.active}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">In Scadenza</div>
          <div className="text-2xl font-semibold text-amber-400 mt-1">{stats.expiring}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-4 border border-border/20"
        >
          <div className="text-sm text-muted-foreground">Costo Mensile</div>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">
            {formatCurrency(stats.totalSalary)}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-4 border border-border/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca dipendente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none"
            >
              <option value="all">Tutti i reparti</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Contract Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={contractTypeFilter}
              onChange={(e) => setContractTypeFilter(e.target.value)}
              className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none"
            >
              <option value="all">Tutti i tipi</option>
              <option value="permanent">Tempo Indeterminato</option>
              <option value="fixed_term">Tempo Determinato</option>
              <option value="cococo">Partita IVA</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-muted/30 border border-border/20 rounded-xl text-sm text-foreground focus:outline-none"
            >
              <option value="all">Tutti gli stati</option>
              <option value="active">Attivi</option>
              <option value="inactive">Inattivi</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Employee List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl border border-border/20 overflow-hidden"
      >
        {filteredEmployees.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="size-12 text-muted-foreground/50 mx-auto mb-4" />
            <div className="text-foreground font-medium">Nessun dipendente trovato</div>
            <div className="text-sm text-muted-foreground mt-1">
              Prova a modificare i filtri
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {filteredEmployees.map((employee) => {
              const daysUntilEnd = getDaysUntil(employee.termination_date)

              return (
                <Link
                  key={employee.id}
                  href={`/dashboard/employees/${employee.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {employee.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {employee.full_name}
                      </span>
                      {employee.employee_type === "fixed_term" && daysUntilEnd && daysUntilEnd > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          Scade tra {daysUntilEnd}gg
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {employee.role || 'N/A'} · {employee.department || 'N/A'}
                    </div>
                  </div>

                  {/* Contract Type */}
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs px-2 py-1 rounded-full", getContractTypeColor(employee.employee_type ?? ''))}>
                      {getContractTypeLabel(employee.employee_type ?? '')}
                    </span>
                    {employee.ral && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(employee.ral / 12)}/mese
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
                      <FileText className="size-4" />
                    </button>
                    <MoreHorizontal className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
