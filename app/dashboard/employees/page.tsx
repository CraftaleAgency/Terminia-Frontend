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
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Mock data for employees
const MOCK_EMPLOYEES = [
  {
    id: "1",
    name: "Mario Rossi",
    email: "mario.rossi@terminia.it",
    phone: "+39 333 1234567",
    role: "Sviluppatore Senior",
    department: "Tecnologia",
    contract_type: "tempo_indeterminato",
    start_date: "2022-03-15",
    end_date: null,
    status: "active",
    monthly_salary: 3500,
    contracts_count: 0,
  },
  {
    id: "2",
    name: "Laura Bianchi",
    email: "laura.bianchi@terminia.it",
    phone: "+39 333 2345678",
    role: "Product Designer",
    department: "Design",
    contract_type: "tempo_determinato",
    start_date: "2023-06-01",
    end_date: "2024-05-31",
    status: "active",
    monthly_salary: 2800,
    contracts_count: 0,
  },
  {
    id: "3",
    name: "Giuseppe Verdi",
    email: "giuseppe.verdi@terminia.it",
    phone: "+39 333 3456789",
    role: "Backend Developer",
    department: "Tecnologia",
    contract_type: "cococo",
    start_date: "2023-09-01",
    end_date: "2024-08-31",
    status: "active",
    monthly_salary: 4200,
    contracts_count: 0,
  },
  {
    id: "4",
    name: "Anna Neri",
    email: "anna.neri@terminia.it",
    phone: "+39 333 4567890",
    role: "Marketing Manager",
    department: "Marketing",
    contract_type: "tempo_indeterminato",
    start_date: "2021-01-10",
    end_date: null,
    status: "active",
    monthly_salary: 3200,
    contracts_count: 0,
  },
  {
    id: "5",
    name: "Marco Ferrari",
    email: "marco.ferrari@terminia.it",
    phone: "+39 333 5678901",
    role: "Frontend Developer",
    department: "Tecnologia",
    contract_type: "fixed_term",
    start_date: "2024-02-01",
    end_date: "2025-01-31",
    status: "active",
    monthly_salary: 3000,
    contracts_count: 0,
  },
]

export default function EmployeesPage() {
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [contractTypeFilter, setContractTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
    const matchesSearch = search === "" ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter
    const matchesContractType = contractTypeFilter === "all" || emp.contract_type === contractTypeFilter
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter

    return matchesSearch && matchesDepartment && matchesContractType && matchesStatus
  })

  const stats = {
    total: MOCK_EMPLOYEES.length,
    active: MOCK_EMPLOYEES.filter(e => e.status === "active").length,
    expiring: MOCK_EMPLOYEES.filter(e => {
      const endDate = new Date(e.end_date || "2099-12-31")
      const days = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return days <= 90 && e.status === "active"
    }).length,
    totalSalary: MOCK_EMPLOYEES.reduce((sum, e) => sum + e.monthly_salary, 0),
  }

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

  const getDaysUntil = (dateStr: string) => {
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
              <option value="Tecnologia">Tecnologia</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
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
        <div className="divide-y divide-border/10">
          {filteredEmployees.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="size-12 text-muted-foreground/50 mx-auto mb-4" />
              <div className="text-foreground font-medium">Nessun dipendente trovato</div>
              <div className="text-sm text-muted-foreground mt-1">
                Prova a modificare i filtri
              </div>
            </div>
          ) : (
            filteredEmployees.map((employee) => {
              const daysUntilEnd = getDaysUntil(employee.end_date)

              return (
                <Link
                  key={employee.id}
                  href={`/dashboard/employees/${employee.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {employee.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {employee.name}
                      </span>
                      {employee.contract_type === "fixed_term" && daysUntilEnd && daysUntilEnd > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          Scade tra {daysUntilEnd}gg
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {employee.role} · {employee.department}
                    </div>
                  </div>

                  {/* Contract Type */}
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getContractTypeColor(employee.contract_type)}`}>
                      {getContractTypeLabel(employee.contract_type)}
                    </span>
                    {employee.monthly_salary && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(employee.monthly_salary)}/mese
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
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}
