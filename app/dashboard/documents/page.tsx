"use client"

import { Files, FileText, PenLine, CircleHelp } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const documentActions = [
  {
    title: "Lettera di disdetta",
    description: "Genera una bozza pronta da inviare per evitare rinnovi automatici.",
    icon: PenLine,
  },
  {
    title: "Richiesta chiarimenti",
    description: "Prepara una richiesta formale su clausole poco chiare o sfavorevoli.",
    icon: CircleHelp,
  },
  {
    title: "Riepilogo contratto",
    description: "Documento sintetico con scadenze, obblighi e azioni consigliate.",
    icon: FileText,
  },
]

export default function DocumentsPage() {
  return (
    <div className="space-y-5">
      <div className="glass-card rounded-2xl p-5 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Files className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Documenti</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crea documenti utili per la gestione dei tuoi contratti personali.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentActions.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="border-border/30 bg-card/50">
              <CardHeader className="pb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="size-4 text-primary" />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/contracts">Usa su un contratto</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
