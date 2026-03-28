import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  Prodotto: [
    { label: "Funzionalita", href: "#features" },
    { label: "BandoRadar", href: "#bandoradar" },
    // { label: "Prezzi", href: "#pricing" },
  ],
  Risorse: [
    { label: "Documentazione", href: "/docs" },
    { label: "Integrazioni", href: "/docs/integrazioni" },
  ],
  Legale: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Termini di Servizio", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/20 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/images/terminia-logo.png"
                alt="Terminia"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-foreground font-semibold text-[15px]">Terminia</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              L'intelligenza artificiale che legge, capisce e protegge ogni contratto della tua azienda.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2026 Terminia S.r.l. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}
