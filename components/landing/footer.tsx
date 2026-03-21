import Link from "next/link"

const footerLinks = {
  Prodotto: ["Funzionalità", "BandoRadar", "Prezzi", "Integrazioni", "Changelog"],
  Azienda: ["Chi siamo", "Blog", "Lavora con noi", "Contatti"],
  Legale: ["Privacy Policy", "Termini di Servizio", "Cookie Policy", "GDPR"],
  Supporto: ["Documentazione", "FAQ", "Status", "Supporto"],
}

export function Footer() {
  return (
    <footer className="border-t border-border/20 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/30">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <rect x="2" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" className="text-primary"/>
                  <path d="M5 4h5M5 7h5M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-primary"/>
                  <circle cx="12.5" cy="12.5" r="2.5" fill="currentColor" className="text-primary"/>
                </svg>
              </div>
              <span className="text-foreground font-semibold text-[15px]">ContractOS</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
              Il CRM contrattuale AI per le PMI italiane.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 ContractOS S.r.l. · P.IVA IT12345678901 · Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" aria-hidden />
            Tutti i sistemi operativi
          </div>
        </div>
      </div>
    </footer>
  )
}
