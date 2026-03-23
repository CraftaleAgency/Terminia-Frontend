import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.12_280/0.15)_0%,oklch(0.55_0.14_195/0.08)_50%,transparent_70%)]" />
        <div className="absolute -left-40 bottom-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.12_195/0.08)_0%,transparent_60%)]" />
        <div className="absolute -right-40 top-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.14_180/0.06)_0%,transparent_60%)]" />
      </div>

      {/* Back to site button */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Torna al sito</span>
      </Link>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10">
        <Image
          src="/images/terminia-logo.png"
          alt="Terminia"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <span className="text-foreground font-semibold text-xl tracking-tight">Terminia</span>
      </Link>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
