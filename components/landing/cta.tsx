import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section className="py-24 px-6 relative">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[radial-gradient(ellipse,oklch(0.72_0.18_220/0.1)_0%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-2xl text-center relative z-10">
        <h2 className="text-balance text-3xl sm:text-4xl font-semibold text-foreground mb-5 leading-tight">
          Smetti di perdere fatturato{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient">per contratti non gestiti</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 text-base">
          Inizia con 14 giorni gratuiti. Nessuna carta di credito, nessun vincolo.
          Il tuo primo contratto analizzato in meno di 2 minuti.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="#"
            className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 glow-blue text-[15px]"
          >
            Inizia Gratis — 14 giorni
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 glass-card text-foreground font-medium px-6 py-3 rounded-xl hover:glass-card-hover transition-all duration-200 text-[15px] border border-border/20"
          >
            Prenota una demo
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Costruito in Italia · GDPR compliant · Dati ospitati in EU
        </p>
      </div>
    </section>
  )
}
