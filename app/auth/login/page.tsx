"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "../actions"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formDataObj = new FormData()
    formDataObj.append("email", formData.email)
    formDataObj.append("password", formData.password)

    const result = await login(formDataObj)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  const isValid = formData.email.includes("@") && formData.password.length >= 6

  return (
    <div className="glass-card rounded-2xl p-8 border border-border/30">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Bentornato</h1>
        <p className="text-muted-foreground">Accedi al tuo account Terminia</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@azienda.it"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 h-12 bg-secondary/50 border-border/40"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="La tua password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 h-12 bg-secondary/50 border-border/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Nascondi password" : "Mostra password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full h-12 text-base font-medium glow-teal-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Accesso in corso...
            </>
          ) : (
            "Accedi"
          )}
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Non hai un account?{" "}
        <Link href="/auth/register" className="text-primary hover:underline font-medium">
          Registrati
        </Link>
      </p>
    </div>
  )
}
