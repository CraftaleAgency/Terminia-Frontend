"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { DashboardPreview } from "@/components/landing/dashboard-preview"

function BorderMagicButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,oklch(0.78_0.12_175)_0%,oklch(0.35_0.12_220)_50%,oklch(0.78_0.12_175)_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-background px-8 py-1 text-lg font-medium text-foreground backdrop-blur-3xl transition-all duration-300 group-hover:bg-card">
        {children}
        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" aria-hidden />
      </span>
    </Link>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow orbs - teal themed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Central purple/teal gradient glow - inspired by wope */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.12_280/0.25)_0%,oklch(0.55_0.14_195/0.15)_40%,transparent_70%)]" />
        {/* Top left teal accent */}
        <div className="absolute -left-40 top-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.12_195/0.1)_0%,transparent_60%)]" />
        {/* Bottom right teal accent */}
        <div className="absolute -right-40 bottom-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.14_180/0.08)_0%,transparent_60%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.75 0.14 180) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.14 180) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <ContainerScroll
        titleComponent={
          <div className="pt-24 md:pt-32 pb-6">
            {/* Heading - wope style large centered */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-balance text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-foreground">Ogni scadenza.</span>
              <br />
              <span className="text-foreground">Ogni clausola.</span>
              <br />
              <span className="text-gradient">Ogni opportunita.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto max-w-2xl text-balance text-lg md:text-xl text-muted-foreground leading-relaxed mb-10"
            >
              Lascia che l'AI legga, capisca e protegga ogni contratto della tua azienda.
              Il co-pilota legale per le PMI italiane.
            </motion.p>

            {/* CTAs with border magic */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <BorderMagicButton href="/auth/register">
                Inizia Gratis
              </BorderMagicButton>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 text-muted-foreground font-medium px-6 py-3.5 rounded-full hover:text-foreground transition-colors text-lg"
              >
                Scopri come funziona
              </Link>
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-sm text-muted-foreground/70"
            >
              Nessuna carta richiesta. Setup in 2 minuti.
            </motion.p>
          </div>
        }
      >
        {/* Dashboard Preview - mirrors real dashboard */}
        <DashboardPreview />
      </ContainerScroll>
    </section>
  )
}
