"use client"

import { BrainCircuit, FileText, ShieldAlert, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const aiCards = [
  {
    title: "Cosa posso fare?",
    description: "Azioni consigliate in base alle clausole del contratto.",
    icon: Lightbulb,
  },
  {
    title: "Cosa rischio?",
    description: "Penali, rinnovi automatici e punti critici da monitorare.",
    icon: ShieldAlert,
  },
  {
    title: "Cosa devo sapere?",
    description: "Spiegazione in linguaggio semplice delle clausole principali.",
    icon: FileText,
  },
]

export function AiAnalysisView() {
  return (
    <div className="space-y-5">
      <div className="glass-card rounded-2xl p-5 border border-border/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <BrainCircuit className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Analisi AI</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Per ogni contratto: spiegazione chiara su cosa puoi fare, cosa rischi e cosa devi sapere.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiCards.map((item) => {
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
                  <Link href="/dashboard/contracts">Apri contratti</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
