"use client"

import { LogoLoop } from "@/components/LogoLoop"

const apiLogos = [
  {
    src: "/loghi_api/logo_VIESAC.svg",
    alt: "VIESAC API",
    href: "https://ec.europa.eu/taxation_customs/vies/",
  },
  {
    src: "/loghi_api/ted-logo-left.png",
    alt: "TED - Tenders Electronic Daily",
    href: "https://ted.europa.eu/",
  },
  {
    src: "/loghi_api/image.png",
    alt: "API Partner",
  },
]

export function ApiLogos() {
  return (
    <section className="py-12 md:py-16">
      <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider px-4">
        Fonti dati ufficiali
      </p>
      <LogoLoop
        logos={apiLogos}
        speed={80}
        logoHeight={40}
        gap={48}
        fadeOut
        scaleOnHover
        pauseOnHover
      />
    </section>
  )
}
