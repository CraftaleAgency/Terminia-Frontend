"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { label: "Funzionalita", href: "#features" },
  { label: "Come Funziona", href: "#how-it-works" },
  { label: "BandoRadar", href: "#bandoradar" },
  { label: "Prezzi", href: "#pricing" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav
        className={cn(
          "mx-auto max-w-6xl transition-all duration-500",
          isScrolled
            ? "glass-card rounded-2xl px-6 py-3"
            : "px-3 py-4"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="Terminia home">
            <Image
              src="/images/terminia-logo.png"
              alt="Terminia"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-foreground font-semibold text-lg tracking-tight">Terminia</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-base text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Accedi
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/register"
                className="text-base font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors duration-150 glow-teal-sm"
              >
                Inizia Gratis
              </Link>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-5 pb-5 border-t border-border/40 pt-5 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-base text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 flex flex-col gap-3">
                  <Link href="/auth/login" className="text-base text-muted-foreground hover:text-foreground">Accedi</Link>
                  <Link
                    href="/auth/register"
                    className="text-base font-medium bg-primary text-primary-foreground px-5 py-3 rounded-xl text-center hover:bg-primary/90 transition-colors"
                  >
                    Inizia Gratis
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
