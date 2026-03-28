import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { BandoRadar } from "@/components/landing/bandoradar"
// import { Pricing } from "@/components/landing/pricing"
import { Cta } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <BandoRadar />
      {/* <Pricing /> */}
      <Cta />
      <Footer />
    </main>
  )
}
